<template>
  <div id="assigned">
    <!-- HEADER -->

    <div class="header">
      <!-- <breadcrumb
        v-if="selectedAssigned"
        :crumbs="[selectedAssigned]"
      /> -->
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
          :class="{'selected-tab': selectedTab === 'inprogress-items'}"
        >
          In Process Nuggets
        </div>
        <div
          class="tab"
          @click="goToUpcomingItems"
          :class="{'selected-tab': selectedTab === 'upcoming-items'}"
        >
          Upcoming Nuggets
        </div>
        <div
          class="tab"
          @click="goToNeedEstimateItems"
          :class="{'selected-tab': selectedTab === 'need-estimate-items'}"
        >
          Need Estimate
        </div>
        <div class="tab">Newly Assgined</div>
      </div>

      <router-view></router-view>

    </div>
  </div>
</template>

<script>

export default {
  name: 'Assigned',
  data () {
    return {
      selectedTab: 'inprogress-items'
    }
  },
  methods: {
    goToAssignedItems () {
      this.$router.push('inprogress-items')
      this.selectedTab = 'inprogress-items'
    },
    goToUpcomingItems () {
      this.$router.push('upcoming-items')
      this.selectedTab = 'upcoming-items'
    },
    goToNeedEstimateItems () {
      this.$router.push('need-estimate-items')
      this.selectedTab = 'need-estimate-items'
    }
  }
}
</script>
