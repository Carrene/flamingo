<template>
  <div id="breadcrumb">
    <div
      class="crumbs"
      v-for="(crumb, index) in crumbs"
      :key="index"
    >
      <p v-if="crumb">
        {{ crumb.title }}
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
  mounted () {
  }
}
</script>
