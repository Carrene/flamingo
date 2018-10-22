<template>
  <div id="homeRightColumn"  v-on-clickaway="showPopups">

    <update-project-form v-if="selectedScope === 'Projects' && selectedProject.id"/>

    <new-project-form v-if="selectedScope === 'Projects' && !selectedProject.id"/>

    <div class="tabs">
      <div class="icons" :class="{selected: selectedTab === 'details'}" @click="selectedTab = 'details'">
        <img :src="detailsSrc" class="icon-detail-icon-maestro details-icon">
      </div>
      <div class="icons" :class="{selected: selectedTab === 'event'}" @click="selectedTab = 'event'">
        <img :src="eventSrc" class="icon-event-icon event-icon">
      </div>
      <div class="icons" :class="{selected: selectedTab === 'attachment'}" @click="selectedTab = 'attachment'">
        <img :src="attachmentSrc" class="attachment-icon">
      </div>
      <div class="icons" :class="{selected: selectedTab === 'link'}" @click="selectedTab = 'link'">
        <img :src="linkSrc" class="link-icon">
      </div>
    </div>
    <update-nugget-form v-if="selectedTab === 'details' && selectedScope === 'Nuggets' && selectedNugget"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway'
import UpdateNuggetForm from './UpdateNuggetForm'
import NewProjectForm from './NewProjectForm'
import UpdateProjectForm from './UpdateProjectForm'

export default {
  mixins: [ clickaway ],
  name: 'HomeRightColumn',
  data () {
    return {
      selectedTab: 'details',
      disabledSaveButton: true,
      buttonAction: '',
      activateProjectButton: false,
      popUpButton: false,
      isFormDirty: false
    }
  },
  computed: {
    eventSrc () {
      return require(`@/assets/event${this.selectedTab === 'event' ? '-selected' : ''}.svg`)
    },
    detailsSrc () {
      return require(`@/assets/details${this.selectedTab === 'details' ? '-selected' : ''}.svg`)
    },
    attachmentSrc () {
      return require(`@/assets/attachment${this.selectedTab === 'attachment' ? '-selected' : ''}.svg`)
    },
    linkSrc () {
      return require(`@/assets/link${this.selectedTab === 'link' ? '-selected' : ''}.svg`)
    },
    ...mapState([
      'selectedProject',
      'selectedScope',
      'selectedNugget'
    ])
  },
  methods: {
    setDirtyForm (value) {
      this.isFormDirty = value
    },
    showPopups () {
      if (this.selectedTab === 'details' && this.isFormDirty) {
        this.popUpButton = true
      }
    }
  },
  components: {
    UpdateNuggetForm,
    NewProjectForm,
    UpdateProjectForm
  }
}
</script>
