<template>
  <div
    ref="cardElement"
    class="crypto-card relative w-80 h-96 bg-white rounded-2xl shadow-2xl border-4 border-transparent transition-all duration-300 cursor-grab active:cursor-grabbing"
  >
    <div class="relative h-full overflow-hidden rounded-2xl">
      <!-- Crypto Image -->
      <div class="relative h-48 bg-gradient-to-br from-purple-500 to-blue-600">
        <img
          :src="crypto.image"
          :alt="crypto.name"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-black bg-opacity-20"></div>
        
        <!-- Price Change Badge -->
        <div
          class="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold"
          :class="crypto.priceChange24h >= 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'"
        >
          {{ crypto.priceChange24h >= 0 ? '+' : '' }}{{ crypto.priceChange24h.toFixed(2) }}%
        </div>
      </div>

      <!-- Card Content -->
      <div class="p-6 space-y-4">
        <div class="text-center">
          <h2 class="text-2xl font-bold text-gray-800">{{ crypto.name }}</h2>
          <p class="text-lg font-semibold text-gray-600">{{ crypto.symbol }}</p>
          <p class="text-xl font-bold text-blue-600">${{ formatPrice(crypto.currentPrice) }}</p>
        </div>

        <p class="text-sm text-gray-600 leading-relaxed">
          {{ crypto.description }}
        </p>

        <div class="text-xs text-gray-500 text-center">
          Market Cap: ${{ formatMarketCap(crypto.marketCap) }}
        </div>
      </div>

      <!-- Swipe Indicators -->
      <div class="absolute top-1/2 left-4 transform -translate-y-1/2 opacity-0 transition-opacity duration-200" :class="{ 'opacity-100': swipeDirection === 'left' }">
        <div class="bg-red-500 text-white px-4 py-2 rounded-lg font-bold">
          NOPE
        </div>
      </div>
      
      <div class="absolute top-1/2 right-4 transform -translate-y-1/2 opacity-0 transition-opacity duration-200" :class="{ 'opacity-100': swipeDirection === 'right' }">
        <div class="bg-green-500 text-white px-4 py-2 rounded-lg font-bold">
          LIKE
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { CryptoCurrency } from '../types/crypto';
import { useSwipe } from '../composables/useSwipe';

interface Props {
  crypto: CryptoCurrency;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  swipeLeft: [crypto: CryptoCurrency];
  swipeRight: [crypto: CryptoCurrency];
}>();

const cardElement = ref<HTMLElement | null>(null);
const swipeDirection = ref<'left' | 'right' | null>(null);

const { isDragging } = useSwipe(
  cardElement,
  () => {
    emit('swipeLeft', props.crypto);
    swipeDirection.value = null;
  },
  () => {
    emit('swipeRight', props.crypto);
    swipeDirection.value = null;
  }
);

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

const formatMarketCap = (cap: number): string => {
  if (cap >= 1e12) {
    return `${(cap / 1e12).toFixed(2)}T`;
  } else if (cap >= 1e9) {
    return `${(cap / 1e9).toFixed(2)}B`;
  } else if (cap >= 1e6) {
    return `${(cap / 1e6).toFixed(2)}M`;
  }
  return cap.toLocaleString();
};
</script>

<style scoped>
.crypto-card {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.crypto-card:hover {
  transform: scale(1.02);
}
</style>