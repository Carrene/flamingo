<template>
  <div id="newPhasePopup">
    <div class="popup-header">
      <p>Add new phase</p>
      <simple-svg
        :filepath="require('@/assets/close.svg')"
        fill="#6A6A6A"
        class="close-icon"
        @click.native="$emit('close')"
      />
    </div>
    <form class="popup-content">
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
        <!-- <p
            class="character-count"
            v-if="phase.description"
          >
            {{ phase.description.length }}/{{phase.fields.description.maxLength }}
          </p> -->
      </div>
      <button
        type="button"
        class="secondary-button"
      >Create</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'newPhasePopup',
  data () {
    return {
    }
  }
}
</script>
