<template>
  <div id="homeRightColumn">
    <div
      class="content details"
      v-if="selectedTab === 'details'"
    >
      <update-release-form v-if="$route.name === 'Releases' && selectedRelease" />

      <new-release-form v-else-if="$route.name === 'Releases'" />

      <update-project-form v-if="isProjectActivated" />

      <new-project-form v-else-if="$route.name.match('Projects')" />

      <update-nugget-form v-if="isNuggetActivated" />

      <multiple-nuggets-form v-else-if="selectedNuggets.length > 1" />

      <new-nugget-form v-else-if="$route.name.match(/Unread|Subscribed|Nuggets/)" />

      <no-form-state v-else-if="!selectedNuggets.length"/>

    </div>

    <div
      class="content events"
      v-if="selectedTab === 'events'"
    >
      <event-log v-if="isNuggetActivated" />
    </div>

    <div
      class="content attachment"
      v-if="selectedTab === 'attachments'"
    >
      <attachment
        v-if="isNuggetActivated || isProjectActivated"
        :selected-model="activeModel"
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
        :size="20"
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
const MultipleNuggetsForm = () => import(
  /* webpackChunkName: "MultipleNuggetsForm" */ './MultipleNuggetsForm'
)
const NoFormState = () => import(
  /* webpackChunkName: "NoFormState" */ './NoFormState'
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
    activeModel () {
      if (this.isProjectActivated) {
        return this.selectedProject
      } else if (this.isNuggetActivated) {
        return this.selectedNuggets[0]
      }
    },
    isProjectActivated () {
      return this.$route.name.match('Projects') && this.selectedProject
    },
    isNuggetActivated () {
      return this.$route.name.match(/Nuggets|Unread|Subscribed/) && (this.selectedNuggets.length === 1) && this.roomId
    },
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
          isDisabled: !this.isNuggetActivated,
          count: this.eventLogUnreadCount
        },
        attachments: {
          iconSrc: require('@/assets/attachments.svg'),
          activeIconSrc: require('@/assets/attachments-active.svg'),
          isSelected: this.selectedTab === 'attachments',
          isDisabled: !this.isProjectActivated && !this.isNuggetActivated
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
      'selectedNuggets',
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
    NotificationBell,
    MultipleNuggetsForm,
    NoFormState
  }
}
</script>
