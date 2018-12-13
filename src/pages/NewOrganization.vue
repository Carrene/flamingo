<template>
  <div id="newOrganization">

    <!-- HEADER -->

    <div class="header">

      <!-- HEADER TITLE -->

      <p class="title">
        Create an organization account
      </p>
    </div>

    <!-- CONTENT -->

    <div class="content">
      <form
        class="form"
        @submit.prevent="create"
      >
        <div class="input-container">
          <label
            for="organizationName"
            class="label"
          >{{ organizationMetadata.fields.title.label }}</label>
          <input
            type="text"
            id="organizationName"
            class="light-primary-input"
            v-model="$v.organization.title.$model"
          >
          <validation-message
            :validation="$v.organization.title"
            :metadata="organizationMetadata.fields.title"
          />
        </div>
        <div class="actions">
          <button
            class="primary-button medium"
            type="submit"
            :disabled="$v.organization.$invalid"
          >Create organization</button>
        </div>
      </form>
      <div class="helper">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste expedita unde neque repellat doloremque obcaecati, fuga saepe maxime autem explicabo ut aperiam officiis enim dolores maiores natus harum ratione nemo?</p>
      </div>
    </div>
    <snackbar
      :status="status"
      :message="message"
      @close="clearMessage"
      v-on-clickaway="clearMessage"
    />
  </div>
</template>

<script>
import server from '../server'
import { mapState } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway'
const ValidationMessage = () => import(
  /* webpackChunkName: "ValidationMessage" */ './../components/ValidationMessage.vue'
)
const Snackbar = () => import(
  /* webpackChunkName: "Snackbar" */ './../components/Snackbar.vue'
)

export default {
  mixins: [clickaway],
  name: 'NewOrganization',
  data () {
    return {
      status: null,
      organization: null,
      message: null,
      organizationMetadata: server.metadata.models.Organization
    }
  },
  validations () {
    return {
      organization: {
        title: this.organizationMetadata.fields.title.createValidator()
      }
    }
  },
  computed: mapState([
    'Organization'
  ]),
  methods: {
    create () {
      this.clearMessage()
      this.organization.save().send().then(resp => {
        this.status = resp.status
        this.$router.push({
          name: 'Organizations'
        })
      }).catch(err => {
        this.status = err.status
        this.message = err.error
      })
    },
    clearMessage () {
      this.status = null
      this.message = null
    }
  },
  components: {
    ValidationMessage,
    Snackbar
  },
  beforeMount () {
    this.organization = new this.Organization()
  }
}
</script>
