<template>
  <form id="updateSkillForm">

    <!-- HEADER -->

    <div class="header">
      <button
        type="button"
        class="secondary-button outlined small disabled"
      >New Skill</button>
    </div>

    <!-- LOADING -->

    <loading v-if="loading" />

    <!-- CONTENT -->

    <div class="content">
      <div class="input-container">
        <label
          for="skillName"
          class="label"
        >{{ skillMetadata.fields.title.label }}</label>
        <input
          type="text"
          class="light-primary-input"
          v-model.trim="skill.title"
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
            v-model.trim="skill.description"
          ></textarea>
          <p
            class="character-count"
            v-if="skill.description"
          >
            {{ skill.description.length }}/{{skillMetadata.fields.description.maxLength }}
          </p>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import server from '../server'
import { mapState } from 'vuex'
export default {
  name: 'UpdateSkillForm',
  data () {
    return {
      skill: null,
      loading: false,
      skillMetadata: server.metadata.models.Skill
    }
  },
  props: {
    selectedSkill: Object
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
    }
  },
  mounted () {
    this.getSelectedSkill()
  },
  beforeMount () {
    this.skill = new this.Skill()
  }
}
</script>
