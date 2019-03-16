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
              <tr class="row">
                <td class="workflow-name cell">lorem</td>
                <td class="workflow-phases cell">lorem</td>
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
      showingNewWorkflowForm: false
    }
  },
  computed: {
    headers () {
      return [
        {
          label: 'Workflow Name',
          field: 'workflowName',
          className: 'workflow-name'
        },
        {
          label: 'Phases',
          field: 'phases',
          className: 'workflow-Phases'
        },
        {
          label: 'Workflow escription',
          field: 'workflowDescription',
          className: 'workflow-description'
        }
      ]
    }
  },
  components: {
    UpdateWorkflowForm,
    NewWorkflowForm
  }
}
</script>
