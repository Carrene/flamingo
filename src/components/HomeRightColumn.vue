<template>
  <div id="homeRightColumn">
    <div
      class="content details"
      v-if="selectedRightColumnTab === 'details'"
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
      v-if="selectedRightColumnTab === 'events'"
    >
      <event-log v-if="isEventLogActivated" />
    </div>

    <!-- ATTACHMENT -->

    <div
      class="content attachment"
      v-if="selectedRightColumnTab === 'attachments'"
    >
      <attachment
        v-if="isAttachmentActivated"
        :selected-model="activeModel"
      />
    </div>

    <!-- ASSIGNMENT TAB -->

    <div
      class="content assignment"
      v-if="selectedRightColumnTab === 'assignment'"
    >
      <assignment />
    </div>

    <!-- TIME CARD -->

    <div
      class="content time-card"
      v-if="selectedRightColumnTab === 'timeCardForm'"
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
import { mapState, mapMutations } from 'vuex'
import { mixin as clickout } from 'vue-clickout'
import NotificationBell from 'vue-notification-bell'
import NewReleaseForm from './NewReleaseForm'
import UpdateReleaseForm from './UpdateReleaseForm'
import NewProjectForm from './NewProjectForm'
import UpdateNuggetForm from './UpdateNuggetForm'
import NewNuggetForm from './NewNuggetForm'
import UpdateProjectForm from './UpdateProjectForm'
import EventLog from './EventLog'
import Attachment from './Attachment'
import MultipleNuggetsForm from './MultipleNuggetsForm'
import NoFormState from './NoFormState'
import TimeCardForm from './TimeCardForm'
import Assignment from './Assignment'

export default {
  mixins: [clickout],
  name: 'HomeRightColumn',
  data () {
    return {
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
      return !this.$route.name.match(/Projects|Releases|Settings/) ||
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
      return this.$route.path.match(/assigned|triage|need-approval|missing-hours|missing-estimate|hours-reported|delayed-nuggets/) && this.selectedNuggets.length === 1
    },
    tabs () {
      return {
        details: {
          iconSrc: require('@/assets/details.svg'),
          activeIconSrc: require('@/assets/details-active.svg'),
          isSelected: this.selectedRightColumnTab === 'details',
          isDisabled: false,
          label: 'Details'
        },
        events: {
          iconSrc: require('@/assets/events.svg'),
          activeIconSrc: require('@/assets/events-active.svg'),
          isSelected: this.selectedRightColumnTab === 'events',
          isDisabled: !this.isEventLogActivated,
          count: this.eventLogUnreadCount,
          label: 'Events'
        },
        attachments: {
          iconSrc: require('@/assets/attachments.svg'),
          activeIconSrc: require('@/assets/attachments-active.svg'),
          isSelected: this.selectedRightColumnTab === 'attachments',
          isDisabled: !this.isAttachmentActivated,
          label: 'Attachments'
        },
        assignment: {
          iconSrc: require('@/assets/assignment.svg'),
          activeIconSrc: require('@/assets/assignment-active.svg'),
          isSelected: this.selectedRightColumnTab === 'assignment',
          isDisabled: !this.isAssignedActivated,
          label: 'Assignment'
        },
        timeCardForm: {
          iconSrc: require('@/assets/time-card.svg'),
          activeIconSrc: require('@/assets/time-card-active.svg'),
          isSelected: this.selectedRightColumnTab === 'timeCardForm',
          isDisabled: !this.$route.path.match(/assigned|missing-hours|missing-estimate/),
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
      'relatedIssueId',
      'selectedRightColumnTab'
    ])
  },
  methods: {
    selectTab (tab, event) {
      if (event.currentTarget.getAttribute('disabled')) {
        return
      }
      this.setSelectedRightColumnTab(tab)
    },
    ...mapMutations([
      'setSelectedRightColumnTab'
    ])
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
