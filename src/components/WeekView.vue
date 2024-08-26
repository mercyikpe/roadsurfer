<template>
  <div class="space-y-4">
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

    <Autocomplete
      placeholder="Select a station"
      :apiUrl="stationsApiUrl"
      @selected="handleStationSelected"
    />
    <div class="grid grid-cols-7 gap-4">
      <div v-for="day in weekDays" :key="day.date" class="border rounded p-4">
        <h3 class="font-bold">{{ day.name }}</h3>
        <p class="text-sm">{{ day.date }}</p>
        <ul class="mt-2 space-y-2">
          <li
            v-for="booking in bookingsForDay(day.date)"
            :key="booking.id"
            @click="showBookingDetails(booking)"
            class="bg-blue-100 p-2 rounded cursor-pointer"
          >
            {{ booking.id }} - {{ booking.customerName }}
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

const currentWeekStart = ref(new Date())
const stationsApiUrl = '' // Not needed anymore since we are using ApiService

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
  const start = format(currentWeekStart.value, 'MM/dd/yyyy')
  const end = format(addDays(currentWeekStart.value, 6), 'MM/dd/yyyy')
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

const bookingsForDay = (date: string): Booking[] => {
  return bookingStore.bookings.filter((booking) => {
    const bookingStart = parseISO(booking.startDate)
    const bookingEnd = parseISO(booking.endDate)
    const currentDate = parseISO(date)
    return currentDate >= bookingStart && currentDate <= bookingEnd
  })
}

const showBookingDetails = (booking: Booking) => {
  router.push(`/booking/${bookingStore.selectedStation?.id}/${booking.id}`)
}

const fetchInitialData = async () => {
  try {
    const stations = await ApiService.getStations('')
    if (stations.length > 0) {
      bookingStore.setSelectedStation(stations[0])
      await fetchBookings()
    }
  } catch (error) {
    console.error('Error fetching initial data:', error)
  }
}

onMounted(() => {
  fetchInitialData()
})
</script>
