<template>
  <div id="settings">

    <!-- HEADER -->

    <div class="header">
      <img
        class="icon"
        src="../assets/notification.svg"
      >
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
          :fill="'#FFF'"
          class="pic"
          @click.native="toggleMenuTooltip"
        />

        <!-- MENU TOOLTIP -->

        <div
          class="tooltip-container right profile"
          v-if="showMenuTooltip"
          v-on-clickaway="toggleMenuTooltip.bind(undefined, false)"
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
    <router-view class="setting-content" />

  </div>
</template>

<script>
import server from '../server'
import { mixin as clickaway } from 'vue-clickaway'
const Profile = () => import(
  /* webpackChunkName: "Profile" */ '../components/Profile'
)
const SettingsRightColumn = () => import(
  /* webpackChunkName: "SettingsRightColumn" */ '../components/SettingsRightColumn'
)
const SettingsNavigation = () => import(
  /* webpackChunkName: "SettingsNavigation" */ '../components/SettingsNavigation'
)
const SettingsMiddleColumn = () => import(
  /* webpackChunkName: "SettingsMiddleColumn" */ '../components/SettingsMiddleColumn'
)

export default {
  name: 'Settings',
  mixins: [clickaway],
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
    Profile,
    SettingsNavigation,
    SettingsRightColumn,
    SettingsMiddleColumn
  }
}
</script>
