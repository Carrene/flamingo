<template>
  <div id="noFormState">
    <div class="header">
      <avatar />
    </div>
    <div class="unselected content">
      <simple-svg
        :filepath="require('@/assets/unselected.svg')"
        fill="#232323"
        class="unselected-icon"
      />
      <div class="description">
        <p class="title">Get Select</p>
        <p class="subtitle">Please select the nugget to show detail</p>
      </div>
    </div>
  </div>
</template>

<script>
const Avatar = () => import(
  /* webpackChunkName: "Avarat" */ '../components/Avatar'
)

export default {
  components: {
    Avatar
  }
}
</script>
