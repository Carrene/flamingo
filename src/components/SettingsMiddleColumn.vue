<template>
  <div id="settingsMiddleColumn">
    <div class="tabs">
      <router-link
        v-for="(tab, routeName) in tabs"
        tag="div"
        :to="tab.path"
        class="tab"
        :active-class="tab.activeClass"
        :key="routeName"
      >
        <simple-svg
          :filepath="tab.iconSrc"
          :fill="$route.name === routeName ? tab.iconColor : tab.activeIconColor"
          class="icon"
          height="20"
        />
        <p>{{ tab.title }}</p>
      </router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
const Profile = () => import(
  /* webpackChunkName: "Profile" */ './Profile'
)

export default {
  name: 'SettingsMiddleColumn',
  data () {
    return {
      tabs: {
        Profile: {
          path: 'profile',
          title: 'Profile',
          iconSrc: require('../assets/profile-field.svg'),
          iconColor: '#FFF',
          activeIconColor: '#232323',
          activeClass: 'selected'
        },
        MyOrganizations: {
          path: 'organizations',
          title: 'Organizations',
          iconSrc: require('../assets/organizations-field.svg'),
          iconColor: '#FFF',
          activeIconColor: '#232323',
          activeClass: 'selected'
        },
        Settings1: {
          path: 'settings1',
          title: 'Settings 1',
          iconSrc: require('../assets/profile-field.svg'),
          iconColor: '#FFF',
          activeIconColor: '#232323',
          activeClass: 'selected'
        },
        Settings2: {
          path: 'settings2',
          title: 'Settings 2',
          iconSrc: require('../assets/profile-field.svg'),
          iconColor: '#FFF',
          activeIconColor: '#232323',
          activeClass: 'selected'
        }
      }
    }
  },
  components: {
    Profile
  }
}
</script>
