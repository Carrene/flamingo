<template>
  <form
    id="updateSpecialtyForm"
    @submit.prevent="update"
    autocomplete="off"
  >

    <!-- HEADER -->

    <div class="header">
      <button
        type="button"
        class="secondary-button outlined"
        v-if="specialty.__status__ !== 'dirty'"
        @click="$emit('showNewSpecialtyForm')"
      >New specialty</button>
      <button
        type="button"
        class="secondary-button"
        @click="update"
        v-else
      >Save</button>
    </div>

    <!-- CONTENT -->

    <div class="content">
      <div class="input-container">
        <label
          for="specialtyName"
          class="label"
          :class="{error: $v.specialty.title.$error}"
        >{{ specialtyMetadata.fields.title.label }}</label>
        <input
          type="text"
          class="light-primary-input"
          :class="{error: $v.specialty.title.$error}"
          v-model.trim="specialty.title"
          @input="$v.specialty.title.$touch"
          @focus="$v.specialty.title.$reset"
        >
        <validation-message
          :validation="$v.specialty.title"
          :metadata="specialtyMetadata.fields.title"
        />
      </div>
      <div class="input-container">
        <label
          for="specialtyName"
          class="label"
          :class="{error: $v.specialty.description.$error}"
        >{{ specialtyMetadata.fields.description.label }}</label>
        <div class="textarea-container medium">
          <textarea
            class="light-primary-input"
            :class="{error: $v.specialty.description.$error}"
            v-model.trim="specialty.description"
            @input="$v.specialty.description.$touch"
            @focus="$v.specialty.description.$reset"
            @keyup.ctrl.enter="update"
          ></textarea>
          <p
            class="character-count"
            v-if="specialty.description"
          >
            {{ specialty.description.length }}/{{specialtyMetadata.fields.description.maxLength }}
          </p>
        </div>
        <validation-message
          :validation="$v.specialty.description"
          :metadata="specialtyMetadata.fields.description"
        />
      </div>
      <snackbar
        :status="status"
        :message="message"
        @close="clearMessage"
        v-on-clickout="clearMessage"
      ></snackbar>
    </div>
  </form>
</template>

<script>
import server from '../server'
import { mapState, mapMutations } from 'vuex'
import { updateModel } from './../helpers.js'
import { mixin as clickout } from 'vue-clickout'
const ValidationMessage = () => import(
  /* webpackChunkName: "ValidationMessage" */ './ValidationMessage'
)
const Snackbar = () => import(
  /* webpackChunkName: "Snackbar" */ './Snackbar'
)
export default {
  mixins: [clickout],
  name: 'UpdateSpecialtyForm',
  data () {
    return {
      specialty: null,
      status: null,
      message: null,
      specialtyMetadata: server.metadata.models.Specialty
    }
  },
  props: {
    selectedSpecialty: Object
  },
  validations () {
    return {
      specialty: {
        title: this.specialtyMetadata.fields.title.createValidator(),
        description: this.specialtyMetadata.fields.description.createValidator()
      }
    }
  },
  computed: {
    ...mapState([
      'Specialty',
      'specialties'
    ])
  },
  watch: {
    'selectedSpecialty.id': {
      immediate: true,
      handler (newValue) {
        this.getSelectedSpecialty(newValue)
      }
    }
  },
  methods: {
    async getSelectedSpecialty (specialtyId) {
      this.setGlobalLoading(false)
      // TODO: remove get if you can.
      let response = await this.Specialty.get(specialtyId).send()
      this.specialty = response.models[0]
      this.setGlobalLoading(false)
    },
    clearMessage () {
      this.status = null
      this.message = null
    },
    update () {
      this.setGlobalLoading(true)
      this.specialty.save().send().then(async (resp) => {
        this.status = resp.status
        this.message = 'Your specialty was updated.'
        await updateModel(this.specialties, this.specialty)
        setTimeout(() => {
          this.clearMessage()
        }, 3000)
      }).catch(resp => {
        this.status = resp.status
        this.message = resp.error
        setTimeout(() => {
          this.clearMessage()
        }, 3000)
      }).finally(() => {
        this.setGlobalLoading(false)
      })
    },
    ...mapMutations([
      'setGlobalLoading'
    ])
  },
  components: {
    ValidationMessage,
    Snackbar
  },
  beforeMount () {
    this.specialty = new this.Specialty()
  }
}
</script>
