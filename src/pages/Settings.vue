<template>
  <div id="settings">

    <!-- HEADER -->

    <div class="header">
      <p class="header-title">Personal Setting</p>
      <img class="icon" src="../assets/notification.svg">
      <img class="avatar" :src="auth.member.avatar" v-if="auth.member.avatar">
      <simple-svg v-else
                  :filepath="require('./../assets/profile-default-picture.svg')"
                  :fill="'#FFF'"
                  height="30"
                  class="avatar"
      />
    </div>

    <!-- CONTENT -->

    <settings-left-column />
    <settings-middle-column />
    <settings-right-column />

  </div>
</template>

<script>
import Profile from '../components/Profile'
import SettingsRightColumn from '../components/SettingsRightColumn'
import SettingsLeftColumn from '../components/SettingsLeftColumn'
import SettingsMiddleColumn from '../components/SettingsMiddleColumn'
import server from '../server'

export default {
  name: 'Settings',
  data () {
    return {
      auth: server.authenticator
    }
  },
  components: {
    Profile,
    SettingsLeftColumn,
    SettingsRightColumn,
    SettingsMiddleColumn
  }
}
</script>
