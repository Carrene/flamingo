<template>
  <form id="timeCardForm">

    <!-- HEADER -->

    <div class="header">
      <button
        type="button"
        class="secondary-button"
      >Submit Time Card</button>
    </div>

    <!-- LOADING -->

    <loading v-if="loading" />

    <!-- CONTENT -->

    <div class="content">

      <!-- ESTIMATE -->

      <div class="estimate">

        <!-- ESTIMATE HEADER -->

        <div class="header">
          <p>Estimate</p>
        </div>

        <!-- ESTIMATE FORM -->

        <form class="estimate-form">

          <!-- START DATE -->

          <div class="input-container">
            <label class="label">
              Start Date
            </label>
            <div class="datepicker-container">
              <input
                type="text"
                class="light-primary-input calendar"
                @click="toggleDatepicker"
                readonly
              >
              <div
                v-if="showDatepicker"
                class="datepicker"
                v-on-clickout="toggleLaunchDatepicker.bind(undefined, false)"
              >
                <custom-datepicker
                  primary-color="#2F2445"
                  :wrapperStyles="datepickerOptions.wrapperStyles"
                  @dateSelected="setCutoffDate($event)"
                  :date="release.cutoff"
                  :limits="datepickerOptions.limits"
                />
              </div>
            </div>
          </div>

          <!-- TARGET DATE -->

          <div class="input-container">
            <label class="label">
              Target Date
            </label>
            <div class="datepicker-container">
              <input
                type="text"
                class="light-primary-input calendar"
                @click="toggleDatepicker"
                readonly
              >
              <div
                v-if="showDatepicker"
                class="datepicker"
                v-on-clickout="toggleLaunchDatepicker.bind(undefined, false)"
              >
                <custom-datepicker
                  primary-color="#2F2445"
                  :wrapperStyles="datepickerOptions.wrapperStyles"
                  @dateSelected="setCutoffDate($event)"
                  :date="release.cutoff"
                  :limits="datepickerOptions.limits"
                />
              </div>
            </div>
          </div>

          <!-- ESTIMATE -->

          <div class="input-container">
            <label class="label">Estimate(hrs)</label>
            <input
              type="number"
              class="light-primary-input"
            >
          </div>

          <!-- ACTION -->

          <div class="action">
            <button
              class="secondary-button outlined"
              type="submit"
            >Submit Estimate</button>
          </div>
        </form>
      </div>

      <!-- TIME CARD -->

      <div class="time-card">

        <!-- ESTIMATE HEADER -->

        <div class="header">
          <p>Time Card</p>
        </div>

        <!-- TABLE -->

        <div class="time-card-table">
          <div class="table-box">
            <table class="table">
              <thead class="header">
                <tr class="row">
                  <th
                    v-for="header in headers"
                    :key="header.label"
                    class="cell"
                  >
                    <div class="title-container">
                      <p :title="header.label">{{ header.label }}</p>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="content">
                <tr
                  class="row"
                  :class="{selected: selectedTimeCard}"
                  @click="selectedTimeCard = true"
                >

                  <!-- PHASE -->

                  <td class="phase cell">
                    <p>Lorem</p>
                  </td>

                  <!-- REPORT DATE -->

                  <td class="report-date cell">
                    <p>Lorem</p>
                  </td>

                  <!-- HOURS -->

                  <td class="hours cell">
                    <p>Lorem</p>
                  </td>

                  <!-- NOTE -->

                  <td class="note cell">
                    <p>Lorem</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="time-card-form">

            <!-- PHASE -->

            <div class="input-container">
              <label class="label">Phase</label>
              <input
                type="text"
                class="light-primary-input"
              >
            </div>

            <!-- REPORT DATE -->

            <div class="input-container">
              <label class="label">Report Date</label>
              <input
                type="text"
                class="light-primary-input"
              >
            </div>

            <!-- HOURS -->

            <div class="input-container">
              <label class="label">Hours</label>
              <input
                type="text"
                class="light-primary-input"
              >
            </div>

            <!-- NOTE -->

            <div class="input-container">
              <label class="label">
                Note
              </label>
              <div class="textarea-container small">
                <textarea class="light-primary-input"></textarea>
                <p class="character-count">
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

  </form>
</template>

<script>
import server from '.././server'
import CustomDatepicker from 'vue-custom-datepicker'
// import moment from 'moment'
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)
export default {
  name: 'TimeCardForm',
  data () {
    return {
      loading: false,
      timeCardMetadata: server.metadata.models.TimeCard,
      selectedTimeCard: false,
      showDatepicker: false
    }
  },
  computed: {
    headers () {
      return [
        {
          label: 'Phase',
          className: 'phase'
        },
        {
          label: 'Report Date',
          className: 'report-date'
        },
        {
          label: 'Hours',
          className: 'hours'
        },
        {
          label: 'Note',
          className: 'note'
        }
      ]
    }
  },
  methods: {
    toggleDatepicker (value) {
      if (typeof value === 'boolean') {
        this.showDatepicker = value
      } else {
        this.showDatepicker = !this.showDatepicker
      }
    }
    // setCutoffDate (date) {
    //   // Checking if the date has been changed
    //   this.release.cutoff = moment(date).format('YYYY-MM-DD')
    //   this.showDatepicker = false
    //   this.$refs.cutoff.focus()
    //   if (this.release.cutoff !== moment(date).format('YYYY-MM-DD')) {
    //     this.$v.release.cutoff.$touch()
    //   }
    // }
  },
  components: {
    Loading,
    CustomDatepicker
  }
}
</script>
