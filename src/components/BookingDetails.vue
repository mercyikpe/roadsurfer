<template>
  <div class="p-4">
    <SkeletonLoader v-if="loading" />

    <ErrorCard v-else-if="error" :error-message="error" />

    <div v-else-if="bookingStore.bookingDetails" class="max-w-3xl mx-auto my-6">
      <div class="flex justify-between items-end">
        <div class="px-4 sm:px-0">
          <h3 class="text-base font-semibold leading-7 text-gray-900">Booking Details</h3>
        </div>

        <RouterLink to="/" class="mt-4 px-4 py-2 bg-primary-green text-black rounded font-semibold"
          >Back to Calender</RouterLink
        >
      </div>

      <div class="mt-6 border-t border-gray-100">
        <dl class="divide-y divide-gray-100">
          <div class="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
            <dt class="text-sm font-medium leading-6 text-gray-900">Customer Name</dt>
            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {{ bookingStore.bookingDetails.customerName }}
            </dd>
          </div>
          <div class="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
            <dt class="text-sm font-medium leading-6 text-gray-900">Start Date</dt>
            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {{ formatDate(bookingStore.bookingDetails.startDate) }}
            </dd>
          </div>
          <div class="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
            <dt class="text-sm font-medium leading-6 text-gray-900">End Date</dt>
            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {{ formatDate(bookingStore.bookingDetails.endDate) }}
            </dd>
          </div>
          <div class="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
            <dt class="text-sm font-medium leading-6 text-gray-900">Duration</dt>
            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {{ bookingDuration }} days
            </dd>
          </div>
          <div class="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
            <dt class="text-sm font-medium leading-6 text-gray-900">Pickup-Return Station</dt>
            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {{ bookingStore.bookingDetails.stationName }}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBookingStore } from '@/stores/BookingStore'
import SkeletonLoader from './SkeletonLoader.vue'
import ErrorCard from './ErrorCard.vue'

const route = useRoute()
const bookingStore = useBookingStore()

const error = ref<string | null>(null)

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

onMounted(fetchBookingDetails)
</script>
