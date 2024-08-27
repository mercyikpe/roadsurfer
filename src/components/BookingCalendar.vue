<template>
  <div v-if="isLoading" class="text-center p-4">
    <SkeletonLoader />
  </div>

  <ErrorCard v-else-if="errorMessage" :error-message="errorMessage" />

  <div v-else class="space-y-8 py-[5%]">
    <div
      class="flex flex-col md:flow-row space-y-4 justify-between items-center max-w-xl md:ml-auto"
    >
      <p class="text-xl font-bold">{{ formattedWeekRange }}</p>

      <div class="space-x-6">
        <button
          @click="previousWeek"
          class="px-4 py-2 bg-primary-green text-black rounded font-semibold"
        >
          Previous
        </button>
        <button
          @click="nextWeek"
          class="px-4 py-2 bg-primary-green text-black rounded font-semibold"
        >
          Next
        </button>
      </div>
    </div>

    <section class="flex flex-col md:flex-row max-w-3xl gap-8">
      <p
        v-if="bookingStore.selectedStation"
        class="text-lg font-semibold whitespace-nowrap text-center md:text-left"
      >
        Current Station: {{ bookingStore.selectedStation.name }}
      </p>
      <Autocomplete @selected="handleStationSelected" />
    </section>

    <div class="bg-white md:py-8 px-4 lg:max-w-7xl lg:mx-auto lg:px-8">
      <div
        class="inline-flex flex-col space-y-1 items-start justify-start h-full w-full overflow-x-auto"
      >
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 w-full">
          <div
            v-for="day in weekDays"
            :key="day.date"
            class="border border-gray-200 rounded p-4"
            @dragover.prevent
            @drop="handleDrop(day.date)"
          >
            <h3 class="font-bold text-gray-800">{{ day.name }}</h3>
            <p class="text-sm text-gray-800">{{ formatDisplayDate(day.date) }}</p>
            <ul class="mt-2 space-y-2">
              <li
                v-for="bookingEntry in bookingsForDay(day.date)"
                :key="bookingEntry.booking.id"
                draggable="true"
                @dragstart="handleDragStart(bookingEntry)"
                @click="showBookingDetails(bookingEntry.booking)"
                class="p-2 rounded cursor-pointer text-xs space-y-2"
                :class="{
                  'bg-primary-yellow text-white': bookingEntry.isStart,
                  'bg-primary-blue text-white': bookingEntry.isEnd
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '@/stores/BookingStore'
import { useCalendar } from '@/composables/useCalendar'
import { useBookings } from '@/composables/useBookings'
import { useDragAndDrop } from '@/composables/useDragAndDrop'
import Autocomplete from './Autocomplete.vue'
import type { Booking } from '@/types'
import { startOfWeek } from 'date-fns'
import SkeletonLoader from './SkeletonLoader.vue'
import ErrorCard from './ErrorCard.vue'

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
