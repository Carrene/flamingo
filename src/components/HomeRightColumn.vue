<template>
  <div id="homeRightColumn">

    <update-project-form v-if="selectedTab === 'details' && $route.name === 'Projects' && selectedProject" />

    <new-project-form v-else-if="selectedTab === 'details' && $route.name === 'Projects'" />

    <update-nugget-form v-if="selectedTab === 'details' && $route.name === 'Nuggets' && selectedNugget" />

    <new-nugget-form v-else-if="selectedTab === 'details' && $route.name === 'Nuggets'" />

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
const UpdateNuggetForm = () => import(
  /* webpackChunkName: "UpdateNuggetForm" */ './UpdateNuggetForm'
)
const NewNuggetForm = () => import(
  /* webpackChunkName: "NewNuggetForm" */ './NewNuggetForm'
)
const NewProjectForm = () => import(
  /* webpackChunkName: "NewProjectForm" */ './NewProjectForm'
)
const UpdateProjectForm = () => import(
  /* webpackChunkName: "UpdateProjectForm" */ './UpdateProjectForm'
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
          isDisabled: true
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
      'selectedProject',
      'selectedNugget'
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
  components: {
    UpdateNuggetForm,
    NewNuggetForm,
    NewProjectForm,
    UpdateProjectForm,
    Attachment
  }
}
</script>
