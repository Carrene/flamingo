<template>
  <form
    id="newProjectForm"
    v-on-clickout.capture="showPopup"
    @submit.prevent="create"
  >

    <!--HEADER-->

    <div class="header">
      <button
        type="submit"
        class="light-primary-button small"
        :disabled="$v.project.$invalid"
      >
        <img
          src="./../assets/save.svg"
          class="save-icon"
        >
        Save
      </button>
    </div>

    <loading v-if="loading" />

    <!--FORM-->

    <div
      class="project-information content"
      v-else
    >

      <!-- PROJECT TITLE -->

      <div class="input-container">
        <label
          class="label"
          :class="{error: $v.project.title.$error}"
        >
          {{ projectMetadata.fields.title.label }}
        </label>
        <input
          type="text"
          class="light-primary-input"
          v-model.trim="project.title"
          @input="$v.project.title.$touch"
          :class="{error: $v.project.title.$error}"
        >
        <validation-message
          :validation="$v.project.title"
          :metadata="projectMetadata.fields.title"
        />
      </div>

      <!-- RELEASE -->

      <div class="input-container">
        <label
          class="label"
          for="release"
        >
          {{ projectMetadata.fields.releaseId.label }}
        </label>
        <v-select
          :options="releases"
          label="title"
          v-model="project.releaseId"
          index="id"
          inputId="release"
        ></v-select>
        <validation-message
          :validation="$v.project.releaseId"
          :metadata="projectMetadata.fields.releaseId"
        />
      </div>

      <!-- STATUS -->

      <div class="input-container">
        <label
          class="label"
          for="status"
        >
          {{ projectMetadata.fields.status.label }}
        </label>
        <v-select
          :options="statuses"
          v-model="project.status"
          :clearable="!$v.project.status.required"
          index="value"
          inputId="status"
        ></v-select>
        <validation-message
          :validation="$v.project.status"
          :metadata="projectMetadata.fields.status"
        />
      </div>

      <!-- WORKFLOW -->

      <div class="input-container">
        <label
          for="workflow"
          id="workflow"
        >
          {{ projectMetadata.fields.workflowId.label }}
        </label>
        <v-select
          :options="workflows"
          label="title"
          index="id"
          inputId="workflow"
          :clearable="!$v.project.workflowId.required"
          v-model="project.workflowId"
        ></v-select>
        <validation-message
          :validation="$v.project.workflowId"
          :metadata="projectMetadata.fields.workflowId"
        />
      </div>

      <!-- GROUP -->

      <div class="input-container">
        <label
          for="group"
          id="group"
        >
          {{ projectMetadata.fields.groupId.label }}
        </label>
        <v-select
          :options="groups"
          label="title"
          index="id"
          inputId="group"
          :clearable="!$v.project.groupId.required"
          v-model="project.groupId"
        ></v-select>
        <validation-message
          :validation="$v.project.groupId"
          :metadata="projectMetadata.fields.groupId"
        />
      </div>

      <!-- DESCRIPTION -->

      <div class="input-container">
        <label
          class="label"
          :class="{error: $v.project.description.$error}"
        >
          {{ projectMetadata.fields.description.label }}
        </label>
        <div class="textarea-container large">
          <textarea
            class="light-primary-input"
            v-model.trim="project.description"
            @input="$v.project.description.$touch"
            :class="{error: $v.project.description.$error}"
            @keyup.ctrl.enter="create"
          ></textarea>
          <p
            class="character-count"
            v-if="project.description"
          >
            {{ project.description.length }}/512
          </p>
        </div>
        <validation-message
          :validation="$v.project.description"
          :metadata="projectMetadata.fields.description"
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
      :message="'Leave new project view?'"
      @confirm="confirmPopup"
      @cancel="cancelPopup"
    />
  </form>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { mixin as clickout } from 'vue-clickout'
import server from './../server'
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
  name: 'NewProjectForm',
  data () {
    return {
      showingPopup: false,
      status: null,
      project: null,
      projectMetadata: server.metadata.models.Project,
      selectedRelease: null,
      loading: false,
      message: null
    }
  },
  validations () {
    return {
      project: {
        title: this.projectMetadata.fields.title.createValidator(),
        description: this.projectMetadata.fields.description.createValidator(),
        releaseId: this.projectMetadata.fields.releaseId.createValidator(),
        status: this.projectMetadata.fields.status.createValidator(),
        workflowId: this.projectMetadata.fields.workflowId.createValidator(),
        groupId: this.projectMetadata.fields.groupId.createValidator()
      }
    }
  },
  computed: {
    statuses () {
      return this.projectStatuses.map(status => {
        return {
          label: status.formatText(),
          value: status
        }
      })
    },
    ...mapState([
      'releases',
      'Project',
      'Release',
      'projectStatuses',
      'workflows',
      'groups'
    ])
  },
  methods: {
    confirmPopup () {
      this.showingPopup = false
      this.project = new this.Project()
      this.$v.project.$reset()
      this.loading = true
      this.listProjects([undefined, () => {
        this.loading = false
      }])
    },
    cancelPopup () {
      this.showingPopup = false
    },
    showPopup () {
      if (this.$v.project.$anyDirty) {
        this.showingPopup = true
      }
    },
    create () {
      this.loading = true
      this.project.save().send().then(resp => {
        this.status = resp.status
        this.message = 'Your project was created.'
        this.listProjects([resp.json.id])
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
        this.loading = false
      })
    },
    clearMessage () {
      this.status = null
      this.mesasge = null
    },
    ...mapActions([
      'listProjects'
    ])
  },
  beforeMount () {
    this.project = new this.Project()
    this.selectedRelease = new this.Release()
  },
  components: {
    ValidationMessage,
    Popup,
    Loading,
    Snackbar
  }
}
</script>
