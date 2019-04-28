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
    <loading v-if="loading" />

    <!-- CONTENT -->

    <div
      class="content"
      v-if="!loading"
    >
      <div class="input-container">
        <label
          for="type"
          class="label"
        >Type</label>
        <input
          type="text"
          class="light-primary-input"
          v-model="event.eventType"
        >
        <!-- <validation-message
          :validation="$v.event.title"
          :metadata="eventMetadata.fields.title"
        /> -->
      </div>
      <div class="input-container">
        <label
          for="start"
          class="label"
        >Start</label>
        <input
          type="text"
          class="light-primary-input"
          v-model="event.startDate"
        >
        <!-- <validation-message
          :validation="$v.event.title"
          :metadata="eventMetadata.fields.title"
        /> -->
      </div>
      <div class="input-container">
        <label
          for="end"
          class="label"
        >End</label>
        <input
          type="text"
          class="light-primary-input"
          v-model="event.endDate"
        >
        <!-- <validation-message
          :validation="$v.event.title"
          :metadata="eventMetadata.fields.title"
        /> -->
      </div>
      <div class="input-container">
        <label
          for="repeate"
          class="label"
        >Repeat</label>
        <input
          type="text"
          class="light-primary-input"
        >
        <!-- <validation-message
          :validation="$v.event.title"
          :metadata="eventMetadata.fields.title"
        /> -->
      </div>
      <div class="input-container">
        <label
          for="descripton"
          class="label"
        >Description</label>
        <div class="textarea-container medium">
          <textarea
            class="light-primary-input"
            v-model="event.description"
          ></textarea>
          <!-- <p
            class="character-count"
            v-if="event.description"
          >
            {{ event.description.length }}/{{eventMetadata.fields.description.maxLength }}
          </p> -->
        </div>
      </div>
      <!-- <snackbar
        :status="status"
        :message="message"
        @close="clearMessage"
      ></snackbar> -->
    </div>
  </form>
</template>

<script>
import { mapState } from 'vuex'
const Snackbar = () => import(
  /* webpackChunkName: "Snackbar" */ './Snackbar'
)
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)
const ValidationMessage = () => import(
  /* webpackChunkName: "ValidationMessage" */ './ValidationMessage'
)

export default {
  name: 'NewEventForm',
  data () {
    return {
      loading: false,
      status: null,
      message: null,
      event: null

    }
  },
  computed: {
    ...mapState([
      'Event'
    ])
  },
  methods: {
    create () {
      this.event.save().send()
    },
    clearMessage () {
      this.status = null
      this.message = null
    }
  },
  mounted () {
    this.event = new this.Event()
  },
  components: {
    Loading,
    ValidationMessage,
    Snackbar
  }
}
</script>
