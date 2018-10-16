<template>
  <div id="homeRightColumn"  v-on-clickaway="showPopups">
    <div class="header">
      <button
        type="button"
        class="new-project-button"
        v-if="!editing"
        @click="activateNewProject"
      >
        <img src="./../assets/plus.svg" class="plus-icon">
        New Project
      </button>
      <button
        type="button"
        class="save-button"
        v-else
        @click="activeSaveButton"
        :disabled="this.disabledSaveButton"
      >
        <img src="./../assets/save.svg" class="save-icon">
        Save
      </button>
    </div>
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
    <project-form v-if="selectedTab === 'details'"
                  :buttonAction="buttonAction"
                  :popUpButton="popUpButton"
                  :activateProjectButton="activateProjectButton"
                  @toggleSaveButton="toggleSaveButton"
                  @resetButtonAction="buttonAction = ''"
                  @dirtyForm="setDirtyForm"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway'
import ProjectForm from './ProjectForm'

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
      'editing',
      'selectedProject'
    ])
  },
  methods: {
    setDirtyForm (value) {
      this.isFormDirty = value
    },
    showPopups () {
      if (this.editing && this.selectedTab === 'details' && this.isFormDirty) {
        this.popUpButton = true
      }
    },
    activateNewProject () {
      this.activateProjectButton = !this.activateProjectButton
    },
    save () {
      this.buttonAction = 'save'
    },
    create () {
      this.buttonAction = 'create'
    },
    toggleSaveButton (validation) {
      this.disabledSaveButton = validation
    },
    activeSaveButton () {
      this.setEditing(!this.editing)
      if (this.selectedProject.id) {
        this.save()
      } else {
        this.create()
      }
    },
    ...mapMutations([
      'setEditing'
    ])
  },
  components: {
    ProjectForm
  }
}
</script>
