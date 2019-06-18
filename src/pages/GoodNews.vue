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
          <!-- FIXME: ADD THIS LATER -->
          <!-- <div class="counter"></div> -->
          <p>Backlog</p>
        </div>
        <div
          class="tab"
          @click="goToTriageNuggets"
          :class="{'selected-tab': selectedGoodNewsTab === 'triageNuggets'}"
        >
          <!-- FIXME: ADD THIS LATER -->
          <!-- <div class="counter"></div> -->
          <p>Triage</p>
        </div>
        <div
          class="tab"
          @click="goToNeedApprovalNuggets"
          :class="{'selected-tab': selectedGoodNewsTab === 'needApprovalNuggets'}"
        >
          <!-- FIXME: ADD THIS LATER -->
          <!-- <div class="counter"></div> -->
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
      'selectedGoodNewsTab'
    ])
  },
  methods: {
    goToBacklogNuggets () {
      this.$router.push('backlog-nuggets')
      this.setSelectedGoodNewsTab('backlogNuggets')
    },
    goToTriageNuggets () {
      this.$router.push('triage-nuggets')
      this.setSelectedGoodNewsTab('triageNuggets')
    },
    goToNeedApprovalNuggets () {
      this.$router.push('need-approval-nuggets')
      this.setSelectedGoodNewsTab('needApprovalNuggets')
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
