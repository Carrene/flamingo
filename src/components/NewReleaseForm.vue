<template>
  <form
    id="newReleaseForm"
    v-on-clickout.capture="showPopup"
    @submit.prevent="create"
    autocomplete="off"
  >

    <!--HEADER-->

    <div class="header">
      <button
        type="submit"
        class="secondary-button outlined small"
        :disabled="$v.release.$invalid"
      >
        <img
          src="./../assets/save.svg"
          class="save-icon"
        >
        Save
      </button>
      <avatar />
    </div>

    <loading v-if="loading" />

    <!--FORM-->

    <div
      class="release-information content"
      v-else
    >

      <!-- RELEASE TITLE -->

      <div class="input-container">
        <label
          class="label"
          :class="{error: $v.release.title.$error}"
          :for="releaseMetadata.fields.title.name"
        >
          {{ releaseMetadata.fields.title.label }}
        </label>
        <input
          type="text"
          class="light-primary-input"
          v-model.trim="release.title"
          @input="$v.release.title.$touch"
          :class="{error: $v.release.title.$error}"
          :id="releaseMetadata.fields.title.name"
        >
        <validation-message
          :validation="$v.release.title"
          :metadata="releaseMetadata.fields.title"
        />
      </div>

      <!-- CUTOFF -->

      <div class="input-container">
        <label
          class="label"
          :for="releaseMetadata.fields.cutoff.name"
        >
          {{ releaseMetadata.fields.cutoff.label }}
        </label>
        <div class="datepicker-container">
          <input
            type="text"
            class="light-primary-input"
            :value="cutoff"
            @click="toggleDatepicker"
            ref="cutoff"
            @change="$v.release.cutoff.$touch"
            @keyup.enter="toggleDatepicker"
            :id="releaseMetadata.fields.cutoff.name"
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
              :date="release.cutoff"
              :limits="datepickerOptions.limits"
            />
          </div>
        </div>
        <div>
          <validation-message
            :validation="$v.release.cutoff"
            :metadata="releaseMetadata.fields.cutoff"
          />
        </div>
      </div>

      <!-- DESCRIPTION -->

      <div class="input-container">
        <label
          class="label"
          :class="{error: $v.release.description.$error}"
          :for="releaseMetadata.fields.description.name"
        >
          {{ releaseMetadata.fields.description.label }}
        </label>
        <div class="textarea-container large">
          <textarea
            class="light-primary-input"
            v-model.trim="release.description"
            @input="$v.release.description.$touch"
            :class="{error: $v.release.description.$error}"
            @keyup.ctrl.enter="create"
            :id="releaseMetadata.fields.description.name"
          ></textarea>
          <p
            class="character-count"
            v-if="release.description"
          >
            {{ release.description.length }}/{{ releaseMetadata.fields.description.maxLength }}
          </p>
        </div>
        <validation-message
          :validation="$v.release.description"
          :metadata="releaseMetadata.fields.description"
        />
      </div>
      <snackbar
        :status="status"
        :message="message"
        @close="clearMessage"
        v-on-clickout="clearMessage"
      ></snackbar>
    </div>
    <popup
      v-if="showingPopup"
      :message="'Leave new release view?'"
      @confirm="confirmPopup"
      @cancel="cancelPopup"
    />
  </form>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { mixin as clickout } from 'vue-clickout'
import CustomDatepicker from 'vue-custom-datepicker'
import moment from 'moment'
import server from './../server'
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)
const ValidationMessage = () => import(
  /* webpackChunkName: "ValidationMessage" */ './ValidationMessage'
)
const Popup = () => import(
  /* webpackChunkName: "Popup" */ './Popup'
)
const Snackbar = () => import(
  /* webpackChunkName: "Snackbar" */ './Snackbar'
)
const Avatar = () => import(
  /* webpackChunkName: "Avarat" */ '../components/Avatar'
)

export default {
  mixins: [clickout],
  name: 'NewReleaseForm',
  data () {
    return {
      showingPopup: false,
      status: null,
      message: null,
      release: null,
      releaseMetadata: server.metadata.models.Release,
      loading: false,
      showDatepicker: false,
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
      release: {
        title: this.releaseMetadata.fields.title.createValidator(),
        description: this.releaseMetadata.fields.description.createValidator(),
        cutoff: this.releaseMetadata.fields.cutoff.createValidator()
      }
    }
  },
  computed: {
    cutoff () {
      if (this.release.cutoff) {
        return moment(this.release.cutoff).format('YYYY-MM-DD')
      } else {
        return null
      }
    },
    ...mapState([
      'Release',
      'selectedRelease'
    ])
  },
  methods: {
    async confirmPopup () {
      this.showingPopup = false
      this.release = new this.Release({ managerReferenceId: server.authenticator.member.referenceId })
      this.$v.release.$reset()
      this.loading = true
      await this.listReleases()
      this.loading = false
    },
    cancelPopup () {
      this.showingPopup = false
    },
    showPopup () {
      if (this.$v.release.$anyDirty) {
        this.showingPopup = true
      }
    },
    async create () {
      this.loading = true
      try {
        let response = await this.release.save().send()
        this.status = response.status
        this.message = 'Your project was created.'
        await this.listReleases(response.json.id)
        if (this.selectedRelease) {
          this.activateRelease({ release: this.selectedRelease })
        } else {
          this.confirmPopup()
        }
      } catch (err) {
        this.status = err.status
        this.message = err.error
      }
      setTimeout(() => {
        this.clearMessage()
      }, 3000)
      this.loading = false
    },
    setDate (date) {
      // Checking if the date has been changed
      this.release.cutoff = moment(date).format('YYYY-MM-DD')
      this.showDatepicker = false
      this.$refs.cutoff.focus()
      if (this.release.cutoff !== moment(date).format('YYYY-MM-DD')) {
        this.$v.release.cutoff.$touch()
      }
    },
    toggleDatepicker (value) {
      if (typeof value === 'boolean') {
        this.showDatepicker = value
      } else {
        this.showDatepicker = !this.showDatepicker
      }
    },
    clearMessage () {
      this.status = null
      this.mesasge = null
    },
    ...mapActions([
      'listReleases',
      'activateRelease'
    ])
  },
  beforeMount () {
    this.release = new this.Release({
      managerReferenceId: server.authenticator.member.referenceId
    })
  },
  components: {
    ValidationMessage,
    Popup,
    Loading,
    Snackbar,
    CustomDatepicker,
    Avatar
  }
}
</script>
