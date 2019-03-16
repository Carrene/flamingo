<template>
  <form id="newSkillForm">

    <!-- HEADER -->

    <div class="header">
      <button
        type="button"
        class="secondary-button outlined small disabled"
      >Save</button>
    </div>

    <!-- CONTENT -->

    <div class="content">
      <div class="input-container">
        <label
          for="skillName"
          class="label"
        >Skill Name</label>
        <input
          type="text"
          class="light-primary-input"
        >
      </div>
      <div class="input-container">
        <label
          for="skillName"
          class="label"
        >Skill Description</label>
        <div class="textarea-container medium">
          <textarea class="light-primary-input"></textarea>
        </div>
        <!-- <p
          class="character-count"
          v-if="group.description"
        >
          {{ skill.description.length }}/{{skill.fields.description.maxLength }}
        </p> -->
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: 'NewSkillForm',
  data () {
    return {
    }
  }
}
</script>
