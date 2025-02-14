<template>
  <form
    id="updateGroupForm"
    @submit.prevent="update"
    autocomplete="off"
  >

    <!-- HEADER -->

    <div class="header">
      <button
        type="button"
        class="secondary-button outlined"
        v-if="group.__status__ !== 'dirty'"
        @click="$emit('showNewGroupForm')"
      >New group</button>
      <button
        type="button"
        class="secondary-button"
        @click="update"
        v-else
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
        >{{ groupMetadata.fields.description.label }}</label>
        <div class="textarea-container medium">
          <textarea
            class="light-primary-input"
            :class="{error: $v.group.description.$error}"
            v-model.trim="group.description"
            @input="$v.group.description.$touch"
            @focus="$v.group.description.$reset"
            @keyup.ctrl.enter="update"
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
import { mapState, mapMutations } from 'vuex'
import { mixin as clickout } from 'vue-clickout'
import { updateModel } from './../helpers.js'
// import { updateModel } from './../helpers.js'
const ValidationMessage = () => import(
  /* webpackChunkName: "ValidationMessage" */ './ValidationMessage'
)
const Snackbar = () => import(
  /* webpackChunkName: "Snackbar" */ './Snackbar'
)
export default {
  mixins: [clickout],
  name: 'UpdateGroupForm',
  data () {
    return {
      group: null,
      status: null,
      message: null,
      groupMetadata: server.metadata.models.Group
    }
  },
  props: {
    selectedGroup: Object
  },
  validations () {
    return {
      group: {
        title: this.groupMetadata.fields.title.createValidator(),
        description: this.groupMetadata.fields.description.createValidator()
      }
    }
  },
  computed: {
    ...mapState([
      'Group',
      'groups'
    ])
  },
  watch: {
    'selectedGroup.id': {
      immediate: true,
      handler (newValue) {
        this.getSelectedGroup(newValue)
      }
    }
  },
  methods: {
    async getSelectedGroup (groupId) {
      this.setGlobalLoading(false)
      // TODO: remove get if you can.
      let response = await this.Group.get(groupId).send()
      this.group = response.models[0]
      this.setGlobalLoading(false)
    },
    clearMessage () {
      this.status = null
      this.message = null
    },
    update () {
      this.setGlobalLoading(true)
      this.group.save().send().then(async (resp) => {
        this.status = resp.status
        this.message = 'Your group was updated.'
        await updateModel(this.groups, this.group)
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
    ...mapMutations([
      'setGlobalLoading'
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
