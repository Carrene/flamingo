<template>
  <div id="homeRightColumn">

    <update-project-form v-if="selectedTab === 'details' && selectedScope === 'Projects' && selectedProject"/>

    <new-project-form v-else-if="selectedTab === 'details' && selectedScope === 'Projects'"/>

    <update-nugget-form v-if="selectedTab === 'details' && selectedScope === 'Nuggets' && selectedNugget"/>

    <new-nugget-form v-else-if="selectedTab === 'details' && selectedScope === 'Nuggets'"/>

    <div class="tabs">
      <simple-svg :filepath="require('@/assets/details.svg')"
                  :fill="selectedTab === 'details' ? '#5E5375' : '#232323'"
                  class="icon"
                  :class="{selected: selectedTab === 'details'}"
                  @click.native="selectedTab = 'details'"
      />
      <simple-svg :filepath="require('@/assets/events.svg')"
                  :fill="selectedTab === 'events' ? '#5E5375' : '#232323'"
                  class="icon disabled"
                  :class="{selected: selectedTab === 'events'}"
      />
      <simple-svg :filepath="require('@/assets/attachments.svg')"
                  :fill="selectedTab === 'attachments' ? '#5E5375' : '#232323'"
                  class="icon disabled"
                  :class="{selected: selectedTab === 'attachments'}"
      />
      <simple-svg :filepath="require('@/assets/links.svg')"
                  :fill="selectedTab === 'links' ? '#5E5375' : '#232323'"
                  class="icon disabled"
                  :class="{selected: selectedTab === 'links'}"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway'
import UpdateNuggetForm from './UpdateNuggetForm'
import NewNuggetForm from './NewNuggetForm'
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
      isFormDirty: false
    }
  },
  computed: mapState([
    'selectedProject',
    'selectedScope',
    'selectedNugget'
  ]),
  components: {
    UpdateNuggetForm,
    NewNuggetForm,
    NewProjectForm,
    UpdateProjectForm
  }
}
</script>
