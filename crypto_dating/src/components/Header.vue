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

        <!-- User Info / Auth Button -->
        <div v-if="user" class="flex items-center space-x-4">
          <div class="text-right">
            <p class="text-sm font-medium text-gray-900">{{ user.username }}</p>
            <p class="text-xs text-gray-500">
              {{ user.correctPredictions }}/{{ user.totalSwipes }} correct
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
import { TrendingUp } from 'lucide-vue-next';
import type { User } from '../types/crypto';

interface Props {
  user?: User | null;
}

defineProps<Props>();
defineEmits<{
  showAuth: [];
  showResults: [];
  logout: [];
}>();
</script>