<template>
  <div id="login">

    <snackbar
      :message="message"
      :status="status"
      @close="clearMessage"
      v-on-clickaway="clearMessage"
    />

    <left-side></left-side>

    <div class="right-side">

      <div
        class="step-1"
        v-if="!organizations.length"
      >
        <!-- TITLE -->

        <div class="title">
          <h3 class="title-header">Login with <span class="maestro">Maestro</span></h3>
        </div>

        <!-- INPUTS -->

        <form
          class="content form"
          @submit.prevent="login"
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

          <div class="actions">
            <router-link
              to="/forgot_password"
              class="link"
            >Forgot your password?</router-link>
            <button
              class="primary-button medium"
              :disabled="$v.$invalid"
            >Login</button>
          </div>
        </form>
      </div>

      <div
        class="step-2"
        v-if="organizations.length"
      >
        <div class="title">
          <h3 class="title-header">Select Organization</h3>
        </div>
        <div class="content form">
          <div class="input-container">
            <!-- FIXME: Get the label from metadata when metadata is ready -->
            <label
              for="organization"
              class="label"
            >Organization</label>
            <div class="dropdown-container">
              <input
                type="text"
                class="light-primary-input"
                :class="{'showing-list' : showOrganizationList}"
                @click="toggleOrganizationList"
                :value="organization"
                readonly
                ref="organization"
              >
              <img
                src="../assets/chevron-down.svg"
                class="arrow"
                :class="!showOrganizationList ? 'down' : 'up'"
                @click="toggleOrganizationList"
              >
              <div
                class="dropdown-list"
                v-if="showOrganizationList"
                v-on-clickaway="toggleOrganizationList.bind(undefined, false)"
              >
                <p
                  v-for="(organization, index) in organizations"
                  :key="index"
                  @click="selectOrganization(organization)"
                >
                  {{ Organization }}
                </p>
              </div>
            </div>
            <validation-message
              :validation="$v.nugget.kind"
              :metadata="nuggetMetadata.fields.kind"
            />
          </div>
        </div>
        <div>
          <p>
            Haven't got any mails yet? <span
              class="link"
              @click="claim"
            >Resend confirmation email</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import server from './../server'
import { mixin as clickaway } from 'vue-clickaway'
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
  mixins: [clickaway],
  data () {
    return {
      email: null,
      memberMetadata: server.metadata.models.Member,
      organizationMetadata: server.metadata.models.Organization,
      status: null,
      message: null,
      showOrganizationList: false,
      organizations: [],
      selectedOrganization: null
    }
  },
  validations () {
    return {
      email: this.memberMetadata.fields.email.createValidator(),
      // FIXME: Get the label from metadata when metadata is ready
      organization: {
        required
      }
    }
  },
  methods: {
    redirect (start) {
      let redirect = new URL(window.location.href).searchParams.get('redirectUri') || window.location.origin
      let url = new URL(`${CAS_FRONTEND_BASE_URL}/permissions`)
      url.searchParams.set('applicationId', APPLICATION_ID)
      url.searchParams.set('scopes', SCOPES.join(','))
      url.searchParams.set('redirectUri', encodeURI(redirect))
      if (start) {
        url.searchParams.set('start', true)
      }
      window.location.assign(url.href)
    },
    signup () {
      this.redirect(true)
    },
    login () {
      this.redirect(false)
    },
    clearMessage () {
      this.status = null
      this.message = null
    },
    toggleOrganizationList (value) {
      if (typeof value === 'boolean') {
        this.showOrganizationList = value
      } else {
        this.showOrganizationList = !this.showOrganizationList
      }
    },
    selectOrganization (organization) {
      this.selectedOrganization = organization
      this.showOrganizationList = false
      this.$refs.organization.focus()
    }
  },
  components: {
    LeftSide,
    ValidationMessage,
    Snackbar
  }
}
</script>
