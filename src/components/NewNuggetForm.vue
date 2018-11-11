<template>
  <form id="newNuggetForm" v-on-clickaway.capture="showPopup" @submit.prevent.once="define">
    <div class="header">
      <button
        type="submit"
        class="light-primary-button small"
        :disabled="$v.nugget.$invalid"
      >
        <img src="./../assets/save.svg" class="save-icon">
        Save
      </button>
    </div>

    <loading v-if="loading"/>

    <div class="nugget-information" v-else>

        <!-- NUGGET TITLE -->

      <div class="input-container">
        <label class="label" :class="{error: $v.nugget.title.$error}">
          {{ nuggetMetadata.fields.title.label }}
        </label>
        <input
          type="text"
          :placeholder="nuggetMetadata.fields.title.watermark"
          class="light-primary-input"
          v-model="nugget.title"
          @change="$v.nugget.title.$touch"
          :class="{error: $v.nugget.title.$error}"
        >
        <validation-message :validation="$v.nugget.title" :metadata="nuggetMetadata.fields.title" />
      </div>

      <!-- STATUS -->

      <div class="input-container">
        <label class="label">
          {{ nuggetMetadata.fields.status.label }}
        </label>
        <div class="dropdown-container">
          <input
            type="text"
            :placeholder="nuggetMetadata.fields.status.watermark"
            class="light-primary-input"
            :class="{'showing-list': showStatusList}"
            @click="toggleStatusList"
            :value="nugget.status"
            readonly
          >
          <img src="../assets/chevron-down.svg"
               class="arrow"
               :class="!showStatusList ? 'down' : 'up'"
               @click="toggleStatusList"
          >
          <div class="dropdown-list" v-if="showStatusList" v-on-clickaway="toggleStatusList.bind(undefined, false)">
            <p
              v-for="(status, index) in statuses"
              :key="index"
              @click="selectStatus(status)"
            >
              {{ status }}
            </p>
          </div>
        </div>
        <validation-message :validation="$v.nugget.status" :metadata="nuggetMetadata.fields.status" />
      </div>

      <!-- DAYS -->

      <div class="input-container">
        <label class="label" :class="{error: $v.nugget.days.$error}">
          {{ nuggetMetadata.fields.days.label }}
        </label>
        <input
          type="number"
          :placeholder="nuggetMetadata.fields.days.watermark"
          class="light-primary-input"
          v-model="nugget.days"

          @change="$v.nugget.days.$touch"
          :class="{error: $v.nugget.days.$error}"
          :min="nuggetMetadata.fields.days.minimum"
          :max="nuggetMetadata.fields.days.maximum"
        >
        <validation-message :validation="$v.nugget.days" :metadata="nuggetMetadata.fields.days" />
      </div>

      <!-- DUE DATE -->

      <div class="input-container">
        <label class="label">
          {{ nuggetMetadata.fields.dueDate.label }}
        </label>
        <div class="datepicker-container">
          <input
            type="text"
            :placeholder="nuggetMetadata.fields.dueDate.watermark"
            class="light-primary-input"
            v-model="dueDate"
            @click="toggleDatepicker"
            readonly
          >
          <div v-if="showDatepicker" class="datepicker" v-on-clickaway="toggleDatepicker.bind(undefined, false)">
            <custom-datepicker
              primary-color="#2F2445"
              :wrapperStyles="wrapperStyles"
              @dateSelected="setDate($event)"
              :date="nugget.dueDate"
            />
          </div>
        </div>
        <div>
          <validation-message :validation="$v.nugget.dueDate" :metadata="nuggetMetadata.fields.dueDate" />
        </div>
      </div>

      <!-- KIND -->

      <div class="input-container">
        <label class="label">
          {{ nuggetMetadata.fields.kind.label }}
        </label>
        <div class="dropdown-container">
          <input
            type="text"
            :placeholder="nuggetMetadata.fields.kind.watermark"
            class="light-primary-input"
            :class="{'showing-list' : showKindList}"
            @click="toggleKindList"
            :value="nugget.kind"
            readonly
          >
          <img src="../assets/chevron-down.svg"
               class="arrow"
               :class="!showKindList ? 'down' : 'up'"
               @click="toggleKindList"
          >
          <div class="dropdown-list" v-if="showKindList" v-on-clickaway="toggleKindList.bind(undefined, false)">
            <p
              v-for="(kind, index) in kinds"
              :key="index"
              @click="selectKind(kind)"
            >
              {{ kind }}
            </p>
          </div>
        </div>
        <validation-message :validation="$v.nugget.kind" :metadata="nuggetMetadata.fields.kind" />
      </div>

      <!-- DESCRIPTION -->

      <div class="input-container">
        <label class="label" :class="{error: $v.nugget.description.$error}">
          {{ nuggetMetadata.fields.description.label }}
        </label>
        <div class="textarea-container">
            <textarea
              :placeholder="nuggetMetadata.fields.description.watermark"
              class="light-primary-input"
              v-model="nugget.description"
              @change="$v.nugget.description.$touch"
              :class="{error: $v.nugget.description.$error}"
            ></textarea>
          <p class="character-count" v-if="nugget.description">
            {{ nugget.description.length }}/512
          </p>
        </div>
        <validation-message :validation="$v.nugget.description" :metadata="nuggetMetadata.fields.description" />
      </div>
      <div class="response-message">
        <p :class="status === 200 ? 'success' : 'error'">
          {{ message }}
        </p>
      </div>
    </div>
    <popup
      v-if="showingPopup"
      :message="'Are you sure leave the new nugget?'"
      @confirm="confirmPopup"
      @cancel="cancelPopup"
    />
  </form>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import server from './../server'
import CustomDatepicker from 'vue-custom-datepicker'
import moment from 'moment'
import { mixin as clickaway } from 'vue-clickaway'
import Popup from './Popup'
import ValidationMessage from './ValidationMessage'
import Loading from './Loading'

export default {
  mixins: [ clickaway ],
  name: 'UpdateNuggetForm',
  data () {
    return {
      nuggetMetadata: server.metadata.models.Issue,
      showingPopup: false,
      status: null,
      nugget: null,
      kinds: ['feature', 'bug', 'enhancement'],
      showKindList: false,
      statuses: ['backlog', 'triage', 'in-progress', 'on-hold', 'delayed', 'done'],
      showStatusList: false,
      showDatepicker: false,
      wrapperStyles: {
        width: '100%',
        background: '#5E5375',
        color: '#ffffff',
        position: 'relative'
      },
      loading: false
    }
  },
  validations () {
    return {
      nugget: {
        title: server.metadata.models.Issue.fields.title.createValidator(),
        description: server.metadata.models.Issue.fields.description.createValidator(),
        days: server.metadata.models.Issue.fields.days.createValidator(),
        status: server.metadata.models.Issue.fields.status.createValidator(),
        dueDate: server.metadata.models.Issue.fields.dueDate.createValidator(),
        kind: server.metadata.models.Issue.fields.kind.createValidator()
      }
    }
  },
  computed: {
    message () {
      if (this.status === 403) {
        return 'Forbidden'
      } else if (this.status === 600) {
        return 'Repetitive Title'
      } else if (this.status === 601) {
        return 'Project Not Found'
      } else if (this.status === 701) {
        return 'Invalid Due Date Format'
      } else if (this.status === 703) {
        return 'At Most 512 Characters Valid For Description'
      } else if (this.status === 704) {
        return 'At Most 50 Characters Valid For Title'
      } else if (this.status === 705) {
        return 'Invalid Status Value'
      } else if (this.status === 710) {
        return 'Title Not In Form'
      } else if (this.status === 711) {
        return 'Due Date Not In Form'
      } else if (this.status === 713) {
        return 'Project Id Not In Form'
      } else if (this.status === 714) {
        return 'Invalid Project Id Type'
      } else if (this.status === 717) {
        return 'Invalid Kind Value'
      } else if (this.status === 718) {
        return 'Kind Not In Form'
      } else if (this.status === 720) {
        return 'Days Not In Form'
      } else if (this.status === 721) {
        return 'Invalid Days Type'
      } else if (this.status === 747) {
        return 'Invalid Title Format'
      } else if (this.status === 200) {
        return 'Your nugget was created.'
      } else {
        return null
      }
    },
    dueDate () {
      if (this.nugget.dueDate) {
        return moment(this.nugget.dueDate).format('YYYY-MM-DD')
      } else {
        return null
      }
    },
    ...mapState([
      'selectedProject',
      'Nugget'
    ])
  },
  methods: {
    define () {
      this.loading = false
      this.nugget
        .save()
        .send()
        .then(resp => {
          this.status = resp.status
          this.listNuggets([resp.json.id])
          setTimeout(() => {
            this.status = null
          }, 3000)
        }).catch(resp => {
          this.status = resp.status
          setTimeout(() => {
            this.status = null
          }, 3000)
        }).finally(() => {
          this.loading = false
        })
    },
    confirmPopup () {
      this.showingPopup = false
      this.nugget = new this.Nugget()
      this.$v.nugget.$reset()
      this.listNuggets([undefined, () => {
        this.loading = false
      }])
    },
    cancelPopup () {
      this.showingPopup = false
    },
    showPopup () {
      if (this.$v.nugget.$anyDirty) {
        this.showingPopup = true
      }
    },
    setDate (date) {
      // Checking if the date has been changed
      this.nugget.dueDate = moment(date).format('YYYY-MM-DD')
      this.showDatepicker = false
      if (this.nugget.dueDate !== moment(date).format('YYYY-MM-DD')) {
        this.$v.nugget.dueDate.$touch()
      }
    },
    toggleKindList (value) {
      if (value) {
        this.showKindList = value
      } else {
        this.showKindList = !this.showKindList
      }
    },
    toggleStatusList (value) {
      if (value) {
        this.showStatusList = value
      } else {
        this.showStatusList = !this.showStatusList
      }
    },
    toggleDatepicker (value) {
      if (value) {
        this.showDatepicker = value
      } else {
        this.showDatepicker = !this.showDatepicker
      }
    },
    selectStatus (status) {
      this.nugget.status = status
      this.showStatusList = false
    },
    selectKind (kind) {
      this.nugget.kind = kind
      this.showKindList = false
    },
    ...mapActions([
      'listNuggets'
    ])
  },
  beforeMount () {
    this.nugget = new this.Nugget({projectId: this.selectedProject.id})
  },
  components: {
    Loading,
    CustomDatepicker,
    Popup,
    ValidationMessage
  }
}
</script>
