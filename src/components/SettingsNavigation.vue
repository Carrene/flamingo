<template>
  <div id="settingsNavigation">
    <ul class="tabs">
      <li class="header">Personal Settings</li>
      <router-link
        v-for="(tab, routeName) in tabs"
        tag="li"
        :to="tab.path"
        class="tab"
        :active-class="tab.activeClass"
        :key="routeName"
      >
        <p class="title">{{ tab.title }}</p>
      </router-link>
    </ul>
  </div>
</template>

<script>

export default {
  name: 'SettingsNavigation',
  data () {
    return {
      tabs: {
        Profile: {
          path: 'profile',
          title: 'Profile',
          activeClass: 'selected'
        },
        Account: {
          path: 'account',
          title: 'Account',
          activeClass: 'selected'
        },
        MyOrganizations: {
          path: 'organizations',
          title: 'Organizations',
          activeClass: 'selected'
        }
      }
    }
  }
}
</script>
