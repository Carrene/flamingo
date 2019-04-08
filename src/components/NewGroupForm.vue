<template>
  <form id="newGroupForm">

    <!-- HEADER -->

    <div class="header">
      <button
        type="button"
        class="secondary-button"
        :disabled="$v.group.$invalid"
      >Save</button>
    </div>

    <!-- CONTENT -->

    <div class="content">
      <div class="input-container">
        <label
          for="groupName"
          class="label"
        >{{ groupMetadata.fields.title.label }}</label>
        <input
          type="text"
          class="light-primary-input"
          v-model.trim="group.title"
        >
      </div>
      <div class="input-container">
        <label
          for="groupName"
          class="label"
        >Group Description</label>
        <div class="textarea-container medium">
          <textarea class="light-primary-input"></textarea>
        </div>
        <!-- <p
            class="character-count"
            v-if="group.description"
          >
            {{ group.description.length }}/{{grup.fields.description.maxLength }}
          </p> -->
      </div>
    </div>
  </form>
</template>

<script>
import server from '../server'
import { mapState } from 'vuex'
const ValidationMessage = () => import(
  /* webpackChunkName: "ValidationMessage" */ './ValidationMessage'
)
export default {
  name: 'NewGroupForm',
  data () {
    return {
      groupMetadata: server.metadata.models.Group,
      group: null
    }
  },
  computed: {
    ...mapState([
      'Group'
    ])
  },
  validations () {
    return {
      group: {
        title: this.groupMetadata.fields.title.createValidator()
      }
    }
  },
  components: {
    ValidationMessage
  },
  beforeMount () {
    this.group = new this.Group()
  }
}
</script>
