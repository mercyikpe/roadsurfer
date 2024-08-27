<template>
  <div class="relative w-full max-w-xl">
    <div class="relative">
      <label for="Search" class="sr-only"> Search </label>

      <input
        v-model="searchQuery"
        @input="handleInput"
        type="text"
        id="Search"
        placeholder="Search for a station city"
        class="w-full rounded border border-primary-green py-2.5 pe-10 shadow-sm sm:text-sm px-4"
      />

      <span class="absolute inset-y-0 end-0 grid w-10 place-content-center">
        <span class="text-black">
          <span class="sr-only">Search</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </span>
      </span>
    </div>

    <ul v-if="showResults" class="absolute z-10 w-full bg-white border rounded mt-1">
      <li v-if="results.length === 0" class="p-2 text-red-500">No station found</li>
      <li
        v-for="result in results"
        :key="result.id"
        @click="selectResult(result)"
        class="p-2 cursor-pointer hover:text-primary-green"
      >
        {{ result.name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { Station } from '@/types'
import { ApiService } from '@/services/ApiService'

const emit = defineEmits<{
  (e: 'selected', station: Station): void
}>()

const searchQuery = ref('')
const results = ref<Station[]>([])
const showResults = ref(false)

const handleInput = async () => {
  if (searchQuery.value.length > 1) {
    try {
      results.value = await ApiService.getStations(searchQuery.value)
      showResults.value = true
    } catch (error) {
      console.error('Error fetching results:', error)
      results.value = [] // Clear results on error
      showResults.value = true
    }
  } else {
    showResults.value = false
  }
}

const selectResult = (result: Station) => {
  searchQuery.value = result.name
  showResults.value = false
  emit('selected', result)
}

watch(searchQuery, () => {
  if (searchQuery.value.length === 0) {
    showResults.value = false
  }
})
</script>
