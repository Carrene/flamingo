<template>
  <div id="skills">

    <!-- LEFT COLUMN -->

    <div class="left-column">

      <!-- HEADER -->

      <div class="header">
        <p class="title">Skills</p>
      </div>

      <div class="content">
        <div class="table-box">

          <table class="table">

            <thead class="table-header">

              <tr class="row">

                <th
                  v-for="header in headers"
                  :key="header.label"
                  class="cell"
                >
                  <div class="title-container">
                    <p
                      :title="header.label"
                      :class="header.className"
                    >{{ header.label }}</p>
                  </div>
                </th>

              </tr>

            </thead>

            <tbody class="table-content">
              <tr
                class="row"
                v-for="skill in skills"
                :key="skill.id"
                @click="selectSkill(skill)"
                :class="{'selected-skill': selectedSkill && (skill.id === selectedSkill.id)}"
              >
                <td class="skill-name cell">{{ skill.title }}</td>
                <td class="skill-description cell">{{ skill.description ? skill.description : '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- SKILL FORMs -->

    <div class="right-column">
      <update-skill-form
        class="form"
        v-if="selectedSkill"
        :selectedSkill="selectedSkill"
        @showNewSkillForm="showingNewSkillForm"
      />
      <new-skill-form
        class="form"
        @created="selectSkill"
        v-else
      />
    </div>
  </div>
</template>

<script>
import server from '../server'
import { mapState } from 'vuex'
const UpdateSkillForm = () => import(
  /* webpackChunkName: "UpdateSkillForm" */ '../components/UpdateSkillForm'
)
const NewSkillForm = () => import(
  /* webpackChunkName: "NewSkillForm" */ '../components/NewSkillForm'
)

export default {
  name: 'Skills',
  data () {
    return {
      selectedSkill: null,
      skillMetadata: server.metadata.models.Skill
    }
  },
  computed: {
    headers () {
      return [
        {
          label: this.skillMetadata.fields.title.label,
          field: 'skillName',
          className: 'skills-name'
        },
        {
          label: this.skillMetadata.fields.description.label,
          field: 'skillDescription',
          className: 'skill-description'
        }
      ]
    },
    ...mapState([
      'skills'
    ])
  },
  methods: {
    selectSkill (skill) {
      this.selectedSkill = skill
    },
    showingNewSkillForm () {
      this.selectedSkill = null
    }
  },
  components: {
    UpdateSkillForm,
    NewSkillForm
  },
  beforeMount () {
    if (this.skills.length) {
      this.selectedSkill = this.skills[0]
    }
  }
}
</script>
