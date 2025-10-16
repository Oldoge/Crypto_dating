<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
    <!-- Header -->    <Header
      :user="currentUser"
      :has-new-results="hasNewResults"
      :welcome-back="welcomeBack"
      @show-auth="showAuthModal = true"
      @logout="handleLogout"
      @show-results="showResultsModal = true; hasNewResults = false; newResultsIds = []"
      @save-settings="handleSaveSettings"
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
          :disabled="isTransitioning || isLocked"
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
            </div>            <div v-if="pendingPredictions > 0 || hasNewResults" class="mt-4 pt-4 border-t border-gray-200">
              <p v-if="hasNewResults" class="text-sm text-blue-600 font-medium mb-2 cursor-pointer hover:underline" @click="showResultsModal = true; hasNewResults = false; newResultsIds = []">
                🎉 New prediction results are available! Click to view
              </p>
              <p v-if="pendingPredictions > 0" class="text-sm text-gray-600">
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

    <!-- Right-side floating button to open training selection -->
    <button
      class="fixed top-1/2 -translate-y-1/2 right-4 z-40 bg-white/90 backdrop-blur border border-gray-200 shadow-lg hover:shadow-xl px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-gray-900"
      title="Choose cryptocurrencies to train"
      @click="openFilterDrawer"
    >
      Choose cryptos
    </button>

    <!-- Sliding Drawer: choose cryptocurrencies to train -->
    <Transition name="drawer">
      <div v-if="showFilterDrawer" class="fixed inset-0 z-50 flex">
        <!-- Backdrop -->
        <div class="flex-1 bg-black/40" @click="closeFilterDrawer"></div>
        <!-- Panel -->
        <div class="w-80 max-w-full bg-white h-full shadow-2xl border-l border-gray-200 p-4 overflow-y-auto">
          <div class="flex items-start justify-between mb-3">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Train with specific cryptos</h3>
              <p class="text-sm text-gray-500">Select at least 5 cryptocurrencies</p>
            </div>
            <button class="text-gray-400 hover:text-gray-600" @click="closeFilterDrawer">✕</button>
          </div>

          <div class="mb-3">
            <input
              v-model="filterSearch"
              type="text"
              placeholder="Search..."
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>

          <div class="space-y-1">
            <label
              v-for="c in filteredCoinOptions"
              :key="c.id"
              class="flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                class="h-4 w-4"
                :value="c.id"
                v-model="selectedIdsTemp"
              />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ c.name }}</p>
                <p class="text-xs text-gray-500 uppercase">{{ c.symbol }}</p>
              </div>
            </label>
          </div>

          <div class="mt-4 flex items-center justify-between">
            <p class="text-sm" :class="selectedIdsTemp.length < 5 ? 'text-red-600' : 'text-gray-600'">
              Selected: {{ selectedIdsTemp.length }} / at least 5
            </p>
            <div class="flex gap-2">
              <button @click="clearSelection" class="px-3 py-2 text-sm border rounded-lg text-gray-700">Clear</button>
              <button
                @click="confirmSelection"
                :disabled="selectedIdsTemp.length < 5"
                class="px-4 py-2 text-sm rounded-lg text-white disabled:opacity-50 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>


    <!-- Access Gate Overlay -->
    <Transition name="overlay">
      <div v-if="isLocked" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/60"></div>
        <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 text-center modal-panel">
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Authentication required</h3>
          <p class="text-gray-600 mb-6">Before using the site, you must first register or log in.</p>
          <div class="flex items-center justify-center gap-3">
            <button
              @click="showAuthModal = true"
              class="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold hover:from-purple-600 hover:to-blue-700"
            >
              Sign In / Register
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Selection Complete Notice -->
    <Transition name="overlay">
      <div v-if="showSelectionComplete" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/40"></div>
        <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 text-center modal-panel">
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Well done!</h3>
          <p class="text-gray-600">You completed your selected set. Refreshing…</p>
        </div>
      </div>
    </Transition>

    <!-- Auth Modal -->
    <AuthModal
      :is-open="showAuthModal"
      @close="showAuthModal = false"
      @login="handleLogin"
      @register="handleRegister"
    />    <!-- Results Modal -->    <ResultsModal
      :is-open="showResultsModal"
      :predictions="currentUser?.predictions || []"
      :new-results-ids="newResultsIds"
      @close="showResultsModal = false; newResultsIds = []"
      @view-all-results="newResultsIds = []"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { TrendingUp } from './icons';
import type { CryptoCurrency, User, SwipeAction } from './types/crypto';
import { useCoinGecko } from './composables/useCoinGecko';
import Header from './components/Header.vue';
import CryptoCard from './components/CryptoCard.vue';
import SwipeButtons from './components/SwipeButtons.vue';
import AuthModal from './components/AuthModal.vue';
import ResultsModal from './components/ResultsModal.vue';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getUser as apiGetUser, incrementCorrectAnswers, updateProfile } from './api/auth';
import { createPrediction, bulkImportPredictions } from './api/predictions';
import { readPredictionsFromCookie, writePredictionsToCookie, clearPredictionsCookie } from './utils/predictionsCookie';

const currentUser = ref<User | null>(null);
const authToken = ref<string | null>(null);
const showAuthModal = ref(false);
const welcomeBack = ref(false);
const showResultsModal = ref(false);
const availableCryptos = ref<CryptoCurrency[]>([]);
const swipeHistory = ref<SwipeAction[]>([]);
const isTransitioning = ref(false);
const hasNewResults = ref(false);
const newResultsIds = ref<string[]>([]);
// Training selection drawer state
const showFilterDrawer = ref(false);
const filterSearch = ref('');
const selectedIdsTemp = ref<string[]>([]);
// Selection complete notice
const showSelectionComplete = ref(false);

// Use CoinGecko API
const { coins, isLoading, error } = useCoinGecko();

const currentCrypto = computed(() => {
  return availableCryptos.value[0] || null;
});

const accuracyPercentage = computed(() => {
  if (!currentUser.value || currentUser.value.totalSwipes === 0) return 0;
  return Math.round((currentUser.value.correctPredictions / currentUser.value.totalSwipes) * 100);
});

const isLocked = computed(() => !currentUser.value);

const pendingPredictions = computed(() => {
  if (!currentUser.value) return 0;
  return currentUser.value.predictions.filter(p => !p.resultChecked).length;
});

const filteredCoinOptions = computed(() => {
  const q = filterSearch.value.trim().toLowerCase();
  const list = coins.value || [];
  if (!q) return list;
  return list.filter(c =>
    c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
  );
});

const reloadPage = () => {
  window.location.reload();
};

// Storage key for selected cryptos, scoped per user (fallback to anon)
const selectionStorageKey = () => {
  const id = currentUser.value?.id;
  return `cryptoTinderSelectedIds:${id ?? 'anon'}`;
};
 // Handle swipe action
const handleSwipe = async (action: 'like' | 'dislike') => {
  if (!currentCrypto.value || isTransitioning.value) return;
  if (isLocked.value) {
    showAuthModal.value = true;
    return;
  }
  
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
  }
  
  setTimeout(() => {
    availableCryptos.value.shift();
    isTransitioning.value = false;
    // If filtered selection is active and deck is finished, show success notice and refresh
    try {
      const saved = localStorage.getItem(selectionStorageKey());
      let selectedIds: string[] = [];
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) selectedIds = parsed;
      }
      const filterActive = selectedIds.length >= 5;
      if (filterActive && availableCryptos.value.length === 0) {
        showSelectionComplete.value = true;
        setTimeout(() => window.location.reload(), 1200);
      }
    } catch {}
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
    // Clear any previous crypto selection for new account so all cards show by default
    try { localStorage.removeItem(selectionStorageKey()); } catch {}
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
    welcomeBack.value = false;
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
  if (savedToken) {
    authToken.value = savedToken;
    welcomeBack.value = true;
  }
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

// Drawer helpers
const openFilterDrawer = () => {
  // Prefill selection from saved storage if available
  const saved = localStorage.getItem(selectionStorageKey());
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) selectedIdsTemp.value = parsed;
    } catch {}
  }
  showFilterDrawer.value = true;
};
const closeFilterDrawer = () => {
  showFilterDrawer.value = false;
};
const clearSelection = () => {
  selectedIdsTemp.value = [];
  // Remove persisted selection and reset deck to all coins immediately
  try { localStorage.removeItem(selectionStorageKey()); } catch {}
  if (coins.value && coins.value.length > 0) {
    availableCryptos.value = shuffle(coins.value);
  }
  closeFilterDrawer();
};
const confirmSelection = () => {
  if (selectedIdsTemp.value.length < 5) return;
  localStorage.setItem(selectionStorageKey(), JSON.stringify(selectedIdsTemp.value));
  // Refresh to apply selection as requested
  window.location.reload();
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
        const newlyConfirmedIds: string[] = [];
      
      predictionsToCheck.forEach(async (prediction) => {
        const currentPrice = currentPrices[prediction.coinId]?.usd;
        if (currentPrice) {
          const priceChange = currentPrice - prediction.initialPrice;
          const actualOutcome = priceChange >= 0 ? 'up' : 'down';
          const predictedOutcome = prediction.action === 'like' ? 'up' : 'down';
          const wasCorrect = actualOutcome === predictedOutcome;
          
          prediction.resultChecked = true;
          prediction.resultConfirmedAt = new Date();
          prediction.actualOutcome = actualOutcome;
          prediction.wasCorrect = wasCorrect;
          
          // Track this as a newly confirmed result
          const predictionId = prediction.clientId || `${prediction.coinId}-${prediction.timestamp.getTime()}`;
          newlyConfirmedIds.push(predictionId);
          
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
        // Set flag if any predictions were newly confirmed
      if (newlyConfirmedIds.length > 0) {
        hasNewResults.value = true;
        newResultsIds.value = newlyConfirmedIds;
      }
      
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
  
  // Check for results when user returns to the tab
  const handleVisibilityChange = () => {
    if (!document.hidden && currentUser.value) {
      checkPredictionResults();
    }
  };
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  // Watch for coins updates
  const updateAvailableCoins = () => {
    if (coins.value.length > 0 && availableCryptos.value.length === 0) {
      const saved = localStorage.getItem(selectionStorageKey());
      let selectedIds: string[] = [];
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) selectedIds = parsed;
        } catch {}
      }
      let list = [...coins.value];
      if (selectedIds.length >= 5) {
        const set = new Set(selectedIds);
        list = list.filter(c => set.has(c.id));
      }
      // Shuffle for randomness
      availableCryptos.value = shuffle(list);
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
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
});

// Simple Fisher-Yates shuffle
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Handle settings save from header
const handleSaveSettings = async (payload: { username?: string; email?: string; currentPassword?: string; newPassword?: string; newPasswordConfirm?: string }) => {
  if (!authToken.value || !currentUser.value) return;
  try {
    const apiPayload: any = {};
    if (payload.username && payload.username !== currentUser.value.username) apiPayload.name = payload.username;
    if (payload.email && payload.email !== currentUser.value.email) apiPayload.email = payload.email;
    if (payload.newPassword) {
      apiPayload.current_password = payload.currentPassword;
      apiPayload.new_password = payload.newPassword;
      apiPayload.new_password_confirmation = payload.newPasswordConfirm;
    }
    const updated = await updateProfile(authToken.value, apiPayload);
    // Update local user state
    currentUser.value = {
      ...currentUser.value,
      email: updated.email ?? currentUser.value.email,
      username: updated.name ?? currentUser.value.username,
    } as typeof currentUser.value;
    persistAuth();
  } catch (e: any) {
    const msg = e?.response?.data?.message || (e?.response?.data?.errors ? Object.values(e.response.data.errors).flat().join('\n') : null) || 'Failed to update profile';
    alert(msg);
  }
}
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
<style>
/* Overlay fade */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 180ms ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

/* Modal panel pop */
.modal-panel {
  transition: transform 200ms ease, opacity 200ms ease;
}
.overlay-enter-from .modal-panel {
  opacity: 0;
  transform: translateY(6px) scale(0.98);
}
.overlay-enter-to .modal-panel {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.overlay-leave-from .modal-panel {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.overlay-leave-to .modal-panel {
  opacity: 0;
  transform: translateY(6px) scale(0.98);
}

/* Drawer slide from right */
.drawer-enter-active,
.drawer-leave-active {
  transition: transform 220ms ease, opacity 220ms ease;
}
.drawer-enter-from > div:last-child,
.drawer-leave-to > div:last-child {
  transform: translateX(100%);
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0.99; /* keep nearly opaque to avoid flicker */
}
</style>