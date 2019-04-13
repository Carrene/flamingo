<template>
  <form
    id="newSkillForm"
    @submit.prevent="create"
    autocomplete="off"
  >

    <!-- HEADER -->

    <div class="header">
      <button
        type="button"
        class="secondary-button"
        :disabled="$v.skill.$invalid"
        @click="create"
      >Save</button>
    </div>

    <!-- LOADING -->

    <loading v-if="loading" />

    <!-- CONTENT -->

    <div class="content">
      <div class="input-container">
        <label
          for="skillName"
          class="label"
        >{{ skillMetadata.fields.title.label}}</label>
        <input
          type="text"
          class="light-primary-input"
          :class="{error: $v.skill.title.$error}"
          v-model.trim="skill.title"
          @input="$v.skill.title.$touch"
          @focus="$v.skill.title.$reset"
        >
      </div>
      <div class="input-container">
        <label
          for="skillName"
          class="label"
        >{{ skillMetadata.fields.description.label }}</label>
        <div class="textarea-container medium">
          <textarea
            class="light-primary-input"
            :class="{error: $v.skill.description.$error}"
            v-model.trim="skill.description"
            @input="$v.skill.description.$touch"
            @keyup.ctrl.enter="update"
            @focus="$v.skill.title.$reset"
          ></textarea>
        </div>
        <!-- <p
          class="character-count"
          v-if="skill.description"
        >
          {{ skill.description.length }}/{{skillMetadata.fields.description.maxLength }}
        </p> -->
      </div>
    </div>
  </form>
</template>

<script>
import server from '../server'
import { mapState, mapActions } from 'vuex'
const ValidationMessage = () => import(
  /* webpackChunkName: "ValidationMessage" */ './ValidationMessage'
)
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)
export default {
  name: 'NewSkillForm',
  data () {
    return {
      skillMetadata: server.metadata.models.Skill,
      skill: null,
      status: null,
      message: null,
      loading: false
    }
  },
  computed: {
    ...mapState([
      'Skill'
    ])
  },
  validations () {
    return {
      skill: {
        title: this.skillMetadata.fields.title.createValidator(),
        description: this.skillMetadata.fields.description.createValidator()
      }
    }
  },
  methods: {
    async create () {
      this.loading = true
      try {
        let response = await this.skill.save().send()
        this.status = response.status
        this.message = 'Your skill was created.'
        await this.listSkills()
      } catch (err) {
        this.status = err.status
        this.message = err.error
      }
      this.loading = false
      setTimeout(() => {
        this.clearMessage()
      }, 3000)
    },
    clearMessage () {
      this.status = null
      this.message = null
    },
    ...mapActions([
      'listSkills'
    ])
  },
  components: {
    ValidationMessage,
    Loading
  },
  beforeMount () {
    this.skill = new this.Skill()
  }
}
</script>
