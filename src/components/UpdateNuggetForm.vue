<template>
  <form
    id="updateNuggetForm"
    v-on-clickout.capture="showPopup"
    @submit.prevent="update"
  >
    <div class="header">
      <button
        type="submit"
        class="light-primary-button small"
        v-if="nuggetChanged"
        :disabled="$v.nugget.$invalid"
      >
        <img
          src="./../assets/save.svg"
          class="save-icon"
        >
        Save
      </button>
      <button
        type="button"
        class="primary-button small"
        v-else
        @click="activateNugget({nugget: null})"
      >
        <img
          src="./../assets/plus.svg"
          class="plus-icon"
        >
        New Nugget
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
          @focus="$v.nugget.title.$reset"
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
          :clearable="!$v.nugget.status.required"
          :inputId="nuggetMetadata.fields.status.name"
        ></v-select>
        <validation-message
          :validation="$v.nugget.status"
          :metadata="nuggetMetadata.fields.status"
        />
      </div>

      <!-- PRIORITY -->

      <div class="input-container">
        <label
          :for="nuggetMetadata.fields.priority.name"
          class="label"
        >
          {{ nuggetMetadata.fields.priority.label }}
        </label>
        <v-select
          :options="priorities"
          v-model="nugget.priority"
          :clearable="!$v.nugget.priority"
          index="value"
          :inputId="nuggetMetadata.fields.priority.name"
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
          :inputId="nuggetMetadata.fields.tags.name"
          index="id"
          :clearable="!$v.nugget.tags.required"
          v-model="currentSelectedTags"
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
          for="relatedNuggets"
        >
          <!-- FIXME: Change this when metadata fixed! -->
          <!-- {{ nuggetMetadata.fields.relations.label }} -->
          Related Nuggets
        </label>
        <v-select
          :options="computedNuggets"
          inputId="relatedNuggets"
          index="id"
          :clearable="!$v.nugget.relations.required"
          v-model="currentRelatedNuggets"
          multiple
        ></v-select>
        <validation-message
          :validation="$v.nugget.relations"
          :metadata="nuggetMetadata.fields.relations"
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
            :value="formattedDueDate"
            @click="toggleDatepicker"
            @change="$v.nugget.dueDate.$touch"
            @keyup.enter="toggleDatepicker"
            :id="nuggetMetadata.fields.dueDate.name"
            readonly
            ref="dueDate"
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
          v-model="nugget.kind"
          :clearable="!$v.nugget.kind.required"
          index="value"
          :inputId="nuggetMetadata.fields.kind.name"
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

      <!-- PHASE -->

      <div class="input-container">
        <label
          :for="nuggetMetadata.fields.phaseId.name"
          id="phase"
        >
          <!-- FIXME: Change this when metadata fixed! -->
          <!-- {{ nuggetMetadata.fields.phaseId.label }} -->
          Phase
        </label>
        <v-select
          v-model="selectedPhase"
          label="title"
          :inputId="nuggetMetadata.fields.phaseId.name"
          :options="phasesOfSelectedWorkflow"
          index="id"
        ></v-select>
      </div>

      <!-- RESOURCE -->

      <div class="input-container">
        <label
          for="resource"
          id="resource"
        >
          <!-- FIXME: Change this when metadata fixed! -->
          <!-- {{ nuggetMetadata.fields.resourceId.label }} -->
          Resource
        </label>
        <v-select
          v-model="selectedResources"
          label="title"
          inputId="resource"
          :options="resources"
          index="id"
          ref="resources"
          multiple
        >
          <template slot="no-options">
            {{ noResourceMessage }}
          </template>
        </v-select>
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
            @keyup.ctrl.enter="update"
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
      <snackbar
        :status="status"
        :message="message"
        @close="clearMessage"
        v-on-clickout="clearMessage"
      ></snackbar>
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
import { mapState, mapActions } from 'vuex'
import server from './../server'
import CustomDatepicker from 'vue-custom-datepicker'
import moment from 'moment'
import { mixin as clickout } from 'vue-clickout'
import { updateList } from './../helpers.js'

const Popup = () => import(
  /* webpackChunkName: "Popup" */ './Popup'
)
const Snackbar = () => import(
  /* webpackChunkName: "Snackbar" */ './Snackbar'
)
const ValidationMessage = () => import(
  /* webpackChunkName: "ValidationMessage" */ './ValidationMessage'
)
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)

export default {
  mixins: [clickout],
  name: 'UpdateNuggetForm',
  data () {
    return {
      showingPopup: false,
      status: null,
      nugget: null,
      nuggets: [],
      initialTags: [],
      currentSelectedTags: [],
      intialRelatedNuggets: [],
      currentRelatedNuggets: [],
      showDatepicker: false,
      nuggetMetadata: server.metadata.models.Issue,
      message: null,
      loading: false,
      selectedPhase: null,
      resources: [],
      initialResources: [],
      selectedResources: [],
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
        title: this.nuggetMetadata.fields.title.createValidator(),
        description: this.nuggetMetadata.fields.description.createValidator(),
        status: this.nuggetMetadata.fields.status.createValidator(),
        dueDate: this.nuggetMetadata.fields.dueDate.createValidator(),
        kind: this.nuggetMetadata.fields.kind.createValidator(),
        priority: this.nuggetMetadata.fields.priority.createValidator(),
        projectId: this.nuggetMetadata.fields.projectId.createValidator(),
        tags: this.nuggetMetadata.fields.tags.createValidator(),
        relations: this.nuggetMetadata.fields.relations.createValidator()
      }
    }
  },
  computed: {
    computedNuggets () {
      return this.nuggets.reduce((accumulator, nugget) => {
        nugget.label = `#${nugget.id}`
        if (nugget.id !== this.nugget.id) {
          accumulator.push(nugget)
        }
        return accumulator
      }, [])
    },
    formattedDueDate () {
      return moment(this.nugget.dueDate).format('YYYY-MM-DD')
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
    tagsChanged () {
      let initialTags = [...this.initialTags].sort()
      let currentSelectedTags = [...this.currentSelectedTags].sort()
      return JSON.stringify(initialTags) !== JSON.stringify(currentSelectedTags)
    },
    nuggetsChanged () {
      let intialRelatedNuggets = [...this.intialRelatedNuggets].sort()
      let currentRelatedNuggets = [...this.currentRelatedNuggets].sort()
      return JSON.stringify(intialRelatedNuggets) !== JSON.stringify(currentRelatedNuggets)
    },
    isNewPhase () {
      return this.selectedPhase !== this.nugget.currentPhaseId && !this.initialResources.length && !this.selectedResources.length
    },
    resourceChanged () {
      let initialResources = [...this.initialResources].sort()
      let selectedResources = [...this.selectedResources].sort()
      return JSON.stringify(initialResources) !== JSON.stringify(selectedResources)
    },
    nuggetChanged () {
      return this.nugget.__status__ === 'dirty' || this.tagsChanged || this.resourceChanged || this.isNewPhase || this.nuggetsChanged
    },
    noResourceMessage () {
      return 'No resources'
    },
    ...mapState([
      'selectedNugget',
      'Nugget',
      'nuggetStatuses',
      'nuggetKinds',
      'nuggetPriorities',
      'selectedProject',
      'projects',
      'tags',
      'phasesOfSelectedWorkflow',
      'Phase',
      'nuggetsOfSelectedProject'
    ])
  },
  watch: {
    'selectedNugget.id' () {
      this.getSelectedNugget()
    },
    'selectedPhase' (newValue) {
      this.updateResources(newValue)
    }
  },
  methods: {
    async update () {
      this.loading = true
      let jsonPatchRequest = server.jsonPatchRequest(this.Nugget.__url__)
      for (let tag of this.tags) {
        if (this.initialTags.includes(tag.id) && !this.currentSelectedTags.includes(tag.id)) {
          jsonPatchRequest.addRequest(this.nugget.removeTag(tag.id))
        } else if (!this.initialTags.includes(tag.id) && this.currentSelectedTags.includes(tag.id)) {
          jsonPatchRequest.addRequest(this.nugget.addTag(tag.id))
        }
      }
      for (let nugget of this.computedNuggets) {
        if (!this.intialRelatedNuggets.includes(nugget.id) && this.currentRelatedNuggets.includes(nugget.id)) {
          jsonPatchRequest.addRequest(this.nugget.relateNugget(nugget.id))
        }
      }
      if (this.isNewPhase) {
        jsonPatchRequest.addRequest(this.nugget.assign(this.selectedPhase, null))
      } else if (this.resourceChanged) {
        for (let resource of this.resources) {
          if (this.initialResources.includes(resource.id) && !this.selectedResources.includes(resource.id)) {
            jsonPatchRequest.addRequest(this.nugget.unAssign(this.selectedPhase, resource.id))
          } else if (!this.initialResources.includes(resource.id) && this.selectedResources.includes(resource.id)) {
            jsonPatchRequest.addRequest(this.nugget.assign(this.selectedPhase, resource.id))
          }
        }
      }
      if (this.nugget.__status__ === 'dirty') {
        jsonPatchRequest.addRequest(this.nugget.save())
      }
      jsonPatchRequest.send()
        .then(async (resps) => {
          this.status = resps[0].status
          this.message = 'Your nugget was updated.'
          this.getSelectedNugget()
          await updateList(this.nuggetsOfSelectedProject, this.nugget)
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
    confirmPopup () {
      this.showingPopup = false
      this.getSelectedNugget()
    },
    cancelPopup () {
      this.showingPopup = false
    },
    showPopup () {
      if (this.tagsChanged || this.nugget.__status__ === 'dirty' || this.isResourceSelected) {
        this.showingPopup = true
      }
    },
    setDate (date) {
      // Checking if the date has been changed
      this.nugget.dueDate = moment(date).toISOString()
      this.showDatepicker = false
      this.$refs.dueDate.focus()
    },
    toggleDatepicker (value) {
      if (typeof value === 'boolean') {
        this.showDatepicker = value
      } else {
        this.showDatepicker = !this.showDatepicker
      }
    },
    async getSelectedNugget () {
      this.loading = true
      let resp = await this.Nugget.get(this.selectedNugget.id).send()
      this.nugget = resp.models[0]
      this.initialTags = this.nugget.tags.map(tag => tag.id)
      this.currentSelectedTags = [...this.initialTags]
      this.intialRelatedNuggets = this.nugget.relations.map(relation => relation.id)
      this.currentRelatedNuggets = [...this.intialRelatedNuggets]
      this.selectedPhase = this.nugget.currentPhaseId
      await this.updateResources(this.selectedPhase)
      this.loading = false
      return Promise.resolve(this.nugget)
    },
    async updateResources (phase) {
      this.resources = []
      this.initialResources = []
      this.selectedResources = []
      if (phase) {
        let phaseInstance = new this.Phase({ id: phase })
        let resp = await phaseInstance.listResources().send()
        console.log(resp.json)
        this.resources = resp.models
        this.initialResources = this.nugget.assignees[phase] || []
        this.selectedResources = [...this.initialResources]
      }
      return Promise.resolve(true)
    },
    clearMessage () {
      this.status = null
      this.message = null
    },
    listNuggets () {
      this.Nugget.load().send().then(resp => {
        this.nuggets = resp.models
      })
    },
    ...mapActions([
      'activateNugget'
    ])
  },
  components: {
    CustomDatepicker,
    Popup,
    ValidationMessage,
    Loading,
    Snackbar
  },
  beforeMount () {
    this.nugget = new this.Nugget()
  },
  mounted () {
    this.getSelectedNugget()
    this.listNuggets()
  }
}
</script>
