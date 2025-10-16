<template>
  <div class="fixed inset-0 z-[60] flex items-start justify-center">
    <div class="absolute inset-0 bg-black/60" @click="close"></div>
    <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 my-10 p-6">
      <div class="flex items-start justify-between mb-4">
        <h2 class="text-2xl font-bold text-gray-900">Profile</h2>
        <button class="text-gray-400 hover:text-gray-600" @click="close">✕</button>
      </div>

      <div v-if="user" class="space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="text-sm text-gray-500">Name</p>
            <p class="text-lg font-semibold text-gray-900">{{ user.username }}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="text-sm text-gray-500">Email</p>
            <p class="text-lg font-semibold text-gray-900">{{ user.email }}</p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div class="bg-white border rounded-lg p-4 text-center">
            <p class="text-2xl font-bold text-blue-600">{{ user.totalSwipes }}</p>
            <p class="text-sm text-gray-600">Total Swipes</p>
          </div>
          <div class="bg-white border rounded-lg p-4 text-center">
            <p class="text-2xl font-bold text-green-600">{{ user.correctPredictions }}</p>
            <p class="text-sm text-gray-600">Correct</p>
          </div>
          <div class="bg-white border rounded-lg p-4 text-center">
            <p class="text-2xl font-bold text-purple-600">{{ accuracy }}%</p>
            <p class="text-sm text-gray-600">Accuracy</p>
          </div>
        </div>

        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-sm text-gray-500">Pending results</p>
          <p class="text-lg font-semibold text-gray-900">{{ pending }}</p>
        </div>

        <div class="flex items-center gap-3">
          <button
            @click="openSettings"
            class="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold hover:from-purple-600 hover:to-blue-700"
          >
            Edit Profile
          </button>
          <button
            @click="close"
            class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Back
          </button>
        </div>
      </div>

      <div v-else class="text-center py-10">
        <p class="text-gray-600">You are not logged in.</p>
      </div>

      <SettingsModal
        :is-open="settingsOpen"
        :user="user"
        @close="settingsOpen = false"
        @save="saveSettings"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { User } from '../types/crypto';
import SettingsModal from '../components/SettingsModal.vue';
import { updateProfile } from '../api/auth';

const router = useRouter();
const settingsOpen = ref(false);

const user = ref<User | null>(null);
const token = ref<string | null>(null);

try {
  const savedUser = localStorage.getItem('cryptoTinderUser');
  const savedToken = localStorage.getItem('cryptoTinderToken');
  if (savedUser) user.value = JSON.parse(savedUser);
  if (savedToken) token.value = savedToken;
} catch {}

const accuracy = computed(() => {
  if (!user.value || user.value.totalSwipes === 0) return 0;
  return Math.round((user.value.correctPredictions / user.value.totalSwipes) * 100);
});

const pending = computed(() => {
  if (!user.value) return 0;
  return user.value.predictions.filter(p => !p.resultChecked).length;
});

const close = () => router.back();
const openSettings = () => (settingsOpen.value = true);

const saveSettings = async (payload: { username?: string; email?: string; currentPassword?: string; newPassword?: string; newPasswordConfirm?: string }) => {
  if (!token.value || !user.value) return;
  try {
    const apiPayload: any = {};
    if (payload.username && payload.username !== user.value.username) apiPayload.name = payload.username;
    if (payload.email && payload.email !== user.value.email) apiPayload.email = payload.email;
    if (payload.newPassword) {
      apiPayload.current_password = payload.currentPassword;
      apiPayload.new_password = payload.newPassword;
      apiPayload.new_password_confirmation = payload.newPasswordConfirm;
    }
    const updated = await updateProfile(token.value, apiPayload);
    user.value = {
      ...user.value,
      email: updated.email ?? user.value.email,
      username: updated.name ?? user.value.username,
    } as User;
    localStorage.setItem('cryptoTinderUser', JSON.stringify(user.value));
  } catch (e: any) {
    const msg = e?.response?.data?.message || (e?.response?.data?.errors ? Object.values(e.response.data.errors).flat().join('\n') : null) || 'Failed to update profile';
    alert(msg);
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
