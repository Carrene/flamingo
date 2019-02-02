<template>
  <div id="homeRightColumn">
    <div
      class="content details"
      v-if="selectedTab === 'details'"
    >
      <update-release-form v-if="$route.name === 'Releases' && selectedRelease" />

      <new-release-form v-else-if="$route.name === 'Releases'" />

      <update-project-form v-if="$route.name.match('Projects') && selectedProject" />

      <new-project-form v-else-if="$route.name.match('Projects')" />

      <update-nugget-form v-if="$route.name.match(/Nuggets|Unread/) && selectedNugget" />

      <new-nugget-form v-else-if="$route.name.match(/Nuggets|Unread/)" />
    </div>

    <div
      class="content events"
      v-if="selectedTab === 'events'"
    >
      <event-log v-if="$route.name.match( /Nuggets|Unread/ )" />
    </div>

    <div
      class="content attachment"
      v-if="selectedTab === 'attachments'"
    >
      <attachment
        v-if="($route.name.match('Projects') && selectedProject) || ($route.name.match( /Nuggets/ ) && selectedNugget)"
        :selectedModel="$route.name.match( /Nuggets/ ) ? this.selectedNugget : this.selectedProject"
      />
    </div>

    <div class="tabs">
      <notification-bell
        v-for="(tab, name) in tabs"
        :key="name"
        :icon="tab.isSelected ? tab.activeIconSrc : tab.iconSrc"
        class="icon"
        :class="{selected: tab.isSelected, disabled: tab.isDisabled}"
        @click.native="selectTab(name, $event)"
        :disabled="tab.isDisabled"
        :count="!tab.isDisabled ? tab.count : null"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mixin as clickout } from 'vue-clickout'
import NotificationBell from 'vue-notification-bell'
const NewReleaseForm = () => import(
  /* webpackChunkName: "NewReleaseForm" */ './NewReleaseForm'
)
const UpdateReleaseForm = () => import(
  /* webpackChunkName: "UpdateReleaseForm" */ './UpdateReleaseForm'
)
const NewProjectForm = () => import(
  /* webpackChunkName: "NewProjectForm" */ './NewProjectForm'
)
const UpdateNuggetForm = () => import(
  /* webpackChunkName: "UpdateNuggetForm" */ './UpdateNuggetForm'
)
const NewNuggetForm = () => import(
  /* webpackChunkName: "NewNuggetForm" */ './NewNuggetForm'
)
const UpdateProjectForm = () => import(
  /* webpackChunkName: "UpdateProjectForm" */ './UpdateProjectForm'
)
const EventLog = () => import(
  /* webpackChunkName: "EventLog" */ './EventLog'
)
const Attachment = () => import(
  /* webpackChunkName: "Attachment" */ './Attachment'
)

export default {
  mixins: [clickout],
  name: 'HomeRightColumn',
  data () {
    return {
      selectedTab: 'details'
    }
  },
  computed: {
    tabs () {
      return {
        details: {
          iconSrc: require('@/assets/details.svg'),
          activeIconSrc: require('@/assets/details-active.svg'),
          isSelected: this.selectedTab === 'details',
          isDisabled: false
        },
        events: {
          iconSrc: require('@/assets/events.svg'),
          activeIconSrc: require('@/assets/events-active.svg'),
          isSelected: this.selectedTab === 'events',
          isDisabled: !this.roomId || !this.$route.name.match(/Nuggets|Unread/),
          count: this.eventLogUnreadCount
        },
        attachments: {
          iconSrc: require('@/assets/attachments.svg'),
          activeIconSrc: require('@/assets/attachments-active.svg'),
          isSelected: this.selectedTab === 'attachments',
          isDisabled: !this.selectedProject || !this.$route.name.match('Projects')
        },
        links: {
          iconSrc: require('@/assets/links.svg'),
          activeIconSrc: require('@/assets/links-active.svg'),
          isSelected: this.selectedTab === 'links',
          isDisabled: true
        }
      }
    },
    ...mapState([
      'selectedRelease',
      'selectedProject',
      'selectedNugget',
      'roomId',
      'eventLogUnreadCount'
    ])
  },
  methods: {
    selectTab (tab, event) {
      if (event.currentTarget.getAttribute('disabled')) {
        return
      }
      this.selectedTab = tab
    }
  },
  watch: {
    '$route.name' (newValue, oldValue) {
      this.selectedTab = 'details'
    }
  },
  components: {
    NewReleaseForm,
    UpdateReleaseForm,
    NewProjectForm,
    UpdateProjectForm,
    NewNuggetForm,
    UpdateNuggetForm,
    EventLog,
    Attachment,
    NotificationBell
  }
}
</script>
