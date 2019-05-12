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
        <div class="tab">In Process Nuggets</div>
        <div class="tab">Upcoming Nuggets</div>
        <div class="tab">Need Estimate</div>
        <div class="tab">Newly Assgined</div>
      </div>

      <inprogress-items></inprogress-items>

    </div>
  </div>
</template>

<script>
const InprogressItems = () => import(
  /* webpackChunkName: "InprogressItems" */ './../components/InprogressItems'
)

export default {
  name: 'Assigned',
  data () {
    return {
    }
  },
  components: {
    InprogressItems
  }
}
</script>
