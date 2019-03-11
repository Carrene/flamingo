<template>
  <div id="login">

    <snackbar
      :message="message"
      :status="status"
      @close="clearMessage"
      v-on-clickout="clearMessage"
    />

    <left-side></left-side>

    <div class="right-side">

      <div
        class="step-1"
        v-if="!isClaimed"
      >
        <!-- TITLE -->

        <div class="title">
          <h3 class="title-header">Login with <span class="maestro">Maestro</span></h3>
        </div>

        <!-- INPUTS -->

        <form
          class="content form"
          @submit.prevent="listOrganizations"
        >
          <div class="input-container">
            <label
              for="email"
              class="label"
            >{{ memberMetadata.fields.email.label }}</label>
            <input
              type="text"
              id="email"
              class="light-primary-input"
              v-model="$v.email.$model"
              :class="{error: $v.email.$error}"
            >
            <validation-message
              :validation="$v.email"
              :metadata="memberMetadata.fields.email"
            />
          </div>

          <!-- ACTIONS -->

          <div class="actions end">
            <button
              class="secondary-button small"
              :disabled="$v.email.$invalid"
              type="submit"
            >Continue</button>
          </div>
        </form>
      </div>

      <div
        class="step-2"
        v-else-if="isClaimed && organizations.length"
      >
        <div class="title">
          <h3 class="title-header">Select Organization</h3>
        </div>
        <form class="content form">
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
              class="primary-button medium"
              :disabled="$v.selectedOrganization.$invalid"
              type="submit"
              key="step-2"
            >Next</button>
          </div>
        </form>
      </div>
      <div
        class="step-2"
        v-else-if="!organizations.length"
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
</template>

<script>
import server from './../server'
import { mapState } from 'vuex'
import { mixin as clickout } from 'vue-clickout'
import { SCOPES, APPLICATION_ID, CAS_FRONTEND_BASE_URL } from '../settings'
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
      isClaimed: false
    }
  },
  validations () {
    return {
      email: this.memberMetadata.fields.email.createValidator(),
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
        this.isClaimed = true
        this.organizations = resp.models
        if (resp.models.length === 1) {
          this.isClaimed = false
          this.selectedOrganization = resp.models[0]
          this.login()
        }
      })
    },
    redirect () {
      let redirect = new URL(window.location.href).searchParams.get('redirectUri') || window.location.origin
      let url = new URL(`${CAS_FRONTEND_BASE_URL}/permissions`)
      url.searchParams.set('applicationId', APPLICATION_ID)
      url.searchParams.set('scopes', SCOPES.join(','))
      url.searchParams.set('redirectUri', encodeURI(redirect))
      url.searchParams.set('state', this.selectedOrganization.id)
      url.searchParams.set('email', this.email)
      window.location.assign(url.href)
    },
    login () {
      this.redirect()
    },
    clearMessage () {
      this.status = null
      this.message = null
    }
  },
  components: {
    LeftSide,
    ValidationMessage,
    Snackbar
  }
}
</script>
