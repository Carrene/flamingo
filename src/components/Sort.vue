<template>
  <div id="sort">
    <div class="radio-container">
      <input
        type="radio"
        class="radio"
        name="ascending"
        id="Ascending"
        value="ascending"
        v-model="sortingStatus"
      >
      <label
        for="Ascending"
        class="check"
      ></label>
      <label
        for="Ascending"
        class="label"
      >Ascending</label>
    </div>
    <div class="radio-container">
      <input
        type="radio"
        class="radio"
        name="descending"
        id="Descending"
        value="descending"
        v-model="sortingStatus"
      >
      <label
        for="Descending"
        class="check"
      ></label>
      <label
        for="Descending"
        class="label"
      >Descending</label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sort',
  props: ['sortCriteria', 'sortAction', 'header'],
  data () {
    return {
      sortingStatus: null
    }
  },
  watch: {
    'sortingStatus' (newValue) {
      this.sortAction(this.header, newValue === 'descending')
    }
  },
  beforeMount () {
    if (this.header.isActive && this.sortCriteria.descending) {
      this.sortingStatus = 'descending'
    } else if (this.header.isActive && !this.sortCriteria.descending) {
      this.sortingStatus = 'ascending'
    }
  }
}
</script>
