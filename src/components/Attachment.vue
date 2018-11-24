<template>
  <div id="attachment">
    <div class="header">
      <button
        type="button"
        class="primary-button small"
      >
        <img
          src="./../assets/plus.svg"
          class="plus-icon"
        >
        New Project
      </button>
    </div>

    <!-- SEARCH -->

    <div class="content">
      <div class="search-container">
        <div class="input-container">
          <input
            type="text"
            class="search-input"
            placeholder="Search attachment"
          >
          <simple-svg
            :filepath="require('@/assets/search.svg')"
            fill="#23232380"
            class="search-icon"
          />
          <simple-svg
            :filepath="require('@/assets/close.svg')"
            fill="#232323"
            class="close-icon"
          />
        </div>
        <simple-svg
          :filepath="require('@/assets/plus.svg')"
          fill="#A63E5D"
          class="plus-button"
        />
      </div>
      <div class="attachment-items">
        <form class="new-attachment">
          <label>Me</label>
        </form>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Attachment',
  data () {
    return {
    }
  }
}
</script>
