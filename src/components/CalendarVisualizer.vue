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
                class="check-box"
                :checked="false"
                :size="16"
                :loading="false"
                :label="Monday"
                borderRadius="3px"
                checkedBorderColor="#008290"
                checkedBackgroundColor="#008290"
                spinnerColor="#008290"
              ></loading-checkbox>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingCheckbox from 'vue-loading-checkbox'

export default {
  name: 'CalendarVisualizer',
  data () {
    return {
    }
  },
  components: {
    LoadingCheckbox
  }
}
</script>
