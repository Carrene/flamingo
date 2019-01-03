<template>
  <dialog
    id="assign"
    ref="dialog"
    @cancel="closeModal"
  >
    <form
      method="dialog"
      class="form"
      tabindex="-1"
      ref="form"
      @submit.prevent="assign"
      v-on-clickout="closeModal"
    >

      <!-- PHASES -->

      <div class="input-container">
        <label
          for="phase"
          id="phase"
        >{{ nuggetMetadata.fields.phaseId.label }}</label>
        <v-select
          v-model="selectedPhase"
          label="title"
          inputId="phase"
          :options="phasesOfSelectedWorkflow"
          :clearable='false'
        ></v-select>
      </div>

      <!-- RESOURCES -->

      <div class="input-container">
        <label
          for="resource"
          id="resource"
        >Resource</label>
        <v-select
          v-model="selectedResource"
          label="title"
          inputId="resource"
          :options="resources"
          ref="resources"
        >
          <template slot="no-options">
            {{ noResourceMessage }}
          </template>
        </v-select>
      </div>
      <div class="actions">
        <button
          type="button"
          class="light-primary-button small"
          @click="closeModal"
        >Cancel</button>
        <button
          type="submit"
          class="primary-button small"
          :disabled="isAssignDisabled"
        >Assign</button>
      </div>
    </form>
  </dialog>
</template>

<script>
import { mapState } from 'vuex'
import server from './../server.js'
import { mixin as clickout } from 'vue-clickout'

const ValidationMessage = () => import(
  /* webpackChunkName: "ValidationMessage" */ './ValidationMessage'
)

export default {
  mixins: [clickout],
  name: 'Assign',
  data () {
    return {
      nuggetMetadata: server.metadata.models.Issue,
      phaseMetadata: server.metadata.models.Phase,
      selectedPhase: null,
      resources: [],
      selectedResource: null,
      status: null,
      message: null,
      loading: false
    }
  },
  computed: {
    noResourceMessage () {
      return this.selectedPhase ? `${this.selectedPhase.title} has no resources` : 'Please select a phase first'
    },
    isAssignDisabled () {
      return !this.selectedPhase || !this.selectedResource
    },
    ...mapState([
      'selectedNugget',
      'selectedProject',
      'Organization',
      'phasesOfSelectedWorkflow',
      'Phase'
    ])
  },
  watch: {
    'selectedPhase': {
      deep: true,
      handler (newValue) {
        this.resources = []
        this.selectedResource = null
        this.listResources()
      }
    }
  },
  methods: {
    closeModal (value = 'cancel', error) {
      this.$emit('close', value, error)
    },
    async listResources () {
      this.$refs.resources.toggleLoading()
      this.selectedPhase.listResources().send().then(resp => {
        this.resources = resp.models
        this.$refs.resources.toggleLoading()
      })
    },
    assign () {
      this.status = null
      this.message = null
      this.selectedNugget.assign(this.selectedPhase.id, this.selectedResource.id).send().then(resp => {
        this.closeModal('confirm')
      }).catch(err => {
        this.closeModal('cancel', err)
      })
    }
  },
  mounted () {
    this.$refs.dialog.showModal()
    this.$refs.form.focus()
  },
  components: {
    ValidationMessage
  }
}
</script>
