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

    <Autocomplete :apiUrl="stationsApiUrl" @selected="handleStationSelected" />

    <div class="grid grid-cols-7 gap-4">
      <div v-for="day in weekDays" :key="day.date" class="border rounded p-4">
        <h3 class="font-bold">{{ day.name }}</h3>
        <p class="text-sm">{{ formatDisplayDate(day.date) }}</p>
        <ul class="mt-2 space-y-2">
          <li
            v-for="bookingEntry in bookingsForDay(day.date)"
            :key="bookingEntry.booking.id"
            @click="showBookingDetails(bookingEntry.booking)"
            :class="{
              'bg-blue-500 text-white': bookingEntry.isStart,
              'bg-red-500 text-white': bookingEntry.isEnd
            }"
            class="p-2 rounded cursor-pointer text-xs space-y-2"
          >
            <span class="block">{{ bookingEntry.booking.customerName }}: </span>

            <span class="block">{{ bookingEntry.isStart ? 'Booking Start' : '' }}:</span>

            <span class="block">{{ bookingEntry.isEnd ? 'Booking End' : '' }} </span>

            <span
              >{{ formatDisplayDate(bookingEntry.booking.startDate) }} -
              {{ formatDisplayDate(bookingEntry.booking.endDate) }}</span
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '../stores/store'
import { ApiService } from '../services/ApiService'
import Autocomplete from './Autocomplete.vue'
import type { Station, Booking } from '@/types'
import { startOfWeek, addDays, format, parseISO, min } from 'date-fns'

const router = useRouter()
const bookingStore = useBookingStore()

const errorMessage = ref<string | null>(null)
const isLoading = ref(false)

const currentWeekStart = ref(new Date())
const stationsApiUrl = '' // Not needed anymore since we are using ApiService

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

const handleStationSelected = (station: Station) => {
  bookingStore.setSelectedStation(station)
  fetchBookings()
}

const fetchBookings = async () => {
  if (bookingStore.selectedStation) {
    try {
      const fetchedBookings = await ApiService.getBookings(
        bookingStore.selectedStation.id,
        '', // We're not using date range filtering here
        ''
      )
      bookingStore.setBookings(fetchedBookings)

      if (fetchedBookings.length > 0) {
        const dates = fetchedBookings.flatMap((booking) => [
          parseISO(booking.startDate),
          parseISO(booking.endDate)
        ])
        const earliestDate = min(dates)
        // const latestDate = max(dates)

        currentWeekStart.value = startOfWeek(earliestDate)
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
  errorMessage.value = null // Reset any previous error message
  try {
    const stations = await ApiService.getStations('')
    if (stations.length > 0) {
      bookingStore.setSelectedStation(stations[0])
      await fetchBookings()
    } else {
      errorMessage.value = 'No stations available.'
    }
  } catch (error) {
    console.error('Error fetching initial data:', error)
    errorMessage.value = 'Failed to fetch station data. Please try again later.'
  } finally {
    isLoading.value = false
  }
}

// const fetchInitialData = async () => {
//   try {
//     const stations = await ApiService.getStations('')
//     if (stations.length > 0) {
//       bookingStore.setSelectedStation(stations[0])
//       await fetchBookings()
//     } else {
//       errorMessage.value = 'No stations available.'
//     }
//   } catch (error) {
//     console.error('Error fetching initial data:', error)
//     errorMessage.value = 'Failed to fetch station data. Please try again later.'
//   }
// }

// const fetchInitialData = async () => {
//   try {
//     const stations = await ApiService.getStations('')
//     if (stations.length > 0) {
//       bookingStore.setSelectedStation(stations[0])
//       await fetchBookings()
//     }
//   } catch (error) {
//     console.error('Error fetching initial data:', error)
//   }
// }

onMounted(() => {
  fetchInitialData()
})
</script>
