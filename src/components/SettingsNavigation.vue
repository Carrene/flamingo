<template>
  <div id="settingsNavigation">

    <!-- PERSONAL SETTINGS -->

    <ul class="tabs">
      <li class="header">Personal Settings</li>
      <router-link
        v-for="(tab, routeName) in profileSettingTabs"
        tag="li"
        :to="tab.path"
        class="tab"
        :active-class="tab.activeClass"
        :key="routeName"
      >
        <p class="title">{{ tab.title }}</p>
      </router-link>
    </ul>

    <!-- MAESTRO SETTINGS -->

    <ul class="tabs">
      <li class="header">Maestro Settings</li>
      <router-link
        v-for="(tab, routeName) in maestroSettingTabs"
        tag="li"
        :to="tab.path"
        class="tab"
        :active-class="tab.activeClass"
        :key="routeName"
      >
        <p class="title">{{ tab.title }}</p>
      </router-link>
    </ul>

    <!-- OTHER -->

    <ul class="tabs">
      <li class="header">Other</li>
      <router-link
        v-for="(tab, routeName) in otherTabs"
        tag="li"
        :to="tab.path"
        class="tab"
        :active-class="tab.activeClass"
        :key="routeName"
      >
        <p class="title">{{ tab.title }}</p>
      </router-link>
    </ul>

    <!-- FOOTER -->

    <footer class="footer">
      <!-- FIXME: Get date from back-end -->
      <p class="copy-right">© 2019 Xeba Technologies</p>
      <p class="version">{{ version }}</p>
    </footer>
  </div>
</template>

<script>

export default {
  name: 'SettingsNavigation',
  data () {
    return {
      profileSettingTabs: {
        Profile: {
          path: {
            name: 'Profile'
          },
          title: 'Profile',
          activeClass: 'selected'
        },
        Security: {
          path: {
            name: 'Security'
          },
          title: 'Security',
          activeClass: 'selected'
        },
        MyOrganizations: {
          path: {
            name: 'Accounts'
          },
          title: 'Accounts',
          activeClass: 'selected'
        }
      },
      maestroSettingTabs: {
        users: {
          path: {
            name: 'Users'
          },
          title: 'Users',
          activeClass: 'selected'
        },
        groups: {
          path: {
            name: 'Groups'
          },
          title: 'Groups',
          activeClass: 'selected'
        },
        specialties: {
          path: {
            name: 'Specialties'
          },
          title: 'Specialties',
          activeClass: 'selected'
        },
        // FIXME: ADD LATER!
        // phases: {
        //   path: {
        //     name: 'Phases'
        //   },
        //   title: 'Phases',
        //   activeClass: 'selected'
        // },
        workflows: {
          path: {
            name: 'Workflows'
          },
          title: 'Workflows',
          activeClass: 'selected'
        },
        tags: {
          path: {
            name: 'Tags'
          },
          title: 'Tags',
          activeClass: 'selected'
        },
        calendar: {
          path: {
            name: 'Calendar'
          },
          title: 'Calendar',
          activeClass: 'selected'
        }
      },
      otherTabs: {
        ReleaseNote: {
          path: {
            name: 'ReleaseNote'
          },
          title: 'Release Note',
          activeClass: 'selected'
        }
      },
      version: require('../../package.json').version
    }
  }
}
</script>
