<template>
  <div
    id="login"
    class="authentication-container"
  >

    <!-- SNACKBAR -->

    <snackbar
      :message="message"
      :status="status"
      @close="clearMessage"
      v-on-clickout="clearMessage"
    />

    <!-- LEFT SIDE -->

    <left-side />

    <!-- RIGHT SIDE -->

    <div class="right-side">

      <!-- TITLE -->

      <div class="title">
        <h3 class="title-header">Login with <span class="maestro">Maestro</span></h3>
      </div>

      <!-- INPUTS -->

      <form
        class="content form"
        @submit.prevent="login"
      >
        <div class="inputs">
          <div class="input-container">
            <label
              for="email"
              class="label"
            >{{ memberMetadata.fields.email.label }}</label>
            <input
              type="text"
              id="email"
              class="primary-input"
              v-model="$v.credentials.email.$model"
              :class="{error: $v.credentials.email.$error}"
            >
            <validation-message
              :validation="$v.credentials.email"
              :metadata="memberMetadata.fields.email"
            />
          </div>

          <div class="input-container">
            <label
              for="password"
              class="label"
            >{{ memberMetadata.fields.password.label }}</label>
            <input
              type="password"
              id="password"
              class="primary-input"
              v-model="credentials.password"
              :class="{error: $v.credentials.password.$error}"
            >
            <password-validation-message
              :validation="$v.credentials.password"
              :metadata="memberMetadata.fields.password"
            />
          </div>
        </div>

        <!-- ACTIONS -->

        <div class="actions">
          <div class="link">Forgot your password?</div>
          <button
            class="secondary-button big"
            :disabled="$v.credentials.$invalid"
          >Login</button>
        </div>
      </form>

      <!-- GO TO SIGNUP -->

      <div class="go-to-signup">
        <p>Don't have an account yet? <span class="link">Sign up</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import server from './../server'
import { required } from 'vuelidate/lib/validators'
import { mixin as clickout } from 'vue-clickout'
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
  mixins: [clickout],
  name: 'Login',
  data () {
    return {
      credentials: {
        email: null,
        password: null
      },
      memberMetadata: server.metadata.models.Member,
      status: null,
      message: null,
      applicationId: this.$route.query.applicationId,
      state: this.$route.query.state,
      redirectUri: this.$route.query.redirectUri,
      scopes: this.$route.query.scopes
    }
  },
  validations () {
    return {
      credentials: {
        email: {
          required
        },
        password: {
          required
        }
      }
    }
  },
  methods: {
    login () {
      this.clearMessage()
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
