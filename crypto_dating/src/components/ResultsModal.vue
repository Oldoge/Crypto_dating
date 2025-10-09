<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Prediction Results</h2>
        <button
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-700"
        >
          <X :size="24" />
        </button>
      </div>

      <div class="overflow-y-auto max-h-[60vh]">
        <div v-if="predictions.length === 0" class="text-center py-8">
          <TrendingUp class="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-600">No predictions yet. Start swiping to make predictions!</p>
        </div>

        <div v-else class="space-y-4">
          <!-- Pending Predictions -->
          <div v-if="pendingPredictions.length > 0">
            <h3 class="text-lg font-semibold text-gray-700 mb-3">Pending Results</h3>
            <div class="space-y-2">
              <div
                v-for="prediction in pendingPredictions"
                :key="prediction.timestamp.toString()"
                class="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
              >
                <div class="flex justify-between items-center">
                  <div>
                    <p class="font-semibold text-gray-800">{{ prediction.coinName }} ({{ prediction.coinSymbol }})</p>
                    <p class="text-sm text-gray-600">
                      Predicted: {{ prediction.action === 'like' ? 'Will go UP 📈' : 'Will go DOWN 📉' }}
                    </p>
                    <p class="text-sm text-gray-500">
                      Price at prediction: ${{ formatPrice(prediction.initialPrice) }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm text-yellow-600 font-medium">Pending</p>
                    <p class="text-xs text-gray-500">
                      {{ getTimeRemaining(prediction.timestamp) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Completed Predictions -->
          <div v-if="completedPredictions.length > 0">
            <h3 class="text-lg font-semibold text-gray-700 mb-3">Completed Results</h3>
            <div class="space-y-2">
              <div
                v-for="prediction in completedPredictions"
                :key="prediction.timestamp.toString()"
                class="rounded-lg p-4 border"
                :class="prediction.wasCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'"
              >
                <div class="flex justify-between items-center">
                  <div>
                    <p class="font-semibold text-gray-800">{{ prediction.coinName }} ({{ prediction.coinSymbol }})</p>
                    <p class="text-sm text-gray-600">
                      Predicted: {{ prediction.action === 'like' ? 'UP 📈' : 'DOWN 📉' }} | 
                      Actual: {{ prediction.actualOutcome === 'up' ? 'UP 📈' : 'DOWN 📉' }}
                    </p>
                    <p class="text-sm text-gray-500">
                      Initial: ${{ formatPrice(prediction.initialPrice) }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-medium" :class="prediction.wasCorrect ? 'text-green-600' : 'text-red-600'">
                      {{ prediction.wasCorrect ? '✅ Correct' : '❌ Wrong' }}
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ formatDate(prediction.timestamp) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Stats -->
      <div v-if="predictions.length > 0" class="mt-6 pt-4 border-t border-gray-200">
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <p class="text-2xl font-bold text-blue-600">{{ predictions.length }}</p>
            <p class="text-sm text-gray-600">Total Predictions</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-green-600">{{ correctCount }}</p>
            <p class="text-sm text-gray-600">Correct</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-purple-600">{{ accuracyRate }}%</p>
            <p class="text-sm text-gray-600">Accuracy</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { X, TrendingUp } from 'lucide-vue-next';
import type { SwipeAction } from '../types/crypto';

interface Props {
  isOpen: boolean;
  predictions: SwipeAction[];
}

const props = defineProps<Props>();
defineEmits<{
  close: [];
}>();

const pendingPredictions = computed(() => 
  props.predictions.filter(p => !p.resultChecked)
);

const completedPredictions = computed(() => 
  props.predictions.filter(p => p.resultChecked).reverse()
);

const correctCount = computed(() => 
  props.predictions.filter(p => p.wasCorrect).length
);

const accuracyRate = computed(() => {
  const completed = completedPredictions.value.length;
  if (completed === 0) return 0;
  return Math.round((correctCount.value / completed) * 100);
});

const formatPrice = (price: number): string => {
  if (price >= 1000) {
    return price.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  } else if (price >= 1) {
    return price.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  } else if (price >= 0.01) {
    return price.toFixed(4);
  } else {
    return price.toFixed(6);
  }
};

const formatDate = (timestamp: Date): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const getTimeRemaining = (timestamp: Date): string => {
  const now = new Date();
  const predictionTime = new Date(timestamp);
  const fiveMinutesLater = new Date(predictionTime.getTime() + 5 * 60 * 1000);
  const remaining = fiveMinutesLater.getTime() - now.getTime();

  if (remaining <= 0) {
    return 'Results available soon';
  }

  const minutes = Math.floor(remaining / (1000 * 60));
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
  return `${minutes}m ${seconds}s remaining`;
};
</script>