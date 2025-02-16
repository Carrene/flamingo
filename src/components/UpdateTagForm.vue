<template>
  <form
    id="updateTagForm"
    @submit.prevent="save"
    autocomplete="off"
  >

    <!-- HEADER -->

    <div class="header">
      <button
        type="submit"
        class="secondary-button"
        v-if="tag.__status__ === 'dirty'"
        :disabled="$v.tag.$invalid"
      >Save</button>
      <button
        type="button"
        class="secondary-button outlined disabled"
        @click="$emit('showNewTagForm')"
        v-else
      >New Tag</button>
    </div>

    <!-- CONTENT -->

    <div class="content">
      <div class="input-container">
        <label
          :for="tagMetadata.fields.title.label"
          class="label"
          :class="{error: $v.tag.title.$error}"
        >{{ tagMetadata.fields.title.label }}</label>
        <input
          type="text"
          class="light-primary-input"
          v-model="tag.title"
          @input="$v.tag.title.$touch"
          @focus="$v.tag.title.$reset"
          :class="{error: $v.tag.title.$error}"
        >
        <validation-message
          :validation="$v.tag.title"
          :metadata="tagMetadata.fields.title"
        />
      </div>
      <div class="input-container">
        <label
          for="tagDescription"
          class="label"
          :class="{error: $v.tag.description.$error}"
        >{{ tagMetadata.fields.description.label }}</label>
        <div class="textarea-container medium">
          <textarea
            class="light-primary-input"
            v-model="tag.description"
            @input="$v.tag.description.$touch"
            :class="{error: $v.tag.description.$error}"
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
import { mapState, mapMutations } from 'vuex'
import { updateModel } from './../helpers.js'
const ValidationMessage = () => import(
  /* webpackChunkName: "ValidationMessage" */ './ValidationMessage'
)
const Snackbar = () => import(
  /* webpackChunkName: "Snackbar" */ './Snackbar'
)

export default {
  name: 'UpdateTagForm',
  data () {
    return {
      tag: null,
      tagMetadata: server.metadata.models.Tag,
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
      'Tag',
      'tags'
    ])
  },
  props: {
    selectedTag: Object
  },
  watch: {
    'selectedTag.id': {
      immediate: true,
      handler (newValue) {
        this.getSelectedTag(newValue)
      }
    }
  },
  methods: {
    async getSelectedTag (tagId) {
      this.setGlobalLoading(false)
      let response = await this.Tag.get(tagId).send()
      this.tag = response.models[0]
      this.setGlobalLoading(false)
    },
    save () {
      this.setGlobalLoading(true)
      this.tag.save().send().then(async (resp) => {
        this.status = resp.status
        this.message = 'Your tag was updated.'
        await updateModel(this.tags, this.tag)
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
        this.setGlobalLoading(false)
      })
    },
    clearMessage () {
      this.status = null
      this.message = null
    },
    ...mapMutations([
      'setGlobalLoading'
    ])
  },
  beforeMount () {
    this.tag = new this.Tag()
  },
  components: {
    ValidationMessage,
    Snackbar
  }
}
</script>
