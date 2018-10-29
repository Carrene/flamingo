<template>
  <div id="newNuggetForm" v-on-clickaway.capture="showPopup">
    <div class="header">
      <button
        type="button"
        class="light-primary-button small"
        @click="define"
        :disabled="$v.nugget.$invalid"
      >
        <img src="./../assets/save.svg" class="save-icon">
        Save
      </button>
    </div>
      <form class="nugget-information">
        <div class="nugget-title">

          <!-- NUGGET TITLE -->

          <label class="label" :class="{error: $v.nugget.title.$error}">
            Nugget title
          </label>
          <input
            type="text"
            placeholder="Nugget"
            class="light-primary-input"
            v-model="nugget.title"
            @change="$v.nugget.title.$touch"
            @focus="$v.nugget.title.$reset"
            :class="{error: $v.nugget.title.$error}"
          >
          <validation-message :validation="$v.nugget.title" :metadata="nuggetMetadata.fields.title" />
        </div>

        <!-- STATUS -->

         <div class="nugget-status">
          <label class="label">
            Status
          </label>
          <div class="status-container">
            <input
              type="text"
              placeholder="Status"
              class="light-primary-input"
              :class="{'show-status-list': showStatusList}"
              @click="toggleStatusList"
              :value="nugget.status"
              readonly
            >
            <img src="../assets/chevron-down.svg"
                 class="down-icon"
                 :class="!showStatusList ? 'down' : 'up'"
                 @click="toggleStatusList"
            >
            <div class="status-list" v-if="showStatusList">
              <p
                v-for="(status, index) in statuses"
                :key="index"
                @click="selectStatus(status)"
              >
                {{ status }}
              </p>
            </div>
          </div>
          <div class="helper">
            <span>*Please enter status</span>
          </div>
        </div>

        <!-- DAYS -->

        <div class="days">
          <label class="label" :class="{error: $v.nugget.days.$error}">
            Days
          </label>
          <input
            type="number"
            placeholder="Days"
            class="light-primary-input"
            v-model="nugget.days"
            min="1"
            @change="$v.nugget.days.$touch"
            @focus="$v.nugget.days.$reset"
            :class="{error: $v.nugget.days.$error}"
          >
          <validation-message :validation="$v.nugget.days" :metadata="nuggetMetadata.fields.days" />
        </div>

        <!-- DUE DATE -->

        <div class="nugget-due-date">
          <label class="label">
            Due date
          </label>
          <div class="input-container">
            <input
              type="text"
              placeholder="Nugget due date"
              class="light-primary-input"
              v-model="dueDate"
              @click="showDatepicker = !showDatepicker"
            >
            <div v-if="showDatepicker" class="datepicker">
              <custom-datepicker
                primary-color="#2F2445"
                :wrapperStyles="wrapperStyles"
                @dateSelected="setDate($event)"
                :date="nugget.dueDate"
              />
            </div>
          </div>
          <div>
            <span class="helper">*Nugget due date</span>
          </div>
        </div>

        <!-- KIND -->

         <div class="kind">
          <label class="label">
            kind
          </label>
          <div class="kind-container">
            <input
              type="text"
              placeholder="Kind"
              class="light-primary-input"
              :class="{'show-kind-list' : showKindList}"
              @click="toggleKindList"
              :value="nugget.kind"
              readonly
            >
            <img src="../assets/chevron-down.svg"
                 class="down-icon"
                 :class="!showKindList ? 'down' : 'up'"
                 @click="toggleKindList"
            >
            <div class="kind-list" v-if="showKindList">
              <p
                v-for="(kind, index) in kinds"
                :key="index"
                @click="selectKind(kind)"
              >
                {{ kind }}
              </p>
            </div>
          </div>
          <div class="helper">
            <span>*Please enter kind</span>
          </div>
        </div>

        <!-- DESCRIPTION -->

        <div class="nugget-description">
          <label class="label" :class="{error: $v.nugget.description.$error}">Description (optional)</label>
          <div class="textarea-container">
            <textarea
              placeholder="Description"
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
      </form>
    <div class="response-message">
      <p :class="status === 200 ? 'success' : 'error'">
        {{ message }}
      </p>
    </div>
    <popup
      v-if="showingPopup"
      :message="'Are you sure leave the new nugget?'"
      @confirm="confirmPopup"
      @cancel="cancelPopup"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import server from './../server'
import CustomDatepicker from 'vue-custom-datepicker'
import moment from 'moment'
import { mixin as clickaway } from 'vue-clickaway'
import Popup from './Popup'
import ValidationMessage from './ValidationMessage'

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
      statuses: ['in-progress', 'on-hold', 'delayed', 'complete'],
      showStatusList: false,
      showDatepicker: false,
      wrapperStyles: {
        width: '100%',
        background: '#5E5375',
        color: '#ffffff',
        position: 'relative'
      }
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
      this.nugget
        .save()
        .send()
        .then(resp => {
          this.status = resp.status
          this.listNuggets()
          setTimeout(() => {
            this.status = null
          }, 3000)
        }).catch(resp => {
          this.status = resp.status
          setTimeout(() => {
            this.status = null
          }, 3000)
        })
    },
    confirmPopup () {
      this.showingPopup = false
      this.$v.nugget.$reset()
      this.listNuggets()
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
    toggleKindList () {
      this.showKindList = !this.showKindList
    },
    toggleStatusList () {
      this.showStatusList = !this.showStatusList
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
    CustomDatepicker,
    Popup,
    ValidationMessage
  }
}
</script>
