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

      <new-nugget-form v-else-if="isNewNuggetActivated" />

      <no-form-state v-else-if="
      !selectedNuggets.length &&
      $route.name.match(/Nuggets|Unread|Subscribed/)
      " />

    </div>

    <!-- EVENT -->

    <div
      class="content events"
      v-if="selectedTab === 'events'"
    >
      <event-log v-if="isEventLogActivated" />
    </div>

    <!-- ATTACHMENT -->

    <div
      class="content attachment"
      v-if="selectedTab === 'attachments'"
    >
      <attachment
        v-if="isAttachmentActivated"
        :selected-model="activeModel"
      />
    </div>

    <!-- ASSIGNMENT TAB -->

    <div
      class="content assignment"
      v-if="selectedTab === 'assignment'"
    >
      <assignment />
    </div>

    <!-- TIME CARD -->

    <div
      class="content time-card"
      v-if="selectedTab === 'timeCardForm'"
    >
      <time-card-form />
    </div>
    <div class="tabs">
      <notification-bell
        counterPadding="4px 7px"
        v-for="(tab, name) in tabs"
        :key="name"
        :icon="tab.isSelected ? tab.activeIconSrc : tab.iconSrc"
        class="icon"
        :class="{selected: tab.isSelected, disabled: tab.isDisabled}"
        @click.native="selectTab(name, $event)"
        :disabled="tab.isDisabled"
        :count="!tab.isDisabled ? tab.count : null"
        :size="20"
        :title="tab.label"
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
const TimeCardForm = () => import(
  /* webpackChunkName: "TimeCardForm" */ './TimeCardForm'
)
const Assignment = () => import(
  /* webpackChunkName: "Assignment" */ './Assignment'
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
      return !this.$route.name.match(/Projects|Releases|Settings/) &&
        (this.selectedNuggets.length === 1) && this.roomId
    },
    isNewNuggetActivated () {
      return this.$route.name.match(/Nuggets|InProgressItems|UpcomingItems|NeedEstimateItems|NewlyAssigned|Subscribed|Unread|MissingHours|MissingEstimate|ExpiredTriage|NeedApprovalItems|HoursReported/) ||
        (this.$route.name.match(/Unread|Subscribed|Assigned/) && this.relatedIssueId)
    },
    isReleaseActivated () {
      return this.$route.name.match('Releases') && this.selectedRelease
    },
    isEventLogActivated () {
      return this.isNuggetActivated || this.isProjectActivated || this.isReleaseActivated || this.isAssignedActivated
    },
    isAttachmentActivated () {
      return this.isNuggetActivated || this.isProjectActivated
    },
    isAssignedActivated () {
      return this.$route.path.match(/assigned|triage|need-approval|missing-hours|missing-estimate|hours-reported/) && this.selectedNuggets.length === 1
    },
    tabs () {
      return {
        details: {
          iconSrc: require('@/assets/details.svg'),
          activeIconSrc: require('@/assets/details-active.svg'),
          isSelected: this.selectedTab === 'details',
          isDisabled: false,
          label: 'Details'
        },
        events: {
          iconSrc: require('@/assets/events.svg'),
          activeIconSrc: require('@/assets/events-active.svg'),
          isSelected: this.selectedTab === 'events',
          isDisabled: !this.isEventLogActivated,
          count: this.eventLogUnreadCount,
          label: 'Events'
        },
        attachments: {
          iconSrc: require('@/assets/attachments.svg'),
          activeIconSrc: require('@/assets/attachments-active.svg'),
          isSelected: this.selectedTab === 'attachments',
          isDisabled: !this.isAttachmentActivated,
          label: 'Attachments'
        },
        assignment: {
          iconSrc: require('@/assets/assignment.svg'),
          activeIconSrc: require('@/assets/assignment-active.svg'),
          isSelected: this.selectedTab === 'assignment',
          isDisabled: !this.isAssignedActivated,
          label: 'Assignment'
        },
        timeCardForm: {
          iconSrc: require('@/assets/time-card.svg'),
          activeIconSrc: require('@/assets/time-card-active.svg'),
          isSelected: this.selectedTab === 'timeCardForm',
          isDisabled: !this.$route.path.match(/assigned|missing-hours|missing-estimate|need-approval|hours-reported/),
          label: 'Time Card Form'
        }
      }
    },
    ...mapState([
      'selectedItem',
      'selectedRelease',
      'selectedProject',
      'selectedNuggets',
      'roomId',
      'eventLogUnreadCount',
      'relatedIssueId'
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
    $route: {
      immediate: true,
      handler (newValue) {
        if (newValue.path.match('assigned')) {
          this.selectedTab = 'timeCardForm'
        } else {
          this.selectedTab = 'details'
        }
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
    Attachment,
    NotificationBell,
    MultipleNuggetsForm,
    NoFormState,
    TimeCardForm,
    Assignment
  }
}
</script>
