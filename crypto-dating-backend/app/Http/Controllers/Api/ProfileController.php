<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

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

    /**
     * Update the authenticated user's profile information
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => [
                'sometimes', 'email', 'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'current_password' => ['nullable', 'string'],
            'new_password' => ['nullable', 'string', 'min:6', 'confirmed'], // expects new_password_confirmation
        ]);

        // Update name/email if provided
        if (array_key_exists('name', $validated)) {
            $user->name = $validated['name'];
        }
        if (array_key_exists('email', $validated)) {
            $user->email = $validated['email'];
        }

        // Handle password change
        if (!empty($validated['new_password'])) {
            // If user has a password set, require current_password match
            if (!empty($user->password)) {
                if (empty($validated['current_password']) || !Hash::check($validated['current_password'], $user->password)) {
                    return response()->json(['message' => 'Current password is incorrect'], 422);
                }
            }
            $user->password = Hash::make($validated['new_password']);
        }

        $user->save();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ]);
    }
}
