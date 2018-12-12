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

      <div
        class="organization"
        v-for="organization in organizations"
        :key="organization.id"
      >

        <!-- ORGANIZATION INFO -->

        <div class="info">
          <img
            class="logo"
            :src="organization.logo"
            v-if="organization.logo"
          >
          <img
            class="logo"
            v-else
            src="../assets/profile-default-picture.svg"
          >
          <p class="name">{{ organization.title }}</p>
          <p class="role">{{ organization.role }}</p>
          <p class="member">{{ organization.membersCount }}<span>members</span></p>
        </div>

        <!-- ORGANIZATION ACTIONS -->

        <div class="actions">
          <button
            class="light-primary-button small"
            type="button"
            disabled
          >Invite</button>
          <button
            class="light-primary-button small"
            type="button"
            disabled
          >Leave</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import server from './../server.js'

export default {
  name: 'MyOrganizations',
  data () {
    return {
      organizations: null,
      member: null,
      newOrganizationUrl: {
        name: 'NewOrganization'
      },
      auth: server.authenticator.member
    }
  },
  computed: {
    ...mapState([
      'Member'
    ])
  },
  methods: {
    listOrganizations () {
      this.member.getOrganizations().send().then(resp => {
        this.organizations = resp.json
      })
    }
  },
  beforeMount () {
    this.member = new this.Member({ id: this.auth.id })
  },
  mounted () {
    this.listOrganizations()
  }
}
</script>
