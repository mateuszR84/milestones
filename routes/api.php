<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EventPhotoController;
use App\Http\Controllers\FriendshipController;
use App\Http\Controllers\TimelineShareController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::get('/friends', [FriendshipController::class, 'index']);
    Route::get('/friends/requests', [FriendshipController::class, 'requests']);
    Route::post('/friends/requests', [FriendshipController::class, 'store']);
    Route::post('/friends/requests/{friendship}/accept', [FriendshipController::class, 'accept']);
    Route::post('/friends/requests/{friendship}/decline', [FriendshipController::class, 'decline']);
    Route::delete('/friends/{friendship}', [FriendshipController::class, 'destroy']);

    Route::get('/timeline-shares', [TimelineShareController::class, 'index']);
    Route::post('/timeline-shares', [TimelineShareController::class, 'store']);
    Route::delete('/timeline-shares/{timelineShare}', [TimelineShareController::class, 'destroy']);

    Route::get('/timelines/{user}/events', [EventController::class, 'indexForUser']);
    Route::post('/events', [EventController::class, 'store']);
    Route::get('/events/{event}', [EventController::class, 'show']);
    Route::put('/events/{event}', [EventController::class, 'update']);
    Route::delete('/events/{event}', [EventController::class, 'destroy']);
    Route::post('/events/{event}/photos', [EventPhotoController::class, 'store']);
    Route::delete('/events/{event}/photos/{photo}', [EventPhotoController::class, 'destroy']);
});
