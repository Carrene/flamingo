<template>
  <form
    id="updateProjectForm"
    v-on-clickout.capture="showPopup"
    @submit.prevent="save"
    autocomplete="off"
  >
    <div class="header">
      <button
        type="button"
        class="secondary-button outlined"
        v-if="project.__status__ !== 'dirty'"
        @click="activateProject({project: null})"
      >
        <img
          src="./../assets/plus.svg"
          class="plus-icon"
        >
        New Project
      </button>
      <button
        type="submit"
        class="secondary-button"
        v-else
        :disabled="$v.project.$invalid"
      >
        <img
          src="./../assets/save-light.svg"
          class="save-icon"
        >
        Save
      </button>
      <avatar />
    </div>

    <div class="project-information content">

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
          @focus="$v.project.title.$reset"
          :class="{error: $v.project.title.$error}"
          :id="projectMetadata.fields.title.name"
        >
        <validation-message
          :validation="$v.project.title"
          :metadata="projectMetadata.fields.title"
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
          :inputId="projectMetadata.fields.status.name"
          :clearable="false"
          v-model="project.status"
          index="value"
        ></v-select>
        <validation-message
          :validation="$v.project.status"
          :metadata="projectMetadata.fields.status"
        />
      </div>

      <!-- MANAGER -->

      <div class="input-container">
        <label
          class="label"
          :for="projectMetadata.fields.managerId.name"
        >
          {{ projectMetadata.fields.managerId.label }}
        </label>
        <v-select
          :options="members"
          v-model="project.managerId"
          :clearable="!$v.project.managerId.required"
          index="id"
          label="title"
          :inputId="projectMetadata.fields.managerId.name"
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
            @keyup.ctrl.enter="save"
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
      v-if="showingPopup && $v.project.$anyDirty"
      :message="'Save changes?'"
      @confirm="confirmPopup"
      @cancel="cancelPopup"
    />
  </form>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { mixin as clickout } from 'vue-clickout'
import server from './../server'
import { updateModel } from './../helpers.js'
const Popup = () => import(
  /* webpackChunkName: "Popup" */ './Popup'
)
const ValidationMessage = () => import(
  /* webpackChunkName: "ValidationMessage" */ './ValidationMessage'
)
const Snackbar = () => import(
  /* webpackChunkName: "Snackbar" */ './Snackbar'
)
const Avatar = () => import(
  /* webpackChunkName: "Avarat" */ '../components/Avatar'
)

export default {
  mixins: [clickout],
  name: 'ProjectForm',
  data () {
    return {
      auth: server.authenticator,
      status: null,
      project: null,
      projectMetadata: server.metadata.models.Project,
      message: null,
      members: []
    }
  },
  validations () {
    return {
      project: {
        title: this.projectMetadata.fields.title.createValidator(),
        description: this.projectMetadata.fields.description.createValidator(),
        status: this.projectMetadata.fields.status.createValidator(),
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
      'selectedProject',
      'Project',
      'projectStatuses',
      'groups',
      'releases',
      'projects',
      'Organization',
      'showingPopup'
    ])
  },
  watch: {
    'selectedProject.id' () {
      this.getSelectedProject()
    }
  },
  methods: {
    confirmPopup () {
      this.setShowingPopup(false)
      this.save()
    },
    cancelPopup () {
      this.setShowingPopup(false)
      this.getSelectedProject()
    },
    showPopup () {
      if (this.project.__status__ === 'dirty') {
        this.setShowingPopup(true)
      }
    },
    save () {
      this.setGlobalLoading(true)
      this.project.save().send().then(async (resp) => {
        this.status = resp.status
        this.message = 'Your project was updated.'
        await updateModel(this.projects, this.project)
        await this.generateDecoratedProjects()
        this.listAllProjects({ forceUpdate: true })
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
        this.setGlobalLoading(false)
      })
    },
    async getSelectedProject () {
      this.setGlobalLoading(false)
      let response = await this.Project.get(this.selectedProject.id).send()
      this.project = response.models[0]
      this.setGlobalLoading(false)
    },
    clearMessage () {
      this.status = null
      this.message = null
    },
    ...mapActions([
      'activateProject',
      'generateDecoratedProjects',
      'listAllProjects'
    ]),
    ...mapMutations([
      'setGlobalLoading',
      'setShowingPopup'
    ])
  },
  beforeMount () {
    this.project = new this.Project()
    let organization = new this.Organization({
      id: this.auth.member.organizationId
    })
    organization.listMembers().send().then(resp => {
      this.members = resp.models
    })
  },
  mounted () {
    this.getSelectedProject()
  },
  components: {
    Popup,
    ValidationMessage,
    Snackbar,
    Avatar
  }
}
</script>
