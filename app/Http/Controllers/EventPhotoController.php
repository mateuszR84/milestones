<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEventPhotoRequest;
use App\Models\Event;
use App\Models\EventPhoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EventPhotoController extends Controller
{
    public function store(StoreEventPhotoRequest $request, Event $event)
    {
        $this->authorize('update', $event);

        if ($event->photos()->count() >= 5) {
            return response()->json(['message' => 'An event can have at most 5 photos.'], 422);
        }

        $path = $request->file('photo')->store("events/{$event->id}", 'public');
        $position = $event->photos()->count();

        $photo = $event->photos()->create(['path' => $path, 'position' => $position]);

        return response()->json($photo, 201);
    }

    public function destroy(Request $request, Event $event, EventPhoto $photo)
    {
        $this->authorize('update', $event);
        abort_unless($photo->event_id === $event->id, 404);

        Storage::disk('public')->delete($photo->path);
        $photo->delete();

        return response()->noContent();
    }
}
