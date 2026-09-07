<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }

    public function sentFriendRequests(): HasMany
    {
        return $this->hasMany(Friendship::class, 'requester_id');
    }

    public function receivedFriendRequests(): HasMany
    {
        return $this->hasMany(Friendship::class, 'recipient_id');
    }

    public function timelineSharesGiven(): HasMany
    {
        return $this->hasMany(TimelineShare::class, 'owner_id');
    }

    public function timelineSharesReceived(): HasMany
    {
        return $this->hasMany(TimelineShare::class, 'shared_with_id');
    }

    /**
     * IDs of accepted friends, regardless of who sent the request.
     */
    public function friendIds(): array
    {
        return Friendship::query()
            ->where('status', 'accepted')
            ->where(fn ($q) => $q->where('requester_id', $this->id)->orWhere('recipient_id', $this->id))
            ->get(['requester_id', 'recipient_id'])
            ->map(fn ($f) => $f->requester_id === $this->id ? $f->recipient_id : $f->requester_id)
            ->values()
            ->all();
    }

    public function isFriendsWith(User $other): bool
    {
        return Friendship::query()
            ->where('status', 'accepted')
            ->where(function ($q) use ($other) {
                $q->where(['requester_id' => $this->id, 'recipient_id' => $other->id])
                    ->orWhere(['requester_id' => $other->id, 'recipient_id' => $this->id]);
            })
            ->exists();
    }

    public function canViewTimelineOf(User $owner): bool
    {
        if ($this->id === $owner->id) {
            return true;
        }

        return TimelineShare::query()
            ->where('owner_id', $owner->id)
            ->where('shared_with_id', $this->id)
            ->exists();
    }
}
