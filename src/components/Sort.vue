<template>
  <div id="sort">
    <div class="radio-container">
      <input
        type="radio"
        class="radio"
        name="ascending"
        id="Ascending"
        value="1"
        @click="sortAction(header)"
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
        value="1"
        @click="sortAction(header)"
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
    }
  }
}
</script>
