<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <!-- Logo -->
        <div class="flex items-center space-x-2">
          <TrendingUp class="h-8 w-8 text-purple-600" />
          <h1 class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Crypto Tinder
          </h1>
        </div>

        <!-- User Info / Auth Button -->        <div v-if="user" class="flex items-center space-x-4 relative" ref="menuRoot">
          <div class="text-right">
            <button
              @click="toggleMenu"
              class="text-sm font-medium text-gray-900 hover:text-blue-600 flex items-center gap-2"
            >
              <span v-if="props.welcomeBack" class="text-gray-400 italic">Welcome back</span>
              <span>{{ user.username }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
              </svg>
            </button>
            <p 
              class="text-xs cursor-pointer hover:text-blue-600 hover:underline transition-all duration-200 relative text-right"
              :class="props.hasNewResults ? 'text-blue-600 font-medium' : 'text-gray-500'"
              @click="$emit('showResults')"
              title="Click to see prediction results"
            >
              {{ user.correctPredictions }}/{{ user.totalSwipes }} correct
              <span 
                v-if="props.hasNewResults" 
                class="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"
              ></span>
            </p>
          </div>
          <button
            @click="$emit('showResults')"
            class="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors duration-200"
          >
            Results
          </button>
          <button
            @click="$emit('logout')"
            class="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            Sign Out
          </button>

          <!-- Dropdown -->
          <Transition name="dropdown">
            <div v-if="menuOpen" class="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
              <div class="px-4 py-3">
                <p class="text-xs text-gray-500">Signed in as</p>
                <p class="text-sm font-medium text-gray-900 truncate">{{ user.email }}</p>
              </div>
              <div class="border-t border-gray-100">
                <button
                  @click="goProfile"
                  class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Profile
                </button>
                <button
                  @click="openSettings"
                  class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Settings
                </button>
              </div>
            </div>
          </Transition>
          <!-- Settings Modal -->
          <SettingsModal
            :is-open="settingsOpen"
            :user="user ?? null"
            @close="settingsOpen = false"
            @save="(p) => { emit('saveSettings', p); settingsOpen = false; }"
          />
        </div>
        
        <button
          v-else
          @click="$emit('showAuth')"
          class="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
        >
          Sign In
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { TrendingUp } from '../icons';
import type { User } from '../types/crypto';
import SettingsModal from './SettingsModal.vue';

interface Props {
  user?: User | null;
  hasNewResults?: boolean;
  welcomeBack?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  showAuth: [];
  showResults: [];
  logout: [];
  saveSettings: [{ username?: string; email?: string; currentPassword?: string; newPassword?: string; newPasswordConfirm?: string }];
  showProfile: [];
}>();

const menuOpen = ref(false);
const settingsOpen = ref(false);
const menuRoot = ref<HTMLElement | null>(null);

const toggleMenu = () => (menuOpen.value = !menuOpen.value);
const closeMenu = () => (menuOpen.value = false);
const openSettings = () => {
  settingsOpen.value = true;
  closeMenu();
};
const goProfile = () => {
  emit('showProfile');
  closeMenu();
};

const handleClickOutside = (e: MouseEvent) => {
  if (!menuRoot.value) return;
  const target = e.target as Node;
  if (!menuRoot.value.contains(target)) {
    closeMenu();
  }
};

const handleEsc = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    closeMenu();
    settingsOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleEsc);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleEsc);
});
</script>

<style scoped>
/* Slide-down fade transition for dropdown */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 150ms ease-out;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
