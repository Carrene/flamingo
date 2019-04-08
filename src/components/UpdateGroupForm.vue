<template>
  <form
    id="updateGroupForm"
    @submit.prevent="save"
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
        v-else
      >Save</button>
    </div>

    <!-- LOADING -->

    <loading v-if="loading" />

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
          v-model="group.title"
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
            {{ group.description.length }}/{{group.fields.description.maxLength }}
          </p> -->
      </div>
    </div>
  </form>
</template>

<script>
import server from '../server'
import { mapState } from 'vuex'
// import { updateModel } from './../helpers.js'
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)
export default {
  name: 'UpdateGroupForm',
  data () {
    return {
      group: null,
      loading: false,
      groupMetadata: server.metadata.models.Group
    }
  },
  props: {
    selectedGroup: Object
  },
  computed: {
    ...mapState([
      'Group',
      'groups'
    ])
  },
  watch: {
    // selectedGroup: {
    //   deep: true,
    //   immediate: true,
    //   handler (newValue) {
    //     this.group = Object.assign({}, newValue)
    //   }
    // },
    'selectedGroup.id' () {
      this.getSelectedGroup()
    }
  },
  methods: {
    async getSelectedGroup () {
      this.loading = false
      let response = await this.Group.get(this.selectedGroup.id).send()
      this.group = response.models[0]
      this.loading = false
    }
    // save () {
    //   this.loading = true
    //   this.group.save().send().then(async (resp) => {
    //     this.status = resp.status
    //     this.message = 'Your group was updated.'
    //     await updateModel(this.groups, this.group)
    //     setTimeout(() => {
    //       this.clearMessage()
    //     }, 3000)
    //   }).catch(resp => {
    //     this.status = resp.status
    //     this.message = resp.error
    //     setTimeout(() => {
    //       this.clearMessage()
    //     }, 3000)
    //   }).finally(() => {
    //     this.loading = false
    //   })
    // }
  },
  components: {
    Loading
  },
  beforeMount () {
    this.group = new this.Group()
  },
  mounted () {
    this.getSelectedGroup()
  }
}
</script>
