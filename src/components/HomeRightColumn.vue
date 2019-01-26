<template>
  <div id="homeRightColumn">
    <update-release-form v-if="selectedTab === 'details' && $route.name === 'Releases' && selectedRelease" />

    <new-release-form v-else-if="selectedTab === 'details' && $route.name === 'Releases'" />

    <update-project-form v-if="selectedTab === 'details' && $route.name === 'Projects' && selectedProject" />

    <new-project-form v-else-if="selectedTab === 'details' && $route.name === 'Projects'" />

    <update-nugget-form v-if="selectedTab === 'details' && ($route.name === 'Nuggets' || $route.name === 'Unread') && selectedNugget" />

    <new-nugget-form v-else-if="selectedTab === 'details' && ($route.name === 'Nuggets' || $route.name === 'Unread')" />

    <event-log v-if="selectedTab === 'events' && ($route.name === 'Nuggets' || $route.name === 'Unread')" />

    <attachment v-if="selectedTab === 'attachments' && $route.name === 'Projects' && selectedProject" />

    <div class="tabs">
      <simple-svg
        v-for="(tab, name) in tabs"
        :key="name"
        :filepath="tab.iconSrc"
        :fill="tab.isSelected ? '#5E5375' : '#232323'"
        class="icon"
        :ref="name"
        :class="{selected: tab.isSelected, disabled: tab.isDisabled}"
        @click.native="selectTab(name, $event)"
        :disabled="tab.isDisabled"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mixin as clickout } from 'vue-clickout'
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
          isSelected: this.selectedTab === 'details',
          isDisabled: false
        },
        events: {
          iconSrc: require('@/assets/events.svg'),
          isSelected: this.selectedTab === 'events',
          isDisabled: !this.roomId || !['Nuggets', 'Unread'].includes(this.$route.name)
        },
        attachments: {
          iconSrc: require('@/assets/attachments.svg'),
          isSelected: this.selectedTab === 'attachments',
          isDisabled: !this.selectedProject || this.$route.name !== 'Projects'
        },
        links: {
          iconSrc: require('@/assets/links.svg'),
          isSelected: this.selectedTab === 'links',
          isDisabled: true
        }
      }
    },
    ...mapState([
      'selectedRelease',
      'selectedProject',
      'selectedNugget',
      'roomId'
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
      if (oldValue === 'Projects' && this.selectedTab === 'attachments') {
        this.selectedTab = 'details'
      }
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
    Attachment
  }
}
</script>
