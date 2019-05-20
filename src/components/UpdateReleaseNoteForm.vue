<template>
  <form
    id="updateReleaseNoteForm"
    autocomplete="off"
  >

    <!-- HEADER -->

    <div class="header">
      <button
        type="submit"
        class="secondary-button"
      >Save</button>
    </div>

    <loading v-if="loading" />

    <!-- CONTENT -->

    <div
      class="content"
      v-if="!loading"
    >

      <!-- TITLE INPUT -->

      <div class="input-container">
        <label class="label">Title</label>
        <input
          type="text"
          class="light-primary-input"
        >
        <!-- <validation-message
          :validation="$v.tag.title"
          :metadata="tagMetadata.fields.title"
        /> -->
      </div>

      <!-- DATE INPUT -->

      <div class="input-container">
        <label class="label">Date</label>
        <div class="datepicker-container">
          <input
            type="text"
            :value="formatDate"
            class="light-primary-input calendar"
            @click="toggleDatepicker"
            @keyup.enter="toggleDatepicker"
            readonly
          >
          <div
            v-if="showDatepicker"
            class="datepicker"
            v-on-clickout="toggleDatepicker.bind(undefined, false)"
          >
            <custom-datepicker
              primary-color="#2F2445"
              :wrapperStyles="datepickerOptions.wrapperStyles"
              @dateSelected="setDate($event)"
              :date="releasenote.date"
              :limits="datepickerOptions.limits"
            />
          </div>
        </div>
      </div>

      <div class="input-container">
        <label
          for="tagDescription"
          class="label"
        >Description</label>
        <div class="textarea-container medium">
          <textarea class="light-primary-input"></textarea>
          <!-- <p
            class="character-count"
          >
            {{ tag.description.length }}/{{tagMetadata.fields.description.maxLength }}
          </p> -->
        </div>
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
import CustomDatepicker from 'vue-custom-datepicker'
import moment from 'moment'
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)
const Snackbar = () => import(
  /* webpackChunkName: "Snackbar" */ './Snackbar'
)

export default {
  name: 'UpdateReleaseNoteForm',
  data () {
    return {
      showDatepicker: false,
      releasenote: {
        date: null
      },
      status: null,
      loading: false,
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
  methods: {
    toggleDatepicker (value) {
      if (typeof value === 'boolean') {
        this.showDatepicker = value
      } else {
        this.showDatepicker = !this.showDatepicker
      }
    },
    clearMessage () {
      this.status = null
      this.message = null
    }
  },
  beforeMount () {
  },
  components: {
    CustomDatepicker,
    Loading,
    Snackbar
  }
}
</script>
