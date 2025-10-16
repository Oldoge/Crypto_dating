<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/50" @click.self="$emit('close')"></div>
    <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6">
      <h3 class="text-xl font-semibold text-gray-900 mb-4">Account settings</h3>

      <form @submit.prevent="onSave" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            v-model="form.username"
            type="text"
            placeholder="Enter username"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="you@example.com"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />
        </div>

        <div class="pt-2">
          <p class="text-sm font-medium text-gray-900 mb-2">Change password</p>
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-700 mb-1">Current password</label>
              <input v-model="form.currentPassword" type="password" autocomplete="current-password" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm text-gray-700 mb-1">New password</label>
              <input v-model="form.newPassword" type="password" autocomplete="new-password" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-sm text-gray-700 mb-1">Confirm new password</label>
              <input v-model="form.newPasswordConfirm" type="password" autocomplete="new-password" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

        <div class="flex justify-end gap-3 mt-6">
          <button type="button" @click="$emit('close')" class="px-4 py-2 rounded-lg border text-gray-700">Cancel</button>
          <button type="submit" :disabled="saving" class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
            {{ saving ? 'Saving…' : 'Save' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, ref } from 'vue'
import type { User } from '../types/crypto'

interface Props {
  isOpen: boolean
  user: User | null
}
const props = defineProps<Props>()
const emit = defineEmits<{ save: [payload: { username?: string; email?: string; currentPassword?: string; newPassword?: string; newPasswordConfirm?: string }]; close: [] }>()

const error = ref('')
const saving = ref(false)
const form = reactive({
  username: '',
  email: '',
  currentPassword: '',
  newPassword: '',
  newPasswordConfirm: '',
})

watch(
  () => props.user,
  (u) => {
    form.username = u?.username || ''
    form.email = u?.email || ''
    form.currentPassword = ''
    form.newPassword = ''
    form.newPasswordConfirm = ''
  },
  { immediate: true }
)

const onSave = async () => {
  error.value = ''
  if (form.newPassword || form.newPasswordConfirm) {
    if (form.newPassword.length < 6) {
      error.value = 'New password must be at least 6 characters.'
      return
    }
    if (form.newPassword !== form.newPasswordConfirm) {
      error.value = 'Password confirmation does not match.'
      return
    }
  }
  saving.value = true
  try {
    emit('save', {
      username: form.username,
      email: form.email,
      currentPassword: form.currentPassword || undefined,
      newPassword: form.newPassword || undefined,
      newPasswordConfirm: form.newPasswordConfirm || undefined,
    })
  } finally {
    saving.value = false
  }
}
</script>
