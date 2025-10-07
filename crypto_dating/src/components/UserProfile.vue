<script setup lang="ts">
import { onMounted, ref } from 'vue'
import api from '@/api/axios'

interface Profile {
  name: string
  email: string
  created_at: string
  correct_answers: number
}

const loading = ref(true)
const error = ref<string | null>(null)
const profile = ref<Profile | null>(null)

onMounted(async () => {
  try {
    loading.value = true
    error.value = null
    // If you're using Sanctum Personal Access Tokens, include the Authorization header
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token')
    const res = await api.get('/profile', token ? {
      headers: { Authorization: `Bearer ${token}` },
    } : undefined)
    profile.value = res.data
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'Failed to load profile.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-md mx-auto p-4 bg-white/80 dark:bg-gray-800/60 rounded-xl shadow">
    <h2 class="text-2xl font-semibold mb-4">Your Profile</h2>

    <div v-if="loading" class="text-gray-500">Loading...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>

    <div v-else-if="profile" class="space-y-2">
      <div>
        <span class="font-medium">Name:</span>
        <span>{{ profile.name }}</span>
      </div>
      <div>
        <span class="font-medium">Email:</span>
        <span>{{ profile.email }}</span>
      </div>
      <div>
        <span class="font-medium">Registered:</span>
        <span>{{ new Date(profile.created_at).toLocaleDateString() }}</span>
      </div>
      <div>
        <span class="font-medium">Correct Answers:</span>
        <span>{{ profile.correct_answers }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
