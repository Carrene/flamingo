<template>
  <form id="updateNuggetForm" v-on-clickaway.capture="showPopup" @submit.prevent.once="update">
    <div class="header">
      <button
        type="button"
        class="primary-button small"
        v-if="nugget.__status__ !== 'dirty'"
        @click="clearSelectedNugget"
      >
        <img src="./../assets/plus.svg" class="plus-icon">
        New Nugget
      </button>
      <button
        type="submit"
        class="light-primary-button small"
        v-else
        :disabled="$v.nugget.$invalid"
      >
        <img src="./../assets/save.svg" class="save-icon">
        Save
      </button>
    </div>

    <loading v-if="loading"/>

    <div class="nugget-information" v-else>
      <div class="nugget-title">

        <!-- NUGGET TITLE -->

        <label class="label" :class="{error: $v.nugget.title.$error}">
          {{ nuggetMetadata.fields.title.label }}
        </label>
        <input
          type="text"
          :placeholder="nuggetMetadata.fields.title.watermark"
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
          {{ nuggetMetadata.fields.status.label }}
        </label>
        <div class="status-container">
          <input
            type="text"
            :placeholder="nuggetMetadata.fields.status.watermark"
            class="light-primary-input"
            :class="{'show-status-list' : showStatusList}"
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
            <p v-for="(status, index) in statuses" :key="index" @click="selectStatus(status)">
              {{ status }}
            </p>
          </div>
        </div>
        <!-- FIXME: Use validation-message component for this -->
        <div class="helper">
          <span>*Please enter status</span>
        </div>
      </div>

      <!-- DAYS -->

      <div class="days">
        <label class="label" :class="{error: $v.nugget.days.$error}">
          {{ nuggetMetadata.fields.days.label }}
        </label>
        <input
          type="number"
          :placeholder="nuggetMetadata.fields.days.watermark"
          class="light-primary-input"
          v-model="nugget.days"
          @change="$v.nugget.days.$touch"
          @focus="$v.nugget.days.$reset"
          :class="{error: $v.nugget.days.$error}"
        >
        <validation-message :validation="$v.nugget.days" :metadata="nuggetMetadata.fields.days" />
      </div>

      <!-- DUE DATE -->

      <div class="nugget-due-date">
        <label class="label">
          {{ nuggetMetadata.fields.dueDate.label }}
        </label>
        <div class="input-container">
          <input
            type="text"
            :placeholder="nuggetMetadata.fields.dueDate.watermark"
            class="light-primary-input"
            v-model="dueDate"
            @click="showDatepicker = !showDatepicker"
            readonly
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
          <!-- FIXME: Use validation-message component for this -->
          <span class="helper">*Nugget due date</span>
        </div>
      </div>

      <!-- KIND -->

      <div class="kind">
        <label class="label">
          {{ nuggetMetadata.fields.kind.label }}
        </label>
        <div class="kind-container">
          <input
            type="text"
            :placeholder="nuggetMetadata.fields.kind.watermark"
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
        <!-- FIXME: Use validation-message component for this -->
        <div class="helper">
          <span>*Please enter kind</span>
        </div>
      </div>

      <!-- DESCRIPTION -->

      <div class="nugget-description">
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
      message="Are you sure leave the update nugget?"
      @confirm="confirmPopup"
      @cancel="cancelPopup"
    />
  </form>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
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
      showingPopup: false,
      status: null,
      nugget: null,
      kinds: ['feature', 'bug', 'enhancement'],
      showKindList: false,
      statuses: ['in-progress', 'on-hold', 'delayed', 'complete'],
      showStatusList: false,
      showDatepicker: false,
      nuggetMetadata: server.metadata.models.Issue,
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
      } else if (this.status === 701) {
        return 'Invalid Due Date Format'
      } else if (this.status === 703) {
        return 'At Most 512 Characters Valid For Description'
      } else if (this.status === 704) {
        return 'At Most 50 Characters Valid For Title'
      } else if (this.status === 705) {
        return 'Invalid Status Value'
      } else if (this.status === 707) {
        return 'Invalid Field'
      } else if (this.status === 708) {
        return 'Empty Form'
      } else if (this.status === 717) {
        return 'Invalid Kind Value'
      } else if (this.status === 721) {
        return 'Invalid Days Type'
      } else if (this.status === 747) {
        return 'Invalid Title Format'
      } else if (this.status === 200) {
        return 'Your nugget was updated.'
      } else {
        return null
      }
    },
    dueDate () {
      return moment(this.nugget.dueDate).format('YYYY-MM-DD')
    },
    ...mapState([
      'selectedNugget',
      'Nugget'
    ])
  },
  watch: {
    'selectedNugget.id' () {
      this.loading = true
      this.getSelectedNugget()
    }
  },
  methods: {
    update () {
      this.loading = true
      this.nugget.save().send()
        .then(resp => {
          this.status = resp.status
          this.listNuggets([this.nugget.id])
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
      this.getSelectedNugget()
    },
    cancelPopup () {
      this.showingPopup = false
    },
    showPopup () {
      if (this.nugget.__status__ === 'dirty') {
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
    getSelectedNugget () {
      this.nugget = this.Nugget.get(this.selectedNugget.id).send().then(resp => {
        this.nugget = resp.models[0]
      }).finally(() => {
        this.loading = false
      })
    },
    ...mapMutations([
      'clearSelectedNugget'
    ]),
    ...mapActions([
      'listNuggets'
    ])
  },
  components: {
    CustomDatepicker,
    Popup,
    ValidationMessage,
    Loading
  },
  beforeMount () {
    this.nugget = new this.Nugget()
  },
  mounted () {
    this.loading = true
    this.getSelectedNugget()
  }
}
</script>
