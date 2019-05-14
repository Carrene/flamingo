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
              :for="itemMetadata.fields.startDate.name"
            >
              {{ itemMetadata.fields.startDate.label }}
            </label>
            <div class="datepicker-container">
              <input
                type="text"
                class="light-primary-input calendar"
                :value="startDate"
                @click="toggleStartDatepicker"
                @change="$v.item.startDate.$touch"
                @keyup.enter="toggleStartDatepicker"
                ref="startDate"
                :id="itemMetadata.fields.startDate.name"
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
                  :date="item.startDate"
                  :limits="datepickerOptions.limits"
                />
              </div>
            </div>
            <validation-message
              :validation="$v.item.startDate"
              :metadata="itemMetadata.fields.startDate"
            />
          </div>

          <!-- TARGET DATE -->

          <div class="input-container">
            <label
              class="label"
              :for="itemMetadata.fields.endDate.name"
            >
              {{ itemMetadata.fields.endDate.label }}
            </label>
            <div class="datepicker-container">
              <input
                type="text"
                class="light-primary-input calendar"
                :value="endDate"
                @click="toggleTargetDatepicker"
                @change="$v.item.endDate.$touch"
                @keyup.enter="toggleTargetDatepicker"
                ref="endDate"
                :id="itemMetadata.fields.endDate.name"
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
                  :date="item.endDate"
                  :limits="datepickerOptions.limits"
                />
              </div>
            </div>
            <validation-message
              :validation="$v.item.endDate"
              :metadata="itemMetadata.fields.endDate"
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
        startDate: this.itemMetadata.fields.startDate.createValidator(),
        endDate: this.itemMetadata.fields.endDate.createValidator(),
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
    endDate () {
      if (this.item.endDate) {
        return moment(this.item.endDate).format('YYYY-MM-DD')
      } else {
        return null
      }
    },
    startDate () {
      if (this.item.startDate) {
        return moment(this.item.startDate).format('YYYY-MM-DD')
      } else {
        return null
      }
    },
    ...mapState([
      'Item',
      'DailyReport'
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
      this.item.startDate = moment(date).format('YYYY-MM-DD')
      this.showStartDatepicker = false
      this.$refs.startDate.focus()
      if (this.item.startDate !== moment(date).format('YYYY-MM-DD')) {
        this.$v.item.startDate.$touch()
      }
    },
    setTargetDate (date) {
      // Checking if the date has been changed
      this.item.endDate = moment(date).format('YYYY-MM-DD')
      this.showTargetDatepicker = false
      this.$refs.endDate.focus()
      if (this.item.endDate !== moment(date).format('YYYY-MM-DD')) {
        this.$v.item.endDate.$touch()
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
    // 'item': {
    //   immediate: true,
    //   async handler (newValue) {
    //     if (newValue) {
    //       let resp = this.DailyReport.load(undefined, `${this.Item.__url__}/newValue.id/${this.DailyReport.__url__}`).send()
    //       this.dailyReports = resp.models
    //     }
    //   }
    // }
  },
  components: {
    Loading,
    CustomDatepicker,
    ValidationMessage
  },
  beforeMount () {
    this.item = new this.Item()
    console.log(this.itemMetadata.fields)
  }
}
</script>
