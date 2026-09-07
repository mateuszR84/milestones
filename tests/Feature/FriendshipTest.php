<?php

namespace Tests\Feature;

use App\Models\Friendship;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FriendshipTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_send_friend_request(): void
    {
        $user = User::factory()->create();
        $recipient = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/friends/requests', [
            'email' => $recipient->email,
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('friendships', [
            'requester_id' => $user->id,
            'recipient_id' => $recipient->id,
            'status' => 'pending',
        ]);
    }

    public function test_user_cannot_send_duplicate_friend_request(): void
    {
        $user = User::factory()->create();
        $recipient = User::factory()->create();

        Friendship::create([
            'requester_id' => $user->id,
            'recipient_id' => $recipient->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($user)->postJson('/api/friends/requests', [
            'email' => $recipient->email,
        ]);

        $response->assertStatus(422);
    }

    public function test_recipient_can_accept_friend_request(): void
    {
        $requester = User::factory()->create();
        $recipient = User::factory()->create();

        $friendship = Friendship::create([
            'requester_id' => $requester->id,
            'recipient_id' => $recipient->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($recipient)->postJson("/api/friends/requests/{$friendship->id}/accept");

        $response->assertOk();
        $this->assertDatabaseHas('friendships', ['id' => $friendship->id, 'status' => 'accepted']);
    }

    public function test_requester_cannot_accept_own_request(): void
    {
        $requester = User::factory()->create();
        $recipient = User::factory()->create();

        $friendship = Friendship::create([
            'requester_id' => $requester->id,
            'recipient_id' => $recipient->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($requester)->postJson("/api/friends/requests/{$friendship->id}/accept");

        $response->assertStatus(403);
    }

    public function test_accepted_friends_appear_in_friends_list(): void
    {
        $user = User::factory()->create();
        $friend = User::factory()->create();

        Friendship::create([
            'requester_id' => $user->id,
            'recipient_id' => $friend->id,
            'status' => 'accepted',
        ]);

        $response = $this->actingAs($user)->getJson('/api/friends');

        $response->assertOk();
        $response->assertJsonFragment(['id' => $friend->id]);
    }
}
