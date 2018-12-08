<template>
  <div id="myOrganizations">

    <!-- HEADER -->

    <div class="header">

      <!-- HEADER TITLE -->

      <p class="title">
        Organization
      </p>

      <!-- HEADER ACTIONS -->

      <div class="actions">
        <router-link
          class="primary-button medium"
          tag="button"
          :to="newOrganizationUrl"
        >New organization</router-link>
      </div>
    </div>

    <!-- CONTENT -->

    <div class="content organizations">

      <!-- ORGANIZATION -->

      <div class="organization">

        <!-- ORGANIZATION INFO -->

        <div class="info">
          <img src="">
          <p>carrene</p>
          <p>owner</p>
          <p>52 members</p>
        </div>

        <!-- ORGANIZATION ACTIONS -->

        <div class="actions">
          <button
            class="light-primary-button small"
            type="button"
          >Invite</button>
          <button
            class="light-primary-button small"
            type="button"
          >Leave</button>
        </div>
      </div>
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
