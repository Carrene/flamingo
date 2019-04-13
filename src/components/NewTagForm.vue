<template>
  <form
    id="newTagForm"
    @submit.prevent="create"
    autocomplete="off"
  >

    <!-- HEADER -->

    <div class="header">
      <button
        type="submit"
        class="secondary-button"
        :disabled="$v.tag.$invalid"
      >Save</button>
    </div>
    <loading v-if="loading" />

    <!-- CONTENT -->

    <div
      class="content"
      v-if="!loading"
    >
      <div class="input-container">
        <label
          for="tagName"
          class="label"
          :class="{error: $v.tag.title.$error}"
        >{{ tagMetadata.fields.title.label }}</label>
        <input
          type="text"
          class="light-primary-input"
          v-model="tag.title"
          @input="$v.tag.title.$touch"
          :class="{error: $v.tag.title.$error}"
        >
        <validation-message
          :validation="$v.tag.title"
          :metadata="tagMetadata.fields.title"
        />
      </div>
      <div class="input-container">
        <label
          for="tagDescripton"
          class="label"
        >{{ tagMetadata.fields.description.label }}</label>
        <div class="textarea-container medium">
          <textarea
            class="light-primary-input"
            v-model="tag.description"
            @input="$v.tag.description.$touch"
          ></textarea>
          <p
            class="character-count"
            v-if="tag.description"
          >
            {{ tag.description.length }}/{{tagMetadata.fields.description.maxLength }}
          </p>
        </div>
      </div>
      <snackbar
        :status="status"
        :message="message"
        @close="clearMessage"
      ></snackbar>
    </div>
  </form>
</template>

<script>
import server from '../server'
import { mapState, mapActions } from 'vuex'
const Snackbar = () => import(
  /* webpackChunkName: "Snackbar" */ './Snackbar'
)
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)
const ValidationMessage = () => import(
  /* webpackChunkName: "ValidationMessage" */ './ValidationMessage'
)

export default {
  name: 'NewTagForm',
  data () {
    return {
      tag: null,
      tagMetadata: server.metadata.models.Tag,
      loading: false,
      status: null,
      message: null

    }
  },
  validations () {
    return {
      tag: {
        title: this.tagMetadata.fields.title.createValidator(),
        description: this.tagMetadata.fields.description.createValidator()
      }
    }
  },
  computed: {
    ...mapState([
      'Tag'
    ])
  },
  methods: {
    create () {
      this.loading = true
      this.tag.save().send().then(async (resp) => {
        this.status = resp.status
        this.message = 'Your tag was created.'
        await this.listTags(resp.json.id)
        this.$emit('response', resp)
        setTimeout(() => {
          this.clearMessage()
        }, 3000)
      }).catch(resp => {
        this.status = resp.status
        this.message = resp.error
        setTimeout(() => {
          this.clearMessage()
        }, 3000)
      }).finally(() => {
        this.loading = false
      })
    },
    clearMessage () {
      this.status = null
      this.message = null
    },
    ...mapActions([
      'listTags'
    ])
  },
  beforeMount () {
    this.tag = new this.Tag()
  },
  components: {
    Loading,
    ValidationMessage,
    Snackbar
  }
}
</script>
