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
    <loading v-if="loading" />
    <!-- CONTENT -->

    <div
      class="content"
      v-if="!loading"
    >
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
        </div>
        <!-- FIXME: NOT IMPLEMENTED YET -->
        <!-- <p
          class="character-count"
          v-if="tag.description"
        >
          {{ tag.description.length }}/{{tag.fields.description.maxLength }}
        </p> -->
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
import { mapState } from 'vuex'
import { updateModel } from './../helpers.js'
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)
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
      loading: false,
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
    'selectedTag.id' () {
      this.getSelectedTag()
    }
  },
  methods: {
    async getSelectedTag () {
      this.loading = false
      let response = await this.Tag.get(this.selectedTag.id).send()
      this.tag = response.models[0]
      this.loading = false
    },
    save () {
      this.loading = true
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
        console.log(resp)
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
    }
  },
  beforeMount () {
    this.tag = new this.Tag()
  },
  mounted () {
    this.getSelectedTag()
  },
  components: {
    Loading,
    ValidationMessage,
    Snackbar
  }
}
</script>
