<template>
  <div id="badNews">

    <!-- HEADER -->

    <div class="header">
      <breadcrumb :crumbs="[]" />
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
        fill="#F9F9F9"
        class="column-icon"
      />
    </div>

    <!-- CONTENT -->

    <div class="content">
      <div class="bad-news-tabs">
        <div
          class="tab"
          @click="goToMissingHoursItems"
          :class="{'selected-tab': selectedBadNewsTab === 'missingHours'}"
        >
          <div
            class="counter"
            v-if="missingHoursCounter"
          >{{ missingHoursCounter || null }}</div>
          <p>Missing Hours</p>
        </div>
        <div
          class="tab"
          @click="goToMissingEstimateItems"
          :class="{'selected-tab': selectedBadNewsTab === 'missingEstimate'}"
        >
          <div
            class="counter"
            v-if="missingEstimateCounter"
          >{{ missingEstimateCounter || null }}</div>
          <p>Missing Estimate</p>
        </div>
        <div
          class="tab"
          @click="goToExpiredTriageNuggets"
          :class="{'selected-tab': selectedBadNewsTab === 'expiredTriage'}"
        >
          <div
            class="counter"
            v-if="expiredTriageCounter"
          >{{ expiredTriageCounter || null }}</div>
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

export default {
  name: 'BadNews',
  data () {
    return {
    }
  },
  computed: {
    ...mapState([
      'selectedBadNewsTab',
      'missingHoursCounter',
      'missingEstimateCounter',
      'expiredTriageCounter'
    ])
  },
  methods: {
    goToMissingHoursItems () {
      this.$router.push('missing-hours')
      this.setSelectedBadNewsTab('missingHours')
    },
    goToMissingEstimateItems () {
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
    Breadcrumb
  }
}
</script>
