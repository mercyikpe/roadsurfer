<template>
  <div class="relative">
    <input
      type="text"
      v-model="searchQuery"
      @input="handleInput"
      class="w-full p-2 border rounded"
      placeholder="Type a station city"
    />
    <ul v-if="showResults" class="absolute z-10 w-full bg-white border rounded mt-1">
      <li v-if="results.length === 0" class="p-2 text-red-500">No results found</li>
      <li
        v-for="result in results"
        :key="result.id"
        @click="selectResult(result)"
        class="p-2 hover:bg-gray-100 cursor-pointer"
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
