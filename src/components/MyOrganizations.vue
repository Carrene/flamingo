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
      <!-- FIXME: Add v-for to organization -->
      <div class="organization">

        <!-- ORGANIZATION INFO -->

        <div class="info">
          <img class="logo" src="../assets/profile-default-picture.svg">
          <p class="name">Carrene</p>
          <p class="role">owner</p>
          <p class="member">25<span>members</span></p>
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
      'Organization'
    ])
  }
  // TODO: Uncomment this
  // methods: {
  //   listOrganizations () {
  //     this.Organization.load().send().then(resp => {
  //       console.log(resp)
  //       this.organizations = resp.models
  //     })
  //   }
  // },
  // mounted () {
  //   this.listOrganizations()
  // }
}
</script>
