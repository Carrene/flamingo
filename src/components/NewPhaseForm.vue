<template>
  <form id="updatePhaseForm">

    <!-- HEADER -->

    <div class="header">
      <button
        type="button"
        class="secondary-button small disabled"
      >Save</button>
    </div>

    <!-- CONTENT -->

    <div class="content">
      <div class="input-container">
        <label
          for="phaseName"
          class="label"
        >Phase Name</label>
        <input
          type="text"
          class="light-primary-input"
        >
      </div>
      <div class="input-container">
        <label
          for="phaseName"
          class="label"
        >Associated Skills</label>
        <input
          type="text"
          class="light-primary-input"
        >
      </div>
      <div class="input-container">
        <label
          for="phaseName"
          class="label"
        >Phase Description</label>
        <div class="textarea-container medium">
          <textarea class="light-primary-input"></textarea>
        </div>
        <!-- FIXME: NOT IMPLEMENTED YET -->
        <!-- <p
            class="character-count"
            v-if="phase.description"
          >
            {{ phase.description.length }}/{{phase.fields.description.maxLength }}
          </p> -->
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: 'UpdatePhaseForm',
  data () {
    return {
    }
  }
}
</script>
