<template>
  <div
    id="avatar"
    class="avatar small"
  >
    <img
      class="pic"
      :src="auth.member.avatar"
      v-if="auth.member.avatar"
      @click="toggleMenuTooltip"
    >
    <simple-svg
      v-else
      :filepath="require('./../assets/profile-field.svg')"
      fill="#C9C9C9"
      class="pic"
      @click.native="toggleMenuTooltip"
    />

    <!-- FIXME: Add this after role has been added to users -->
    <!--<img :src="roleImgSrc" class="icon"/>-->

    <!-- MENU TOOLTIP -->

    <div
      class="tooltip-container right profile"
      v-if="showMenuTooltip"
      v-on-clickout="toggleMenuTooltip.bind(undefined, false)"
    >
      <div class="tooltip-header">
        <label class="name-label">{{ auth.member.name }}</label>
        <label class="email-label">{{ auth.member.email }}</label>
      </div>
      <div class="tooltip-content">
        <div class="menu-item">
          <simple-svg
            :filepath="require('@/assets/settings.svg')"
            fill="#232323"
            class="menu-icons"
          />
          <router-link
            to="/settings"
            tag="div"
          >Settings</router-link>
        </div>
        <div class="menu-item">
          <simple-svg
            :filepath="require('@/assets/help.svg')"
            fill="#232323"
            class="menu-icons"
          />
          <div>Help</div>
        </div>
        <div
          class="menu-item"
          @click="logout"
        >
          <simple-svg
            :filepath="require('@/assets/logout.svg')"
            fill="#232323"
            class="menu-icons"
          />
          <div>logout</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mixin as clickout } from 'vue-clickout'
import server from '../server'

export default {
  mixins: [clickout],
  data () {
    return {
      auth: server.authenticator,
      showMenuTooltip: false

    }
  },
  methods: {
    logout () {
      server.logout()
      this.$router.push('/login')
    },
    toggleMenuTooltip (value) {
      if (typeof value === 'boolean') {
        this.showMenuTooltip = value
      } else {
        this.showMenuTooltip = !this.showMenuTooltip
      }
    }
  }
}
</script>
