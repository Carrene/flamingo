<template>
  <div id="workflows">

    <!-- LEFT COLUMN -->

    <div class="left-column">

      <!-- HEADER -->

      <div class="header">
        <p class="title">Workflows</p>
      </div>

      <div class="content">
        <div class="table-box">

          <table class="table">

            <thead class="table-header">

              <tr class="row">

                <th
                  v-for="header in headers"
                  :key="header.label"
                  class="cell"
                >
                  <div class="title-container">
                    <p
                      :title="header.label"
                      :class="header.className"
                    >{{ header.label }}</p>
                  </div>
                </th>

              </tr>

            </thead>

            <tbody class="table-content">
              <tr
                class="row"
                v-for="workflow in workflows"
                :key="workflow.id"
                :class="{'selected-workflow': selectedWorkflow && (workflow.id === selectedWorkflow.id)}"
                @click="selectWorkflow(workflow)"
              >
                <td class="workflow-name cell">{{ workflow.title }}</td>
                <td class="workflow-phases cell">
                  <div
                    class="workflow-phases-card"
                    v-for="phase in workflow.phases"
                    :key="phase.id"
                  >
                    <p>{{ phase.title || '-' }}</p>
                  </div>
                </td>
                <td class="workflow-description cell">{{ workflow.description || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- WORKFLOW FORMS -->

    <div class="right-column">
      <update-workflow-form
        class="form"
        v-if="selectedWorkflow"
        :selectedWorkflow="selectedWorkflow"
        @showNewWorkflowForm="showNewWorkflowForm"
        @phaseCreated="refreshPhaseList"
      />
      <new-workflow-form
        class="form"
        v-else
        @created="selectWorkflow"
      />
    </div>
  </div>
</template>

<script>
import server from '../server'
import { mapState, mapActions } from 'vuex'
const UpdateWorkflowForm = () => import(
  /* webpackChunkName: "UpdateWorkflowForm" */ '../components/UpdateWorkflowForm'
)
const NewWorkflowForm = () => import(
  /* webpackChunkName: "NewWorkflowForm" */ '../components/NewWorkflowForm'
)

export default {
  name: 'Workflows',
  data () {
    return {
      workflowMetadata: server.metadata.models.Workflow,
      selectedWorkflow: null
    }
  },
  computed: {
    headers () {
      return [
        {
          label: this.workflowMetadata.fields.title.label,
          field: 'workflowName',
          className: 'workflow-name'
        },
        {
          label: this.workflowMetadata.fields.phases.label,
          field: 'phases',
          className: 'workflow-Phases'
        },
        {
          label: this.workflowMetadata.fields.description.label,
          field: 'workflowDescription',
          className: 'workflow-description'
        }
      ]
    },
    ...mapState([
      'workflows'
    ])
  },
  methods: {
    selectWorkflow (workflow = null) {
      this.selectedWorkflow = workflow
    },
    showNewWorkflowForm () {
      this.selectWorkflow(null)
    },
    refreshPhaseList (workflow) {
      this.selectWorkflow(null)
      this.selectWorkflow(workflow)
    },
    ...mapActions([
      'listWorkflows'
    ])
  },
  components: {
    UpdateWorkflowForm,
    NewWorkflowForm
  },
  async beforeMount () {
    await this.listWorkflows()
    this.selectWorkflow(this.workflows[0])
  }
}
</script>
