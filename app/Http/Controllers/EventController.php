<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Models\Event;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EventController extends Controller
{
    public function indexForUser(Request $request, User $user)
    {
        abort_unless($request->user()->canViewTimelineOf($user), 403);

        $query = $user->events()->with(['photos', 'participants'])->orderBy('event_date');

        if ($from = $request->query('from')) {
            $query->where('event_date', '>=', $from);
        }

        if ($to = $request->query('to')) {
            $query->where('event_date', '<=', $to);
        }

        return response()->json($query->get());
    }

    public function store(StoreEventRequest $request)
    {
        $data = $request->validated();

        $event = $request->user()->events()->create([
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'event_date' => $data['event_date'],
            'external_link' => $data['external_link'] ?? null,
        ]);

        foreach ($request->file('photos', []) as $position => $photo) {
            $path = $photo->store("events/{$event->id}", 'public');
            $event->photos()->create(['path' => $path, 'position' => $position]);
        }

        if (! empty($data['participant_ids'])) {
            $event->participants()->sync($data['participant_ids']);
        }

        return response()->json($event->load(['photos', 'participants']), 201);
    }

    public function show(Request $request, Event $event)
    {
        $this->authorize('view', $event);

        return response()->json($event->load(['photos', 'participants']));
    }

    public function update(UpdateEventRequest $request, Event $event)
    {
        $this->authorize('update', $event);

        $data = $request->validated();
        $event->update(array_diff_key($data, ['participant_ids' => null]));

        if (array_key_exists('participant_ids', $data)) {
            $event->participants()->sync($data['participant_ids'] ?? []);
        }

        return response()->json($event->load(['photos', 'participants']));
    }

    public function destroy(Request $request, Event $event)
    {
        $this->authorize('delete', $event);

        Storage::disk('public')->deleteDirectory("events/{$event->id}");
        $event->delete();

        return response()->noContent();
    }
}
