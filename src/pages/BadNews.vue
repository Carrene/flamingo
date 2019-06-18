<template>
  <div id="badNews">

    <!-- HEADER -->

    <div class="header">
      <breadcrumb :crumbs="[]" />
      <div class="input-container search">
        <input
          type="text"
          class="primary-input"
          disabled
        >
        <simple-svg
          :filepath="require('@/assets/search.svg')"
          fill="#F9F9F9"
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
      <div class="bad-news-tabs">
        <div
          class="tab"
          @click="goToMissingHoursNuggets"
          :class="{'selected-tab': selectedBadNewsTab === 'missingHours'}"
        >
          <!-- FIXME: ADD THIS LATER -->
          <!-- <div class="counter"></div> -->
          <p>Missing Hours</p>
        </div>
        <div
          class="tab"
          @click="goToMissingEstimateNuggets"
          :class="{'selected-tab': selectedBadNewsTab === 'missingEstimate'}"
        >
          <!-- FIXME: ADD THIS LATER -->
          <!-- <div class="counter"></div> -->
          <p>Missing Estimate</p>
        </div>
        <div
          class="tab"
          @click="goToExpiredTriageNuggets"
          :class="{'selected-tab': selectedBadNewsTab === 'expiredTriage'}"
        >
          <!-- FIXME: ADD THIS LATER -->
          <!-- <div class="counter"></div> -->
          <p>Expired Triage</p>
        </div>
        <button
          type="submit"
          class="secondary-button"
          disabled
        >
          Save
        </button>
      </div>

      <router-view></router-view>

    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Breadcrumb from './../components/Breadcrumb.vue'
import ExpiredTriage from './../components/ExpiredTriage.vue'

export default {
  name: 'BadNews',
  data () {
    return {
    }
  },
  computed: {
    ...mapState([
      'selectedBadNewsTab'
    ])
  },
  methods: {
    goToMissingHoursNuggets () {
      this.$router.push('missing-hours')
      this.setSelectedBadNewsTab('missingHours')
    },
    goToMissingEstimateNuggets () {
      this.$router.push('missing-estimate')
      this.setSelectedBadNewsTab('missingEstimate')
    },
    goToExpiredTriageNuggets () {
      this.$router.push('expired-triage')
      this.setSelectedBadNewsTab('expiredTriage')
    },
    ...mapMutations([
      'setSelectedBadNewsTab'
    ])
  },
  components: {
    ExpiredTriage,
    Breadcrumb
  }
}
</script>
