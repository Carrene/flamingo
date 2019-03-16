<template>
  <form id="newTagForm">

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
          for="tagName"
          class="label"
        >Tag Name</label>
        <input
          type="text"
          class="light-primary-input"
        >
      </div>
      <div class="input-container">
        <label
          for="tagName"
          class="label"
        >Tag Description</label>
        <div class="textarea-container large">
          <textarea class="light-primary-input"></textarea>
        </div>
        <!-- <p
          class="character-count"
          v-if="tag.description"
        >
          {{ tag.description.length }}/{{tag.fields.description.maxLength }}
        </p> -->
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: 'NewTagForm',
  data () {
    return {
    }
  }
}
</script>
