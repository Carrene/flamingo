<template>
  <form
    id="updateNuggetForm"
    v-on-clickout.capture="showPopup"
    @submit.prevent="update"
    autocomplete="off"
  >
    <div class="header">
      <button
        type="submit"
        class="secondary-button"
        v-if="nuggetChanged"
        :disabled="$v.nugget.$invalid"
      >
        <img
          src="./../assets/save-light.svg"
          class="save-icon"
        >
        Save
      </button>
      <button
        type="button"
        class="secondary-button outlined"
        v-else
        @click="activateNugget({nugget: null})"
      >
        <img
          src="./../assets/plus.svg"
          class="plus-icon"
        >
        New Nugget
      </button>
      <avatar />
    </div>

    <div class="nugget-information content">

      <!-- NUGGET TITLE -->

      <div class="input-container">
        <label
          class="label"
          :class="{error: $v.nugget.title.$error}"
          :for="nuggetMetadata.fields.title.name"
        >
          {{ nuggetMetadata.fields.title.label }}
        </label>
        <input
          type="text"
          class="light-primary-input"
          v-model.trim="nugget.title"
          @input="$v.nugget.title.$touch"
          @focus="$v.nugget.title.$reset"
          :class="{error: $v.nugget.title.$error}"
          :id="nuggetMetadata.fields.title.name"
        >
        <validation-message
          :validation="$v.nugget.title"
          :metadata="nuggetMetadata.fields.title"
        />
      </div>

      <!-- KIND -->

      <div class="input-container">
        <label
          class="label"
          :for="nuggetMetadata.fields.kind.name"
        >
          {{ nuggetMetadata.fields.kind.label }}
        </label>
        <v-select
          :options="kinds"
          v-model="nugget.kind"
          :clearable="!$v.nugget.kind.required"
          index="value"
          :inputId="nuggetMetadata.fields.kind.name"
        ></v-select>
        <validation-message
          :validation="$v.nugget.kind"
          :metadata="nuggetMetadata.fields.kind"
        />
      </div>

      <!-- PROJECT -->

      <div class="input-container">
        <label
          :for="nuggetMetadata.fields.projectId.name"
          class="label"
        >
          {{ nuggetMetadata.fields.projectId.label }}
        </label>
        <v-select
          :options="projects"
          index="id"
          label="title"
          :inputId="nuggetMetadata.fields.projectId.name"
          :clearable="!$v.nugget.projectId.required"
          v-model="nugget.projectId"
        ></v-select>
        <validation-message
          :validation="$v.nugget.projectId"
          :metadata="nuggetMetadata.fields.projectId"
        />
      </div>

      <!-- PRIORITY -->

      <div class="input-container">
        <label
          :for="nuggetMetadata.fields.priority.name"
          class="label"
        >
          {{ nuggetMetadata.fields.priority.label }}
        </label>
        <v-select
          :options="priorities"
          v-model="nugget.priority"
          :clearable="!$v.nugget.priority"
          index="value"
          :inputId="nuggetMetadata.fields.priority.name"
        ></v-select>
        <validation-message
          :validation="$v.nugget.priority"
          :metadata="nuggetMetadata.fields.priority"
        />
      </div>

      <!-- TAGS -->

      <div class="input-container">
        <label
          class="label"
          :for="nuggetMetadata.fields.tags.name"
        >
          {{ nuggetMetadata.fields.tags.label }}
        </label>
        <v-select
          :options="computedListOfTags"
          label="title"
          :inputId="nuggetMetadata.fields.tags.name"
          index="id"
          :clearable="!$v.nugget.tags.required"
          v-model="currentSelectedTags"
          multiple
        ></v-select>
        <validation-message
          :validation="$v.nugget.tags"
          :metadata="nuggetMetadata.fields.tags"
        />
      </div>

      <!-- RELATED NUGGETS -->

      <div class="input-container">
        <label
          class="label"
          :for="nuggetMetadata.fields.relations.name"
        >
          {{ nuggetMetadata.fields.relations.label }}
        </label>
        <v-select
          :options="computedNuggets"
          :inputId="nuggetMetadata.fields.relations.name"
          index="id"
          :clearable="!$v.nugget.relations.required"
          v-model="currentRelatedNuggets"
          @search="nuggetSearch"
          multiple
        ></v-select>
        <validation-message
          :validation="$v.nugget.relations"
          :metadata="nuggetMetadata.fields.relations"
        />
      </div>

      <!-- DESCRIPTION -->

      <div class="input-container">
        <label
          class="label"
          :class="{error: $v.nugget.description.$error}"
          :for="nuggetMetadata.fields.description.name"
        >
          {{ nuggetMetadata.fields.description.label }}
        </label>
        <div class="textarea-container large">
          <textarea
            class="light-primary-input"
            v-model.trim="nugget.description"
            @input="$v.nugget.description.$touch"
            :class="{error: $v.nugget.description.$error}"
            :id="nuggetMetadata.fields.description.name"
            @keyup.ctrl.enter="update"
          ></textarea>
          <p
            class="character-count"
            v-if="nugget.description"
          >
            {{ nugget.description.length }}/{{ nuggetMetadata.fields.description.maxLength }}
          </p>
        </div>
        <validation-message
          :validation="$v.nugget.description"
          :metadata="nuggetMetadata.fields.description"
        />
      </div>
      <snackbar
        :status="status"
        :message="message"
        @close="clearMessage"
        v-on-clickout="clearMessage"
      ></snackbar>
    </div>
    <popup
      v-if="showingPopup"
      message="Are you sure leave the update nugget?"
      @confirm="confirmPopup"
      @cancel="cancelPopup"
    />
  </form>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import server from './../server'
import { mixin as clickout } from 'vue-clickout'
import { updateModel } from './../helpers.js'

const Popup = () => import(
  /* webpackChunkName: "Popup" */ './Popup'
)
const Snackbar = () => import(
  /* webpackChunkName: "Snackbar" */ './Snackbar'
)
const ValidationMessage = () => import(
  /* webpackChunkName: "ValidationMessage" */ './ValidationMessage'
)
const Avatar = () => import(
  /* webpackChunkName: "Avarat" */ '../components/Avatar'
)

export default {
  mixins: [clickout],
  name: 'UpdateNuggetForm',
  data () {
    return {
      showingPopup: false,
      status: null,
      nugget: null,
      nuggets: [],
      initialTags: [],
      currentSelectedTags: [],
      initialRelatedNugget: [],
      initialProjectId: null,
      currentRelatedNuggets: [],
      nuggetMetadata: server.metadata.models.Issue,
      message: null
    }
  },
  validations () {
    return {
      nugget: {
        title: this.nuggetMetadata.fields.title.createValidator(),
        description: this.nuggetMetadata.fields.description.createValidator(),
        kind: this.nuggetMetadata.fields.kind.createValidator(),
        priority: this.nuggetMetadata.fields.priority.createValidator(),
        projectId: this.nuggetMetadata.fields.projectId.createValidator(),
        tags: this.nuggetMetadata.fields.tags.createValidator(),
        relations: this.nuggetMetadata.fields.relations.createValidator()
      }
    }
  },
  computed: {
    currentActiveModel () {
      if (this.$route.name.match('Nuggets')) {
        return this.nuggetsOfSelectedProject
      } else if (this.$route.name.match('Subscribed')) {
        return this.subscribedNuggets
      } else if (this.$route.name.match('Unread')) {
        return this.unreadNuggets
      }
    },
    computedNuggets () {
      let relatedNuggets = []
      if (this.nugget.relations) {
        relatedNuggets = this.nugget.relations.filter(relatedNugget => !this.nuggets.find(nugget => nugget.id === relatedNugget.id))
      }
      return this.nuggets.concat(relatedNuggets).reduce((accumulator, nugget) => {
        nugget.label = `#${nugget.id} ${nugget.title}`
        if (this.nugget.projectId === nugget.projectId && nugget.id !== this.nugget.id) {
          accumulator.push(nugget)
        }
        return accumulator
      }, [])
    },
    kinds () {
      return this.nuggetKinds.map(kind => {
        return {
          label: kind.formatText(),
          value: kind
        }
      })
    },
    priorities () {
      return this.nuggetPriorities.map(priority => {
        return {
          label: priority.formatText(),
          value: priority
        }
      })
    },
    tagsChanged () {
      let initialTags = [...this.initialTags].sort()
      let currentSelectedTags = [...this.currentSelectedTags].sort()
      return JSON.stringify(initialTags) !== JSON.stringify(currentSelectedTags)
    },
    relatedNuggetsChanged () {
      let initialRelatedNugget = [...this.initialRelatedNugget].sort()
      let currentRelatedNuggets = [...this.currentRelatedNuggets].sort()
      return JSON.stringify(initialRelatedNugget) !== JSON.stringify(currentRelatedNuggets)
    },
    nuggetChanged () {
      return this.nugget.__status__ === 'dirty' || this.tagsChanged || this.relatedNuggetsChanged
    },
    computedListOfTags () {
      let unselectedTags = []
      let selectedTags = []
      for (let tag of this.tags) {
        if (this.currentSelectedTags.includes(tag.id)) {
          selectedTags.push(tag)
        } else {
          unselectedTags.push(tag)
        }
      }
      return unselectedTags.concat(selectedTags)
    },
    ...mapState([
      'selectedNuggets',
      'Nugget',
      'nuggetKinds',
      'nuggetPriorities',
      'projects',
      'tags',
      'nuggetsOfSelectedProject',
      'currentTab',
      'subscribedNuggets',
      'unreadNuggets'
    ])
  },
  watch: {
    'selectedNuggets': {
      deep: true,
      async handler () {
        await this.getSelectedNugget()
      }
    }
  },
  methods: {
    async update () {
      this.setGlobalLoading(true)
      let jsonPatchRequest = server.jsonPatchRequest(this.Nugget.__url__)
      for (let tag of this.tags) {
        if (this.initialTags.includes(tag.id) && !this.currentSelectedTags.includes(tag.id)) {
          jsonPatchRequest.addRequest(this.nugget.removeTag(tag.id))
        } else if (!this.initialTags.includes(tag.id) && this.currentSelectedTags.includes(tag.id)) {
          jsonPatchRequest.addRequest(this.nugget.addTag(tag.id))
        }
      }
      for (let nugget of this.computedNuggets) {
        if (!this.initialRelatedNugget.includes(nugget.id) && this.currentRelatedNuggets.includes(nugget.id)) {
          jsonPatchRequest.addRequest(this.nugget.relateNugget(nugget.id))
        } else if (this.initialRelatedNugget.includes(nugget.id) && !this.currentRelatedNuggets.includes(nugget.id)) {
          jsonPatchRequest.addRequest(this.nugget.unrelateNugget(nugget.id))
        }
      }
      if (this.nugget.__status__ === 'dirty') {
        jsonPatchRequest.addRequest(this.nugget.save())
      }
      if (this.initialProjectId !== this.nugget.projectId) {
        jsonPatchRequest.addRequest(this.nugget.moveProject(this.nugget.projectId))
      }
      jsonPatchRequest.send()
        .then(async (resps) => {
          this.status = resps[0].status
          this.message = 'Your nugget was updated.'
          this.getSelectedNugget()
          this.listItems()
          if (this.currentActiveModel) {
            await updateModel(this.currentActiveModel, this.nugget)
          }
          setTimeout(() => {
            this.clearMessage()
          }, 3000)
        }).catch(resps => {
          this.status = resps[0].status
          this.message = resps[0].error
          setTimeout(() => {
            this.clearMessage()
          }, 3000)
        }).finally(() => {
          this.setGlobalLoading(false)
        })
    },
    confirmPopup () {
      this.showingPopup = false
      this.getSelectedNugget()
    },
    cancelPopup () {
      this.showingPopup = false
    },
    showPopup () {
      if (this.tagsChanged || this.nugget.__status__ === 'dirty') {
        this.showingPopup = true
      }
    },
    async getSelectedNugget () {
      this.setGlobalLoading(true)
      let resp = await this.Nugget.get(this.selectedNuggets[0].id).send()
      this.nugget = resp.models[0]
      this.initialProjectId = this.nugget.projectId
      this.initialTags = this.nugget.tags.map(tag => tag.id)
      this.currentSelectedTags = [...this.initialTags]
      this.initialRelatedNugget = this.nugget.relations.map(relation => relation.id)
      this.currentRelatedNuggets = [...this.initialRelatedNugget]
      this.setGlobalLoading(false)
      return Promise.resolve(this.nugget)
    },
    nuggetSearch (search, loading) {
      loading(true)
      if (this.searchNuggetTimeoutHandler) {
        clearTimeout(this.searchNuggetTimeoutHandler)
      }
      this.searchNuggetTimeoutHandler = setTimeout(() => {
        this.Nugget
          .search(search)
          .send()
          .then(resps => {
            this.nuggets = resps.models
            loading(false)
          })
      }, 500)
    },
    clearMessage () {
      this.status = null
      this.message = null
    },
    listNuggetsLocal () {
      this.Nugget.load().send().then(resp => {
        this.nuggets = resp.models
      })
    },
    ...mapActions([
      'activateNugget',
      'listItems'
    ]),
    ...mapMutations([
      'setGlobalLoading'
    ])
  },
  components: {
    Popup,
    ValidationMessage,
    Snackbar,
    Avatar
  },
  async beforeMount () {
    this.nugget = new this.Nugget()
    await this.getSelectedNugget()
    this.listNuggetsLocal()
  }
}
</script>
