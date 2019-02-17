<template>
  <div id="nuggetsMenu">
    <ul class="menu">

      <li class="item">Subscribe</li>

      <li class="item">Unsubscribe</li>

      <li
        class="item project"
        @mouseover="showingProjectSubmenu=true"
        @mouseout="showingProjectSubmenu=false"
      >
        <p>Change Project</p>
        <simple-svg
          :filepath="require('@/assets/right-arrow.svg')"
          fill="#232323"
          class="arrow-icon"
        />
        <div
          class="submenu"
          v-if="showingProjectSubmenu"
        >lorem</div>
      </li>

      <li
        class="item priority"
        @mouseover="showingPrioritySubmenu=true"
        @mouseout="showingPrioritySubmenu=false"
      >
        <p>Change Priority</p>
        <simple-svg
          :filepath="require('@/assets/right-arrow.svg')"
          fill="#232323"
          class="arrow-icon"
        />
        <div
          class="submenu"
          v-if="showingPrioritySubmenu"
        >lorem</div>
      </li>

      <li
        class="item status"
        @mouseover="showingStatusSubmenu=true"
        @mouseout="showingStatusSubmenu=false"
      >
        <p>Change Status</p>
        <simple-svg
          :filepath="require('@/assets/right-arrow.svg')"
          fill="#232323"
          class="arrow-icon"
        />
        <div
          class="submenu"
          v-if="showingStatusSubmenu"
        >lorem</div>
      </li>

      <li class="item">Report Bug</li>

    </ul>
  </div>
</template>

<script>

export default {
  name: 'NuggetsMenu',
  data () {
    return {
      showingProjectSubmenu: false,
      showingStatusSubmenu: false,
      showingPrioritySubmenu: false
    }
  },
  methods: {
  },
  mounted () {
    this.$emit('mounted')
  }
}
</script>
