<template>
  <div id="pagination">
    <div
      class="prev action"
      @click="previousPage"
    >
      <img
        src="./../assets/chevron-down.svg"
        alt="Next"
        class="icon left"
      >
    </div>
    <div
      :key="page"
      v-for="page in options.pageCount"
      @click="goToPage(page)"
      :class="{current: page === options.page}"
      class="page action"
    >
      {{ page }}
    </div>
    <div
      class="next action"
      @click="nextPage"
    >
      <img
        src="./../assets/chevron-down.svg"
        alt="Next"
        class="icon right"
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    options: Object
  },
  methods: {
    previousPage () {
      if (this.options.page !== 1) {
        this.$emit('prev')
      }
    },
    nextPage () {
      if (this.options.page !== this.options.pageCount) {
        this.$emit('next')
      }
    },
    goToPage (pageNumber) {
      if (this.options.page !== pageNumber) {
        this.$emit('goToPage', pageNumber)
      }
    }
  }
}
</script>
