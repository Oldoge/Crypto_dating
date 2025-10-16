<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\QuizController;
use App\Http\Controllers\Api\PredictionController;

Route::get('/ping', fn() => response()->json(['message' => 'pong']));

// Handle preflight OPTIONS requests
Route::options('{any}', function() {
    return response('', 200)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization, X-Requested-With')
        ->header('Access-Control-Allow-Credentials', 'true');
})->where('any', '.*');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // Profile
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::patch('/profile', [ProfileController::class, 'update']);

    // Example quiz route to increment correct answers when an answer is correct
    Route::post('/quiz/correct', [QuizController::class, 'incrementCorrectAnswers']);

    // Predictions
    Route::get('/predictions', [PredictionController::class, 'index']);
    Route::post('/predictions', [PredictionController::class, 'store']);
    Route::post('/predictions/bulk', [PredictionController::class, 'bulkStore']);
});
