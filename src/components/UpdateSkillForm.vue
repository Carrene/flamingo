<template>
  <form
    id="updateSkillForm"
    @submit.prevent="update"
    autocomplete="off"
  >

    <!-- HEADER -->

    <div class="header">
      <button
        type="button"
        class="secondary-button outlined"
        v-if="skill.__status__ !== 'dirty'"
        @click="$emit('showNewSkillForm')"
      >New skill</button>
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
            @keyup.ctrl.enter="update"
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
  name: 'UpdateSkillForm',
  data () {
    return {
      skill: null,
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
    'selectedSkill.id': {
      immediate: true,
      handler (newValue) {
        this.getSelectedSkill(newValue)
      }
    }
  },
  methods: {
    async getSelectedSkill (skillId) {
      this.setGlobalLoading(false)
      // TODO: remove get if you can.
      let response = await this.Skill.get(skillId).send()
      this.skill = response.models[0]
      this.setGlobalLoading(false)
    },
    clearMessage () {
      this.status = null
      this.message = null
    },
    update () {
      this.setGlobalLoading(true)
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
    this.skill = new this.Skill()
  }
}
</script>
