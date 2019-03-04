
<template>
  <div id="filters">

    <!-- FILTER TYPE -->

    <div class="filter-type">
      <div
        class="checkbox-container"
        v-for="(item, index) in header.filteringItems"
        :key="index"
      >
        <input
          type="checkbox"
          class="checkbox"
          name="item"
          :id="`item${index}`"
          :value="typeof item === 'object' ? item.id : item"
          v-model="filters"
        >
        <label
          class="check"
          :for="`item${index}`"
        ></label>
        <label
          class="label"
          :for="`item${index}`"
        >{{ typeof item === 'object' ? item.title : item.formatText() }}</label>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mixin as clickout } from 'vue-clickout'
import LoadingCheckbox from 'vue-loading-checkbox'
import 'vue-loading-checkbox/dist/LoadingCheckbox.css'
export default {
  name: 'Filters',
  mixins: [clickout],
  data () {
    return {
      filters: null
    }
  },
  props: ['mutation', 'header', 'model'],
  computed: {
    ...mapState([
      'phasesOfSelectedWorkflow',
      'tags'
    ])
  },
  watch: {
    'filters' (newValue) {
      this.mutation({ [this.header.field]: this.filters })
    }
  },
  components: {
    LoadingCheckbox
  },
  beforeMount () {
    this.filters = [...this.model[this.header.field]]
  }
}
</script>
