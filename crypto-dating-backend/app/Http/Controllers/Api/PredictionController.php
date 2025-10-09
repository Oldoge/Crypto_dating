<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Prediction;
use Illuminate\Http\Request;

class PredictionController extends Controller
{
    // GET /api/predictions
    public function index(Request $request)
    {
        $predictions = $request->user()
            ->predictions()
            ->latest()
            ->paginate(20);

        return response()->json($predictions);
    }

    // POST /api/predictions
    public function store(Request $request)
    {
        try {
            \Log::info('Predictions.store: incoming', [
                'user_id' => optional($request->user())->id,
                'client_id' => $request->input('client_id'),
            ]);

            $data = $request->validate([
                'client_id' => ['nullable', 'string', 'max:255'],
                'type' => ['nullable', 'string', 'max:100'],
                'payload' => ['required', 'array'],
                'score' => ['nullable', 'numeric'],
            ]);

            $user = $request->user();
            $coinId = $data['payload']['coinId'] ?? null;

            if (!empty($data['client_id'])) {
                $prediction = Prediction::updateOrCreate(
                    ['user_id' => $user->id, 'client_id' => $data['client_id']],
                    [
                        'coin_id' => $coinId,
                        'type' => $data['type'] ?? null,
                        'payload' => $data['payload'],
                        'score' => $data['score'] ?? null,
                    ]
                );
            } else {
                $prediction = Prediction::create([
                    'user_id' => $user->id,
                    'client_id' => null,
                    'coin_id' => $coinId,
                    'type' => $data['type'] ?? null,
                    'payload' => $data['payload'],
                    'score' => $data['score'] ?? null,
                ]);
            }

            \Log::info('Predictions.store: saved', [
                'user_id' => $user->id,
                'id' => $prediction->id,
                'client_id' => $prediction->client_id,
            ]);

            return response()->json($prediction, 201);
        } catch (\Throwable $e) {
            \Log::error('Predictions.store: error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['message' => 'Failed to save prediction'], 500);
        }
    }

    // POST /api/predictions/bulk
    public function bulkStore(Request $request)
    {
        try {
            \Log::info('Predictions.bulkStore: incoming', [
                'user_id' => optional($request->user())->id,
                'items_count' => is_array($request->input('items')) ? count($request->input('items')) : 0,
            ]);

            $payloads = $request->validate([
                'items' => ['required', 'array', 'max:1000'],
                'items.*.client_id' => ['nullable', 'string', 'max:255'],
                'items.*.type' => ['nullable', 'string', 'max:100'],
                'items.*.payload' => ['required', 'array'],
                'items.*.score' => ['nullable', 'numeric'],
            ])['items'];

            $user = $request->user();

            $count = 0;
            foreach ($payloads as $item) {
                $coinId = $item['payload']['coinId'] ?? null;
                Prediction::updateOrCreate(
                    [
                        'user_id' => $user->id,
                        'client_id' => $item['client_id'] ?? null,
                    ],
                    [
                        'coin_id' => $coinId,
                        'type' => $item['type'] ?? null,
                        'payload' => $item['payload'],
                        'score' => $item['score'] ?? null,
                    ]
                );
                $count++;
            }

            \Log::info('Predictions.bulkStore: saved', [
                'user_id' => $user->id,
                'count' => $count,
            ]);

            return response()->json([
                'message' => 'Synced',
                'count' => $count,
            ]);
        } catch (\Throwable $e) {
            \Log::error('Predictions.bulkStore: error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['message' => 'Failed to sync predictions'], 500);
        }
    }
}
