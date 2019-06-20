<template>
  <form id="newWorkflowForm">

    <!-- HEADER -->

    <div class="header">
      <button
        type="button"
        class="secondary-button small disabled"
        @click="create"
        :disabled="$v.workflow.$invalid"
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
          :class="{error: $v.workflow.description.$error}"
        >{{ workflowMetadata.fields.description.label }}</label>
        <div class="textarea-container medium">
          <textarea
            class="light-primary-input"
            v-model="workflow.description"
            @input="$v.workflow.description.$touch"
            @keyup.ctrl.enter="create"
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
    </div>
  </form>
</template>

<script>
import server from '../server'
import { mapState, mapActions } from 'vuex'
import { mixin as clickout } from 'vue-clickout'
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
  name: 'NewWorkflowForm',
  mixins: [clickout],
  data () {
    return {
      workflow: null,
      loading: false,
      status: null,
      message: null,
      workflowMetadata: server.metadata.models.Workflow
    }
  },
  computed: {
    ...mapState([
      'Workflow'
    ])
  },
  methods: {
    clearMessage () {
      this.status = null
      this.message = null
    },
    create () {
      this.loading = true
      this.workflow.save().send().then(async (resp) => {
        this.status = resp.status
        this.message = 'Your workflow was updated.'
        await this.listWorkflows()
        this.$emit('created', resp.models[0])
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
