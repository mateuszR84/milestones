<?php

namespace App\Http\Controllers;

use App\Models\TimelineShare;
use App\Models\User;
use Illuminate\Http\Request;

class TimelineShareController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'given' => $user->timelineSharesGiven()->with('sharedWith')->get(),
            'received' => $user->timelineSharesReceived()->with('owner')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email', 'exists:users,email'],
        ]);

        $user = $request->user();
        $sharedWith = User::where('email', $data['email'])->first();

        if ($sharedWith->id === $user->id) {
            return response()->json(['message' => 'You cannot share your timeline with yourself.'], 422);
        }

        if (! $user->isFriendsWith($sharedWith)) {
            return response()->json(['message' => 'You can only share your timeline with friends.'], 422);
        }

        $share = TimelineShare::firstOrCreate([
            'owner_id' => $user->id,
            'shared_with_id' => $sharedWith->id,
        ]);

        return response()->json($share, 201);
    }

    public function destroy(Request $request, TimelineShare $timelineShare)
    {
        $this->authorize('delete', $timelineShare);

        $timelineShare->delete();

        return response()->noContent();
    }
}
