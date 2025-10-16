import { ref, onMounted, onUnmounted } from 'vue';
import type { CryptoCurrency } from '../types/crypto';
import { coinGeckoService } from '../services/coinGeckoService';

export function useCoinGecko() {
  const coins = ref<CryptoCurrency[]>([]);
  const isLoading = ref(true);
  const error = ref<string | null>(null);

  const handleCoinsUpdate = (newCoins: CryptoCurrency[]) => {
    if (newCoins.length > 0) {
      coins.value = newCoins;
      error.value = null;
    } else if (coins.value.length === 0) {
      error.value = 'Failed to fetch cryptocurrency data';
    }
    isLoading.value = false;
  };

  onMounted(() => {
    coinGeckoService.startPolling(handleCoinsUpdate);

    // Set a timeout to stop loading even if API never responds
    setTimeout(() => {
      if (isLoading.value) {
        isLoading.value = false;
        if (coins.value.length === 0) {
          error.value = 'Unable to load cryptocurrency data. Please check your connection.';
        }
      }
    }, 10000); // 10 second timeout
  });

  onUnmounted(() => {
    coinGeckoService.stopPolling(handleCoinsUpdate);
  });

  return {
    coins,
    isLoading,
    error
  };
}