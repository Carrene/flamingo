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
        >Today</button>
      </div>
      <div class="calendar-box-content">
        <div class="week-days">
          <div class="week-days-header">Weekly Off-Days</div>
          <div class="week-days-content">
            <div class="days">
              <loading-checkbox
                v-for="day of daysOfWeek"
                :key="day"
                class="check-box"
                :checked="false"
                :size="14"
                :fontSize="14"
                :loading="false"
                :gap="8"
                :label="day"
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
              class="check-box"
              :checked="false"
              :size="14"
              :fontSize="14"
              :loading="false"
              :gap="8"
              label="lorem"
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

export default {
  name: 'CalendarVisualizer',
  data () {
    return {
      daysOfWeek: ['Monday', 'Friday', 'Tuesday', 'Saturday', 'Wednesday', 'Sunday', 'Thursday']
    }
  },
  components: {
    LoadingCheckbox
  }
}
</script>
