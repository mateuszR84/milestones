<?php

namespace App\Http\Controllers;

use App\Models\Friendship;
use App\Models\User;
use Illuminate\Http\Request;

class FriendshipController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $friendships = Friendship::query()
            ->where('status', 'accepted')
            ->where(fn ($q) => $q->where('requester_id', $user->id)->orWhere('recipient_id', $user->id))
            ->with(['requester', 'recipient'])
            ->get()
            ->map(fn (Friendship $f) => $f->requester_id === $user->id ? $f->recipient : $f->requester)
            ->values();

        return response()->json($friendships);
    }

    public function requests(Request $request)
    {
        $requests = $request->user()->receivedFriendRequests()
            ->where('status', 'pending')
            ->with('requester')
            ->get();

        return response()->json($requests);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email', 'exists:users,email'],
        ]);

        $recipient = User::where('email', $data['email'])->first();
        $user = $request->user();

        if ($recipient->id === $user->id) {
            return response()->json(['message' => 'You cannot add yourself as a friend.'], 422);
        }

        $exists = Friendship::query()
            ->where(function ($q) use ($user, $recipient) {
                $q->where(['requester_id' => $user->id, 'recipient_id' => $recipient->id])
                    ->orWhere(['requester_id' => $recipient->id, 'recipient_id' => $user->id]);
            })
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'A friend request already exists between these users.'], 422);
        }

        $friendship = Friendship::create([
            'requester_id' => $user->id,
            'recipient_id' => $recipient->id,
            'status' => 'pending',
        ]);

        return response()->json($friendship, 201);
    }

    public function accept(Request $request, Friendship $friendship)
    {
        $this->authorize('respond', $friendship);

        $friendship->update(['status' => 'accepted']);

        return response()->json($friendship);
    }

    public function decline(Request $request, Friendship $friendship)
    {
        $this->authorize('respond', $friendship);

        $friendship->update(['status' => 'declined']);

        return response()->json($friendship);
    }

    public function destroy(Request $request, Friendship $friendship)
    {
        $this->authorize('delete', $friendship);

        $friendship->delete();

        return response()->noContent();
    }
}
