<template>
  <form id="newWorkflowForm">

    <!-- HEADER -->

    <div class="header">
      <button
        type="button"
        class="secondary-button outlined small disabled"
      >Save</button>
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
    </div>
    <new-phase-popup v-if="showingNewPhasePopup" @close="closeNewPhasePopup()"/>
  </form>
</template>

<script>
const NewPhasePopup = () => import(
  /* webpackChunkName: "NewPhasePopup" */ '../components/NewPhasePopup'
)
export default {
  name: 'NewWorkflowForm',
  data () {
    return {
      showingNewPhasePopup: false
    }
  },
  methods: {
    closeNewPhasePopup () {
      this.showingNewPhasePopup = false
    }
  },
  components: {
    NewPhasePopup
  }
}
</script>
