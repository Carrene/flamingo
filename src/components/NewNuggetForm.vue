<template>
  <div id="newNuggetForm" v-on-clickaway="showPopup">
    <div class="header">
      <button
        type="button"
        class="light-primary-button small"
        v-if="selectedScope === 'Nuggets' && !selectedNugget"
        @click="define"
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
            @blur="$v.nugget.title.$touch"
            @focus="[$v.nugget.title.$reset, setEditing(true)]"
            :class="{error: $v.nugget.title.$error}"
          >
          <div v-if="$v.nugget.title.$error" class="validation-message">
            <span v-if="!$v.nugget.title.required">This field is required</span>
            <span v-if="!$v.nugget.title.maxLength">This field should be less than 50 characters.</span>
          </div>
          <div v-else class="helper">
            <span>*Please enter nugget title</span>
          </div>
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
              :class="{'show-status-list' : showStatusList}"
              @click="statusListVisibility"
              @focus="setEditing(true)"
              v-model="nugget.status"
            >
            <img src="../assets/chevron-down.svg"
                 class="down-icon"
                 :class="!showStatusList ? 'down' : 'up'"
                 @click="statusListVisibility"
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
            @blur="$v.nugget.days.$touch"
            @focus="[$v.nugget.days.$reset, setEditing(true)]"
            :class="{error: $v.nugget.days.$error}"
          >
          <div v-if="$v.nugget.days.$error" class="validation-message">
            <span v-if="!$v.nugget.days.integer">This field should be number.</span>
          </div>
          <div v-else class="helper">
            <span>*Please enter nugget days</span>
          </div>
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
              v-model="nugget.dueDate"
              @focus="setEditing(true)"
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
              @click="kindListVisibility"
              @focus="setEditing(true)"
              v-model="nugget.kind"
            >
            <img src="../assets/chevron-down.svg"
                 class="down-icon"
                 :class="!showKindList ? 'down' : 'up'"
                 @click="kindListVisibility"
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
              @focus="setEditing(true)"
            ></textarea>
            <p class="character-count" v-if="nugget.description">
              {{ nugget.description.length }}/512
            </p>
          </div>
          <div v-if="$v.nugget.description.$error" class="validation-message">
            <span v-if="!$v.nugget.description.maxLength">This field should be less than 512 characters.</span>
          </div>
          <div v-else class="helper">
            <span>*Please enter description</span>
          </div>
        </div>
      </form>
    <div class="response-message">
      <p :class="status === 200 ? 'success' : 'error'">
        {{ message }}
      </p>
    </div>
        <div class="popup" v-if="showNuggetPopup">
      <div class="popupBox">
        <p>Are you sure leave the new Nugget?</p>
        <div class="buttonContainer">
          <button type="button" class="light-primary-button small" @click="confirmPopup('new')">Yes</button>
          <button type="button" class="primary-button small" @click="cancelPopup('new')">No</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { required, maxLength, integer, minValue } from 'vuelidate/lib/validators'
import { mapState, mapMutations, mapActions } from 'vuex'
import { updateDateNugget } from '../helpers'
import server from './../server'
import CustomDatepicker from 'vue-custom-datepicker'
import moment from 'moment'
import { mixin as clickaway } from 'vue-clickaway'

export default {
  mixins: [ clickaway ],
  name: 'UpdateNuggetForm',
  data () {
    return {
      showNuggetPopup: false,
      selectedTab: 'details',
      status: null,
      nugget: {
        title: null,
        dueDate: null,
        description: '',
        kind: null,
        days: null,
        status: null
      },
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
  validations: {
    nugget: {
      title: {
        required,
        maxLength: maxLength(50)
      },
      description: {
        maxLength: maxLength(512)
      },
      days: {
        integer,
        minValue: minValue(1)
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
    ...mapState([
      'selectedNugget',
      'editing',
      'selectedScope',
      'selectedProject'
    ])
  },
  watch: {
    'selectedNugget': {
      deep: true,
      handler (newValue) {
        if (newValue) {
          this.nugget = Object.assign({}, updateDateNugget(newValue))
        }
      }
    }
  },
  methods: {
    define () {
      server
        .request('issues')
        .setVerb('DEFINE')
        .addParameters({
          title: this.nugget.title,
          description: this.nugget.description,
          dueDate: moment(this.nugget.dueDate).format('YYYY-MM-DD'),
          kind: this.nugget.kind,
          days: this.nugget.days,
          status: this.nugget.status,
          projectId: this.selectedProject.id
        })
        .send()
        .then(resp => {
          this.setEditing(false)
          this.status = resp.status
          this.listNuggets()
          setTimeout(() => {
            this.status = null
          }, 3000)
        }).catch(resp => {
          console.log(this.nugget)
          this.status = resp.status
          setTimeout(() => {
            this.status = null
          }, 3000)
        })
    },
    confirmPopup () {
      this.showNuggetPopup = false
      this.setEditing(false)
      this.listNuggets()
    },
    cancelPopup () {
      this.showNuggetPopup = false
    },
    showPopup () {
      if (this.$v.nugget.$anyDirty) {
        this.showNuggetPopup = true
      }
    },
    setDate (date) {
      // Checking if the date has been changed
      this.nugget.dueDate = moment(date).format('MM/DD/YYYY')
      this.showDatepicker = false
      if (this.nugget.dueDate !== moment(date).format('MM/DD/YYYY')) {
        this.$v.nugget.dueDate.$touch()
      }
    },
    kindListVisibility () {
      this.showKindList = !this.showKindList
    },
    statusListVisibility () {
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
      this.nugget = Object.assign({}, updateDateNugget(this.selectedNugget))
    },
    ...mapMutations([
      'clearSelectedNugget',
      'setEditing'
    ]),
    ...mapActions([
      'listNuggets',
      'listProjects'
    ])
  },
  components: {
    CustomDatepicker
  },
  mounted () {
    this.getSelectedNugget()
  }
}
</script>
