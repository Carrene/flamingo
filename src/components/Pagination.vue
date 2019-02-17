<template>
  <div id="pagination">
    <div
      class="prev"
      @click="previousPage"
    >Prev</div>
    <div
      :key="page"
      v-for="page in pageCount"
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
  data () {
    return {
      pageCount: 1,
      page: 1
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
  },
  mounted () {
    this.pageCount = this.options.pageCount
    this.page = this.options.page
  }
}
</script>

<style scoped>
div.current {
  color: red;
}
</style>
