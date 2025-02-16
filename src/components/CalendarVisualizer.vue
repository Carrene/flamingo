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
          <calendar
            :eventCategories="categoryActivated"
            :events="decoratedEvents"
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
                :checked="day.isOff"
                @click.native="toggleOffDay(day)"
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
              v-for="eventCategory of decoratedEventCategories"
              :key="eventCategory.id"
              class="check-box"
              :checked="eventCategory.selected"
              @click.native="toggleCheckbox(eventCategory)"
              :size="14"
              :fontSize="14"
              :loading="false"
              :gap="8"
              :label="eventCategory.title"
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
import { mapState, mapMutations } from 'vuex'
import LoadingCheckbox from 'vue-loading-checkbox'
import 'vue-loading-checkbox/dist/LoadingCheckbox.css'
import { Calendar } from 'vue-sweet-calendar'
import 'vue-sweet-calendar/dist/SweetCalendar.css'
import moment from 'moment'

export default {
  name: 'CalendarVisualizer',
  data () {
    return {
      eventCategories: [
        {
          id: 1,
          selected: true,
          textColor: 'white',
          backgroundColor: '#194173'
        },
        {
          id: 2,
          selected: true,
          textColor: 'white',
          backgroundColor: '#0B2B53'
        }
      ]
      // daysOfWeek: [
      //   {
      //     name: 'Sunday',
      //     id: 1,
      //     isOff: this.weeklyOffDays.includes('sunday')
      //   },
      //   {
      //     name: 'Monday',
      //     id: 2,
      //     isOff: this.weeklyOffDays.includes('monday')
      //   },
      //   {
      //     name: 'Tuesday',
      //     id: 3,
      //     isOff: this.weeklyOffDays.includes('tuesday')
      //   },
      //   {
      //     name: 'Wednesday',
      //     id: 4,
      //     isOff: this.weeklyOffDays.includes('wednesday')
      //   },
      //   {
      //     name: 'Thursday',
      //     id: 5,
      //     isOff: this.weeklyOffDays.includes('thursday')
      //   },
      //   {
      //     name: 'Friday',
      //     id: 6,
      //     isOff: this.weeklyOffDays.includes('friday')
      //   },
      //   {
      //     name: 'Saturday',
      //     id: 7,
      //     isOff: this.weeklyOffDays.includes('saturday')
      //   }
      // ]
    }
  },
  computed: {
    decoratedEvents () {
      return this.events.map(event => {
        return {
          categoryId: event.eventTypeId,
          start: moment(event.startDate).format('YYYY-MM-DD'),
          end: moment(event.endDate).format('YYYY-MM-DD'),
          repeat: event.repeat,
          title: event.title
        }
      })
    },
    decoratedEventCategories () {
      return this.eventTypes.map(eventType => {
        let currentCategory = this.eventCategories.find(eventCategory => eventCategory.id === eventType.id)
        return {
          id: eventType.id,
          title: eventType.title,
          textColor: currentCategory.textColor,
          selected: currentCategory.selected,
          backgroundColor: currentCategory.backgroundColor
        }
      })
    },
    daysOfWeek () {
      return [
        {
          name: 'Sunday',
          id: 1,
          isOff: this.weeklyOffDays.includes('sunday')
        },
        {
          name: 'Monday',
          id: 2,
          isOff: this.weeklyOffDays.includes('monday')
        },
        {
          name: 'Tuesday',
          id: 3,
          isOff: this.weeklyOffDays.includes('tuesday')
        },
        {
          name: 'Wednesday',
          id: 4,
          isOff: this.weeklyOffDays.includes('wednesday')
        },
        {
          name: 'Thursday',
          id: 5,
          isOff: this.weeklyOffDays.includes('thursday')
        },
        {
          name: 'Friday',
          id: 6,
          isOff: this.weeklyOffDays.includes('friday')
        },
        {
          name: 'Saturday',
          id: 7,
          isOff: this.weeklyOffDays.includes('saturday')
        }
      ]
    },
    offDays () {
      return this.daysOfWeek.reduce((acc, day) => {
        if (day.isOff) {
          acc.push(day.id)
        }
        return acc
      }, [])
    },
    categoryActivated () {
      return this.eventCategories.filter(category => category.selected === true)
    },
    ...mapState([
      'events',
      'eventTypes',
      'weeklyOffDays'
    ])
  },
  methods: {
    toggleCheckbox (eventCategory) {
      // eventCategory.selected = !eventCategory.selectedtoggleOffDay
      let category = this.eventCategories.find(item => item.id === eventCategory.id)
      category.selected = !category.selected
    },
    toggleOffDay (day) {
      let currentOffDays = [...this.weeklyOffDays]
      if (currentOffDays.includes(day.name.toLowerCase())) {
        currentOffDays.splice(currentOffDays.indexOf(day.name.toLowerCase()), 1)
      } else {
        currentOffDays.push(day.name.toLowerCase())
      }
      this.setWeeklyOffDays(currentOffDays)
    },
    goToday () {
      this.$refs.calendar.goToday()
    },
    addToOfDays (dayId) {
      this.offDays.push(dayId)
    },
    ...mapMutations([
      'setWeeklyOffDays'
    ])
  },
  components: {
    LoadingCheckbox,
    Calendar
  }
}
</script>
