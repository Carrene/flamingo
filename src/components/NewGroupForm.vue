<template>
  <form
    id="newGroupForm"
    @submit.prevent="create"
    autocomplete="off"
  >

    <!-- HEADER -->

    <div class="header">
      <button
        type="button"
        class="secondary-button"
        :disabled="$v.group.$invalid"
        @click="create"
      >Save</button>
    </div>

    <!-- CONTENT -->

    <div class="content">

      <!-- NAME INPUT -->

      <div class="input-container">
        <label
          for="groupName"
          class="label"
          :class="{error: $v.group.title.$error}"
        >{{ groupMetadata.fields.title.label }}</label>
        <input
          type="text"
          class="light-primary-input"
          :class="{error: $v.group.title.$error}"
          v-model.trim="group.title"
          @input="$v.group.title.$touch"
          @focus="$v.group.title.$reset"
        >
        <validation-message
          :validation="$v.group.title"
          :metadata="groupMetadata.fields.title"
        />
      </div>

      <!-- DESCRIPTION INPUT -->

      <div class="input-container">
        <label
          for="groupName"
          class="label"
          :class="{error: $v.group.description.$error}"
        >{{ groupMetadata.fields.description.label }}</label>
        <div class="textarea-container medium">
          <textarea
            class="light-primary-input"
            :class="{error: $v.group.description.$error}"
            v-model.trim="group.description"
            @input="$v.group.description.$touch"
            @focus="$v.group.description.$reset"
            @keyup.ctrl.enter="create"
          ></textarea>
          <p
            class="character-count"
            v-if="group.description"
          >
            {{ group.description.length }}/{{groupMetadata.fields.description.maxLength }}
          </p>
        </div>
        <validation-message
          :validation="$v.group.description"
          :metadata="groupMetadata.fields.description"
        />
      </div>

      <!-- SNACKBAR -->

      <snackbar
        :status="status"
        :message="message"
        @close="clearMessage"
        v-on-clickout="clearMessage"
      ></snackbar>
    </div>
  </form>
</template>

<script>
import server from '../server'
import { mapState, mapActions } from 'vuex'
import { mixin as clickout } from 'vue-clickout'
const ValidationMessage = () => import(
  /* webpackChunkName: "ValidationMessage" */ './ValidationMessage'
)
const Snackbar = () => import(
  /* webpackChunkName: "Snackbar" */ './Snackbar'
)
export default {
  mixins: [clickout],
  name: 'NewGroupForm',
  data () {
    return {
      groupMetadata: server.metadata.models.Group,
      group: null,
      status: null,
      message: null
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
        title: this.groupMetadata.fields.title.createValidator(),
        description: this.groupMetadata.fields.description.createValidator()
      }
    }
  },
  methods: {
    async create () {
      this.loading = true
      try {
        let response = await this.group.save().send()
        this.status = response.status
        this.message = 'Your group was created.'
        await this.listGroups()
        this.$emit('response', response.models[0])
      } catch (err) {
        this.status = err.status
        this.message = err.error
      }
      this.loading = false
      setTimeout(() => {
        this.clearMessage()
      }, 3000)
    },
    clearMessage () {
      this.status = null
      this.message = null
    },
    ...mapActions([
      'listGroups'
    ])
  },
  components: {
    ValidationMessage,
    Snackbar
  },
  beforeMount () {
    this.group = new this.Group()
  }
}
</script>
