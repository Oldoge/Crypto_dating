<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class QuizController extends Controller
{
    /**
     * Example endpoint to increment correct answers count.
     
     */
    public function incrementCorrectAnswers(Request $request)
    {
        $user = $request->user();
        $user->increment('correct_answers');

        return response()->json([
            'message' => 'Correct answers incremented',
            'correct_answers' => (int) $user->correct_answers,
        ]);
    }
}
