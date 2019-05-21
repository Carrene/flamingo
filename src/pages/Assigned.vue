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
        fill="#232323"
        class="column-icon disabled"
      />
    </div>

    <!-- CONTENT -->

    <div class="content">
      <div class="assgin-tabs">
        <div
          class="tab"
          @click="goToAssignedItems"
          :class="{'selected-tab': selectedZoneTab === 'inProcessNuggets'}"
        >
          <div class="counter" v-if='inprocessCounter'>{{ inprocessCounter !== 0 ? inprocessCounter : null }}</div>
          <p>In Process Nuggets</p>
        </div>
        <div
          class="tab"
          @click="goToUpcomingItems"
          :class="{'selected-tab': selectedZoneTab === 'upcomingNuggets'}"
        >
          <div class="counter" v-if="upcomingCounter">{{ upcomingCounter !== 0 ? upcomingCounter : null }}</div>
          <p>Upcoming Nuggets</p>
        </div>
        <div
          class="tab"
          @click="goToNeedEstimateItems"
          :class="{'selected-tab': selectedZoneTab === 'needEstimate'}"
        >
          <div class="counter" v-if="needEstimateCounter">{{ needEstimateCounter !== 0 ? needEstimateCounter : null }}</div>
          <p>Need Estimate</p>
        </div>
        <div
          class="tab"
          @click="goToNewlyAssigned"
          :class="{'selected-tab': selectedZoneTab === 'newlyAssigned'}"
        >
          <div class="counter" v-if="newlyAssignedCounter">{{ newlyAssignedCounter !== 0 ? newlyAssignedCounter : null }}</div>
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
      'inprocessCounter',
      'upcomingCounter',
      'newlyAssignedCounter',
      'needEstimateCounter'
    ])
  },
  methods: {
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
      'setSelectedZoneTab'
    ])
  },
  components: {
    Breadcrumb
  }
}
</script>
