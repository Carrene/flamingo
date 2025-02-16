<template>
  <form
    id="updateReleaseForm"
    v-on-clickout.capture="showPopup"
    @submit.prevent="save"
    autocomplete="off"
  >
    <div class="header">
      <button
        type="button"
        class="secondary-button outlined"
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
        class="secondary-button"
        v-else
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

    <div class="release-information content">

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
            :value="formattedLaunchDate"
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
            class="light-primary-input calendar"
            :value="formattedCutoff"
            @click="toggleCutoffDatepicker"
            @change="$v.release.cutoff.$touch"
            @keyup.enter="toggleCutoffDatepicker"
            :id="releaseMetadata.fields.cutoff.name"
            ref="cutoff"
            readonly
          >
          <div
            v-if="showCutoffDatepicker"
            class="datepicker"
            v-on-clickout="toggleCutoffDatepicker.bind(undefined, false)"
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
          v-model="release.groupId"
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
import { mapState, mapActions, mapMutations } from 'vuex'
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
const Snackbar = () => import(
  /* webpackChunkName: "Snackbar" */ './Snackbar'
)
const Avatar = () => import(
  /* webpackChunkName: "Avarat" */ '../components/Avatar'
)

export default {
  mixins: [clickout],
  name: 'UpdateReleaseForm',
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
    formattedCutoff () {
      return moment(this.release.cutoff).format('YYYY-MM-DD')
    },
    formattedLaunchDate () {
      return moment(this.release.launchDate).format('YYYY-MM-DD')
    },
    ...mapState([
      'selectedRelease',
      'Release',
      'releases',
      'groups',
      'Organization',
      'showingPopup'
    ])
  },
  watch: {
    'selectedRelease.id' () {
      this.getSelectedRelease()
    }
  },
  methods: {
    confirmPopup () {
      this.setShowingPopup(false)
      this.save()
    },
    cancelPopup () {
      this.setShowingPopup(false)
      this.getSelectedRelease()
    },
    showPopup () {
      if (this.release.__status__ === 'dirty') {
        this.setShowingPopup(true)
      }
    },
    save () {
      this.setGlobalLoading(true)
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
        this.setGlobalLoading(false)
      })
    },
    async getSelectedRelease () {
      this.setGlobalLoading(false)
      let response = await this.Release.get(this.selectedRelease.id).send()
      this.release = response.models[0]
      this.setGlobalLoading(false)
    },
    setCutoffDate (date) {
      this.release.cutoff = moment(date).toISOString()
      this.showCutoffDatepicker = false
      this.$refs.cutoff.focus()
    },
    setLaunchDate (date) {
      this.release.launchDate = moment(date).toISOString()
      this.showLaunchDatepicker = false
      this.$refs.launchDate.focus()
    },
    toggleCutoffDatepicker (value) {
      if (typeof value === 'boolean') {
        this.showCutoffDatepicker = value
      } else {
        this.showCutoffDatepicker = !this.showCutoffDatepicker
      }
    },
    toggleLaunchDatepicker (value) {
      if (typeof value === 'boolean') {
        this.showLaunchDatepicker = value
      } else {
        this.showLaunchDatepicker = !this.showLaunchDatepicker
      }
    },
    clearMessage () {
      this.status = null
      this.message = null
    },
    ...mapActions([
      'activateRelease'
    ]),
    ...mapMutations([
      'setGlobalLoading',
      'setShowingPopup'
    ])
  },
  beforeMount () {
    this.release = new this.Release()
    let organization = new this.Organization({
      id: this.auth.member.organizationId
    })
    organization.listMembers().send().then(resp => {
      this.members = resp.models
    })
  },
  mounted () {
    this.getSelectedRelease()
  },
  components: {
    Popup,
    ValidationMessage,
    Snackbar,
    CustomDatepicker,
    Avatar
  }
}
</script>
