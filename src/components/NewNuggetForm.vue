<template>
  <form
    id="newNuggetForm"
    v-on-clickout.capture="showPopup"
    @submit.prevent="define"
    autocomplete="off"
  >
    <div class="header">
      <button
        type="submit"
        class="secondary-button outlined"
        :disabled="$v.nugget.$invalid"
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
            class="light-primary-input calendar"
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
              :wrapperStyles="datepickerOptions.wrapperStyles"
              @dateSelected="setDate($event)"
              :date="nugget.dueDate"
              :limits="datepickerOptions.limits"
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

      <!-- TAGS -->

      <div class="input-container">
        <label
          class="label"
          :for="nuggetMetadata.fields.tags.name"
        >
          {{ nuggetMetadata.fields.tags.label }}
        </label>
        <v-select
          :options="computedListOfTags"
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

      <!-- RELATED NUGGETS -->

      <div class="input-container">
        <label
          class="label"
          :for="nuggetMetadata.fields.relations.name"
        >
          {{ nuggetMetadata.fields.relations.label }}
        </label>
        <v-select
          :options="computedNuggets"
          :inputId="nuggetMetadata.fields.relations.name"
          index="id"
          :clearable="!$v.nugget.relations.required"
          v-model="relatedIssueIds"
          multiple
        ></v-select>
        <validation-message
          :validation="$v.nugget.relations"
          :metadata="nuggetMetadata.fields.relations"
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
import { mapState, mapActions, mapMutations } from 'vuex'
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
const Avatar = () => import(
  /* webpackChunkName: "Avarat" */ '../components/Avatar'
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
      nuggets: [],
      relatedIssueIds: [],
      showDatepicker: false,
      message: null,
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
        projectId: this.nuggetMetadata.fields.projectId.createValidator(),
        relations: this.nuggetMetadata.fields.relations.createValidator()
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
    computedNuggets () {
      return this.nuggets.reduce((accumulator, nugget) => {
        nugget.label = `#${nugget.id}`
        if (nugget.id !== this.nugget.id) {
          accumulator.push(nugget)
        }
        return accumulator
      }, [])
    },
    computedListOfTags () {
      let unselectedTags = []
      let selectedTags = []
      for (let tag of this.tags) {
        if (this.nugget.tags.includes(tag.id)) {
          selectedTags.push(tag)
        } else {
          unselectedTags.push(tag)
        }
      }
      return unselectedTags.concat(selectedTags)
    },
    ...mapState([
      'DraftNugget',
      'Nugget',
      'nuggetStatuses',
      'nuggetKinds',
      'nuggetPriorities',
      'selectedProject',
      'selectedNuggets',
      'tags',
      'projects'
    ])
  },
  methods: {
    async define () {
      this.loading = true
      try {
        let jsonPatchRequest = server.jsonPatchRequest(this.DraftNugget.__url__)
        for (let tag of this.nugget.tags) {
          jsonPatchRequest.addRequest(this.nugget.addTag(tag))
        }
        for (let relatedIssueId of this.relatedIssueIds) {
          jsonPatchRequest.addRequest(this.nugget.relateNugget(relatedIssueId))
        }
        jsonPatchRequest.addRequest(this.nugget.finalize())
        let response = await jsonPatchRequest.send()
        this.status = response[0].status
        this.message = 'Your nugget was created.'
        this.setNuggetsViewState({ relatedIssueId: null })
        await this.listNuggets(response[response.length - 1].models[0].issueId)
        if (this.selectedNuggets.length === 1) {
          await this.activateNugget({ nugget: this.selectedNuggets[0] })
        } else {
          this.confirmPopup()
        }
        setTimeout(() => {
          this.clearMessage()
        }, 3000)
      } catch (err) {
        this.status = err[0].status
        this.message = err[0].error
        setTimeout(() => {
          this.clearMessage()
        }, 3000)
      }
      this.loading = false
    },
    async confirmPopup () {
      this.showingPopup = false
      this.nugget = new this.DraftNugget({
        projectId: this.selectedProject ? this.selectedProject.id : null,
        relatedIssueId: this.$route.query.relatedIssueId ? parseInt(this.$route.query.relatedIssueId) : null
      })
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
      this.nugget.dueDate = date
      this.showDatepicker = false
      this.$refs.dueDate.focus()
      this.$v.nugget.dueDate.$touch()
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
    listAllNuggets () {
      this.Nugget.load().send().then(resp => {
        this.nuggets = resp.models
      })
    },
    ...mapMutations([
      'setNuggetsViewState'
    ]),
    ...mapActions([
      'listNuggets',
      'activateNugget'
    ])
  },
  async beforeMount () {
    this.nugget = new this.DraftNugget({
      projectId: this.selectedProject ? this.selectedProject.id : null
    })
    this.nugget.tags = []
    this.relatedIssueIds = this.$route.query.relatedIssueId ? [parseInt(this.$route.query.relatedIssueId)] : []
    await this.nugget.save().send()
  },
  mounted () {
    this.listAllNuggets()
  },
  components: {
    Loading,
    CustomDatepicker,
    Popup,
    ValidationMessage,
    Snackbar,
    Avatar
  }
}
</script>
