<template>
  <div id="login">

    <!-- LOADING -->

    <div
      class="loading"
      v-if="loading"
    >
      <loading />
    </div>

    <!-- CONTAINER -->

    <div
      class="container"
      v-else
    >

      <!-- SNACKBAR -->

      <snackbar
        :message="message"
        :status="status"
        @close="clearMessage"
        v-on-clickout="clearMessage"
      />

      <!-- LEFT SIDE -->

      <left-side></left-side>

      <!-- RIGHT SIDE -->

      <div class="right-side">
        <div
          class="select-organization"
          v-if="!noOrganization"
        >
          <div class="title">
            <h3 class="title-header">Select Organization</h3>
          </div>
          <form
            class="content form"
            @submit.prevent="login"
          >
            <div class="input-container">
              <!-- FIXME: Get the label from metadata when metadata is ready -->
              <label
                for="organization"
                class="label"
              >Organization</label>
              <v-select
                :options="organizations"
                label="title"
                v-model="selectedOrganization"
                :clearable="false"
              ></v-select>
              <validation-message
                :validation="$v.selectedOrganization"
                :metadata="organizationMetadata.fields.title"
              />
            </div>
            <div class="actions end">
              <button
                class="secondary-button big"
                :disabled="$v.selectedOrganization.$invalid"
                type="submit"
                key="select-organization"
              >Next</button>
            </div>
          </form>
        </div>
        <div
          class="select-organization"
          v-else
        >
          <div class="title">
            <h3 class="title-header">No Organization</h3>
          </div>
          <div class="content dialog-message">
            <p>
              You don't have any organization yet, to use Maestro you need to be in an organization
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import server from './../server'
import { mapState, mapActions } from 'vuex'
import { mixin as clickout } from 'vue-clickout'
import { required } from 'vuelidate/lib/validators'
const LeftSide = () => import(
  /* webpackChunkName: "LeftSide" */ './../components/LeftSide'
)
const ValidationMessage = () => import(
  /* webpackChunkName: "ValidationMessage" */ './../components/ValidationMessage'
)
const Snackbar = () => import(
  /* webpackChunkName: "Snackbar" */ './../components/Snackbar'
)
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './../components/Loading'
)

export default {
  name: 'Login',
  mixins: [clickout],
  data () {
    return {
      email: null,
      memberMetadata: server.metadata.models.Member,
      organizationMetadata: server.metadata.models.Organization,
      status: null,
      message: null,
      organizations: [],
      selectedOrganization: null,
      loading: true,
      noOrganization: false
    }
  },
  validations () {
    return {
      selectedOrganization: {
        required
      }
    }
  },
  computed: {
    ...mapState([
      'Organization'
    ])
  },
  methods: {
    listOrganizations () {
      this.Organization.load().addParameter('email', this.email).send().then(resp => {
        this.organizations = resp.models
        if (resp.models.length === 1) {
          this.loading = true
          this.selectedOrganization = resp.models[0]
          this.login()
        } else if (resp.models.length > 1) {
          this.loading = false
          this.noOrganization = false
        } else if (resp.models.length === 0) {
          this.loading = false
          this.noOrganization = true
        }
      })
    },
    async login () {
      this.loading = true
      await server.login(this.code, this.selectedOrganization.id)
      if (this.$route.query.redirectUri) {
        this.$router.push({
          path: new URL(this.$route.query.redirectUri).pathname
        })
      } else {
        this.$router.push({
          path: '/'
        })
      }
    },
    clearMessage () {
      this.status = null
      this.message = null
    },
    ...mapActions([
      'redirectToCAS'
    ])
  },
  components: {
    LeftSide,
    ValidationMessage,
    Snackbar,
    Loading
  },
  beforeMount () {
    this.loading = true
    server.logout()
    this.email = this.$route.query.state
    this.code = this.$route.query.code
    if (!this.email || !this.code) {
      this.redirectToCAS()
    }
    this.listOrganizations()
  }
}
</script>
