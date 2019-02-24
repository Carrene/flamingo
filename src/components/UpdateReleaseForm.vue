<template>
  <form
    id="updateReleaseForm"
    v-on-clickout.capture="showPopup"
    @submit.prevent="save"
  >
    <div class="header">
      <button
        type="button"
        class="primary-button small"
        v-if="release.__status__ !== 'dirty'"
        @click="activateRelease({release: null})"
      >
        <img
          src="./../assets/plus.svg"
          class="plus-icon"
        >
        New Release
      </button>
      <button
        type="submit"
        class="light-primary-button small"
        v-else
        :disabled="$v.release.$invalid"
      >
        <img
          src="./../assets/save.svg"
          class="save-icon"
        >
        Save
      </button>
    </div>

    <loading v-if="loading" />

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
          @focus="$v.release.title.$reset"
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
            :value="formattedCutoff"
            @click="toggleDatepicker"
            @change="$v.release.cutoff.$touch"
            @keyup.enter="toggleDatepicker"
            :id="releaseMetadata.fields.cutoff.name"
            ref="cutoff"
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
            :id="releaseMetadata.fields.description.name"
            @keyup.ctrl.enter="save"
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
      v-if="showingPopup && $v.release.$anyDirty"
      :message="'Save changes?'"
      @confirm="confirmPopup"
      @cancel="cancelPopup"
    />
  </form>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { mixin as clickout } from 'vue-clickout'
import CustomDatepicker from 'vue-custom-datepicker'
import moment from 'moment'
import server from './../server'
import { updateModel } from './../helpers.js'
const Popup = () => import(
  /* webpackChunkName: "Popup" */ './Popup'
)
const ValidationMessage = () => import(
  /* webpackChunkName: "ValidationMessage" */ './ValidationMessage'
)
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)
const Snackbar = () => import(
  /* webpackChunkName: "Snackbar" */ './Snackbar'
)

export default {
  mixins: [clickout],
  name: 'UpdateReleaseForm',
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
          background: '#5E5375',
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
    formattedCutoff () {
      return moment(this.release.cutoff).format('YYYY-MM-DD')
    },
    ...mapState([
      'selectedRelease',
      'Release',
      'releases'
    ])
  },
  watch: {
    'selectedRelease.id' () {
      this.getSelectedRelease()
    }
  },
  methods: {
    confirmPopup () {
      this.showingPopup = false
      this.save()
    },
    cancelPopup () {
      this.showingPopup = false
      this.getSelectedRelease()
    },
    showPopup () {
      if (this.release.__status__ === 'dirty') {
        this.showingPopup = true
      }
    },
    save () {
      this.loading = true
      this.release.save().send().then(async (resp) => {
        this.status = resp.status
        this.message = 'Your release was updated.'
        await updateModel(this.releases, this.release)
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
        this.loading = false
      })
    },
    async getSelectedRelease () {
      this.loading = false
      let response = await this.Release.get(this.selectedRelease.id).send()
      this.release = response.models[0]
      this.loading = false
    },
    setDate (date) {
      this.release.cutoff = moment(date).toISOString()
      this.showDatepicker = false
      this.$refs.cutoff.focus()
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
      this.message = null
    },
    ...mapActions([
      'activateRelease'
    ])
  },
  beforeMount () {
    this.release = new this.Release()
  },
  mounted () {
    this.getSelectedRelease()
  },
  components: {
    Popup,
    ValidationMessage,
    Loading,
    Snackbar,
    CustomDatepicker
  }
}
</script>
