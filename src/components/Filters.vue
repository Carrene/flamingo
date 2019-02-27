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
      <!-- <button
          class="small"
          :class="filters.subscribed !== 'all' ? 'primary-button' : 'secondary-button'"
          @click="toggleSubscribedTooltip"
        >
          {{ metadata.fields.isSubscribed.label }}
        </button> -->
      <!-- <div
          class="tooltip-container center filter"
          v-if="showSubscribedTooltip"
          v-on-clickout="toggleSubscribedTooltip.bind(undefined, false)"
        >
          <div class="tooltip-header">
            <p>{{ metadata.fields.isSubscribed.label }}</p>
          </div>
          <div class="tooltip-content">
            <div class="radio-container">
              <input
                type="radio"
                class="radio"
                name="subscribed"
                id="all"
                v-model="filters.isSubscribed"
                value="all"
              >
              <label
                for="all"
                class="check"
              ></label>
              <label
                for="all"
                class="label"
              >All</label>
            </div>

            <div class="radio-container">
              <input
                type="radio"
                class="radio"
                name="subscribed"
                id="notSubscribed"
                v-model="filters.isSubscribed"
                value="0"
              >
              <label
                for="notSubscribed"
                class="check"
              ></label>
              <label
                for="notSubscribed"
                class="label"
              >Not Subscribed</label>
            </div>

            <div class="radio-container">
              <input
                type="radio"
                class="radio"
                name="subscribed"
                id="Subscribed"
                v-model="filters.isSubscribed"
                value="1"
              >
              <label
                for="Subscribed"
                class="check"
              ></label>
              <label
                for="Subscribed"
                class="label"
              >Subscribed</label>
            </div>
          </div>
        </div> -->
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
  props: ['changeAction', 'mutation', 'header', 'model'],
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
    // 'items': {
    //   deep: true,
    //   handler () {
    //     this.changeAction()
    //   }

    // }
  },
  components: {
    LoadingCheckbox
  },
  beforeMount () {
    this.filters = [...this.model[this.header.field]]
  }
}
</script>
