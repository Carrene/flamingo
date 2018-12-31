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
          v-model="selectedPhaseId"
          label="title"
          index="id"
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
          v-model="selectedResourceId"
          label="title"
          index="id"
          inputId="resource"
          :options="resources"
        ></v-select>
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
      selectedPhaseId: null,
      resources: [],
      selectedResourceId: null,
      status: null,
      message: null
    }
  },
  computed: {
    ...mapState([
      'selectedNugget',
      'selectedProject',
      'Organization',
      'phasesOfSelectedWorkflow'
    ])
  },
  methods: {
    closeModal (value = 'cancel', error) {
      this.$emit('close', value, error)
    },
    async listResources () {
      let organization = new this.Organization({ id: server.authenticator.member.organizationId })
      let resp = await organization.listMembers().send()
      this.resources = resp.json
    },
    assign () {
      this.status = null
      this.message = null
      this.selectedNugget.assign(this.selectedPhaseId, this.selectedResourceId).send().then(resp => {
        this.closeModal('confirm')
      }).catch(err => {
        this.closeModal('cancel', err)
      })
    }
  },
  async beforeMount () {
    await this.listResources()
    this.$refs.dialog.showModal()
  },
  mounted () {
    this.$refs.form.focus()
  },
  components: {
    ValidationMessage
  }
}
</script>
