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

      <!-- ORDER INPUT -->

      <div class="input-container">
        <label
          for="phaseOrder"
          class="label"
          :class="{error: $v.phase.order.$error}"
        >{{ phaseMetadata.fields.order.label }}</label>
        <input
          type="number"
          class="light-primary-input"
          v-model.number="phase.order"
          :class="{error: $v.phase.order.$error}"
          @input="$v.phase.order.$touch"
          @focus="$v.phase.order.$reset"
        >
        <validation-message
          :validation="$v.phase.order"
          :metadata="phaseMetadata.fields.order"
        />
      </div>

      <!-- NAME INPUT -->

      <div class="input-container">
        <label
          for="phaseName"
          class="label"
          :class="{error: $v.phase.title.$error}"
        >{{ phaseMetadata.fields.title.label }}</label>
        <input
          type="text"
          class="light-primary-input"
          v-model="phase.title"
          :class="{error: $v.phase.title.$error}"
          @input="$v.phase.title.$touch"
          @focus="$v.phase.title.$reset"
        >
        <validation-message
          :validation="$v.phase.title"
          :metadata="phaseMetadata.fields.title"
        />
      </div>

      <!-- SKILL INPUT -->

      <div class="input-container">
        <label
          :for="phaseMetadata.fields.skillId.label"
          class="label"
        >{{ phaseMetadata.fields.skillId.label }}</label>
        <v-select
          :options="skills"
          label="title"
          index="id"
          v-model="phase.skillId"
          :clearable="!$v.phase.skillId.required"
        ></v-select>
        <validation-message
          :validation="$v.phase.skillId"
          :metadata="phaseMetadata.fields.skillId"
        />
      </div>

      <!-- DESCRIPTION -->

      <div class="input-container">
        <label
          for="phaseName"
          class="label"
        >Description</label>
        <div class="textarea-container medium">
          <textarea class="light-primary-input"></textarea>
          <p
            class="character-count"
            v-if="phase.description"
          >
            {{ phase.description.length }}/{{phaseMetadata.fields.description.maxLength }}
          </p>
        </div>
      </div>

      <!-- ACTION -->

      <button
        type="button"
        class="secondary-button"
        :disabled="$v.phase.$invalid"
        @click="create"
      >Create</button>
    </form>
  </div>
</template>

<script>
import server from '../server'
import { mapState, mapActions } from 'vuex'
const ValidationMessage = () => import(
  /* webpackChunkName: "ValidationMessage" */ './ValidationMessage'
)
export default {
  name: 'newPhasePopup',
  data () {
    return {
      phaseMetadata: server.metadata.models.Phase,
      phase: null
    }
  },
  props: {
    selectedWorkflow: Object
  },
  validations () {
    return {
      phase: {
        title: this.phaseMetadata.fields.title.createValidator(),
        skillId: this.phaseMetadata.fields.skillId.createValidator(),
        order: this.phaseMetadata.fields.order.createValidator()
      }
    }
  },
  computed: {
    ...mapState([
      'Phase',
      'skills'
    ])
  },
  methods: {
    create () {
      this.phase.create(this.selectedWorkflow.id, this.phase).send().then(resp => {
        console.log('salaaam')
      })
    },
    ...mapActions([
      'listSkills'
    ])
  },
  components: {
    ValidationMessage
  },
  beforeMount () {
    this.listSkills()
    this.phase = new this.Phase()
  }
}
</script>
