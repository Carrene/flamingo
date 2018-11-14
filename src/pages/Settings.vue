<template>
  <div id="settings">

    <!-- HEADER -->

    <div class="header">
      <p class="header-title">Personal Setting</p>
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
    Profile,
    SettingsLeftColumn,
    SettingsRightColumn,
    SettingsMiddleColumn
  }
}
</script>
