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
        <div class="tab">
          <div class="counter"></div>
          <p>Backlog</p>
        </div>
        <div class="tab">
          <div class="counter"></div>
          <p>Triage</p>
        </div>
        <div class="tab">
          <div class="counter"></div>
          <p>Need Approval</p>
        </div>
        <div class="tab">
          <div class="counter"></div>
          <p>Hours Reported</p>
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
    }
  },
  computed: {
    ...mapState([
    ])
  },
  methods: {
    ...mapMutations([
      'setSelectedZoneTab'
    ])
  },
  components: {
    Breadcrumb
  }
}
</script>
