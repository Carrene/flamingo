<template>
  <form id="newTagForm">

    <!-- HEADER -->

    <div class="header">
      <button
        type="button"
        class="secondary-button"
        :disabled="$v.tag.$invalid"
      >Save</button>
    </div>

    <!-- CONTENT -->

    <div class="content">
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
        >Tag Description</label>
        <div class="textarea-container medium">
          <textarea class="light-primary-input"></textarea>
        </div>
        <!-- FIXME: NOT IMPLEMENTED YET -->
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
  name: 'NewTagForm',
  data () {
    return {
      tag: null,
      tagMetadata: server.metadata.models.Tag

    }
  },
  validations () {
    return {
      tag: {
        title: this.tagMetadata.fields.title.createValidator()
      }
    }
  },
  computed: {
    ...mapState([
      'Tag'
    ])
  },
  beforeMount () {
    this.tag = new this.Tag()
  },
  components: {
    Loading,
    ValidationMessage
  }
}
</script>
