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
              <tr class="row">
                <td class="skill-name cell">lorem</td>
                <td class="skill-description cell">lorem</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- SKILL FORMs -->

    <div class="right-column">
      <new-skill-form
        class="form"
        v-if="showingNewSkillForm"
      />
      <update-skill-form
        class="form"
        v-else
      />
    </div>
  </div>
</template>

<script>
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
      showingNewSkillForm: false
    }
  },
  computed: {
    headers () {
      return [
        {
          label: 'Skill Name',
          field: 'skillName',
          className: 'skills-name'
        },
        {
          label: 'Skill Description',
          field: 'skillDescription',
          className: 'skill-description'
        }
      ]
    }
  },
  components: {
    UpdateSkillForm,
    NewSkillForm
  }
}
</script>
