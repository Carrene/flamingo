<template>
  <div id="pagination">
    <div
      class="prev"
      @click="previousPage"
    >Prev</div>
    <div
      :key="page"
      v-for="page in options.pageCount"
      @click="goToPage(page)"
      :class="{current: page === options.page}"
    >
      {{ page }}
    </div>
    <div
      class="next"
      @click="nextPage"
    >Next</div>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    options: {
      type: Object,
      default: null
    }
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

<style scoped>
div.current {
  color: red;
}
</style>
