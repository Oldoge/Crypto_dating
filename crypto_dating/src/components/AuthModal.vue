<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl p-8 w-full max-w-md">
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">
          {{ isLogin ? 'Welcome Back!' : 'Join Crypto Tinder' }}
        </h2>
        <p class="text-gray-600">
          {{ isLogin ? 'Sign in to continue swiping' : 'Create an account to start predicting' }}
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="!isLogin">
          <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            v-model="username"
            type="text"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your username"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
        >
          {{ isLogin ? 'Sign In' : 'Create Account' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600">
          {{ isLogin ? "Don't have an account?" : 'Already have an account?' }}
          <button
            @click="toggleMode"
            class="text-blue-600 hover:text-blue-800 font-semibold ml-1"
          >
            {{ isLogin ? 'Sign Up' : 'Sign In' }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  isOpen: boolean;
}

defineProps<Props>();
const emit = defineEmits<{
  close: [];
  login: [{ email: string; password: string }];
  register: [{ email: string; password: string; username: string }];
}>();

const isLogin = ref(true);
const email = ref('');
const password = ref('');
const username = ref('');

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  // Clear form when switching modes
  email.value = '';
  password.value = '';
  username.value = '';
};

const handleSubmit = () => {
  if (isLogin.value) {
    emit('login', {
      email: email.value,
      password: password.value
    });
  } else {
    emit('register', {
      email: email.value,
      password: password.value,
      username: username.value
    });
  }
  
  // Clear form after submission
  email.value = '';
  password.value = '';
  username.value = '';
};
</script>