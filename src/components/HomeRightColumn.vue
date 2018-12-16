<template>
  <div id="homeRightColumn">

    <update-project-form v-if="selectedTab === 'details' && $route.name === 'Projects' && selectedProject" />

    <new-project-form v-else-if="selectedTab === 'details' && $route.name === 'Projects'" />

    <update-nugget-form v-if="selectedTab === 'details' && $route.name === 'Nuggets' && selectedNugget" />

    <new-nugget-form v-else-if="selectedTab === 'details' && $route.name === 'Nuggets'" />

    <attachment v-if="selectedTab === 'attachments' && $route.name === 'Projects' && selectedProject" />

    <div class="tabs">
      <simple-svg
        :filepath="require('@/assets/details.svg')"
        :fill="selectedTab === 'details' ? '#5E5375' : '#232323'"
        class="icon"
        :class="{selected: selectedTab === 'details'}"
        @click.native="selectedTab = 'details'"
      />
      <simple-svg
        :filepath="require('@/assets/events.svg')"
        :fill="selectedTab === 'events' ? '#5E5375' : '#232323'"
        class="icon disabled"
        :class="{selected: selectedTab === 'events'}"
      />
      <simple-svg
        :filepath="require('@/assets/attachments.svg')"
        :fill="selectedTab === 'attachments' ? '#5E5375' : '#232323'"
        class="icon"
        :class="{selected: selectedTab === 'attachments', disabled: !selectedProject}"
        @click.native="selectedTab = 'attachments'"
        :disabled="!selectedProject"
      />
      <simple-svg
        :filepath="require('@/assets/links.svg')"
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
  mixins: [clickaway],
  name: 'HomeRightColumn',
  data () {
    return {
      selectedTab: 'details'
    }
  },
  computed: mapState([
    'selectedProject',
    'selectedNugget'
  ]),
  components: {
    UpdateNuggetForm,
    NewNuggetForm,
    NewProjectForm,
    UpdateProjectForm,
    Attachment
  }
}
</script>
