<template>
  <form id="updateWorkflowForm">

    <!-- HEADER -->

    <div class="header">
      <button
        type="button"
        class="secondary-button outlined"
        v-if="!$v.$anyDirty"
        :disabled="$v.workflow.description.$invalid"
        @click="$emit('showNewWorkflowForm')"
      >New workflow</button>
      <button
        type="button"
        class="secondary-button"
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
              v-for="(phase, index) in currentPhases"
              :key="phase.id"
            >

              <div class="phase-info">
                <div class="order-container">

                  <!-- PHASE ORDER INPUT -->

              <div class="input-container order">
                <label class="label">Order</label>
                <input
                  type="number"
                  class="light-primary-input"
                  v-model="currentPhases[index].order"
                  @input="$v.phase.order.$touch"
                >
                <!-- FIXME: Not implemented yet -->
                <!-- <validation-message
                  :validation="$v.phase.order"
                  :metadata="phaseMetadata.fields.order"
                /> -->
              </div>

                  <!-- PHASE NAME INPUT -->

              <div class="input-container name">
                <label class="label">Phase Name</label>
                <input
                  type="text"
                  class="light-primary-input"
                  v-model="currentPhases[index].title"
                  @input="$v.phase.title.$touch"
                >
                <!-- FIXME: Not implemented yet -->
                <!-- <validation-message
                  :validation="$v.phase.title"
                  :metadata="phaseMetadata.fields.title"
                /> -->
              </div>
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
                v-model="currentPhases[index].skillId"
                @input="$v.phase.skillId.$touch"
                :clearable="false"
              ></v-select>
              <!-- FIXME: Not implemented yet -->
              <!-- <validation-message
                  :validation="$v.phase.skillId"
                  :metadata="phaseMetadata.fields.skillId"
                /> -->
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
      initialPhases: [],
      currentPhases: [],
      workflowMetadata: server.metadata.models.Workflow,
      phaseMetadata: server.metadata.models.Phase
    }
  },
  computed: {
    ...mapState([
      'Workflow',
      'skills',
      'Phase'
    ])
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
    async update () {
      this.loading = true
      let jsonPatchRequest = server.jsonPatchRequest('')
      if (this.workflow.__status__ === 'dirty') {
        jsonPatchRequest.addRequest(this.workflow.save())
      }
      for (let phaseIndex in this.currentPhases) {
        for (let key in this.currentPhases[phaseIndex]) {
          if (this.initialPhases[phaseIndex][key] === this.currentPhases[phaseIndex][key]) {
            continue
          } else {
            let phaseUpdateRequest = (new this.Phase(this.currentPhases[phaseIndex])).updatePhase()
            jsonPatchRequest.addRequest(phaseUpdateRequest)
          }
        }
      }
      jsonPatchRequest.send().then(resps => {
        this.status = resps.status
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
        this.resetForms()
      })
    },
    resetForms () {
      this.$nextTick(() => { this.$v.$reset() })
    },
    async updateWorkflowList () {
      this.closeNewPhasePopup()
      await this.listWorkflows()
      await this.getWorkflow(this.workflow.id)
      this.$emit('phaseCreated', this.workflow)
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
      },
      phase: {
        title: this.phaseMetadata.fields.title.createValidator(),
        skillId: this.phaseMetadata.fields.skillId.createValidator(),
        order: this.phaseMetadata.fields.order.createValidator(),
        description: this.phaseMetadata.fields.description.createValidator()
      }
    }
  },
  props: {
    selectedWorkflow: Object
  },
  watch: {
    'selectedWorkflow': {
      immediate: true,
      handler (newValue) {
        if (newValue) {
          this.getWorkflow(newValue.id)
          this.initialPhases = []
          this.currentPhases = []
          for (let phase of this.selectedWorkflow.phases) {
            this.initialPhases.push(Object.assign({}, phase))
            this.currentPhases.push(Object.assign({}, phase))
          }
          this.resetForms()
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
