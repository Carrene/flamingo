<template>
  <form id="updateWorkflowForm">

    <!-- HEADER -->

    <div class="header">
      <button
        type="button"
        class="secondary-button outlined small disabled"
      >New Workflow</button>
    </div>

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
        >
      </div>
      <div class="input-container">
        <label
          for="workflowName"
          class="label"
        >Workflow Description</label>
        <div class="textarea-container medium">
          <textarea class="light-primary-input"></textarea>
        </div>
        <!-- <p
          class="character-count"
          v-if="workflow.description"
        >
          {{ workflow.description.length }}/{{workflow.fields.description.maxLength }}
        </p> -->
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: 'UpdateWorkflowForm',
  data () {
    return {
    }
  }
}
</script>
