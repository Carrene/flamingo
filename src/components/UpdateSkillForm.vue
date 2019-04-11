<template>
  <form
    id="updateSkillForm"
    @submit.prevent="save"
    autocomplete="off"
  >

    <!-- HEADER -->

    <div class="header">
      <button
        type="button"
        class="secondary-button outlined"
        v-if="skill.__status__ !== 'dirty'"
        @click="$emit('showNewSkillForm')"
      >New group</button>
      <button
        type="button"
        class="secondary-button"
        @click="save"
        v-else
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
          :class="{error: $v.skill.title.$error}"
        >{{ skillMetadata.fields.title.label }}</label>
        <input
          type="text"
          class="light-primary-input"
          :class="{error: $v.skill.title.$error}"
          v-model.trim="skill.title"
          @input="$v.skill.title.$touch"
          @focus="$v.skill.title.$reset"
        >
        <validation-message
          :validation="$v.skill.title"
          :metadata="skillMetadata.fields.title"
        />
      </div>
      <div class="input-container">
        <label
          for="skillName"
          class="label"
          :class="{error: $v.skill.description.$error}"
        >{{ skillMetadata.fields.description.label }}</label>
        <div class="textarea-container medium">
          <textarea
            class="light-primary-input"
            :class="{error: $v.skill.description.$error}"
            v-model.trim="skill.description"
            @input="$v.skill.description.$touch"
            @focus="$v.skill.description.$reset"
          ></textarea>
          <p
            class="character-count"
            v-if="skill.description"
          >
            {{ skill.description.length }}/{{skillMetadata.fields.description.maxLength }}
          </p>
        </div>
        <validation-message
          :validation="$v.skill.description"
          :metadata="skillMetadata.fields.description"
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
import { mapState } from 'vuex'
import { updateModel } from './../helpers.js'
import { mixin as clickout } from 'vue-clickout'
const ValidationMessage = () => import(
  /* webpackChunkName: "ValidationMessage" */ './ValidationMessage'
)
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)
const Snackbar = () => import(
  /* webpackChunkName: "Snackbar" */ './Snackbar'
)
export default {
  mixins: [clickout],
  name: 'UpdateSkillForm',
  data () {
    return {
      skill: null,
      loading: false,
      status: null,
      message: null,
      skillMetadata: server.metadata.models.Skill
    }
  },
  props: {
    selectedSkill: Object
  },
  validations () {
    return {
      skill: {
        title: this.skillMetadata.fields.title.createValidator(),
        description: this.skillMetadata.fields.description.createValidator()
      }
    }
  },
  computed: {
    ...mapState([
      'Skill',
      'skills'
    ])
  },
  watch: {
    'selectedSkill.id' () {
      this.getSelectedSkill()
    }
  },
  methods: {
    async getSelectedSkill () {
      this.loading = false
      let response = await this.Skill.get(this.selectedSkill.id).send()
      this.skill = response.models[0]
      this.loading = false
    },
    clearMessage () {
      this.status = null
      this.message = null
    },
    save () {
      this.loading = true
      this.skill.save().send().then(async (resp) => {
        this.status = resp.status
        this.message = 'Your skill was updated.'
        await updateModel(this.skills, this.skill)
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
        this.loading = false
      })
    }
  },
  components: {
    ValidationMessage,
    Loading,
    Snackbar
  },
  mounted () {
    this.getSelectedSkill()
  },
  beforeMount () {
    this.skill = new this.Skill()
  }
}
</script>
