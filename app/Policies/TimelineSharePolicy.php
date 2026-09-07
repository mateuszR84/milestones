<?php

namespace App\Policies;

use App\Models\TimelineShare;
use App\Models\User;

class TimelineSharePolicy
{
    public function delete(User $user, TimelineShare $timelineShare): bool
    {
        return $user->id === $timelineShare->owner_id;
    }
}
