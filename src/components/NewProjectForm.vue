<template>
  <form
    id="newProjectForm"
    v-on-clickout.capture="showPopup"
    @submit.prevent="create"
    autocomplete="off"
  >

    <!--HEADER-->

    <div class="header">
      <button
        type="submit"
        class="secondary-button outlined"
        :disabled="$v.project.$invalid"
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
          :for="projectMetadata.fields.title.name"
        >
          {{ projectMetadata.fields.title.label }}
        </label>
        <input
          type="text"
          class="light-primary-input"
          v-model.trim="project.title"
          @input="$v.project.title.$touch"
          :class="{error: $v.project.title.$error}"
          :id="projectMetadata.fields.title.name"
        >
        <validation-message
          :validation="$v.project.title"
          :metadata="projectMetadata.fields.title"
        />
      </div>

      <!-- WORKFLOW -->

      <div class="input-container">
        <label
          :for="projectMetadata.fields.workflowId.name"
          id="workflow"
        >
          {{ projectMetadata.fields.workflowId.label }}
        </label>
        <v-select
          :options="workflows"
          label="title"
          index="id"
          :inputId="projectMetadata.fields.workflowId.name"
          :clearable="!$v.project.workflowId.required"
          v-model="project.workflowId"
        ></v-select>
        <validation-message
          :validation="$v.project.workflowId"
          :metadata="projectMetadata.fields.workflowId"
        />
      </div>

      <!-- RELEASE -->

      <div class="input-container">
        <label
          :for="projectMetadata.fields.releaseId.name"
          class="label"
        >
          {{ projectMetadata.fields.releaseId.label }}
        </label>
        <v-select
          :options="releases"
          index="id"
          label="title"
          :inputId="projectMetadata.fields.releaseId.name"
          :clearable="!$v.project.releaseId.required"
          v-model="project.releaseId"
        ></v-select>
        <validation-message
          :validation="$v.project.releaseId"
          :metadata="projectMetadata.fields.releaseId"
        />
      </div>

      <!-- GROUP -->

      <div class="input-container">
        <label
          :for="projectMetadata.fields.groupId.name"
          id="group"
        >
          {{ projectMetadata.fields.groupId.label }}
        </label>
        <v-select
          :options="groups"
          label="title"
          index="id"
          :inputId="projectMetadata.fields.groupId.name"
          :clearable="!$v.project.groupId.required"
          v-model="project.groupId"
        ></v-select>
        <validation-message
          :validation="$v.project.groupId"
          :metadata="projectMetadata.fields.groupId"
        />
      </div>

      <!-- STATUS -->

      <div class="input-container">
        <label
          class="label"
          :for="projectMetadata.fields.status.name"
        >
          {{ projectMetadata.fields.status.label }}
        </label>
        <v-select
          :options="statuses"
          v-model="project.status"
          :clearable="!$v.project.status.required"
          index="value"
          :inputId="projectMetadata.fields.status.name"
        ></v-select>
        <validation-message
          :validation="$v.project.status"
          :metadata="projectMetadata.fields.status"
        />
      </div>

      <!-- FIXME: Make a decision between manager id and manager reference id -->

      <!-- MANAGER -->

      <div class="input-container">
        <label
          class="label"
          :for="projectMetadata.fields.managerTitle.name"
        >
          {{ projectMetadata.fields.managerTitle.label }}
        </label>
        <v-select
          :options="members"
          v-model="project.managerId"
          :clearable="!$v.project.managerId.required"
          index="id"
          label="title"
          :inputId="projectMetadata.fields.managerTitle.name"
        ></v-select>
        <validation-message
          :validation="$v.project.managerId"
          :metadata="projectMetadata.fields.managerId"
        />
      </div>

      <!-- SECONDARY MANAGER -->

      <div class="input-container">
        <label
          class="label"
          :for="projectMetadata.fields.secondaryManagerId.name"
        >
          {{ projectMetadata.fields.secondaryManagerId.label }}
        </label>
        <v-select
          :options="members"
          v-model="project.secondaryManagerId"
          :clearable="true"
          index="id"
          label="title"
          :inputId="projectMetadata.fields.secondaryManagerId.name"
        ></v-select>
        <validation-message
          :validation="$v.project.secondaryManagerId"
          :metadata="projectMetadata.fields.secondaryManagerId"
        />
      </div>

      <!-- DESCRIPTION -->

      <div class="input-container">
        <label
          class="label"
          :class="{error: $v.project.description.$error}"
          :for="projectMetadata.fields.description.name"
        >
          {{ projectMetadata.fields.description.label }}
        </label>
        <div class="textarea-container large">
          <textarea
            class="light-primary-input"
            v-model.trim="project.description"
            @input="$v.project.description.$touch"
            :class="{error: $v.project.description.$error}"
            :id="projectMetadata.fields.description.name"
            @keyup.ctrl.enter="create"
          ></textarea>
          <p
            class="character-count"
            v-if="project.description"
          >
            {{ project.description.length }}/{{ projectMetadata.fields.description.maxLength }}
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
const Avatar = () => import(
  /* webpackChunkName: "Avarat" */ '../components/Avatar'
)

export default {
  mixins: [clickout],
  name: 'NewProjectForm',
  data () {
    return {
      auth: server.authenticator,
      showingPopup: false,
      status: null,
      project: null,
      members: [],
      myId: null,
      projectMetadata: server.metadata.models.Project,
      loading: false,
      message: null
    }
  },
  validations () {
    return {
      project: {
        title: this.projectMetadata.fields.title.createValidator(),
        description: this.projectMetadata.fields.description.createValidator(),
        status: this.projectMetadata.fields.status.createValidator(),
        workflowId: this.projectMetadata.fields.workflowId.createValidator(),
        groupId: this.projectMetadata.fields.groupId.createValidator(),
        releaseId: this.projectMetadata.fields.releaseId.createValidator(),
        managerId: this.projectMetadata.fields.managerId.createValidator(),
        secondaryManagerId: this.projectMetadata.fields.secondaryManagerId.createValidator()
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
      'Project',
      'selectedProject',
      'projectStatuses',
      'workflows',
      'groups',
      'selectedRelease',
      'releases',
      'Member',
      'Organization'
    ])
  },
  methods: {
    async confirmPopup () {
      this.showingPopup = false
      this.project = new this.Project({
        releaseId: this.selectedRelease ? this.selectedRelease.id : null,
        managerId: this.myId
      })
      this.$v.project.$reset()
      this.loading = true
      await this.listProjects()
      this.loading = false
    },
    cancelPopup () {
      this.showingPopup = false
    },
    showPopup () {
      if (this.$v.project.$anyDirty) {
        this.showingPopup = true
      }
    },
    async create () {
      this.loading = true
      try {
        let response = await this.project.save().send()
        this.status = response.status
        this.message = 'Your project was created.'
        await this.listProjects(response.json.id)
        this.activateProject({ project: this.selectedProject })
        if (!this.selectedProject) {
          this.confirmPopup()
        }
      } catch (err) {
        this.status = err.status
        this.message = err.error
      }
      this.loading = false
      setTimeout(() => {
        this.clearMessage()
      }, 3000)
    },
    clearMessage () {
      this.status = null
      this.message = null
    },
    ...mapActions([
      'listProjects',
      'activateProject'
    ])
  },
  beforeMount () {
    let organization = new this.Organization({
      id: this.auth.member.organizationId
    })
    organization.listMembers().send().then(resp => {
      this.members = resp.models
      this.myId = this.members
        .find(member => member.referenceId === this.auth.member.referenceId)
        .id
      this.project.managerId = this.myId
    })
    this.project = new this.Project({
      releaseId: this.selectedRelease ? this.selectedRelease.id : null,
      managerId: this.myId
    })
  },
  components: {
    ValidationMessage,
    Popup,
    Loading,
    Snackbar,
    Avatar
  }
}
</script>
