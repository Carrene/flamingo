<template>
  <div id="breadcrumb">
    <div
      class="crumbs"
      v-for="(crumb, index) in filteredCrumbs"
      :key="index"
    >

      <simple-svg
        v-if="filteredCrumbs.length > 1 && crumb.type_ === 'release'"
        :filepath="require('@/assets/rocket.svg')"
        fill="#F9F9F9"
        class="entities-icon"
      />

      <simple-svg
        v-if="filteredCrumbs.length > 1 && crumb.type_ === 'project'"
        :filepath="require('@/assets/project.svg')"
        fill="#F9F9F9"
        class="entities-icon"
      />

      <p
        v-if="crumb"
      >
        {{crumb.title}}
      </p>

    </div>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumb',
  data () {
    return {
    }
  },
  props: {
    crumbs: Array
  },
  computed: {
    filteredCrumbs () {
      return this.crumbs.filter(crumb => !!crumb)
    }
  }
}
</script>
