<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
    <!-- Header -->
    <Header
      :user="currentUser"
      @show-auth="showAuthModal = true"
      @logout="handleLogout"
      @show-results="showResultsModal = true"
    />

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-16">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mb-4"></div>
        <p class="text-gray-600">Loading cryptocurrencies...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex flex-col items-center justify-center py-16">
        <div class="text-center">
          <TrendingUp class="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 class="text-2xl font-bold text-gray-800 mb-2">Unable to load data</h2>
          <p class="text-gray-600 mb-6">{{ error }}</p>
          <button
            @click="reloadPage"
            class="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
          >
            Retry
          </button>
        </div>
      </div>

      <!-- Main App Content -->
      <div v-else-if="currentCrypto" class="flex flex-col items-center">
        <!-- Instructions -->
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-2">
            Will {{ currentCrypto.name }} go up or down?
          </h2>
          <p class="text-gray-600">
            Swipe right if you think it will rise, left if you think it will fall
          </p>
          <p class="text-sm text-gray-500 mt-2">
            Data updates every 5 seconds from CoinGecko
          </p>
        </div>

        <!-- Crypto Card -->
        <div class="relative">
          <Transition
            name="card"
            @enter="onCardEnter"
            @leave="onCardLeave"
          >
            <CryptoCard
              :key="currentCrypto.id"
              :crypto="currentCrypto"
              @swipe-left="handleSwipe('dislike')"
              @swipe-right="handleSwipe('like')"
            />
          </Transition>
        </div>

        <!-- Action Buttons -->
        <SwipeButtons
          @like="handleSwipe('like')"
          @dislike="handleSwipe('dislike')"
          :disabled="isTransitioning"
        />

        <!-- Stats -->
        <div v-if="currentUser" class="mt-8 text-center">
          <div class="bg-white rounded-lg p-4 shadow-md">
            <div class="grid grid-cols-3 gap-4 text-center">
              <div>
                <p class="text-2xl font-bold text-blue-600">{{ currentUser.totalSwipes }}</p>
                <p class="text-sm text-gray-600">Total Swipes</p>
              </div>
              <div>
                <p class="text-2xl font-bold text-green-600">{{ currentUser.correctPredictions }}</p>
                <p class="text-sm text-gray-600">Correct</p>
              </div>
              <div>
                <p class="text-2xl font-bold text-purple-600">{{ accuracyPercentage }}%</p>
                <p class="text-sm text-gray-600">Accuracy</p>
              </div>
            </div>
            <div v-if="pendingPredictions > 0" class="mt-4 pt-4 border-t border-gray-200">
              <p class="text-sm text-gray-600">
                {{ pendingPredictions }} predictions pending results
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- No More Cards -->
      <div v-else class="flex flex-col items-center justify-center py-16">
        <div class="text-center">
          <TrendingUp class="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 class="text-2xl font-bold text-gray-800 mb-2">No more cryptocurrencies!</h2>
          <p class="text-gray-600 mb-6">You've swiped through all available coins.</p>
          <button
            @click="resetCards"
            class="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>

    <!-- Auth Modal -->
    <AuthModal
      :is-open="showAuthModal"
      @close="showAuthModal = false"
      @login="handleLogin"
      @register="handleRegister"
    />

    <!-- Results Modal -->
    <ResultsModal
      :is-open="showResultsModal"
      :predictions="currentUser?.predictions || []"
      @close="showResultsModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { TrendingUp } from 'lucide-vue-next';
import type { CryptoCurrency, User, SwipeAction } from './types/crypto';
import { useCoinGecko } from './composables/useCoinGecko';
import Header from './components/Header.vue';
import CryptoCard from './components/CryptoCard.vue';
import SwipeButtons from './components/SwipeButtons.vue';
import AuthModal from './components/AuthModal.vue';
import ResultsModal from './components/ResultsModal.vue';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getUser as apiGetUser, incrementCorrectAnswers } from './api/auth';
import { createPrediction, bulkImportPredictions } from './api/predictions';
import { readPredictionsFromCookie, writePredictionsToCookie, clearPredictionsCookie } from './utils/predictionsCookie';

const currentUser = ref<User | null>(null);
const authToken = ref<string | null>(null);
const showAuthModal = ref(false);
const showResultsModal = ref(false);
const availableCryptos = ref<CryptoCurrency[]>([]);
const swipeHistory = ref<SwipeAction[]>([]);
const isTransitioning = ref(false);

// Use CoinGecko API
const { coins, isLoading, error } = useCoinGecko();

const currentCrypto = computed(() => {
  return availableCryptos.value[0] || null;
});

const accuracyPercentage = computed(() => {
  if (!currentUser.value || currentUser.value.totalSwipes === 0) return 0;
  return Math.round((currentUser.value.correctPredictions / currentUser.value.totalSwipes) * 100);
});

const pendingPredictions = computed(() => {
  if (!currentUser.value) return 0;
  return currentUser.value.predictions.filter(p => !p.resultChecked).length;
});

const reloadPage = () => {
  window.location.reload();
};
 // Handle swipe action
const handleSwipe = async (action: 'like' | 'dislike') => {
  if (!currentCrypto.value || isTransitioning.value) return;
  
  isTransitioning.value = true;
  
  const swipeAction: SwipeAction = {
    coinId: currentCrypto.value.id,
    coinName: currentCrypto.value.name,
    coinSymbol: currentCrypto.value.symbol,
    action,
    initialPrice: currentCrypto.value.currentPrice,
    timestamp: new Date(),
    clientId: crypto.randomUUID(),
  };
  
  swipeHistory.value.push(swipeAction);
  
  if (currentUser.value) {
    currentUser.value.totalSwipes++;
    currentUser.value.predictions.push(swipeAction);
    saveUserToStorage();
    // Persist to backend when authenticated
    try {
      const token = authToken.value || localStorage.getItem('cryptoTinderToken') || undefined;
      const payload = {
        client_id: swipeAction.clientId,
        type: 'coin',
        payload: {
          coinId: swipeAction.coinId,
          coinName: swipeAction.coinName,
          coinSymbol: swipeAction.coinSymbol,
          action: swipeAction.action,
          initialPrice: swipeAction.initialPrice,
          timestamp: swipeAction.timestamp,
        },
      };
      await createPrediction(payload, token);
    } catch (e) {
      console.error('Failed to persist prediction:', e);
    }
  } else {
    // Anonymous: store in cookie for later sync
    const existing = readPredictionsFromCookie();
    existing.push({
      client_id: swipeAction.clientId,
      type: 'coin',
      payload: {
        coinId: swipeAction.coinId,
        coinName: swipeAction.coinName,
        coinSymbol: swipeAction.coinSymbol,
        action: swipeAction.action,
        initialPrice: swipeAction.initialPrice,
        timestamp: swipeAction.timestamp,
      },
    });
    writePredictionsToCookie(existing);
  }
  
  setTimeout(() => {
    availableCryptos.value.shift();
    isTransitioning.value = false;
  }, 300);
};

const handleLogin = async (credentials: { email: string; password: string }) => {
  try {
    const { token, user } = await apiLogin(credentials.email, credentials.password);
    authToken.value = token;
    // Map backend user to frontend User type
    const mappedUser: User = {
      id: String(user.id),
      email: user.email,
      username: user.name ?? user.email.split('@')[0],
      totalSwipes: currentUser.value?.totalSwipes ?? 0,
      correctPredictions: currentUser.value?.correctPredictions ?? 0,
      predictions: currentUser.value?.predictions ?? [],
    };
    currentUser.value = mappedUser;
    showAuthModal.value = false;
    persistAuth();

    // Sync any predictions from cookie to backend
    try {
      const cookieItems = readPredictionsFromCookie();
      if (cookieItems.length > 0) {
        await bulkImportPredictions(cookieItems, token);
        clearPredictionsCookie();
      }
    } catch (e) {
      console.error('Failed to bulk sync predictions after login:', e);
    }
  } catch (e: any) {
    alert(e?.response?.data?.message || 'Login failed');
  }
};

const handleRegister = async (data: { email: string; password: string; username: string }) => {
  try {
    // Backend requires password_confirmation and optional name
    const res = await apiRegister({
      email: data.email,
      password: data.password,
      password_confirmation: data.password,
      name: data.username,
    });
    const { token, user } = res;
    authToken.value = token;
    const mappedUser: User = {
      id: String(user.id),
      email: user.email,
      username: user.name ?? data.username,
      totalSwipes: 0,
      correctPredictions: 0,
      predictions: [],
    };
    currentUser.value = mappedUser;
    showAuthModal.value = false;
    persistAuth();
  } catch (e: any) {
    const msg = e?.response?.data?.message ||
      (e?.response?.data?.errors ? Object.values(e.response.data.errors).flat().join('\n') : null) ||
      'Registration failed';
    alert(msg);
  }
};

const handleLogout = async () => {
  try {
    if (authToken.value) {
      await apiLogout(authToken.value);
    }
  } catch {
    // ignore
  } finally {
    currentUser.value = null;
    authToken.value = null;
    clearAuth();
  }
};

const resetCards = () => {
  availableCryptos.value = [...coins.value];
};

const persistAuth = () => {
  if (currentUser.value) {
    localStorage.setItem('cryptoTinderUser', JSON.stringify(currentUser.value));
  }
  if (authToken.value) {
    localStorage.setItem('cryptoTinderToken', authToken.value);
  }
};

const saveUserToStorage = persistAuth;
// Clear auth data from localStorage
const clearAuth = () => {
  localStorage.removeItem('cryptoTinderUser');
  localStorage.removeItem('cryptoTinderToken');
};

// Load user from localStorage on mount
const loadUserFromStorage = async () => {
  const savedUser = localStorage.getItem('cryptoTinderUser');
  const savedToken = localStorage.getItem('cryptoTinderToken');
  if (savedToken) authToken.value = savedToken;
  if (savedUser) {
    const user = JSON.parse(savedUser);
    if (!user.predictions) user.predictions = [];
    currentUser.value = user;
  }
  // Validate token by fetching user data
  if (authToken.value) {
    try {
      const backendUser = await apiGetUser(authToken.value);
      if (backendUser) {
        currentUser.value = {
          id: String(backendUser.id),
          email: backendUser.email,
          username: backendUser.name ?? backendUser.email.split('@')[0],
          totalSwipes: currentUser.value?.totalSwipes ?? 0,
          correctPredictions: currentUser.value?.correctPredictions ?? 0,
          predictions: currentUser.value?.predictions ?? [],
        };
        persistAuth();
      }
    } catch (e) {
      // Token invalid
      clearAuth();
      authToken.value = null;
    }
  }
  if (currentUser.value) {
    checkPredictionResults();
  }
};

const checkPredictionResults = async () => {
  if (!currentUser.value) return;
  // Check predictions older than 5 minutes that haven't been checked yet
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
  
  // Find predictions that are over 5 minutes old and haven't been checked
  const predictionsToCheck = currentUser.value.predictions.filter(
    p => !p.resultChecked && new Date(p.timestamp) <= fiveMinutesAgo
  );
  
  if (predictionsToCheck.length === 0) return;
  
  try {
    // Fetch current prices for coins that need checking
    const coinIds = [...new Set(predictionsToCheck.map(p => p.coinId))];
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds.join(',')}&vs_currencies=usd`
    );
    
    if (response.ok) {
      const currentPrices = await response.json();
      
      predictionsToCheck.forEach(async (prediction) => {
        const currentPrice = currentPrices[prediction.coinId]?.usd;
        if (currentPrice) {
          const priceChange = currentPrice - prediction.initialPrice;
          const actualOutcome = priceChange >= 0 ? 'up' : 'down';
          const predictedOutcome = prediction.action === 'like' ? 'up' : 'down';
          const wasCorrect = actualOutcome === predictedOutcome;
          
          prediction.resultChecked = true;
          prediction.actualOutcome = actualOutcome;
          prediction.wasCorrect = wasCorrect;
          
          if (wasCorrect) {
            currentUser.value!.correctPredictions++;
            // Inform backend to increment correct answers
            try {
              const token = authToken.value || localStorage.getItem('cryptoTinderToken') || undefined;
              if (token) await incrementCorrectAnswers(token);
            } catch (e) {
              console.error('Failed to increment correct answers in backend:', e);
            }
          }
        }
      });
      
      saveUserToStorage();
    }
  } catch (error) {
    console.error('Error checking prediction results:', error);
  }
};

const onCardEnter = (el: Element) => {
  const element = el as HTMLElement;
  element.style.opacity = '0';
  element.style.transform = 'scale(0.8)';
  
  setTimeout(() => {
    element.style.transition = 'all 0.3s ease-out';
    element.style.opacity = '1';
    element.style.transform = 'scale(1)';
  }, 50);
};

const onCardLeave = (el: Element) => {
  const element = el as HTMLElement;
  element.style.transition = 'all 0.3s ease-in';
  element.style.opacity = '0';
  element.style.transform = 'scale(0.8) translateY(-20px)';
};

onMounted(() => {
  loadUserFromStorage();
  
  // Check prediction results every 5 minutes
  const resultCheckInterval = setInterval(checkPredictionResults, 5 * 60 * 1000);
  
  // Watch for coins updates
  const updateAvailableCoins = () => {
    if (coins.value.length > 0 && availableCryptos.value.length === 0) {
      availableCryptos.value = [...coins.value];
    }
  };
  
  // Set up a watcher for coins
  const unwatchCoins = () => {
    if (coins.value.length > 0) {
      updateAvailableCoins();
    }
  };
  
  // Check immediately and set up interval
  updateAvailableCoins();
  const interval = setInterval(updateAvailableCoins, 1000);
  
  // Cleanup
  return () => {
    clearInterval(interval);
    clearInterval(resultCheckInterval);
  };
});
</script>

<style>
.card-enter-active,
.card-leave-active {
  transition: all 0.3s ease;
}

.card-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(20px);
}

.card-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(-20px);
}
</style>