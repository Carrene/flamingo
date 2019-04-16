<template>
  <form id="updateWorkflowForm">

    <!-- HEADER -->

    <div class="header">
      <button
        type="button"
        class="secondary-button outlined"
        v-if="workflow.__status__ !== 'dirty'"
        :disabled="$v.workflow.description.$invalid"
        @click="$emit('showNewWorkflowForm')"
      >New workflow</button>
      <button
        type="button"
        class="secondary-button outlined small"
        @click="update"
        v-else
      >Save</button>
    </div>

    <!-- LOADING -->

    <loading v-if="loading" />

    <!-- CONTENT -->

    <div class="content">

      <!-- NAME INPUT -->

      <div class="input-container">
        <label
          for="workflowName"
          class="label"
          :class="{error: $v.workflow.description.$error}"
        >Workflow Name</label>
        <input
          type="text"
          class="light-primary-input"
          :class="{error: $v.workflow.title.$error}"
          v-model.trim="workflow.title"
          @input="$v.workflow.title.$touch"
          @focus="$v.workflow.title.$reset"
        >
        <validation-message
          :validation="$v.workflow.title"
          :metadata="workflowMetadata.fields.title"
        />
      </div>

      <!-- DESCRIPTION -->

      <div class="input-container">
        <label
          for="workflowName"
          class="label"
        >{{ workflowMetadata.fields.description.label }}</label>
        <div class="textarea-container medium">
          <textarea
            class="light-primary-input"
            v-model.trim="workflow.description"
            @input="$v.workflow.description.$touch"
            @keyup.ctrl.enter="update"
            @focus="$v.workflow.title.$reset"
          ></textarea>
          <p
            class="character-count"
            v-if="workflow.description"
          >
            {{ workflow.description.length }}/{{ workflowMetadata.fields.description.maxLength }}
          </p>
          <validation-message
            :validation="$v.workflow.description"
            :metadata="workflowMetadata.fields.description"
          />
        </div>
      </div>

      <!-- PHASE FORM -->

      <div class="phases-form">
        <div class="action">
          <p>Phases</p>
          <simple-svg
            :filepath="require('@/assets/plus.svg')"
            fill="#008290"
            class="plus-button"
            @click.native="showingNewPhasePopup = true"
          />
        </div>
        <div class="phase-container">
          <div
            class="phase-list"
            v-for="phase in decoratedPhases"
            :key="phase.id"
          >

            <!-- PHASE LIST -->

            <div
              class="phase-list"
              v-for="phase in decoratedPhases"
              :key="phase.id"
            >

              <div class="input-container order">
                <label class="label">Order</label>
                <input
                  type="number"
                  class="light-primary-input"
                  :value="phase.order"
                  readonly
                >
              </div>
              <div class="input-container">
                <label class="label">Phase Name</label>
                <input
                  type="text"
                  class="light-primary-input"
                  :value="phase.title"
                  readonly
                >
              </div>
              <div class="input-container associated-skills">
                <label class="label">Associated Skills</label>
                <input
                  type="text"
                  class="light-primary-input"
                  :value="phase.skillTitle"
                  readonly
                >
              </div>

              <!-- PHASE ORDER INPUT -->

              <div class="input-container order">
                <label class="label">Order</label>
                <input
                  type="number"
                  class="light-primary-input"
                  :value="phase.order"
                  readonly
                >
              </div>

              <!-- PHASE NAME INPUT -->

              <div class="input-container">
                <label class="label">Phase Name</label>
                <input
                  type="text"
                  class="light-primary-input"
                  :value="phase.title"
                  readonly
                >
              </div>

              <!-- PHASE SKILL FORM -->

              <div class="input-container associated-skills">
                <label
                  class="label"
                  :for="phaseMetadata.fields.skillId.label"
                >{{ phaseMetadata.fields.skillId.label }}</label>
                <v-select
                  :options="skills"
                  label="title"
                  index="id"
                  v-model="phase.skillId"
                ></v-select>
              </div>
            </div>
          </div>
        </div>

        <!-- SNACK BAR -->

        <snackbar
          :status="status"
          :message="message"
          @close="clearMessage"
          v-on-clickout="clearMessage"
        ></snackbar>
      </div>

      <!-- NEW PHASE POPUP -->

      <new-phase-popup
        v-if="showingNewPhasePopup"
        @close="closeNewPhasePopup()"
        @created="updateWorkflowList()"
        :selectedWorkflow="selectedWorkflow"
      />
  </form>
</template>

<script>
import server from '../server'
import { mixin as clickout } from 'vue-clickout'
import { mapState, mapActions } from 'vuex'
import db from '../localdb'
const NewPhasePopup = () => import(
  /* webpackChunkName: "NewPhasePopup" */ '../components/NewPhasePopup'
)
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)
const ValidationMessage = () => import(
  /* webpackChunkName: "ValidationMessage" */ './ValidationMessage'
)
const Snackbar = () => import(
  /* webpackChunkName: "Snackbar" */ './Snackbar'
)
export default {
  name: 'UpdateWorkflowForm',
  mixins: [clickout],
  data () {
    return {
      workflow: null,
      loading: false,
      status: null,
      message: null,
      showingNewPhasePopup: false,
      workflowMetadata: server.metadata.models.Workflow,
      phaseMetadata: server.metadata.models.Phase
    }
  },
  computed: {
    ...mapState([
      'Workflow',
      'workflows',
      'Skill',
      'Phase',
      'skills'
    ])
  },
  asyncComputed: {
    async decoratedPhases () {
      if (!this.selectedWorkflow.phases) {
        return []
      }
      return Promise.all(this.selectedWorkflow.phases.map(async (item) => {
        let phase = new this.Phase(item)
        let skillTitle = '-'
        if (item.skillId) {
          skillTitle = await this.getSkillTitle(item.skillId)
        }
        phase.skillTitle = skillTitle
        return phase
      }))
    }
  },
  methods: {
    closeNewPhasePopup () {
      this.showingNewPhasePopup = false
    },
    async getWorkflow (workflowId) {
      let response = await this.Workflow.get(workflowId).send()
      this.workflow = response.models[0]
    },
    clearMessage () {
      this.status = null
      this.message = null
    },
    update () {
      this.loading = true
      this.workflow.save().send().then(async (resp) => {
        this.status = resp.status
        this.message = 'Your workflow was updated.'
        this.listWorkflows()
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
    updateWorkflowList () {
      this.closeNewPhasePopup()
      this.listWorkflows()
    },
    async getSkillTitle (id) {
      let record = await db.read('skills', id)
      if (!record) {
        let resp = await this.Skill.get(id).send()
        try {
          await db.add('skills', resp.json.id, resp.json.title)
        } catch (error) { } finally {
          record = await db.read('skills', id)
        }
      }
      return record.value
    },
    ...mapActions([
      'listWorkflows',
      'listSkills'
    ])
  },
  validations () {
    return {
      workflow: {
        title: this.workflowMetadata.fields.title.createValidator(),
        description: this.workflowMetadata.fields.description.createValidator()
      }
    }
  },
  props: {
    selectedWorkflow: Object
  },
  watch: {
    'selectedWorkflow.id': {
      immediate: true,
      handler (newValue) {
        if (newValue) {
          this.getWorkflow(newValue)
        }
      }
    }
  },
  components: {
    NewPhasePopup,
    Loading,
    ValidationMessage,
    Snackbar
  },
  beforeMount () {
    this.workflow = new this.Workflow()
    this.listSkills()
  }
}
</script>
