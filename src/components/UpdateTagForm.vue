<template>
  <form id="updateTagForm">

    <!-- HEADER -->

    <div class="header">
      <button
        type="button"
        class="secondary-button"
        v-if="tag.__status__ === 'dirty'"
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
        >{{ tagMetadata.fields.title.label }}</label>
        <input
          type="text"
          class="light-primary-input"
          v-model="tag.title"
        >
      </div>
      <div class="input-container">
        <!-- FIXME: Get label from metadata when it was ready -->

        <label
          for="tagDescription"
          class="label"
        >Tag Description</label>
        <div class="textarea-container medium">
          <textarea class="light-primary-input"></textarea>
        </div>
        <!-- <p
          class="character-count"
          v-if="tag.description"
        >
          {{ tag.description.length }}/{{tag.fields.description.maxLength }}
        </p> -->
      </div>
    </div>
  </form>
</template>

<script>
import server from '../server'
import { mapState } from 'vuex'
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)
const ValidationMessage = () => import(
  /* webpackChunkName: "ValidationMessage" */ './ValidationMessage'
)

export default {
  name: 'UpdateTagForm',
  data () {
    return {
      tag: null,
      tagMetadata: server.metadata.models.Tag
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
  props: {
    selectedTag: Object
  },
  methods: {
    async getSelectedTag () {
      this.loading = false
      let response = await this.Tag.get(this.selectedTag.id).send()
      this.tag = response.models[0]
      this.loading = false
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
    ValidationMessage
  }
}
</script>
