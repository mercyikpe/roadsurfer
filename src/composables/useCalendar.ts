import { ref, computed } from 'vue'
import { addDays, format, parseISO } from 'date-fns'

export function useCalendar() {
  const currentWeekStart = ref(new Date())

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

  const formatDisplayDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMM dd, yyyy')
  }

  return {
    currentWeekStart,
    weekDays,
    formattedWeekRange,
    previousWeek,
    nextWeek,
    formatDisplayDate
  }
}
