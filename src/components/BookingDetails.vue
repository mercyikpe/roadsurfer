<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Booking Details</h2>

    <SkeletonLoader v-if="loading" />

    <ErrorCard v-else-if="error" :error-message="error" />

    <section v-else-if="bookingStore.bookingDetails">
      <div>
        <p><strong>Customer Name:</strong> {{ bookingStore.bookingDetails.customerName }}</p>
        <p><strong>Start Date:</strong> {{ formatDate(bookingStore.bookingDetails.startDate) }}</p>
        <p><strong>End Date:</strong> {{ formatDate(bookingStore.bookingDetails.endDate) }}</p>
        <p><strong>Duration:</strong> {{ bookingDuration }} days</p>
        <p><strong>Pickup-Return Station:</strong> {{ bookingStore.bookingDetails.stationName }}</p>
      </div>

      <button @click="goBack" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Back to Calendar
      </button>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookingStore } from '@/stores/BookingStore'
import SkeletonLoader from './SkeletonLoader.vue'
import ErrorCard from './ErrorCard.vue'

const route = useRoute()
const router = useRouter()
const bookingStore = useBookingStore()

const error = ref<string | null>(null)

console.log('Error', error)
const loading = ref<boolean>(true)

const stationId = computed(() => route.params.stationId as string)
const bookingId = computed(() => route.params.bookingId as string)

const bookingDuration = computed(() => {
  if (bookingStore.bookingDetails) {
    const start = new Date(bookingStore.bookingDetails.startDate)
    const end = new Date(bookingStore.bookingDetails.endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }
  return 0
})

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString()
}

const fetchBookingDetails = async () => {
  try {
    await bookingStore.fetchBookingDetails(stationId.value, bookingId.value)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An unknown error occurred'
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/')
}

onMounted(fetchBookingDetails)
</script>
