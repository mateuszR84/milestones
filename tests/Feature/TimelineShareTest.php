<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\Friendship;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TimelineShareTest extends TestCase
{
    use RefreshDatabase;

    private function makeFriends(User $a, User $b): void
    {
        Friendship::create([
            'requester_id' => $a->id,
            'recipient_id' => $b->id,
            'status' => 'accepted',
        ]);
    }

    public function test_owner_can_share_timeline_with_friend(): void
    {
        $owner = User::factory()->create();
        $friend = User::factory()->create();
        $this->makeFriends($owner, $friend);

        $response = $this->actingAs($owner)->postJson('/api/timeline-shares', [
            'email' => $friend->email,
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('timeline_shares', [
            'owner_id' => $owner->id,
            'shared_with_id' => $friend->id,
        ]);
    }

    public function test_cannot_share_timeline_with_non_friend(): void
    {
        $owner = User::factory()->create();
        $stranger = User::factory()->create();

        $response = $this->actingAs($owner)->postJson('/api/timeline-shares', [
            'email' => $stranger->email,
        ]);

        $response->assertStatus(422);
    }

    public function test_shared_with_user_can_view_owner_events(): void
    {
        $owner = User::factory()->create();
        $viewer = User::factory()->create();
        $this->makeFriends($owner, $viewer);

        $this->actingAs($owner)->postJson('/api/timeline-shares', ['email' => $viewer->email]);

        Event::create([
            'user_id' => $owner->id,
            'title' => 'Wyjazd w góry',
            'event_date' => '2026-01-10',
        ]);

        $response = $this->actingAs($viewer)->getJson("/api/timelines/{$owner->id}/events");

        $response->assertOk();
        $response->assertJsonFragment(['title' => 'Wyjazd w góry']);
    }

    public function test_non_shared_user_cannot_view_owner_events(): void
    {
        $owner = User::factory()->create();
        $stranger = User::factory()->create();

        Event::create([
            'user_id' => $owner->id,
            'title' => 'Prywatne wydarzenie',
            'event_date' => '2026-01-10',
        ]);

        $response = $this->actingAs($stranger)->getJson("/api/timelines/{$owner->id}/events");

        $response->assertStatus(403);
    }
}
