<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    /**
     * Return the authenticated user's profile information
     */
    public function show(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'name' => $user->name,
            'email' => $user->email,
            'created_at' => optional($user->created_at)->toISOString(),
            'correct_answers' => (int) ($user->correct_answers ?? 0),
        ]);
    }
}
