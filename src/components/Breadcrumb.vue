<template>
  <div id="breadcrumb">
    <div
      :class="['crumbs']"
      v-for="(crumb, index) in filteredCrumbs"
      :key="index"
    >

      <simple-svg
        v-if="filteredCrumbs.length > 1 && crumb.type_ === 'release'"
        :filepath="require('@/assets/rocket.svg')"
        class="entities-icon"
      />

      <simple-svg
        v-if="filteredCrumbs.length > 1 && crumb.type_ === 'project'"
        :filepath="require('@/assets/project.svg')"
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
      if (crumb.type_ === 'release' && !this.$route.name.match('Releases')) {
        this.$router.push('/releases')
      } else if (crumb.type_ === 'project' && !this.$route.name.match('Projects')) {
        if (this.$route.params.releaseId) {
          this.$router.push(`/releases/${this.$route.params.releaseId}/projects`)
        } else {
          this.$router.push('/projects')
        }
      }
    }
  },
  updated () {
    this.$nextTick(() => {
      document.querySelector('.crumbs:last-child').style.opacity = '100'
    }
    )
  },
  mounted () {
    if (this.crumbs.filter(Boolean).length === 1) {
      document.querySelector('.crumbs:last-child').style.opacity = '100'
    }
  }
}
</script>
