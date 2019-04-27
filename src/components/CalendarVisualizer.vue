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
            :eventCategories="categoryActivated"
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
                :key="day.id"
                class="check-box"
                :checked="day.selected === true"
                @click.native="day.selected = !day.selected"
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
              :checked="eventCategory.selected === true"
              @click.native="eventCategory.selected = !eventCategory.selected"
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
      eventCategories: [
        {
          id: 1,
          name: 'Personal',
          textColor: 'white',
          backgroundColor: '#194173',
          selected: false
        },
        {
          id: 2,
          name: 'Company-wide',
          textColor: 'white',
          backgroundColor: '#0B2B53',
          selected: false
        }
      ],
      events: [],
      daysOfWeek: [
        {
          name: 'Sunday',
          id: 1,
          selected: true
        },
        {
          name: 'Monday',
          id: 2,
          selected: false
        },
        {
          name: 'Tuesday',
          id: 3,
          selected: false
        },
        {
          name: 'Wednesday',
          id: 4,
          selected: false
        },
        {
          name: 'Thursday',
          id: 5,
          selected: false
        },
        {
          name: 'Friday',
          id: 6,
          selected: false
        },
        {
          name: 'Saturday',
          id: 7,
          selected: true
        }
      ]
    }
  },
  computed: {
    offDays () {
      return this.daysOfWeek.reduce((acc, day) => {
        if (day.selected) {
          acc.push(day.id)
        }
        return acc
      }, [])
    },
    categoryActivated () {
      return this.eventCategories.filter(category => category.selected === true)
    }
  },
  methods: {
    goToday () {
      this.$refs.calendar.goToday()
    },
    toggleOffDay (dayId) { },
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
