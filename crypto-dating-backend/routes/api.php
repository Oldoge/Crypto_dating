<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\QuizController;

Route::get('/ping', fn() => response()->json(['message' => 'pong']));

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function ($request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // Profile
    Route::get('/profile', [ProfileController::class, 'show']);

    // Example quiz route to increment correct answers when an answer is correct
    Route::post('/quiz/correct', [QuizController::class, 'incrementCorrectAnswers']);
});
