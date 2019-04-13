<template>
  <form id="updateWorkflowForm">

    <!-- HEADER -->

    <div class="header">
      <button
        type="button"
        class="secondary-button outlined"
        v-if="workflow.__status__ !== 'dirty'"
        @click="$emit('showNewWorkflowForm')"
      >New workflow</button>
      <button
        type="button"
        class="secondary-button outlined small"
        @click="save"
        v-else
      >Save</button>
    </div>

    <!-- LOADING -->

    <loading v-if="loading" />

    <!-- CONTENT -->

    <div class="content">
      <div class="input-container">
        <label
          for="workflowName"
          class="label"
        >Workflow Name</label>
        <input
          type="text"
          class="light-primary-input"
          v-model="workflow.title"
        >
        <validation-message
          :validation="$v.workflow.title"
          :metadata="workflowMetadata.fields.title"
        />
      </div>
      <div class="input-container">
        <label
          for="workflowName"
          class="label"
        >{{ workflowMetadata.fields.description.label }}</label>
        <div class="textarea-container medium">
          <textarea
            class="light-primary-input"
            v-model="workflow.description"
          ></textarea>
        </div>
        <!-- FIXME: NOT IMPLEMENTED YET -->
        <!-- <p
          class="character-count"
          v-if="workflow.description"
        >
          {{ workflow.description.length }}/{{workflow.fields.description.maxLength }}
        </p> -->
        <validation-message
          :validation="$v.workflow.description"
          :metadata="workflowMetadata.fields.description"
        />
      </div>

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

        <div class="phase-list">

          <div class="phase-info">

            <div class="input-container order">
              <label class="label">Order</label>
              <input
                type="number"
                class="light-primary-input"
              >
            </div>
            <div class="input-container">
              <label class="label">Phase Name</label>
              <input
                type="text"
                class="light-primary-input"
              >
            </div>
            <div class="input-container associated-skills">
              <label class="label">Associated Skills</label>
              <input
                type="text"
                class="light-primary-input"
              >
            </div>

          </div>

        </div>
      </div>
      <snackbar
        :status="status"
        :message="message"
        @close="clearMessage"
        v-on-clickout="clearMessage"
      ></snackbar>
    </div>
    <new-phase-popup
      v-if="showingNewPhasePopup"
      @close="closeNewPhasePopup()"
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
      workflowMetadata: server.metadata.models.Workflow
    }
  },
  computed: {
    ...mapState([
      'Workflow'
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
    save () {
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
    ...mapActions([
      'listWorkflows'
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
  }
}
</script>
