<template>
  <div id="settings">

    <!-- HEADER -->

    <div class="header">
      <div class="avatar small">
        <img
          class="pic"
          :src="auth.member.avatar"
          v-if="auth.member.avatar"
          @click="toggleMenuTooltip"
        >
        <simple-svg
          v-else
          :filepath="require('./../assets/profile-default-picture.svg')"
          :fill="'#C9C9C9'"
          class="pic"
          @click.native="toggleMenuTooltip"
        />

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
              <img
                src="../assets/settings.svg"
                class="menu-icons"
              >
              <router-link
                to="/settings"
                tag="div"
              >Settings</router-link>
            </div>
            <div class="menu-item">
              <img
                src="../assets/help.svg"
                class="menu-icons"
              >
              <div>Help</div>
            </div>
            <div
              class="menu-item"
              @click="logout"
            >
              <img
                src="../assets/logout.svg"
                class="menu-icons"
              >
              <div>logout</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CONTENT -->

    <settings-navigation />
    <div class="contents">
      <router-view />
    </div>
  </div>
</template>

<script>
import server from '../server'
import { mixin as clickout } from 'vue-clickout'
const SettingsNavigation = () => import(
  /* webpackChunkName: "SettingsNavigation" */ '../components/SettingsNavigation'
)

export default {
  name: 'Settings',
  mixins: [clickout],
  data () {
    return {
      auth: server.authenticator,
      showMenuTooltip: false
    }
  },
  methods: {
    toggleMenuTooltip (value) {
      if (typeof value === 'boolean') {
        this.showMenuTooltip = value
      } else {
        this.showMenuTooltip = !this.showMenuTooltip
      }
    },
    logout () {
      server.logout()
      this.$router.push('/login')
    }
  },
  components: {
    SettingsNavigation
  }
}
</script>
