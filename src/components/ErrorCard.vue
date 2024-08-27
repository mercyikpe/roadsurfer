<template>
  <div
    class="mx-auto mt-[10%] flex w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800"
  >
    <div class="flex items-center justify-center w-12 bg-red-500">
      <ErrorIcon />
    </div>

    <div class="px-4 py-2 -mx-3">
      <div class="mx-3">
        <span class="font-semibold text-red-500 dark:text-red-400">Error</span>
        <p class="text-sm text-gray-600 dark:text-gray-200">
          <slot>
            {{ errorMessage }}
          </slot>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import ErrorIcon from './icons/ErrorIcon.vue'

defineProps({
  errorMessage: String
})
</script>
