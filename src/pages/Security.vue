<template>
  <div id="security">

    <!-- ACCOUNT FORM -->

    <div class="header">

      <!-- HEADER TITLE -->

      <p class="title">Security</p>

      <!-- ACTION -->

      <button
        class="secondary-button"
        @click="changePassword()"
        :disabled="$v.accountCredentials.$invalid"
      >Update Password</button>
    </div>

    <!-- ACCOUNT CONTENTS -->

    <div class="content">

      <!-- LEFT COLUMN -->

      <div class="left-column">

        <!-- ACCOUNT FORM -->

        <form class="form">

          <!-- CURRENT PASSWORD -->

          <div class="input-container">
            <label
              for="currentPassword"
              class="label"
              :class="{error: $v.accountCredentials.currentPassword.$error}"
            >Current password</label>
            <input
              type="password"
              id="currentPassword"
              class="light-primary-input"
              :class="{error: $v.accountCredentials.currentPassword.$error}"
              v-model="$v.accountCredentials.currentPassword.$model"
            >
            <password-validation-message
              :validation="$v.accountCredentials.currentPassword"
              :metadata="casMemberMetadata.fields.password"
              :current-password="true"
            />
          </div>

          <!-- NEW PASSWORD -->

          <div class="input-container">
            <label
              for="newPassword"
              class="label"
              :class="{error: $v.accountCredentials.password.$error}"
            >New password</label>
            <input
              type="password"
              id="newPassword"
              class="light-primary-input"
              :class="{error: $v.accountCredentials.password.$error}"
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
              :class="{error: $v.accountCredentials.confirmPassword.$error}"
            >Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              class="light-primary-input"
              :class="{error: $v.accountCredentials.confirmPassword.$error}"
              v-model="$v.accountCredentials.confirmPassword.$model"
            >
            <password-validation-message
              :validation="$v.accountCredentials.confirmPassword"
              :confirm-password="true"
            />
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
import { sameAs, required } from 'vuelidate/lib/validators'
import { casServer } from '../server'
import { mixin as clickout } from 'vue-clickout'
const PasswordValidationMessage = () => import(
  /* webpackChunkName: "PasswordValidationMessage" */ '../components/PasswordValidationMessage'
)
const Snackbar = () => import(
  /* webpackChunkName: "Snackbar" */ '../components/Snackbar'
)
export default {
  mixins: [clickout],
  name: 'Security',
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
