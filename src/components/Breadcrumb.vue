<template>
  <div id="breadcrumb">
    <div
      class="crumbs"
      v-for="(crumb, index) in crumbs"
      :key="index"
    >
      {{ crumb }}
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
  }
}
</script>
