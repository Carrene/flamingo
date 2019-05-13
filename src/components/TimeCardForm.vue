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
                @change="$v.item.startTime.$touch"
                @keyup.enter="toggleStartDatepicker"
                ref="startTime"
                :id="itemMetadata.fields.startTime.name"
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
            <validation-message
              :validation="$v.item.startTime"
              :metadata="itemMetadata.fields.startTime"
            />
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
                @change="$v.item.endTime.$touch"
                @keyup.enter="toggleTargetDatepicker"
                ref="endTime"
                :id="itemMetadata.fields.endTime.name"
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
            <validation-message
              :validation="$v.item.endTime"
              :metadata="itemMetadata.fields.endTime"
            />
          </div>

          <!-- ESTIMATE -->

          <div class="input-container">
            <label
              class="label"
              :class="{error: $v.item.estimatedHours.$error}"
              :for="itemMetadata.fields.estimatedHours.name"
            >
              {{ itemMetadata.fields.estimatedHours.label }}
            </label>
            <input
              type="number"
              class="light-primary-input"
              v-model.trim="item.estimatedHours"
              @input="$v.item.estimatedHours.$touch"
              @focus="$v.item.estimatedHours.$reset"
              :class="{error: $v.item.estimatedHours.$error}"
              :id="itemMetadata.fields.estimatedHours.name"
            >
            <validation-message
              :validation="$v.item.estimatedHours"
              :metadata="itemMetadata.fields.estimatedHours"
            />
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
                  v-for="dailyReport in dailyReports"
                  :key="dailyReport.id"
                >

                  <!-- REPORT DATE -->

                  <td
                    class="report-date cell"
                    :title="formatDate(dailyReport.date)"
                  >
                    <p>{{ dailyReport.date }}</p>
                  </td>

                  <!-- HOURS -->

                  <td
                    class="hours cell"
                    :title="dailyReport.hours"
                  >
                    <p>{{ dailyReport.hours }}</p>
                  </td>

                  <!-- NOTE -->

                  <td
                    class="note cell"
                    :title="dailyReport.note"
                  >
                    <p>{{ dailyReport.note }}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="time-card-form">

            <!-- REPORT DATE -->

            <div class="input-container">
              <label class="label">Report Date</label>
              <input
                type="text"
                class="light-primary-input"
                readonly
                disabled
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
      dailyReportMetadata: server.metadata.models.DailyReport,
      itemMetadata: server.metadata.models.Item,
      selectedTimeCard: true,
      showTargetDatepicker: false,
      showStartDatepicker: false,
      item: null,
      dailyReports: [],
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
        startTime: this.itemMetadata.fields.startTime.createValidator(),
        endTime: this.itemMetadata.fields.endTime.createValidator(),
        estimatedHours: this.itemMetadata.fields.estimatedHours.createValidator()
      }
    }
  },
  computed: {
    headers () {
      return [
        {
          label: this.dailyReportMetadata.fields.date.label,
          className: 'report-date'
        },
        {
          label: this.dailyReportMetadata.fields.hours.label,
          className: 'hours'
        },
        {
          label: this.dailyReportMetadata.fields.note.label,
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
    },
    formatDate (isoString) {
      if (isoString) {
        return moment(isoString).format('DD/MM/YYYY')
      } else {
        return '-'
      }
    }
  },
  watch: {
    // FIXME: Use from prop of assigned component
    'item': {
      immediate: true,
      async handler (newValue) {
        if (newValue) {
          let resp = await newValue.listDailyReports()
          this.dailyReports = resp.models
        }
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
