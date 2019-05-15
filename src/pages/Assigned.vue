<template>
  <div id="assigned">
    <!-- HEADER -->

    <div class="header">
      <breadcrumb
        v-if="selectedItem"
        :crumbs="[selectedItem]"
      />
      <div class="input-container search">
        <input
          type="text"
          class="light-primary-input"
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
          In Process Nuggets
        </div>
        <div
          class="tab"
          @click="goToUpcomingItems"
          :class="{'selected-tab': selectedZoneTab === 'upcomingNuggets'}"
        >
          Upcoming Nuggets
        </div>
        <div
          class="tab"
          @click="goToNeedEstimateItems"
          :class="{'selected-tab': selectedZoneTab === 'needEstimate'}"
        >
          Need Estimate
        </div>
        <div
          class="tab"
          @click="goToNewlyAssigned"
          :class="{'selected-tab': selectedZoneTab === 'NewlyAssigned'}"
        >
          Newly Assigned
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
      'selectedItem'
    ])
  },
  methods: {
    goToAssignedItems () {
      this.$router.push('inprogress-items')
      this.setSelectedZoneTab('inProcessNuggets')
    },
    goToUpcomingItems () {
      this.$router.push('upcoming-items')
      this.setSelectedZoneTab('upcomingNuggets')
    },
    goToNeedEstimateItems () {
      this.$router.push('need-estimate-items')
      this.setSelectedZoneTab('needEstimate')
    },
    goToNewlyAssigned () {
      this.$router.push('newly-assigned')
      this.setSelectedZoneTab('NewlyAssigned')
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
