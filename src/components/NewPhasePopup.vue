<template>
  <div id="newPhasePopup">

    <!-- HEADER -->

    <div class="popup-header">
      <p>Add new phase</p>
      <simple-svg
        :filepath="require('@/assets/close.svg')"
        fill="#6A6A6A"
        class="close-icon"
        @click.native="$emit('close')"
      />
    </div>

    <!-- FORM -->

    <form class="popup-content">

      <!-- NAME INPUT -->

      <div class="input-container">
        <label
          for="phaseName"
          class="label"
        >{{ phaseMetadata.fields.title.label }}</label>
        <input
          type="text"
          class="light-primary-input"
          v-model="phase.title"
        >
      </div>

      <!-- SKILL INPUT -->

      <div class="input-container">
        <label
          :for="phaseMetadata.fields.skillId.label"
          class="label"
        >{{ phaseMetadata.fields.skillId.label }}</label>
        <v-select
          :options="skills"
          label="name"
          index="id"
          v-model="phase.skillId"
        ></v-select>
      </div>

      <!-- DESCRIPTION -->

      <div class="input-container">
        <label
          for="phaseName"
          class="label"
        >Description</label>
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

      <!-- ACTION -->

      <button
        type="button"
        class="secondary-button"
      >Create</button>
    </form>
  </div>
</template>

<script>
import server from '../server'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'newPhasePopup',
  data () {
    return {
      phaseMetadata: server.metadata.models.Phase,
      phase: null
    }
  },
  computed: {
    ...mapState([
      'Phase',
      'skills'
    ])
  },
  methods: {
    ...mapActions([
      'listSkills'
    ])
  },
  beforeMount () {
    this.listSkills()
    this.phase = new this.Phase()
  }
}
</script>
