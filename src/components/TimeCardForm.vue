<template>
  <form id="timeCardForm">

    <!-- HEADER -->

    <div class="header">
      <button
        type="button"
        class="secondary-button"
        @click="updateDailyReport"
      >Submit Time Card</button>
    </div>

    <!-- LOADING -->

    <loading v-if="loading" />

    <!-- CONTENT -->

    <div
      class="content"
      v-if="selectedItem"
    >

      <!-- ESTIMATE -->

      <div class="estimate">

        <!-- ESTIMATE HEADER -->

        <div class="header">
          <p>Estimate</p>
        </div>

        <!-- ESTIMATE FORM -->

        <form
          class="estimate-form"
          @submit.prevent="estimate"
        >

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
                :value="formatedStartDate"
                @click="toggleStartDatepicker"
                @change="$v.selectedItem.startDate.$touch"
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
                  :date="selectedItem.startDate"
                  :limits="datepickerOptions.limits"
                />
              </div>
            </div>
            <validation-message
              :validation="$v.selectedItem.startDate"
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
                :value="formatedEndDate"
                @click="toggleTargetDatepicker"
                @change="$v.selectedItem.endDate.$touch"
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
                  :date="selectedItem.endDate"
                  :limits="datepickerOptions.limits"
                />
              </div>
            </div>
            <validation-message
              :validation="$v.selectedItem.endDate"
              :metadata="itemMetadata.fields.endDate"
            />
          </div>

          <!-- ESTIMATE -->

          <div class="input-container">
            <label
              class="label"
              :class="{error: $v.selectedItem.estimatedHours.$error}"
              :for="itemMetadata.fields.estimatedHours.name"
            >
              {{ itemMetadata.fields.estimatedHours.label }}
            </label>
            <input
              type="number"
              class="light-primary-input"
              v-model.trim="selectedItem.estimatedHours"
              @input="$v.selectedItem.estimatedHours.$touch"
              @focus="$v.selectedItem.estimatedHours.$reset"
              :class="{error: $v.selectedItem.estimatedHours.$error}"
              :id="itemMetadata.fields.estimatedHours.name"
            >
            <validation-message
              :validation="$v.selectedItem.estimatedHours"
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
                  :class="{selected: selectedDailyReport && (dailyReport.id === selectedDailyReport.id)}"
                  v-for="dailyReport in dailyReports"
                  :key="dailyReport.id"
                  @click="selectDailyReport(dailyReport)"
                >

                  <!-- REPORT DATE -->

                  <td
                    class="report-date cell"
                    :title="formatDate(dailyReport.date)"
                  >
                    <p>{{ formatDate(dailyReport.date) }}</p>
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

          <!-- TIME CARD FORM -->

          <div
            class="time-card-form"
            v-if="selectedDailyReport"
          >

            <!-- REPORT DATE -->

            <div class="input-container">
              <label class="label">Report Date</label>
              <input
                type="text"
                class="light-primary-input"
                v-model.trim="selectedDailyReport.date"
                readonly
                disabled
              >
            </div>

            <!-- HOURS -->

            <div class="input-container">
              <label class="label">Hours</label>
              <input
                type="number"
                class="light-primary-input"
                v-model.trim="selectedDailyReport.hours"
              >
            </div>

            <!-- NOTE -->

            <div class="input-container">
              <label class="label">
                Note
              </label>
              <div class="textarea-container small">
                <textarea
                  class="light-primary-input"
                  v-model="selectedDailyReport.note"
                ></textarea>
                <p class="character-count">
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <snackbar
        :status="status"
        :message="message"
        @close="clearMessage"
        v-on-clickout="clearMessage"
      ></snackbar>
    </div>
  </form>
</template>

<script>
import server from '.././server'
import CustomDatepicker from 'vue-custom-datepicker'
import moment from 'moment'
import { mixin as clickout } from 'vue-clickout'
import { mapState, mapActions } from 'vuex'
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)
const ValidationMessage = () => import(
  /* webpackChunkName: "ValidationMessage" */ './ValidationMessage'
)
const Snackbar = () => import(
  /* webpackChunkName: "Snackbar" */ './Snackbar'
)
export default {
  mixins: [clickout],
  name: 'TimeCardForm',
  data () {
    return {
      loading: false,
      dailyReportMetadata: server.metadata.models.DailyReport,
      itemMetadata: server.metadata.models.Item,
      showTargetDatepicker: false,
      showStartDatepicker: false,
      dailyReports: [],
      selectedDailyReport: null,
      dailyReport: null,
      status: null,
      message: null,
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
      selectedItem: {
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
    formatedEndDate () {
      if (this.selectedItem && this.selectedItem.endDate) {
        return moment(this.selectedItem.endDate).format('YYYY-MM-DD')
      } else {
        return null
      }
    },
    formatedStartDate () {
      if (this.selectedItem && this.selectedItem.startDate) {
        return moment(this.selectedItem.startDate).format('YYYY-MM-DD')
      } else {
        return null
      }
    },
    ...mapState([
      'Item',
      'DailyReport',
      'selectedItem'
    ])
  },
  watch: {
    'selectedItem.id': {
      immediate: true,
      async handler (newValue) {
        if (newValue) {
          let resp = await this.DailyReport.load(undefined, `${this.Item.__url__}/${this.selectedItem.id}/${this.DailyReport.__url__}`).send()
          this.dailyReports = resp.models
          this.selectedDailyReport = this.dailyReports[0]
        } else {
          this.dailyReports = []
        }
      }
    }
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
      this.selectedItem.startDate = moment(date).format('YYYY-MM-DD')
      this.showStartDatepicker = false
      this.$refs.startDate.focus()
      if (this.selectedItem.startDate !== moment(date).format('YYYY-MM-DD')) {
        this.$v.selectedItem.startDate.$touch()
      }
    },
    setTargetDate (date) {
      // Checking if the date has been changed
      this.selectedItem.endDate = moment(date).format('YYYY-MM-DD')
      this.showTargetDatepicker = false
      this.$refs.endDate.focus()
      if (this.selectedItem.endDate !== moment(date).format('YYYY-MM-DD')) {
        this.$v.selectedItem.endDate.$touch()
      }
    },
    formatDate (isoString) {
      if (isoString) {
        return moment(isoString).format('DD/MM/YYYY')
      } else {
        return '-'
      }
    },
    estimate () {
      this.selectedItem.estimate().send().then(resp => {
        this.listItems()
        this.status = resp.status
        this.message = 'Your estimate was updated.'
        setTimeout(() => {
          this.clearMessage()
        }, 3000)
      }).catch(resp => {
        this.status = resp.status
        this.message = resp.error
        setTimeout(() => {
          this.clearMessage()
        }, 3000)
      })
    },
    updateDailyReport () {
      this.selectedDailyReport.save().send().then(resp => {
        console.log(resp.models)
      })
    },
    selectDailyReport (dailyReport) {
      this.selectedDailyReport = Object.assign({}, dailyReport)
    },
    clearMessage () {
      this.status = null
      this.message = null
    },
    ...mapActions([
      'listItems'
    ])
  },
  components: {
    Loading,
    CustomDatepicker,
    ValidationMessage,
    Snackbar
  }
}
</script>
