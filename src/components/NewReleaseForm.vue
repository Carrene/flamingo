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
        class="secondary-button"
        :disabled="$v.release.$invalid"
      >
        <img
          src="./../assets/save-light.svg"
          class="save-icon"
        >
        Save
      </button>
      <avatar />
    </div>

    <!--FORM-->

    <div
      class="release-information content"
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

      <!-- RELEASE DATE -->

      <div class="input-container">
        <label
          class="label"
          :for="releaseMetadata.fields.launchDate.name"
        >
          {{ releaseMetadata.fields.launchDate.label }}
        </label>
        <div class="datepicker-container">
          <input
            type="text"
            class="light-primary-input calendar"
            :value="launchDate"
            @click="toggleLaunchDatepicker"
            ref="launchDate"
            @change="$v.release.launchDate.$touch"
            @keyup.enter="toggleLaunchDatepicker"
            :id="releaseMetadata.fields.launchDate.name"
            readonly
          >
          <div
            v-if="showLaunchDatepicker"
            class="datepicker"
            v-on-clickout="toggleLaunchDatepicker.bind(undefined, false)"
          >
            <custom-datepicker
              primary-color="#2F2445"
              :wrapperStyles="datepickerOptions.wrapperStyles"
              @dateSelected="setLaunchDate($event)"
              :date="release.launchDate"
              :limits="datepickerOptions.limits"
            />
          </div>
        </div>
        <div>
          <validation-message
            :validation="$v.release.launchDate"
            :metadata="releaseMetadata.fields.launchDate"
          />
        </div>
      </div>

      <!-- CUTOFF DATE -->

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
            class="light-primary-input calendar"
            :value="cutoff"
            @click="toggleCutoffDatepicker"
            ref="cutoff"
            @change="$v.release.cutoff.$touch"
            @keyup.enter="toggleCutoffDatepicker"
            :id="releaseMetadata.fields.cutoff.name"
            readonly
          >
          <div
            v-if="showCutoffDatepicker"
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
        <div>
          <validation-message
            :validation="$v.release.cutoff"
            :metadata="releaseMetadata.fields.cutoff"
          />
        </div>
      </div>

      <!-- GROUP -->

      <div class="input-container">
        <label
          :for="releaseMetadata.fields.groupId.name"
          class="label"
        >
          {{ releaseMetadata.fields.groupId.label }}
        </label>
        <v-select
          :options="groups"
          index="id"
          label="title"
          :inputId="releaseMetadata.fields.groupId.name"
          v-model.trim="release.groupId"
          :clearable="!$v.release.groupId.required"
        ></v-select>
        <validation-message
          :validation="$v.release.groupId"
          :metadata="releaseMetadata.fields.groupId"
        />
      </div>

      <!-- MANAGER -->

      <div class="input-container">
        <label
          class="label"
          :for="releaseMetadata.fields.managerId.name"
        >
          {{ releaseMetadata.fields.managerId.label }}
        </label>
        <v-select
          :options="members"
          v-model="release.managerId"
          :clearable="!$v.release.managerId.required"
          index="id"
          label="title"
          :inputId="releaseMetadata.fields.managerId.name"
        ></v-select>
        <validation-message
          :validation="$v.release.managerId"
          :metadata="releaseMetadata.fields.managerId"
        />
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
import { mapActions, mapState, mapMutations } from 'vuex'
import { mixin as clickout } from 'vue-clickout'
import CustomDatepicker from 'vue-custom-datepicker'
import moment from 'moment'
import server from './../server'
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
      auth: server.authenticator,
      status: null,
      message: null,
      release: null,
      releaseMetadata: server.metadata.models.Release,
      showCutoffDatepicker: false,
      showLaunchDatepicker: false,
      members: [],
      myId: null,
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
        launchDate: this.releaseMetadata.fields.launchDate.createValidator(),
        cutoff: this.releaseMetadata.fields.cutoff.createValidator(),
        groupId: this.releaseMetadata.fields.groupId.createValidator(),
        managerId: this.releaseMetadata.fields.managerId.createValidator()
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
    launchDate () {
      if (this.release.launchDate) {
        return moment(this.release.launchDate).format('YYYY-MM-DD')
      } else {
        return null
      }
    },
    ...mapState([
      'Release',
      'selectedRelease',
      'groups',
      'Organization',
      'showingPopup'
    ])
  },
  methods: {
    async confirmPopup () {
      this.setShowingPopup(false)
      this.release = new this.Release({ managerId: server.authenticator.member.referenceId })
      this.$v.release.$reset()
      this.setGlobalLoading(true)
      await this.listReleases({ selectedReleaseId: this.selectedRelease ? this.selectedRelease.id : null })
      this.setGlobalLoading(false)
    },
    cancelPopup () {
      this.setShowingPopup(false)
    },
    showPopup () {
      if (this.$v.release.$anyDirty) {
        this.setShowingPopup(true)
      }
    },
    async create () {
      this.setGlobalLoading(true)
      try {
        let response = await this.release.save().send()
        this.status = response.status
        this.message = 'Your release was created.'
        await this.listReleases({ selectedReleaseId: response.json.id })
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
      this.setGlobalLoading(false)
    },
    setLaunchDate (date) {
      // Checking if the date has been changed
      this.release.launchDate = moment(date).format('YYYY-MM-DD')
      this.showLaunchDatepicker = false
      this.$refs.launchDate.focus()
      if (this.release.launchDate !== moment(date).format('YYYY-MM-DD')) {
        this.$v.release.launchDate.$touch()
      }
    },
    setCutoffDate (date) {
      // Checking if the date has been changed
      this.release.cutoff = moment(date).format('YYYY-MM-DD')
      this.showCutoffDatepicker = false
      this.$refs.cutoff.focus()
      if (this.release.cutoff !== moment(date).format('YYYY-MM-DD')) {
        this.$v.release.cutoff.$touch()
      }
    },
    toggleLaunchDatepicker (value) {
      if (typeof value === 'boolean') {
        this.showLaunchDatepicker = value
      } else {
        this.showLaunchDatepicker = !this.showLaunchDatepicker
      }
    },
    toggleCutoffDatepicker (value) {
      if (typeof value === 'boolean') {
        this.showCutoffDatepicker = value
      } else {
        this.showCutoffDatepicker = !this.showCutoffDatepicker
      }
    },
    clearMessage () {
      this.status = null
      this.message = null
    },
    ...mapMutations([
      'setGlobalLoading',
      'setShowingPopup'
    ]),
    ...mapActions([
      'listReleases',
      'activateRelease'
    ])
  },
  beforeMount () {
    let organization = new this.Organization({
      id: this.auth.member.organizationId
    })
    organization.listMembers().send().then(resp => {
      this.members = resp.models
      this.myId = this.members
        .find(member => member.referenceId === this.auth.member.referenceId)
        .id
      this.release.managerId = this.myId
    })
    this.release = new this.Release({
      managerId: this.myId
    })
  },
  components: {
    ValidationMessage,
    Popup,
    Snackbar,
    CustomDatepicker,
    Avatar
  }
}
</script>
