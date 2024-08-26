<template>
  <div class="p-4 border rounded">
    <h2 class="text-2xl font-bold mb-4">Booking Details</h2>
    <div v-if="booking">
      <p><strong>Customer Name:</strong> {{ booking.customerName }}</p>
      <p><strong>Start Date:</strong> {{ formatDate(booking.startDate) }}</p>
      <p><strong>End Date:</strong> {{ formatDate(booking.endDate) }}</p>
      <p><strong>Duration:</strong> {{ bookingDuration }} days</p>
      <p><strong>Pickup-Return Station:</strong> {{ booking.stationName }}</p>
    </div>
    <div v-else-if="error">
      <p class="text-red-500">Error: {{ error }}</p>
    </div>
    <div v-else>
      <p>Loading booking details...</p>
    </div>
    <button @click="goBack" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
      Back to Calendar
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Booking } from '@/types'

const route = useRoute()
const router = useRouter()

const booking = ref<Booking | null>(null)
const error = ref<string | null>(null)

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
    const response = await fetch(
      `https://605c94c36d85de00170da8b4.mockapi.io/stations/${stationId.value}/bookings/${bookingId.value}`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch booking details')
    }
    booking.value = await response.json()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An unknown error occurred'
  }
}

const goBack = () => {
  router.push('/')
}

onMounted(fetchBookingDetails)
</script>
