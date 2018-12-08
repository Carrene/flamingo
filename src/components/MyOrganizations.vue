<template>
  <div id="organizations">
    <div class="org-action">
      <p>Organization</p>
      <router-link
        class="primary-button medium"
        tag="button"
        :to="newOrganizationUrl"
      >New organization</router-link>
    </div>
    <div class="org-info">
      <img
        src=""
      >
      <p>
      </p>
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
      organizations: null,
      newOrganizationUrl: {
        name: 'NewOrganization'
      }
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
        this.organizations = resp.models[0]
      })
    }
  },
  mounted () {
    this.listOrganizations()
  }
}
</script>
