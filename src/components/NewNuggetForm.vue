<template>
  <form
    id="newNuggetForm"
    v-on-clickaway.capture="showPopup"
    @submit.prevent="define"
  >
    <div class="header">
      <button
        type="submit"
        class="light-primary-button small"
        :disabled="$v.nugget.$invalid"
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
      class="nugget-information"
      v-else
    >

      <!-- NUGGET TITLE -->

      <div class="input-container">
        <label
          class="label"
          :class="{error: $v.nugget.title.$error}"
        >
          {{ nuggetMetadata.fields.title.label }}
        </label>
        <input
          type="text"
          :placeholder="nuggetMetadata.fields.title.watermark"
          class="light-primary-input"
          v-model.trim="nugget.title"
          @input="$v.nugget.title.$touch"
          :class="{error: $v.nugget.title.$error}"
        >
        <validation-message
          :validation="$v.nugget.title"
          :metadata="nuggetMetadata.fields.title"
        />
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
            :value="nugget.status.formatText()"
            ref="status"
            readonly
          >
          <img
            src="../assets/chevron-down.svg"
            class="arrow"
            :class="!showStatusList ? 'down' : 'up'"
            @click="toggleStatusList"
          >
          <div
            class="dropdown-list"
            v-if="showStatusList"
            v-on-clickaway="toggleStatusList.bind(undefined, false)"
          >
            <p
              v-for="(status, index) in nuggetStatuses"
              :key="index"
              @click="selectStatus(status)"
            >
              {{ status.formatText() }}
            </p>
          </div>
        </div>
        <validation-message
          :validation="$v.nugget.status"
          :metadata="nuggetMetadata.fields.status"
        />
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
            ref="dueDate"
            readonly
          >
          <div
            v-if="showDatepicker"
            class="datepicker"
            v-on-clickaway="toggleDatepicker.bind(undefined, false)"
          >
            <custom-datepicker
              primary-color="#2F2445"
              :wrapperStyles="wrapperStyles"
              @dateSelected="setDate($event)"
              :date="nugget.dueDate"
            />
          </div>
        </div>
        <div>
          <validation-message
            :validation="$v.nugget.dueDate"
            :metadata="nuggetMetadata.fields.dueDate"
          />
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
            ref="kind"
            readonly
          >
          <img
            src="../assets/chevron-down.svg"
            class="arrow"
            :class="!showKindList ? 'down' : 'up'"
            @click="toggleKindList"
          >
          <div
            class="dropdown-list"
            v-if="showKindList"
            v-on-clickaway="toggleKindList.bind(undefined, false)"
          >
            <p
              v-for="(kind, index) in nuggetKinds"
              :key="index"
              @click="selectKind(kind)"
            >
              {{ kind }}
            </p>
          </div>
        </div>
        <validation-message
          :validation="$v.nugget.kind"
          :metadata="nuggetMetadata.fields.kind"
        />
      </div>

      <!-- DESCRIPTION -->

      <div class="input-container">
        <label
          class="label"
          :class="{error: $v.nugget.description.$error}"
        >
          {{ nuggetMetadata.fields.description.label }}
        </label>
        <div class="textarea-container">
          <textarea
            :placeholder="nuggetMetadata.fields.description.watermark"
            class="light-primary-input"
            v-model.trim="nugget.description"
            @input="$v.nugget.description.$touch"
            :class="{error: $v.nugget.description.$error}"
            @keyup.ctrl.enter="define"
          ></textarea>
          <p
            class="character-count"
            v-if="nugget.description"
          >
            {{ nugget.description.length }}/512
          </p>
        </div>
        <validation-message
          :validation="$v.nugget.description"
          :metadata="nuggetMetadata.fields.description"
        />
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
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)
const ValidationMessage = () => import(
  /* webpackChunkName: "ValidationMessage" */ './ValidationMessage'
)
const Popup = () => import(
  /* webpackChunkName: "Popup" */ './Popup'
)

export default {
  mixins: [clickaway],
  name: 'UpdateNuggetForm',
  data () {
    return {
      nuggetMetadata: server.metadata.models.Issue,
      showingPopup: false,
      status: null,
      nugget: null,
      showKindList: false,
      showStatusList: false,
      showDatepicker: false,
      message: null,
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
        status: server.metadata.models.Issue.fields.status.createValidator(),
        dueDate: server.metadata.models.Issue.fields.dueDate.createValidator(),
        kind: server.metadata.models.Issue.fields.kind.createValidator()
      }
    }
  },
  computed: {
    dueDate () {
      if (this.nugget.dueDate) {
        return moment(this.nugget.dueDate).format('YYYY-MM-DD')
      } else {
        return null
      }
    },
    ...mapState([
      'Nugget',
      'nuggetStatuses',
      'nuggetKinds'
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
          this.message = 'Your nugget was created.'
          this.listNuggets([this.$route.params.projectId, resp.json.id])
          setTimeout(() => {
            this.status = null
            this.message = null
          }, 3000)
        }).catch(resp => {
          this.status = resp.status
          this.message = resp.error
          setTimeout(() => {
            this.status = null
            this.message = null
          }, 3000)
        }).finally(() => {
          this.loading = false
        })
    },
    confirmPopup () {
      this.showingPopup = false
      this.nugget = new this.Nugget()
      this.$v.nugget.$reset()
      this.listNuggets([this.$route.params.projectId, undefined, () => {
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
      this.$refs.dueDate.focus()
      if (this.nugget.dueDate !== moment(date).format('YYYY-MM-DD')) {
        this.$v.nugget.dueDate.$touch()
      }
    },
    toggleKindList (value) {
      if (typeof value === 'boolean') {
        this.showKindList = value
      } else {
        this.showKindList = !this.showKindList
      }
    },
    toggleStatusList (value) {
      if (typeof value === 'boolean') {
        this.showStatusList = value
      } else {
        this.showStatusList = !this.showStatusList
      }
    },
    toggleDatepicker (value) {
      if (typeof value === 'boolean') {
        this.showDatepicker = value
      } else {
        this.showDatepicker = !this.showDatepicker
      }
    },
    selectStatus (status) {
      this.nugget.status = status
      this.showStatusList = false
      this.$refs.status.focus()
    },
    selectKind (kind) {
      this.nugget.kind = kind
      this.showKindList = false
      this.$refs.kind.focus()
    },
    ...mapActions([
      'listNuggets'
    ])
  },
  beforeMount () {
    this.nugget = new this.Nugget({ projectId: parseInt(this.$route.params.projectId) })
  },
  components: {
    Loading,
    CustomDatepicker,
    Popup,
    ValidationMessage
  }
}
</script>
