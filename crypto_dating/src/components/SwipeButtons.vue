<template>
  <div class="flex justify-center space-x-8 mt-8">
    <button
      @click="$emit('dislike')"
      class="flex items-center justify-center w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transform transition-all duration-200 hover:scale-110 active:scale-95"
      :disabled="disabled"
    >
      <X :size="24" />
    </button>
    
    <button
      @click="$emit('like')"
      class="flex items-center justify-center w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transform transition-all duration-200 hover:scale-110 active:scale-95"
      :disabled="disabled"
    >
      <Heart :size="24" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { X, Heart } from 'lucide-vue-next';

interface Props {
  disabled?: boolean;
}

defineProps<Props>();
defineEmits<{
  like: [];
  dislike: [];
}>();
</script>