<template>
  <form
    id="newNuggetForm"
    v-on-clickout.capture="showPopup"
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
      class="nugget-information content"
      v-else
    >

      <!-- NUGGET TITLE -->

      <div class="input-container">
        <label
          class="label"
          :class="{error: $v.nugget.title.$error}"
          :for="nuggetMetadata.fields.title.name"
        >
          {{ nuggetMetadata.fields.title.label }}
        </label>
        <input
          type="text"
          class="light-primary-input"
          v-model.trim="nugget.title"
          @input="$v.nugget.title.$touch"
          :class="{error: $v.nugget.title.$error}"
          :id="nuggetMetadata.fields.title.name"
        >
        <validation-message
          :validation="$v.nugget.title"
          :metadata="nuggetMetadata.fields.title"
        />
      </div>

      <!-- STATUS -->

      <div class="input-container">
        <label
          class="label"
          :for="nuggetMetadata.fields.status.name"
        >
          {{ nuggetMetadata.fields.status.label }}
        </label>
        <v-select
          :options="statuses"
          index="value"
          v-model="nugget.status"
          :inputId="nuggetMetadata.fields.status.name"
          :clearable="!$v.nugget.status.required"
        ></v-select>
        <validation-message
          :validation="$v.nugget.status"
          :metadata="nuggetMetadata.fields.status"
        />
      </div>

      <!-- PRIORITY -->

      <div class="input-container">
        <label
          class="label"
          :for="nuggetMetadata.fields.priority.name"
        >
          {{ nuggetMetadata.fields.priority.label }}
        </label>
        <v-select
          :options="priorities"
          index="value"
          :inputId="nuggetMetadata.fields.priority.name"
          :clearable="!$v.nugget.priority.required"
          v-model="nugget.priority"
        ></v-select>
        <validation-message
          :validation="$v.nugget.priority"
          :metadata="nuggetMetadata.fields.priority"
        />
      </div>

      <!-- TAGS -->

      <div class="input-container">
        <label
          class="label"
          :for="nuggetMetadata.fields.tags.name"
        >
          {{ nuggetMetadata.fields.tags.label }}
        </label>
        <v-select
          :options="tags"
          label="title"
          index="id"
          :inputId="nuggetMetadata.fields.tags.name"
          :clearable="!$v.nugget.tags.required"
          v-model="nugget.tags"
          multiple
        ></v-select>
        <validation-message
          :validation="$v.nugget.tags"
          :metadata="nuggetMetadata.fields.tags"
        />
      </div>

      <!-- DUE DATE -->

      <div class="input-container">
        <label
          class="label"
          :for="nuggetMetadata.fields.dueDate.name"
        >
          {{ nuggetMetadata.fields.dueDate.label }}
        </label>
        <div class="datepicker-container">
          <input
            type="text"
            class="light-primary-input"
            v-model="dueDate"
            @click="toggleDatepicker"
            ref="dueDate"
            @keyup.enter="toggleDatepicker"
            :id="nuggetMetadata.fields.dueDate.name"
            readonly
          >
          <div
            v-if="showDatepicker"
            class="datepicker"
            v-on-clickout="toggleDatepicker.bind(undefined, false)"
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
        <label
          class="label"
          :for="nuggetMetadata.fields.kind.name"
        >
          {{ nuggetMetadata.fields.kind.label }}
        </label>
        <v-select
          :options="kinds"
          index="value"
          :inputId="nuggetMetadata.fields.kind.name"
          v-model="nugget.kind"
          :clearable="!$v.nugget.kind.required"
        ></v-select>
        <validation-message
          :validation="$v.nugget.kind"
          :metadata="nuggetMetadata.fields.kind"
        />
      </div>

      <!-- PROJECT -->

      <div class="input-container">
        <label
          :for="nuggetMetadata.fields.projectId.name"
          class="label"
        >
          {{ nuggetMetadata.fields.projectId.label }}
        </label>
        <v-select
          :options="projects"
          index="id"
          label="title"
          :inputId="nuggetMetadata.fields.projectId.name"
          :clearable="!$v.nugget.projectId.required"
          v-model="nugget.projectId"
        ></v-select>
        <validation-message
          :validation="$v.nugget.projectId"
          :metadata="nuggetMetadata.fields.projectId"
        />
      </div>

      <!-- DESCRIPTION -->

      <div class="input-container">
        <label
          class="label"
          :class="{error: $v.nugget.description.$error}"
          :for="nuggetMetadata.fields.description.name"
        >
          {{ nuggetMetadata.fields.description.label }}
        </label>
        <div class="textarea-container large">
          <textarea
            class="light-primary-input"
            v-model.trim="nugget.description"
            @input="$v.nugget.description.$touch"
            :class="{error: $v.nugget.description.$error}"
            :id="nuggetMetadata.fields.description.name"
            @keyup.ctrl.enter="define"
          ></textarea>
          <p
            class="character-count"
            v-if="nugget.description"
          >
            {{ nugget.description.length }}/{{ nuggetMetadata.fields.description.maxLength }}
          </p>
        </div>
        <validation-message
          :validation="$v.nugget.description"
          :metadata="nuggetMetadata.fields.description"
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
import { mixin as clickout } from 'vue-clickout'
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

export default {
  mixins: [clickout],
  name: 'NewNuggetForm',
  data () {
    return {
      nuggetMetadata: server.metadata.models.Issue,
      showingPopup: false,
      status: null,
      nugget: null,
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
        title: this.nuggetMetadata.fields.title.createValidator(),
        description: this.nuggetMetadata.fields.description.createValidator(),
        status: this.nuggetMetadata.fields.status.createValidator(),
        dueDate: this.nuggetMetadata.fields.dueDate.createValidator(),
        kind: this.nuggetMetadata.fields.kind.createValidator(),
        priority: this.nuggetMetadata.fields.priority.createValidator(),
        tags: this.nuggetMetadata.fields.tags.createValidator(),
        projectId: this.nuggetMetadata.fields.projectId.createValidator()
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
    statuses () {
      return this.nuggetStatuses.map(status => {
        return {
          label: status.formatText(),
          value: status
        }
      })
    },
    kinds () {
      return this.nuggetKinds.map(kind => {
        return {
          label: kind.formatText(),
          value: kind
        }
      })
    },
    priorities () {
      return this.nuggetPriorities.map(priority => {
        return {
          label: priority.formatText(),
          value: priority
        }
      })
    },
    ...mapState([
      'DraftNugget',
      'nuggetStatuses',
      'nuggetKinds',
      'nuggetPriorities',
      'selectedProject',
      'tags',
      'projects'
    ])
  },
  methods: {
    async define () {
      this.loading = true
      let jsonPatchRequest = server.jsonPatchRequest(this.DraftNugget.__url__)
      for (let tag of this.nugget.tags) {
        jsonPatchRequest.addRequest(this.nugget.addTag(tag))
      }
      jsonPatchRequest.addRequest(this.nugget.finalize())
      jsonPatchRequest.send()
        .then(resps => {
          this.status = resps[0].status
          this.message = 'Your nugget was created.'
          this.listNuggets(resps[resps.length - 1].models[0].issueId)
          setTimeout(() => {
            this.clearMessage()
          }, 3000)
        }).catch(resps => {
          this.status = resps[0].status
          this.message = resps[0].error
          setTimeout(() => {
            this.clearMessage()
          }, 3000)
        }).finally(() => {
          this.loading = false
        })
    },
    async confirmPopup () {
      this.showingPopup = false
      this.nugget = new this.DraftNugget({ projectId: this.selectedProject ? this.selectedProject.id : null })
      this.$v.nugget.$reset()
      await this.listNuggets()
      this.loading = false
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
      'listNuggets'
    ])
  },
  async beforeMount () {
    this.nugget = new this.DraftNugget({ projectId: this.selectedProject ? this.selectedProject.id : null })
    await this.nugget.save().send()
  },
  components: {
    Loading,
    CustomDatepicker,
    Popup,
    ValidationMessage,
    Snackbar
  }
}
</script>
