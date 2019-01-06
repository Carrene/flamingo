<template>
  <form
    id="newNuggetForm"
    v-on-clickout.capture="showPopup"
    @submit.prevent="define"
  >
    <div class="header">
      <button
        type="submit"
        class="light-primary-button small"
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
          inputId="status"
          :clearable="!$v.nugget.status.required"
        ></v-select>
        <validation-message
          :validation="$v.nugget.status"
          :metadata="nuggetMetadata.fields.status"
        />
      </div>

      <!-- PRIORITY -->

      <div class="input-container">
        <label
          class="label"
          for="priority"
        >
          {{ nuggetMetadata.fields.priority.label }}
        </label>
        <v-select
          :options="priorities"
          index="value"
          inputId="priority"
          :clearable="!$v.nugget.priority.required"
          v-model="nugget.priority"
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
          index="id"
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
            v-model="dueDate"
            @click="toggleDatepicker"
            ref="dueDate"
            @keyup.enter="toggleDatepicker"
            readonly
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
          index="value"
          inputId="kind"
          v-model="nugget.kind"
          :clearable="!$v.nugget.kind.required"
        ></v-select>
        <validation-message
          :validation="$v.nugget.kind"
          :metadata="nuggetMetadata.fields.kind"
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
            @keyup.ctrl.enter="define"
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
      :message="'Are you sure leave the new nugget?'"
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
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)
const ValidationMessage = () => import(
  /* webpackChunkName: "ValidationMessage" */ './ValidationMessage'
)
const Popup = () => import(
  /* webpackChunkName: "Popup" */ './Popup'
)

export default {
  mixins: [clickout],
  name: 'NewNuggetForm',
  data () {
    return {
      nuggetMetadata: server.metadata.models.Issue,
      showingPopup: false,
      status: null,
      nugget: null,
      showDatepicker: false,
      message: null,
      wrapperStyles: {
        width: '100%',
        background: '#5E5375',
        color: '#ffffff',
        position: 'relative'
      },
      loading: false
    }
  },
  validations () {
    return {
      nugget: {
        title: server.metadata.models.Issue.fields.title.createValidator(),
        description: server.metadata.models.Issue.fields.description.createValidator(),
        status: server.metadata.models.Issue.fields.status.createValidator(),
        dueDate: server.metadata.models.Issue.fields.dueDate.createValidator(),
        kind: server.metadata.models.Issue.fields.kind.createValidator(),
        priority: server.metadata.models.Issue.fields.priority.createValidator(),
        tags: server.metadata.models.Issue.fields.tags.createValidator()
      }
    }
  },
  computed: {
    dueDate () {
      if (this.nugget.dueDate) {
        return moment(this.nugget.dueDate).format('YYYY-MM-DD')
      } else {
        return null
      }
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
      'DraftNugget',
      'draftNugget',
      'nuggetStatuses',
      'nuggetKinds',
      'nuggetPriorities',
      'selectedProject',
      'tags'
    ])
  },
  methods: {
    async define () {
      this.loading = true
      // FIXME: Replace this with JSON PATCH
      let tagRequests = []
      for (let tagId of this.nugget.tags) {
        tagRequests.push(this.nugget.addTag(tagId).send())
      }
      try {
        await Promise.all(tagRequests)
      } catch (e) {
        console.error(e)
        return
      }
      this.nugget
        .finalize()
        .send()
        .then(resp => {
          this.status = resp.status
          this.message = 'Your nugget was created.'
          this.listNuggets([this.$route.params.projectId, resp.json.id])
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
      this.nugget = new this.DraftNugget()
      this.$v.nugget.$reset()
      this.listNuggets([this.$route.params.projectId, undefined, () => {
        this.loading = false
      }])
    },
    cancelPopup () {
      this.showingPopup = false
    },
    showPopup () {
      if (this.$v.nugget.$anyDirty) {
        this.showingPopup = true
      }
    },
    setDate (date) {
      // Checking if the date has been changed
      this.nugget.dueDate = moment(date).format('YYYY-MM-DD')
      this.showDatepicker = false
      this.$refs.dueDate.focus()
      if (this.nugget.dueDate !== moment(date).format('YYYY-MM-DD')) {
        this.$v.nugget.dueDate.$touch()
      }
    },
    toggleDatepicker (value) {
      if (typeof value === 'boolean') {
        this.showDatepicker = value
      } else {
        this.showDatepicker = !this.showDatepicker
      }
    },
    ...mapMutations([
      'setDraftNugget'
    ]),
    ...mapActions([
      'listNuggets'
    ])
  },
  async beforeMount () {
    if (!this.draftNugget) {
      this.nugget = new this.DraftNugget({ projectId: parseInt(this.$route.params.projectId) })
      await this.nugget.save().send()
      this.setDraftNugget(this.nugget)
    } else {
      this.nugget = new this.DraftNugget(this.draftNugget)
    }
  },
  beforeDestroy () {
    // FIXME: delete this after implementation of JSON patch
    this.setDraftNugget(null)
  },
  components: {
    Loading,
    CustomDatepicker,
    Popup,
    ValidationMessage
  }
}
</script>
