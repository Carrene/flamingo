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

    <form
      class="popup-content"
      @submit.prevent="create"
      autocomplete="off"
    >

      <div class="order-container">

        <!-- ORDER INPUT -->

        <div class="input-container order">
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
      </div>

      <!-- SPECIALTY INPUT -->

      <div class="input-container">
        <label
          :for="phaseMetadata.fields.specialtyId.label"
          class="label"
        >{{ phaseMetadata.fields.specialtyId.label }}</label>
        <v-select
          :options="specialties"
          label="title"
          index="id"
          v-model="phase.specialtyId"
          :clearable="!$v.phase.specialtyId.required"
        ></v-select>
        <validation-message
          :validation="$v.phase.specialtyId"
          :metadata="phaseMetadata.fields.specialtyId"
        />
      </div>

      <!-- DESCRIPTION -->

      <div class="input-container">
        <label
          for="phaseName"
          class="label"
        >{{ phaseMetadata.fields.description.label }}</label>
        <div class="textarea-container medium">
          <textarea
            class="light-primary-input"
            :class="{error: $v.phase.description.$error}"
            v-model.trim="phase.description"
            @input="$v.phase.description.$touch"
            @focus="$v.phase.description.$reset"
            @keyup.ctrl.enter="create"
          ></textarea>
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
    <snackbar
      :status="status"
      :message="message"
      @close="clearMessage"
      v-on-clickout="clearMessage"
    ></snackbar>
  </div>
</template>

<script>
import server from '../server'
import { mapState, mapActions } from 'vuex'
import { mixin as clickout } from 'vue-clickout'
const ValidationMessage = () => import(
  /* webpackChunkName: "ValidationMessage" */ './ValidationMessage'
)
const Snackbar = () => import(
  /* webpackChunkName: "Snackbar" */ './Snackbar'
)
export default {
  mixins: [clickout],
  name: 'newPhasePopup',
  data () {
    return {
      phaseMetadata: server.metadata.models.Phase,
      phase: null,
      status: null,
      message: null
    }
  },
  props: {
    selectedWorkflow: Object
  },
  validations () {
    return {
      phase: {
        title: this.phaseMetadata.fields.title.createValidator(),
        specialtyId: this.phaseMetadata.fields.specialtyId.createValidator(),
        order: this.phaseMetadata.fields.order.createValidator(),
        description: this.phaseMetadata.fields.description.createValidator()
      }
    }
  },
  computed: {
    ...mapState([
      'Phase',
      'specialties'
    ])
  },
  methods: {
    create () {
      this.phase.createPhase(this.selectedWorkflow.id, this.phase).send().then(resp => {
        this.$emit('created')
        this.status = resp.status
      }).catch(err => {
        this.status = err.status
        this.message = err.error
      })
    },
    clearMessage () {
      this.status = null
      this.message = null
    },
    ...mapActions([
      'listSpecialties'
    ])
  },
  components: {
    ValidationMessage,
    Snackbar
  },
  beforeMount () {
    this.listSpecialties()
    this.phase = new this.Phase()
  }
}
</script>
