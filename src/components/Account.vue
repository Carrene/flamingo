<template>
  <div id="account">
    <!-- ACCOUNT FORM -->
    <div class="header">
      <p class="title">Account</p>
    </div>
    <div class="contents">

      <form
        class="form"
        @submit.prevent="changePassword"
      >
        <!-- CURRENT PASSWORD -->

        <div class="input-container">
          <label
            for="currentPassword"
            class="label"
          >Current password</label>
          <input
            type="password"
            id="currentPassword"
            class="light-primary-input"
            v-model="$v.accountCredentials.currentPassword.$model"
          >
          <password-validation-message
            :validation="$v.accountCredentials.currentPassword"
            :metadata="casMemberMetadata.fields.password"
            :currentPassword="true"
          />
        </div>

        <!-- NEW PASSWORD -->

        <div class="input-container">
          <label
            for="newPassword"
            class="label"
          >New password</label>
          <input
            type="password"
            id="newPassword"
            class="light-primary-input"
            v-model="$v.accountCredentials.password.$model"
          >
          <password-validation-message
            :metadata="casMemberMetadata.fields.password"
            :validation="$v.accountCredentials.password"
          />
        </div>

        <!-- CONFIRM PASSWORD -->

        <div class="input-container">
          <label
            for="confirmPassword"
            class="label"
          >Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            class="light-primary-input"
            v-model="$v.accountCredentials.confirmPassword.$model"
          >
          <password-validation-message
            :validation="$v.accountCredentials.confirmPassword"
            :confirmPassword="true"
          />
        </div>
        <div class="actions">
          <button
            class="primary-button medium"
            type="submit"
            :disabled="$v.accountCredentials.$invalid"
          >Update password</button>
        </div>
      </form>
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
import { sameAs, required } from 'vuelidate/lib/validators'
import { casServer } from '../server'
import { mixin as clickaway } from 'vue-clickaway'
const PasswordValidationMessage = () => import(
  /* webpackChunkName: "PasswordValidationMessage" */ './PasswordValidationMessage'
)
const Snackbar = () => import(
  /* webpackChunkName: "Snackbar" */ './Snackbar'
)
export default {
  mixins: [clickaway],
  name: 'Account',
  data () {
    return {
      accountCredentials: {
        currentPassword: null,
        password: null,
        confirmPassword: null
      },
      casMemberMetadata: casServer.metadata.models.Member,
      status: null,
      message: null
    }
  },
  validations () {
    return {
      accountCredentials: {
        currentPassword: {
          required
        },
        password: this.casMemberMetadata.fields.password.createValidator(),
        confirmPassword: {
          sameAs: sameAs('password')
        }
      }
    }
  },
  methods: {
    changePassword () {
      this.clearMessage()
      casServer
        .request('passwords')
        .setVerb('CHANGE')
        .addParameters({
          currentPassword: this.accountCredentials.currentPassword,
          newPassword: this.accountCredentials.confirmPassword
        })
        .send()
        .then(resp => {
          this.message = 'Password changed successfully'
          this.status = resp.status
          this.clearAccountForm()
        }).catch(err => {
          this.status = err.status
          this.message = err.error
        })
    },
    clearMessage () {
      this.status = null
      this.message = null
    },
    clearAccountForm () {
      this.accountCredentials.currentPassword = null
      this.accountCredentials.password = null
      this.accountCredentials.confirmPassword = null
      this.$v.accountCredentials.$reset()
    }
  },
  components: {
    PasswordValidationMessage,
    Snackbar
  }
}
</script>
