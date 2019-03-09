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
        fill="#232323"
        class="entities-icon"
      />

      <simple-svg
        v-if="filteredCrumbs.length > 1 && crumb.type_ === 'project'"
        :filepath="require('@/assets/project.svg')"
        fill="#232323"
        class="entities-icon"
      />

      <p
        v-if="crumb"
        @click="setPath(crumb)"
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
  },
  methods: {
    setPath (crumb) {
      switch (crumb.type_) {
        case 'release':
          this.$router.push(`/releases/${crumb.id}`)
          break
        case 'project':
          this.$router.push(`/projects/${crumb.id}`)
          break
      }
    }
  }
}
</script>
