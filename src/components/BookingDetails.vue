<template>
  <div class="p-4 border rounded">
    <h2 class="text-2xl font-bold mb-4">Booking Details</h2>
    <div v-if="loading">
      <p>Loading booking details...</p>
    </div>
    <div v-else-if="booking">
      <p><strong>Customer Name:</strong> {{ booking.customerName }}</p>
      <p><strong>Start Date:</strong> {{ formatDate(booking.startDate) }}</p>
      <p><strong>End Date:</strong> {{ formatDate(booking.endDate) }}</p>
      <p><strong>Duration:</strong> {{ bookingDuration }} days</p>
      <p><strong>Pickup-Return Station:</strong> {{ booking.stationName || 'Unknown Station' }}</p>
    </div>
    <div v-else-if="error">
      <p class="text-red-500">Error: {{ error }}</p>
    </div>
    <button @click="goBack" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
      Back to Calendar
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ApiService } from '@/services/ApiService'
import type { Booking, Station } from '@/types'

const route = useRoute()
const router = useRouter()

const booking = ref<Booking | null>(null)
const error = ref<string | null>(null)
const loading = ref<boolean>(true) // Added loading state

const stationId = computed(() => route.params.stationId as string)
const bookingId = computed(() => route.params.bookingId as string)

const bookingDuration = computed(() => {
  if (booking.value) {
    const start = new Date(booking.value.startDate)
    const end = new Date(booking.value.endDate)
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
    // Fetch station data
    const stations = await ApiService.getStations('')

    // Fetch booking details
    const bookingDetails = await ApiService.getBookingDetails(stationId.value, bookingId.value)

    // Find the station name based on pickupReturnStationId
    const matchedStation = stations.find(
      (station: Station) => station.id === bookingDetails.pickupReturnStationId
    )

    // Set station name in the booking object
    booking.value = {
      ...bookingDetails,
      stationName: matchedStation ? matchedStation.name : 'Unknown Station'
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An unknown error occurred'
  } finally {
    loading.value = false // Ensure loading is set to false after data is fetched or an error occurs
  }
}

const goBack = () => {
  router.push('/')
}

onMounted(fetchBookingDetails)
</script>
