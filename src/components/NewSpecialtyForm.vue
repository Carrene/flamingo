<template>
  <form
    id="newSpecialtyForm"
    @submit.prevent="create"
    autocomplete="off"
  >

    <!-- HEADER -->

    <div class="header">
      <button
        type="button"
        class="secondary-button"
        :disabled="$v.specialty.$invalid"
        @click="create"
      >Save</button>
    </div>

    <!-- CONTENT -->

    <div class="content">
      <div class="input-container">
        <label
          for="specialtyName"
          class="label"
          :class="{error: $v.specialty.title.$error}"
        >{{ specialtyMetadata.fields.title.label}}</label>
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
            @keyup.ctrl.enter="create"
            @focus="$v.specialty.title.$reset"
          ></textarea>
          <p
          class="character-count"
          v-if="specialty.description"
          >
          {{ specialty.description.length }}/{{ specialtyMetadata.fields.description.maxLength }}
          </p>
          <validation-message
            :validation="$v.specialty.description"
            :metadata="specialtyMetadata.fields.description"
          />
        </div>
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
import { mapState, mapActions, mapMutations } from 'vuex'
import { mixin as clickout } from 'vue-clickout'
const ValidationMessage = () => import(
  /* webpackChunkName: "ValidationMessage" */ './ValidationMessage'
)
const Snackbar = () => import(
  /* webpackChunkName: "Snackbar" */ './Snackbar'
)
export default {
  mixins: [clickout],
  name: 'NewSpecialtyForm',
  data () {
    return {
      specialtyMetadata: server.metadata.models.Specialty,
      specialty: null,
      status: null,
      message: null
    }
  },
  computed: {
    ...mapState([
      'Specialty'
    ])
  },
  validations () {
    return {
      specialty: {
        title: this.specialtyMetadata.fields.title.createValidator(),
        description: this.specialtyMetadata.fields.description.createValidator()
      }
    }
  },
  methods: {
    async create () {
      this.setGlobalLoading(true)
      try {
        let response = await this.specialty.save().send()
        this.status = response.status
        this.message = 'Your specialty was created.'
        await this.listSpecialties()
        this.$emit('created', response.models[0])
      } catch (err) {
        this.status = err.status
        this.message = err.error
      }
      this.setGlobalLoading(false)
      setTimeout(() => {
        this.clearMessage()
      }, 3000)
    },
    clearMessage () {
      this.status = null
      this.message = null
    },
    ...mapActions([
      'listSpecialties'
    ]),
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
