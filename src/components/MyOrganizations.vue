<template>
  <div id="organizations">
    <div class="org-action">
      <p>Organization</p>
      <button
        class="primary-button small"
        type="button"
        disabled
      >New</button>
    </div>
    <div class="org-info">
      <img
        src=""
        alt=""
      >
      <button
        class="light-primary-button small"
        type="button"
        disabled
      >Leave</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'MyOrganizations',
  data () {
    return {
    }
  },
  computed: {
    ...mapState([
      'CasOrganization'
    ])
  },
  methods: {
    listOrganizations () {
      this.CasOrganization.load().send().then(resp => {
        console.log(resp)
      })
    }
  },
  mounted () {
    this.listOrganizations()
  }
}
</script>
