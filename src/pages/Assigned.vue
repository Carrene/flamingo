<template>
  <div id="assigned">
    <!-- HEADER -->

    <div class="header">
      <breadcrumb
        v-if="selectedItem"
        :crumbs="[selectedItem.issue]"
      />
      <div class="input-container search">
        <input
          type="text"
          class="light-primary-input"
          placeholder="Search in the assigned items"
          disabled
        >
        <simple-svg
          :filepath="require('@/assets/search.svg')"
          fill="#23232380"
          class="search-icon"
        />
      </div>
      <simple-svg
        :filepath="require('@/assets/column.svg')"
        fill="#F9F9F9"
        class="column-icon"
      />
    </div>

    <!-- CONTENT -->

    <div class="content">
      <div class="assign-tabs">
        <div
          class="tab"
          @click="goToAssignedItems"
          :class="{'selected-tab': selectedZoneTab === 'inProgressNuggets'}"
        >
          <div
            class="counter"
            v-if='inProgressCounter'
          >{{ formatCounter(inProgressCounter) }}</div>
          <p>In Progress Nuggets</p>
        </div>
        <div
          class="tab"
          @click="goToUpcomingItems"
          :class="{'selected-tab': selectedZoneTab === 'upcomingNuggets'}"
        >
          <div
            class="counter"
            v-if="upcomingCounter"
          >{{ formatCounter(upcomingCounter) }}</div>
          <p>Upcoming Nuggets</p>
        </div>
        <div
          class="tab"
          @click="goToNeedEstimateItems"
          :class="{'selected-tab': selectedZoneTab === 'needEstimate'}"
        >
          <div
            class="counter"
            v-if="needEstimateCounter"
          >{{ formatCounter(needEstimateCounter) }}</div>
          <p>Need Estimate</p>
        </div>
        <div
          class="tab"
          @click="goToNewlyAssigned"
          :class="{'selected-tab': selectedZoneTab === 'newlyAssigned'}"
        >
          <div
            class="counter"
            v-if="newlyAssignedCounter"
          >{{ formatCounter(newlyAssignedCounter) }}</div>
          <p>Newly Assigned</p>
        </div>
      </div>

      <router-view></router-view>

    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Breadcrumb from './../components/Breadcrumb.vue'
import { formatCounter } from '../helpers'
export default {
  name: 'Assigned',
  data () {
    return {
      selectedTab: 'inprogress-items'
    }
  },
  computed: {
    ...mapState([
      'selectedZoneTab',
      'selectedItem',
      'inProgressCounter',
      'upcomingCounter',
      'newlyAssignedCounter',
      'needEstimateCounter'
    ])
  },
  methods: {
    formatCounter,
    goToAssignedItems () {
      this.$router.push('inprogress-items')
    },
    goToUpcomingItems () {
      this.$router.push('upcoming-items')
    },
    goToNeedEstimateItems () {
      this.$router.push('need-estimate-items')
    },
    goToNewlyAssigned () {
      this.$router.push('newly-assigned')
    },
    ...mapMutations([
      'setSelectedZoneTab',
      'setGlobalLoading'
    ])
  },
  components: {
    Breadcrumb
  },
  beforeMount () {
    this.setGlobalLoading(false)
  }
}
</script>
