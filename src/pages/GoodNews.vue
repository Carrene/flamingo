<template>
  <div id="goodNews">

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
      <div class="good-news-tabs">
        <div
          class="tab"
          @click="goToBacklogNuggets"
          :class="{'selected-tab': selectedGoodNewsTab === 'backlogNuggets'}"
        >
          <div class="counter" v-if="backlogNuggetsCounter">{{ backlogNuggetsCounter !== 0 ? backlogNuggetsCounter : null }}</div>
          <p>Backlog</p>
        </div>
        <div
          class="tab"
          @click="goToTriageNuggets"
          :class="{'selected-tab': selectedGoodNewsTab === 'triageNuggets'}"
        >
          <div class="counter" v-if="triageNuggetsCounter">{{ triageNuggetsCounter !== 0 ? triageNuggetsCounter : null }}</div>
          <p>Triage</p>
        </div>
        <div
          class="tab"
          @click="goToNeedApprovalNuggets"
          :class="{'selected-tab': selectedGoodNewsTab === 'needApprovalNuggets'}"
        >
          <div class="counter" v-if="needApprovalItemsCounter">{{ needApprovalItemsCounter !== 0 ? needApprovalItemsCounter : null }}</div>
          <p>Need Approval</p>
        </div>
        <div class="tab">
          <!-- FIXME: ADD THIS LATER -->
          <!-- <div class="counter"></div> -->
          <p>Hours Reported</p>
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
  name: 'GoodNews',
  data () {
    return {
    }
  },
  computed: {
    ...mapState([
      'selectedGoodNewsTab',
      'backlogNuggetsCounter',
      'triageNuggetsCounter',
      'needApprovalItemsCounter'
    ])
  },
  methods: {
    goToBacklogNuggets () {
      this.$router.push('backlog-nuggets')
    },
    goToTriageNuggets () {
      this.$router.push('triage-nuggets')
    },
    goToNeedApprovalNuggets () {
      this.$router.push('need-approval-nuggets')
    },
    ...mapMutations([
      'setSelectedGoodNewsTab'
    ])
  },
  components: {
    Breadcrumb
  }
}
</script>
