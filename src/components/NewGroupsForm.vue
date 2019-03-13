<template>
  <form id="newGroupsForm">

    <!-- HEADER -->

    <div class="header">
      <button
        type="button"
        class="secondary-button small disabled"
      >Save</button>
    </div>

    <!-- CONTENT -->

    <div class="content">
      <div class="input-container">
        <label
          for="groupName"
          class="label"
        >group Name</label>
        <input
          type="text"
          class="light-primary-input disabled"
        >
      </div>
      <div class="input-container">
        <label
          for="groupName"
          class="label"
        >group Description</label>
        <div class="textarea-container large">
          <textarea class="light-primary-input"></textarea>
        </div>
        <!-- <p
            class="character-count"
            v-if="group.description"
          >
            {{ group.description.length }}/{{grup.fields.description.maxLength }}
          </p> -->
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: 'NewGroupsForm',
  data () {
    return {
    }
  }
}
</script>
