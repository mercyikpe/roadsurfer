<template>
  <div v-if="isLoading" class="text-center p-4">
    <p>Loading data, please wait...</p>
  </div>

  <div v-else-if="errorMessage" class="bg-red-500 text-white p-4 rounded mb-4">
    {{ errorMessage }}
  </div>

  <div v-else class="space-y-4">
    <div class="flex justify-between items-center">
      <button @click="previousWeek" class="px-4 py-2 bg-blue-500 text-white rounded">
        Previous
      </button>
      <h2 class="text-xl font-bold">{{ formattedWeekRange }}</h2>
      <button @click="nextWeek" class="px-4 py-2 bg-blue-500 text-white rounded">Next</button>
    </div>

    <p v-if="bookingStore.selectedStation" class="text-lg font-semibold">
      Current Station: {{ bookingStore.selectedStation.name }}
    </p>

    <Autocomplete @selected="handleStationSelected" />

    <div class="grid grid-cols-7 gap-4">
      <div
        v-for="day in weekDays"
        :key="day.date"
        class="border rounded p-4"
        @dragover.prevent
        @drop="handleDrop(day.date)"
      >
        <h3 class="font-bold">{{ day.name }}</h3>
        <p class="text-sm">{{ formatDisplayDate(day.date) }}</p>
        <ul class="mt-2 space-y-2">
          <li
            v-for="bookingEntry in bookingsForDay(day.date)"
            :key="bookingEntry.booking.id"
            draggable="true"
            @dragstart="handleDragStart(bookingEntry)"
            @click="showBookingDetails(bookingEntry.booking)"
            class="p-2 rounded cursor-pointer text-xs space-y-2"
            :class="{
              'bg-blue-500 text-white': bookingEntry.isStart,
              'bg-red-500 text-white': bookingEntry.isEnd
            }"
          >
            <span class="block">{{ bookingEntry.booking.customerName }}</span>
            <span class="block">{{ bookingEntry.isStart ? 'Booking Start' : '' }}</span>
            <span class="block">{{ bookingEntry.isEnd ? 'Booking End' : '' }}</span>
            <span>
              {{ formatDisplayDate(bookingEntry.booking.startDate) }} -
              {{ formatDisplayDate(bookingEntry.booking.endDate) }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '@/stores/BookingStore'
import { useCalendar } from '@/composables/useCalendar'
import { useBookings } from '@/composables/useBookings'
import { useDragAndDrop } from '@/composables/useDragAndDrop'
import Autocomplete from './Autocomplete.vue'
import type { Booking } from '@/types'
import { startOfWeek } from 'date-fns'

const router = useRouter()
const bookingStore = useBookingStore()

const {
  currentWeekStart,
  weekDays,
  formattedWeekRange,
  previousWeek,
  nextWeek,
  formatDisplayDate
} = useCalendar()

const {
  errorMessage,
  isLoading,
  fetchBookings,
  bookingsForDay,
  fetchInitialData,
  handleStationSelected
} = useBookings()

const updateLocalBooking = (updatedBooking: Booking) => {
  const index = bookingStore.bookings.findIndex((b) => b.id === updatedBooking.id)
  if (index !== -1) {
    bookingStore.bookings.splice(index, 1, updatedBooking)
  }
}

const { draggedBooking, handleDragStart, handleDrop } = useDragAndDrop(updateLocalBooking)

const showBookingDetails = (booking: Booking) => {
  router.push(`/booking/${bookingStore.selectedStation?.id}/${booking.id}`)
}

onMounted(async () => {
  const earliestDate = await fetchInitialData()
  if (earliestDate) {
    currentWeekStart.value = startOfWeek(earliestDate)
  }
})
</script>
