<template>
  <div id="newOrganization">

    <!-- HEADER -->

    <div class="header">

      <!-- HEADER TITLE -->

      <p class="title">
        Create an organization account
      </p>

      <!-- ACTION -->

      <button
        class="secondary-button"
        @click="createOrganization"
        :disabled="$v.organization.title.$invalid"
      >Create organization</button>
    </div>

    <!-- CONTENT -->

    <div class="content">
      <div class="right-column">
        <form
          class="form"
          @submit.prevent="invite"
        >

          <!-- ORGANIZATION NAME -->

          <div class="input-container">
            <label
              for="organizationName"
              class="label"
            >{{ organizationMetadata.fields.title.label }}</label>
            <input
              type="text"
              id="organizationName"
              class="light-primary-input"
              :class="{error: $v.organization.title.$error}"
              v-model="$v.organization.title.$model"
            >
            <validation-message
              :validation="$v.organization.title"
              :metadata="organizationMetadata.fields.title"
            />
          </div>
          <div class="helper">
            <p>Organization accounts allow your team to plan, build, review, and ship software — all while tracking bugs and discussing ideas.</p>
          </div>
        </form>
      </div>
    </div>
    <snackbar
      :status="status"
      :message="message"
      @close="clearMessage"
      v-on-clickout="clearMessage"
    />
  </div>
</template>

<script>
import server from '../server'
import { mapState } from 'vuex'
import { mixin as clickout } from 'vue-clickout'
const ValidationMessage = () => import(
  /* webpackChunkName: "ValidationMessage" */ './../components/ValidationMessage.vue'
)
const Snackbar = () => import(
  /* webpackChunkName: "Snackbar" */ './../components/Snackbar.vue'
)

export default {
  mixins: [clickout],
  name: 'NewOrganization',
  data () {
    return {
      status: null,
      message: null,
      organizationMetadata: server.metadata.models.Organization,
      organization: null
    }
  },
  validations () {
    return {
      organization: {
        title: this.organizationMetadata.fields.title.createValidator()
      }
    }
  },
  computed: {
    ...mapState([
      'Organization'
    ])
  },
  methods: {
    createOrganization () {
      this.clearMessage()
      this.organization
        .save()
        .send()
        .then(resp => {
          this.$router.push('/settings/personal_settings/organizations')
          this.status = resp.status
          this.message = 'Create Organization successfully'
        }).catch(err => {
          this.message = err.error
          this.status = err.status
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
