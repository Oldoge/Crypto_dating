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
      // Only set error if we don't have any coins yet
      error.value = 'Failed to fetch cryptocurrency data';
    }
    isLoading.value = false;
  };

  onMounted(() => {
    coinGeckoService.startPolling(handleCoinsUpdate);
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