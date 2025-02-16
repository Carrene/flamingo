<template>
  <form
    id="newEventForm"
    @submit.prevent="create"
  >

    <!-- HEADER -->

    <div class="header">
      <button
        type="submit"
        class="secondary-button"
      >Save</button>
    </div>

    <!-- CONTENT -->

    <div class="content">

      <!-- EVENT NAME -->

      <div class="input-container">
        <label
          for="eventMetadata.fields.title.label"
          class="label"
          :class="{error: $v.event.title.$error}"
        >{{ eventMetadata.fields.title.label }}</label>
        <input
          type="text"
          class="light-primary-input"
          :class="{error: $v.event.title.$error}"
          v-model.trim="event.title"
          @input="$v.event.title.$touch"
          @focus="$v.event.title.$reset"
        >
        <validation-message
          :validation="$v.event.title"
          :metadata="eventMetadata.fields.title"
        />
      </div>

      <!-- EVENT TYPE -->

      <div class="input-container">
        <label
          for="eventMetadata.fields.eventTypeId.label"
          class="label"
        >{{ eventMetadata.fields.eventTypeId.label }}</label>
        <v-select
          :options="eventTypes"
          index="id"
          label="title"
          v-model.trim="event.eventTypeId"
          :clearable="!$v.event.eventTypeId.required"
        ></v-select>
        <validation-message
          :validation="$v.event.eventTypeId"
          :metadata="eventMetadata.fields.eventTypeId"
        />
      </div>

      <!-- START DATE -->

      <div class="input-container">
        <label
          for="eventMetadata.fields.startDate.label"
          class="label"
        >{{ eventMetadata.fields.startDate.label }}</label>
        <div class="datepicker-container">
          <input
            type="text"
            :value="startDate"
            class="light-primary-input calendar"
            @click="toggleStartDateDatepicker"
            ref="startDate"
            @change="$v.event.startDate.$touch"
            @keyup.enter="toggleStartDateDatepicker"
            readonly
          >
          <div
            v-if="showStartDateDatepicker"
            class="datepicker"
            v-on-clickout="toggleStartDateDatepicker.bind(undefined, false)"
          >
            <custom-datepicker
              primary-color="#2F2445"
              :wrapperStyles="datepickerOptions.wrapperStyles"
              @dateSelected="setStartDate($event)"
              :date="event.startDate"
              :limits="datepickerOptions.limits"
            />
          </div>
        </div>
        <validation-message
          :validation="$v.event.startDate"
          :metadata="eventMetadata.fields.startDate"
        />
      </div>

      <!-- END DATE -->

      <div class="input-container">
        <label
          for="eventMetadata.fields.endDate.label"
          class="label"
        >{{ eventMetadata.fields.endDate.label }}</label>
        <div class="datepicker-container">
          <input
            type="text"
            :value="endDate"
            class="light-primary-input calendar"
            @click="toggleEndDateDatepicker"
            ref="endDate"
            @change="$v.event.endDate.$touch"
            @keyup.enter="toggleEndDateDatepicker"
            readonly
          >
          <div
            v-if="showEndDateDatepicker"
            class="datepicker"
            v-on-clickout="toggleEndDateDatepicker.bind(undefined, false)"
          >
            <custom-datepicker
              primary-color="#2F2445"
              :wrapperStyles="datepickerOptions.wrapperStyles"
              @dateSelected="setEndDate($event)"
              :date="event.endDate"
              :limits="datepickerOptions.limits"
            />
          </div>
        </div>
        <validation-message
          :validation="$v.event.endDate"
          :metadata="eventMetadata.fields.endDate"
        />
      </div>

      <!-- REPEATE -->

      <div class="input-container">
        <label
          for="eventMetadata.fields.repeat.label"
          class="label"
        >{{ eventMetadata.fields.repeat.label }}</label>
        <v-select
          :options="repeatItems"
          index="value"
          v-model.trim="event.repeat"
          :clearable="!$v.event.repeat.required"
        ></v-select>
        <validation-message
          :validation="$v.event.repeat"
          :metadata="eventMetadata.fields.repeat"
        />
      </div>
      <snackbar
        :status="status"
        :message="message"
        @close="clearMessage"
      ></snackbar>
    </div>
  </form>
</template>

<script>
import server from '../server'
import { mapState, mapActions, mapMutations } from 'vuex'
import moment from 'moment'
import CustomDatepicker from 'vue-custom-datepicker'
import { mixin as clickout } from 'vue-clickout'
const Snackbar = () => import(
  /* webpackChunkName: "Snackbar" */ './Snackbar'
)
const ValidationMessage = () => import(
  /* webpackChunkName: "ValidationMessage" */ './ValidationMessage'
)

export default {
  mixins: [clickout],
  name: 'NewEventForm',
  data () {
    return {
      status: null,
      message: null,
      event: null,
      eventMetadata: server.metadata.models.Event,
      showStartDateDatepicker: false,
      showEndDateDatepicker: false,
      repeatItems: [{ label: 'Never', value: 'never' }, { label: 'Monthly', value: 'monthly' }, { label: 'Yearly', value: 'yearly' }],
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
      event: {
        title: this.eventMetadata.fields.title.createValidator(),
        eventTypeId: this.eventMetadata.fields.eventTypeId.createValidator(),
        startDate: this.eventMetadata.fields.startDate.createValidator(),
        endDate: this.eventMetadata.fields.endDate.createValidator(),
        repeat: this.eventMetadata.fields.repeat.createValidator()
      }
    }
  },
  computed: {
    startDate () {
      if (this.event.startDate) {
        return moment(this.event.startDate).format('YYYY-MM-DD')
      } else {
        return null
      }
    },
    endDate () {
      if (this.event.endDate) {
        return moment(this.event.endDate).format('YYYY-MM-DD')
      } else {
        return null
      }
    },
    ...mapState([
      'Event',
      'eventTypes'
    ])
  },
  methods: {
    create () {
      this.setGlobalLoading(true)
      this.event.save().send().then(resp => {
        this.status = resp.status
        this.message = 'Event was created.'
        this.listEvents()
        setTimeout(() => {
          this.clearMessage()
        }, 3000)
      }).catch(resp => {
        this.status = resp.status
        this.message = resp.error
        setTimeout(() => {
          this.clearMessage()
        }, 3000)
      }).finally(() => {
        this.setGlobalLoading(false)
      })
    },
    setStartDate (date) {
      // Checking if the date has been changed
      this.event.startDate = moment(date).format('YYYY-MM-DD')
      this.showStartDateDatepicker = false
      this.$refs.startDate.focus()
      if (this.event.startDate !== moment(date).format('YYYY-MM-DD')) {
        this.$v.event.startDate.$touch()
      }
    },
    toggleStartDateDatepicker (value) {
      if (typeof value === 'boolean') {
        this.showStartDateDatepicker = value
      } else {
        this.showStartDateDatepicker = !this.showStartDateDatepicker
      }
    },
    setEndDate (date) {
      // Checking if the date has been changed
      this.event.endDate = moment(date).format('YYYY-MM-DD')
      this.showEndDateDatepicker = false
      this.$refs.endDate.focus()
      if (this.event.endDate !== moment(date).format('YYYY-MM-DD')) {
        this.$v.event.endDate.$touch()
      }
    },
    toggleEndDateDatepicker (value) {
      if (typeof value === 'boolean') {
        this.showEndDateDatepicker = value
      } else {
        this.showEndDateDatepicker = !this.showEndDateDatepicker
      }
    },
    clearMessage () {
      this.status = null
      this.message = null
    },
    ...mapActions([
      'listEvents'
    ]),
    ...mapMutations([
      'setGlobalLoading'
    ])
  },
  beforeMount () {
    this.event = new this.Event()
  },
  components: {
    ValidationMessage,
    Snackbar,
    CustomDatepicker
  }
}
</script>
