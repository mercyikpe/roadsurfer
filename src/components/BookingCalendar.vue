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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '@/stores/BookingStore'
import { startOfWeek, addDays, format, parseISO, min } from 'date-fns'
import Autocomplete from './Autocomplete.vue'
import type { Booking } from '@/types'

const router = useRouter()
const bookingStore = useBookingStore()

const errorMessage = ref<string | null>(null)
const isLoading = ref(false)
const currentWeekStart = ref(new Date())

const formatDisplayDate = (dateString: string) => {
  return format(parseISO(dateString), 'MMM dd, yyyy')
}

const weekDays = computed(() => {
  const days = []
  for (let i = 0; i < 7; i++) {
    const date = addDays(currentWeekStart.value, i)
    days.push({
      name: format(date, 'EEE'),
      date: format(date, 'yyyy-MM-dd')
    })
  }
  return days
})

const formattedWeekRange = computed(() => {
  const start = format(currentWeekStart.value, 'MMM dd, yyyy')
  const end = format(addDays(currentWeekStart.value, 6), 'MMM dd, yyyy')
  return `${start} - ${end}`
})

const previousWeek = () => {
  currentWeekStart.value = addDays(currentWeekStart.value, -7)
}

const nextWeek = () => {
  currentWeekStart.value = addDays(currentWeekStart.value, 7)
}

const handleStationSelected = async (station: Station) => {
  bookingStore.setSelectedStation(station)
  await fetchBookings()
}

const fetchBookings = async () => {
  if (bookingStore.selectedStation) {
    try {
      await bookingStore.fetchBookings(bookingStore.selectedStation.id)
      const fetchedBookings = bookingStore.bookings
      if (fetchedBookings.length > 0) {
        const dates = fetchedBookings.flatMap((booking) => [
          parseISO(booking.startDate),
          parseISO(booking.endDate)
        ])
        const earliestDate = min(dates)
        currentWeekStart.value = startOfWeek(earliestDate) // Ensure the calendar starts with the correct week
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
  }
}

const bookingsForDay = (date: string): { booking: Booking; isStart: boolean; isEnd: boolean }[] => {
  return bookingStore.bookings.flatMap((booking) => {
    const bookingStart = format(parseISO(booking.startDate), 'yyyy-MM-dd')
    const bookingEnd = format(parseISO(booking.endDate), 'yyyy-MM-dd')
    const isStart = bookingStart === date
    const isEnd = bookingEnd === date

    let result = []
    if (isStart) {
      result.push({ booking, isStart: true, isEnd: false })
    }
    if (isEnd) {
      result.push({ booking, isStart: false, isEnd: true })
    }
    return result
  })
}

const showBookingDetails = (booking: Booking) => {
  router.push(`/booking/${bookingStore.selectedStation?.id}/${booking.id}`)
}

const fetchInitialData = async () => {
  isLoading.value = true
  errorMessage.value = null
  try {
    await bookingStore.fetchStations('') // Automatically selects the first station and fetches bookings
    await fetchBookings() // Load bookings for the first station and display them on the calendar
  } catch (error: any) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

// HTML DRAG AND DROP
const draggedBooking = ref<{ booking: Booking; isStart: boolean; isEnd: boolean } | null>(null)

const handleDragStart = (bookingEntry: { booking: Booking; isStart: boolean; isEnd: boolean }) => {
  draggedBooking.value = bookingEntry
}

const handleDrop = (newDate: string) => {
  if (!draggedBooking.value) return

  const { booking, isStart, isEnd } = draggedBooking.value

  // Update the booking's start or end date locally
  if (isStart) {
    booking.startDate = newDate
  } else if (isEnd) {
    booking.endDate = newDate
  }

  // Log the changes to emulate an API call
  console.log('imaginary API Call:', {
    bookingId: booking.id,
    updatedStartDate: booking.startDate,
    updatedEndDate: booking.endDate
  })

  // Update the local bookings array in the store
  updateLocalBooking(booking)

  // Clear the dragged booking reference
  draggedBooking.value = null
}

// Function to update the local booking in the store without re-fetching
const updateLocalBooking = (updatedBooking: Booking) => {
  const index = bookingStore.bookings.findIndex((b) => b.id === updatedBooking.id)
  if (index !== -1) {
    bookingStore.bookings.splice(index, 1, updatedBooking)
  }
}

onMounted(() => {
  fetchInitialData()
})
</script>
