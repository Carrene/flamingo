<template>
  <div id="settings">

    <!-- HEADER -->

    <div class="header">
      <p class="header-title">Personal Setting</p>
    </div>

    <!-- CONTENT -->

    <div class="settings-content">
      <p class="title">{{ selectedSettingsTab }}</p>
      <profile/>
    </div>

  </div>
</template>

<script>
import Profile from '../components/Profile'
import { mapState } from 'vuex'

export default {
  name: 'Settings',
  data () {
    return {
    }
  },
  computed: mapState([
    'selectedSettingsTab'
  ]),
  components: {
    Profile
  }
}
</script>
