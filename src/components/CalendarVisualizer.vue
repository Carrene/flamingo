<template>
  <div id="calendarVisualizer">
    <div class="header">
      <p class="title">Calendar</p>
    </div>
    <div class="content">
      <div class="calendar-box-header">
        <simple-svg
          :filepath="require('@/assets/calendar.svg')"
          fill="#232323"
          class="calendar-icon"
        />
        <button
          type="button"
          class="secondary-button outlined"
          @click="goToday"
        >Today</button>
      </div>
      <div class="calendar-box-content">

        <div class="calendar-container">
          <sweet-calendar
            :eventCategories="eventCategories"
            :events="events"
            :offDays="offDays"
            ref="calendar"
          />
        </div>

        <div class="week-days">
          <div class="week-days-header">Weekly Off-Days</div>
          <div class="week-days-content">
            <div class="days">
              <loading-checkbox
                v-for="day of daysOfWeek"
                :key="day"
                class="check-box"
                :checked="offDays.includes(day.id)"
                @click.native="addToOfDays(day.id)"
                :size="14"
                :fontSize="14"
                :loading="false"
                :gap="8"
                :label="day.name"
                borderRadius="3px"
                checkedBorderColor="#008290"
                checkedBackgroundColor="#008290"
                spinnerColor="#008290"
              ></loading-checkbox>
            </div>
          </div>
        </div>

        <div class="category">
          <div class="category-header">
            Category
          </div>
          <div class="category-content">
            <loading-checkbox
              v-for="eventCategory of eventCategories"
              :key="eventCategory.id"
              class="check-box"
              :checked="false"
              :size="14"
              :fontSize="14"
              :loading="false"
              :gap="8"
              :label="eventCategory.name"
              borderRadius="3px"
              checkedBorderColor="#008290"
              checkedBackgroundColor="#0B2B53"
              spinnerColor="#008290"
            ></loading-checkbox>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import LoadingCheckbox from 'vue-loading-checkbox'
import 'vue-loading-checkbox/dist/LoadingCheckbox.css'
import SweetCalendar from 'vue-sweet-calendar'
import 'vue-sweet-calendar/dist/SweetCalendar.css'

export default {
  name: 'CalendarVisualizer',
  data () {
    return {
      daysOfWeek: [
        { name: 'Sunday', id: 1 },
        { name: 'Monday', id: 2 },
        { name: 'Tuesday', id: 3 },
        { name: 'Wednesday', id: 4 },
        { name: 'Thursday', id: 5 },
        { name: 'Friday', id: 6 },
        { name: 'Saturday', id: 7 }
      ],
      eventCategories: [
        {
          id: 1,
          name: 'Personal',
          textColor: 'white',
          backgroundColor: 'Blue'
        },
        {
          id: 2,
          name: 'Company-wide',
          textColor: 'white',
          backgroundColor: 'red'
        }
      ],
      events: [],
      offDays: [1, 7]
    }
  },
  computed: {},
  methods: {
    goToday () {
      this.$refs.calendar.goToday()
    },
    toggleOffDay (dayId) {},
    addToOfDays (dayId) {
      this.offDays.push(dayId)
    }
  },
  components: {
    LoadingCheckbox,
    SweetCalendar
  }
}
</script>
