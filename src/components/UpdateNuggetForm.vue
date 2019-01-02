<template>
  <form
    id="updateNuggetForm"
    v-on-clickout.capture="showPopup"
    @submit.prevent="update"
  >
    <div class="header">
      <button
        type="button"
        class="primary-button small"
        v-if="nugget.__status__ !== 'dirty'"
        @click="clearSelectedNugget"
      >
        <img
          src="./../assets/plus.svg"
          class="plus-icon"
        >
        New Nugget
      </button>
      <button
        type="submit"
        class="light-primary-button small"
        v-else
        :disabled="$v.nugget.$invalid"
      >
        <img
          src="./../assets/save.svg"
          class="save-icon"
        >
        Save
      </button>
    </div>

    <loading v-if="loading" />

    <div
      class="nugget-information content"
      v-else
    >

      <!-- NUGGET TITLE -->

      <div class="input-container">
        <label
          class="label"
          :class="{error: $v.nugget.title.$error}"
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
        >
        <validation-message
          :validation="$v.nugget.title"
          :metadata="nuggetMetadata.fields.title"
        />
      </div>

      <!-- STATUS -->

      <div class="input-container">
        <label
          class="label"
          for="status"
        >
          {{ nuggetMetadata.fields.status.label }}
        </label>
        <v-select
          :options="statuses"
          index="value"
          v-model="nugget.status"
          :clearable="!$v.nugget.status.required"
          inputId="status"
        ></v-select>
        <validation-message
          :validation="$v.nugget.status"
          :metadata="nuggetMetadata.fields.status"
        />
      </div>

      <!-- PRIORITY -->

      <div class="input-container">
        <label
          for="priority"
          class="label"
        >
          {{ nuggetMetadata.fields.priority.label }}
        </label>
        <v-select
          :options="priorities"
          v-model="nugget.priority"
          :clearable="!$v.nugget.priority"
          index="value"
          inputId="priority"
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
          for="tags"
        >
          {{ nuggetMetadata.fields.tags.label }}
        </label>
        <v-select
          :options="tags"
          label="title"
          inputId="tags"
          :clearable="!$v.nugget.tags.required"
          v-model="nugget.tags"
          multiple
        ></v-select>
        <validation-message
          :validation="$v.nugget.tags"
          :metadata="nuggetMetadata.fields.tags"
        />
      </div>

      <!-- DUE DATE -->

      <div class="input-container">
        <label class="label">
          {{ nuggetMetadata.fields.dueDate.label }}
        </label>
        <div class="datepicker-container">
          <input
            type="text"
            class="light-primary-input"
            :value="formattedDueDate"
            @click="toggleDatepicker"
            readonly
            ref="dueDate"
          >
          <div
            v-if="showDatepicker"
            class="datepicker"
            v-on-clickout="toggleDatepicker.bind(undefined, false)"
          >
            <custom-datepicker
              primary-color="#2F2445"
              :wrapperStyles="wrapperStyles"
              @dateSelected="setDate($event)"
              :date="nugget.dueDate"
            />
          </div>
        </div>
        <div>
          <validation-message
            :validation="$v.nugget.dueDate"
            :metadata="nuggetMetadata.fields.dueDate"
          />
        </div>
      </div>

      <!-- KIND -->

      <div class="input-container">
        <label
          class="label"
          for="kind"
        >
          {{ nuggetMetadata.fields.kind.label }}
        </label>
        <v-select
          :options="kinds"
          v-model="nugget.kind"
          :clearable="!$v.nugget.kind.required"
          index="value"
          inputId="kind"
        ></v-select>
        <validation-message
          :validation="$v.nugget.kind"
          :metadata="nuggetMetadata.fields.kind"
        />
      </div>

      <!-- PROJECT -->

      <div class="input-container">
        <label
          for="project"
          class="label"
        >
          {{ nuggetMetadata.fields.projectId.label }}
        </label>
        <v-select
          :options="projects"
          index="id"
          label="title"
          inputId="project"
          :clearable="!$v.nugget.projectId.required"
          v-model="nugget.projectId"
        ></v-select>
        <validation-message
          :validation="$v.nugget.projectId"
          :metadata="nuggetMetadata.fields.projectId"
        />
      </div>

      <!-- DESCRIPTION -->

      <div class="input-container">
        <label
          class="label"
          :class="{error: $v.nugget.description.$error}"
        >
          {{ nuggetMetadata.fields.description.label }}
        </label>
        <div class="textarea-container large">
          <textarea
            class="light-primary-input"
            v-model.trim="nugget.description"
            @input="$v.nugget.description.$touch"
            :class="{error: $v.nugget.description.$error}"
            @keyup.ctrl.enter="update"
          ></textarea>
          <p
            class="character-count"
            v-if="nugget.description"
          >
            {{ nugget.description.length }}/512
          </p>
        </div>
        <validation-message
          :validation="$v.nugget.description"
          :metadata="nuggetMetadata.fields.description"
        />
      </div>
      <div class="response-message">
        <p :class="status === 200 ? 'success' : 'error'">
          {{ message }}
        </p>
      </div>
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
import { mapState, mapMutations, mapActions } from 'vuex'
import server from './../server'
import CustomDatepicker from 'vue-custom-datepicker'
import moment from 'moment'
import { mixin as clickout } from 'vue-clickout'
const Popup = () => import(
  /* webpackChunkName: "Popup" */ './Popup'
)
const ValidationMessage = () => import(
  /* webpackChunkName: "ValidationMessage" */ './ValidationMessage'
)
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)

export default {
  mixins: [clickout],
  name: 'UpdateNuggetForm',
  data () {
    return {
      showingPopup: false,
      status: null,
      nugget: null,
      initialTags: null,
      showDatepicker: false,
      nuggetMetadata: server.metadata.models.Issue,
      message: null,
      loading: false,
      wrapperStyles: {
        width: '100%',
        background: '#5E5375',
        color: '#ffffff',
        position: 'relative'
      }
    }
  },
  validations () {
    return {
      nugget: {
        title: this.nuggetMetadata.fields.title.createValidator(),
        description: this.nuggetMetadata.fields.description.createValidator(),
        status: this.nuggetMetadata.fields.status.createValidator(),
        dueDate: this.nuggetMetadata.fields.dueDate.createValidator(),
        kind: this.nuggetMetadata.fields.kind.createValidator(),
        priority: this.nuggetMetadata.fields.priority.createValidator(),
        projectId: this.nuggetMetadata.fields.projectId.createValidator(),
        tags: server.metadata.models.Issue.fields.tags.createValidator()
      }
    }
  },
  computed: {
    formattedDueDate () {
      return moment(this.nugget.dueDate).format('YYYY-MM-DD')
    },
    statuses () {
      return this.nuggetStatuses.map(status => {
        return {
          label: status.formatText(),
          value: status
        }
      })
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
    ...mapState([
      'selectedNugget',
      'Nugget',
      'nuggetStatuses',
      'nuggetKinds',
      'nuggetPriorities',
      'selectedProject',
      'projects',
      'tags'
    ])
  },
  watch: {
    'selectedNugget.id' () {
      this.getSelectedNugget()
    }
  },
  methods: {
    async update () {
      this.loading = true
      // FIXME: Replace this with JSON PATCH
      let tagRequests = []
      for (let tag of this.tags) {
        if (this.initialTags.includes(tag.id) && !this.nugget.tags.map(item => { return item.id }).includes(tag.id)) {
          tagRequests.push(this.nugget.remove(tag.id).send())
        } else if (!this.initialTags.includes(tag.id) && this.nugget.tags.map(item => { return item.id }).includes(tag.id)) {
          tagRequests.push(this.nugget.add(tag.id).send())
        }
      }
      try {
        await Promise.all(tagRequests)
      } catch (e) {
        console.error(e)
        return
      }
      this.nugget.save().send()
        .then(resp => {
          this.status = resp.status
          this.message = 'Your nugget was updated.'
          this.listNuggets([this.$route.params.projectId, this.nugget.id])
          // FIXME: Replace this when JSON PATCH completed
          this.getSelectedNugget()
          setTimeout(() => {
            this.status = null
            this.message = null
          }, 3000)
        }).catch(resp => {
          this.status = resp.status
          this.message = resp.error
          setTimeout(() => {
            this.status = null
            this.message = null
          }, 3000)
        }).finally(() => {
          this.loading = false
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
      if (this.nugget.__status__ === 'dirty') {
        this.showingPopup = true
      }
    },
    setDate (date) {
      // Checking if the date has been changed
      this.nugget.dueDate = moment(date).toISOString()
      this.showDatepicker = false
      this.$refs.dueDate.focus()
      this.$v.nugget.dueDate.$touch()
    },
    toggleDatepicker (value) {
      if (typeof value === 'boolean') {
        this.showDatepicker = value
      } else {
        this.showDatepicker = !this.showDatepicker
      }
    },
    getSelectedNugget () {
      this.loading = true
      this.Nugget.get(this.selectedNugget.id).send().then(resp => {
        this.nugget = resp.models[0]
        this.initialTags = this.nugget.tags.map(tag => {
          return tag.id
        })
      })
      this.loading = false
    },
    ...mapMutations([
      'clearSelectedNugget'
    ]),
    ...mapActions([
      'listNuggets'
    ])
  },
  components: {
    CustomDatepicker,
    Popup,
    ValidationMessage,
    Loading
  },
  async beforeMount () {
    this.nugget = new this.Nugget()
  },
  mounted () {
    this.getSelectedNugget()
  }
}
</script>
