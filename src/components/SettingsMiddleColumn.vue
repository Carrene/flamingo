<template>
  <div id="settingsMiddleColumn">
    <div class="tabs">
      <div class="tab" :class="{selected: selectedTab === 'Profile'}">
        <simple-svg :filepath= "require('../assets/profile-field.svg')"
                    :fill="selectedTab === 'Profile' ? '#FFF' : '#232323'"
                    class="icon"
                    height="20"
        />
        <p>Profile</p>
      </div>
      <div class="tab disabled" :class="{selected: selectedTab === 'Setting 1'}">
        <simple-svg :filepath= "require('../assets/notification-field.svg')"
                    :fill="selectedTab === 'Setting 1' ? '#FFF' : '#232323'"
                    class="icon"
                    height="20"
        />
        <p>Setting 1</p>
      </div>
      <div class="tab disabled" :class="{selected: selectedTab === 'Setting 2'}">
        <simple-svg :filepath="require('../assets/customize-field.svg')"
                    :fill="selectedTab === 'Setting 2' ? '#FFF' : '#232323'"
                    class="icon"
                    height="20"
        />
        <p>Setting 2</p>
      </div>
      <div class="tab disabled" :class="{selected: selectedTab === 'Setting 3'}">
        <simple-svg :filepath="require('../assets/about-field.svg')"
                    :fill="selectedTab === 'Setting 3' ? '#FFF' : '#232323'"
                    class="icon"
                    height="20"
        />
        <p>Setting 3</p>
      </div>
    </div>
    <profile />
  </div>
</template>

<script>
import Profile from '../components/Profile'

export default {
  name: 'SettingsMiddleColumn',
  data () {
    return {
      selectedTab: 'Profile'
    }
  },
  components: {
    Profile
  }
}
</script>
