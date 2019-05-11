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
            <label
              class="label"
              :for="itemMetadata.fields.startTime.name"
            >
              {{ itemMetadata.fields.startTime.label }}
            </label>
            <div class="datepicker-container">
              <input
                type="text"
                class="light-primary-input calendar"
                :value="startTime"
                @click="toggleStartDatepicker"
                ref="startTime"
                :id="itemMetadata.fields.startTime.name"
                readonly
              >
              <div
                v-if="showStartDatepicker"
                class="datepicker"
                v-on-clickout="toggleStartDatepicker.bind(undefined, false)"
              >
                <custom-datepicker
                  primary-color="#2F2445"
                  :wrapperStyles="datepickerOptions.wrapperStyles"
                  @dateSelected="setStartDate($event)"
                  :date="item.startTime"
                  :limits="datepickerOptions.limits"
                />
              </div>
            </div>
          </div>

          <!-- TARGET DATE -->

          <div class="input-container">
            <label
              class="label"
              :for="itemMetadata.fields.endTime.name"
            >
              {{ itemMetadata.fields.endTime.label }}
            </label>
            <div class="datepicker-container">
              <input
                type="text"
                class="light-primary-input calendar"
                :value="endTime"
                @click="toggleTargetDatepicker"
                ref="endTime"
                :id="itemMetadata.fields.endTime.name"
                readonly
              >
              <div
                v-if="showTargetDatepicker"
                class="datepicker"
                v-on-clickout="toggleTargetDatepicker.bind(undefined, false)"
              >
                <custom-datepicker
                  primary-color="#2F2445"
                  :wrapperStyles="datepickerOptions.wrapperStyles"
                  @dateSelected="setTargetDate($event)"
                  :date="item.endTime"
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
import moment from 'moment'
import { mixin as clickout } from 'vue-clickout'
import { mapState } from 'vuex'
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)
const ValidationMessage = () => import(
  /* webpackChunkName: "ValidationMessage" */ './ValidationMessage'
)
export default {
  mixins: [clickout],
  name: 'TimeCardForm',
  data () {
    return {
      loading: false,
      timeCardMetadata: server.metadata.models.TimeCard,
      itemMetadata: server.metadata.models.Item,
      selectedTimeCard: false,
      showTargetDatepicker: false,
      showStartDatepicker: false,
      item: null,
      datepickerOptions: {
        wrapperStyles: {
          width: '100%',
          background: '#194173',
          color: '#ffffff',
          position: 'relative'
        },
        limits: {
          start: moment().format('YYYY-MM-DD'),
          end: null
        }
      }
    }
  },
  validations () {
    return {
      item: {
        startIme: this.itemMetadata.fields.startTime.createValidator(),
        endTime: this.itemMetadata.fields.endTime.createValidator()
      }
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
    },
    endTime () {
      if (this.item.endTime) {
        return moment(this.item.endTime).format('YYYY-MM-DD')
      } else {
        return null
      }
    },
    startTime () {
      if (this.item.startTime) {
        return moment(this.item.startTime).format('YYYY-MM-DD')
      } else {
        return null
      }
    },
    ...mapState([
      'Item'
    ])
  },
  methods: {
    toggleStartDatepicker (value) {
      if (typeof value === 'boolean') {
        this.showStartDatepicker = value
      } else {
        this.showStartDatepicker = !this.showStartDatepicker
      }
    },
    toggleTargetDatepicker (value) {
      if (typeof value === 'boolean') {
        this.showTargetDatepicker = value
      } else {
        this.showTargetDatepicker = !this.showTargetDatepicker
      }
    },
    setStartDate (date) {
      // Checking if the date has been changed
      this.item.startTime = moment(date).format('YYYY-MM-DD')
      this.showStartDatepicker = false
      this.$refs.startTime.focus()
      if (this.item.startTime !== moment(date).format('YYYY-MM-DD')) {
        this.$v.item.startTime.$touch()
      }
    },
    setTargetDate (date) {
      // Checking if the date has been changed
      this.item.endTime = moment(date).format('YYYY-MM-DD')
      this.showTargetDatepicker = false
      this.$refs.endTime.focus()
      if (this.item.endTime !== moment(date).format('YYYY-MM-DD')) {
        this.$v.item.endTime.$touch()
      }
    }
  },
  components: {
    Loading,
    CustomDatepicker,
    ValidationMessage
  },
  beforeMount () {
    this.item = new this.Item()
  }
}
</script>
