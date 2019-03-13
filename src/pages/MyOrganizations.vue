<template>
  <div id="myOrganizations">

    <!-- HEADER -->

    <div class="header">

      <!-- HEADER TITLE -->

      <p class="title">Organizations</p>

      <!-- ACTION -->

      <button class="secondary-button outlined small">New organization</button>
    </div>

    <!-- CONTENT -->

    <div class="content">

      <!-- ORGANIZATION -->

      <div class="left-column">
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
            <router-link
              :to="{
              name: 'Invite',
              params: {
                id: organization.id
              }
            }"
              class="secondary-button small"
              tag="button"
              v-if="organization.role === 'owner'"
            >Invite</router-link>
            <button
              class="secondary-button outlined small"
              type="button"
              disabled
            >Leave</button>
          </div>
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
      this.member.listOrganizations().send().then(resp => {
        this.organizations = resp.models
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
