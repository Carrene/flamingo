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
      <div class="tab disabled" :class="{selected: selectedTab === 'Notification'}">
        <simple-svg :filepath= "require('../assets/notification-field.svg')"
                    :fill="selectedTab === 'Notification' ? '#FFF' : '#232323'"
                    class="icon"
                    height="20"
        />
        <p>Notifications</p>
      </div>
      <div class="tab disabled" :class="{selected: selectedTab === 'Personalization'}">
        <simple-svg :filepath="require('../assets/customize-field.svg')"
                    :fill="selectedTab === 'Personalization' ? '#FFF' : '#232323'"
                    class="icon"
                    height="20"
        />
        <p>Personalization</p>
      </div>
      <div class="tab disabled" :class="{selected: selectedTab === 'About'}">
        <simple-svg :filepath="require('../assets/about-field.svg')"
                    :fill="selectedTab === 'About' ? '#FFF' : '#232323'"
                    class="icon"
                    height="20"
        />
        <p>About</p>
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
