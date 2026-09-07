<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\Friendship;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class EventTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    public function test_user_can_create_event_with_photos(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/events', [
            'title' => 'Poród',
            'description' => 'Krótki opis',
            'event_date' => '2026-03-01',
            'photos' => [
                UploadedFile::fake()->image('one.jpg'),
                UploadedFile::fake()->image('two.jpg'),
            ],
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('events', ['title' => 'Poród', 'user_id' => $user->id]);
        $this->assertEquals(2, $response->json('photos') ? count($response->json('photos')) : 0);
    }

    public function test_event_rejects_more_than_five_photos(): void
    {
        $user = User::factory()->create();

        $photos = array_map(fn ($i) => UploadedFile::fake()->image("$i.jpg"), range(1, 6));

        $response = $this->actingAs($user)->postJson('/api/events', [
            'title' => 'Wycieczka',
            'event_date' => '2026-03-01',
            'photos' => $photos,
        ]);

        $response->assertStatus(422);
    }

    public function test_adding_sixth_photo_to_existing_event_is_rejected(): void
    {
        $user = User::factory()->create();
        $event = Event::create(['user_id' => $user->id, 'title' => 'Urodziny', 'event_date' => '2026-01-01']);

        foreach (range(1, 5) as $i) {
            $event->photos()->create(['path' => "events/{$event->id}/$i.jpg", 'position' => $i]);
        }

        $response = $this->actingAs($user)->postJson("/api/events/{$event->id}/photos", [
            'photo' => UploadedFile::fake()->image('sixth.jpg'),
        ]);

        $response->assertStatus(422);
    }

    public function test_owner_can_tag_friends_as_participants(): void
    {
        $user = User::factory()->create();
        $friend = User::factory()->create();

        Friendship::create(['requester_id' => $user->id, 'recipient_id' => $friend->id, 'status' => 'accepted']);

        $response = $this->actingAs($user)->postJson('/api/events', [
            'title' => 'Wyjazd w góry',
            'event_date' => '2026-02-01',
            'participant_ids' => [$friend->id],
        ]);

        $response->assertCreated();
        $response->assertJsonFragment(['id' => $friend->id]);
    }

    public function test_cannot_tag_non_friend_as_participant(): void
    {
        $user = User::factory()->create();
        $stranger = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/events', [
            'title' => 'Wyjazd w góry',
            'event_date' => '2026-02-01',
            'participant_ids' => [$stranger->id],
        ]);

        $response->assertStatus(422);
    }

    public function test_only_owner_can_update_event(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $event = Event::create(['user_id' => $owner->id, 'title' => 'Original', 'event_date' => '2026-01-01']);

        $response = $this->actingAs($other)->putJson("/api/events/{$event->id}", ['title' => 'Hacked']);

        $response->assertStatus(403);
    }

    public function test_only_owner_can_delete_event(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $event = Event::create(['user_id' => $owner->id, 'title' => 'Original', 'event_date' => '2026-01-01']);

        $response = $this->actingAs($other)->deleteJson("/api/events/{$event->id}");

        $response->assertStatus(403);
        $this->assertDatabaseHas('events', ['id' => $event->id]);
    }
}
