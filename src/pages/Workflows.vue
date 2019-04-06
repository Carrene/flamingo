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
              <tr class="row"
                  v-for="workflow in workflows"
                  :key="workflow.id"
              >
                <td class="workflow-name cell">{{ workflow.title}}</td>
                <td class="workflow-phases cell">
                  <div class="workflow-phases-card">
                    <p>{{ workflow.phases }}</p>
                  </div>
                </td>
                <!-- FIXME: Get description from metadata when it was ready -->
                <td class="workflow-description cell">lorem</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- WORKFLOW FORMS -->

    <div class="right-column">
      <new-workflow-form
        class="form"
        v-if="showingNewWorkflowForm"
      />
      <update-workflow-form
        class="form"
        v-else
      />
    </div>
  </div>
</template>

<script>
import server from '../server'
import { mapState } from 'vuex'
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
      showingNewWorkflowForm: false,
      workflowMetadata: server.metadata.models.Workflow
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
        // FIXME: Get label from metadata when it was ready.
        {
          label: 'Workflow Description',
          field: 'workflowDescription',
          className: 'workflow-description'
        }
      ]
    },
    ...mapState([
      'workflows'
    ])
  },
  components: {
    UpdateWorkflowForm,
    NewWorkflowForm
  }
}
</script>
