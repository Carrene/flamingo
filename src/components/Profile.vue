<template>
  <div id="profile">
    <div class="contents">

      <!-- PROFILE FORM -->

      <form
        class="form"
        @submit.prevent="updateMember"
      >
        <p class="title">Profile</p>

        <!-- NAME -->

        <div class="input-container">
          <label
            for="name"
            class="label"
          >{{ casMemberMetadata.fields.name.label }}</label>
          <input
            type="text"
            id="name"
            class="light-primary-input"
            v-model.trim="member.name"
            @input="$v.profileCredentials.name.$touch"
          >
          <validation-message
            :validation="$v.profileCredentials.name"
            :metadata="casMemberMetadata.fields.name"
          />
        </div>
        <div class="actions">
          <button
            class="primary-button medium"
            type="submit"
            :disabled="member.__status__ !== 'dirty'"
          >Update profile</button>
        </div>
      </form>

      <!-- ACCOUNT FORM -->

      <form
        class="form"
        @submit.prevent="changePassword"
      >
        <p class="title">Account</p>

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
import { mapState } from 'vuex'
import { casServer } from '../server'
import { sameAs, required } from 'vuelidate/lib/validators'
import { mixin as clickaway } from 'vue-clickaway'
const ValidationMessage = () => import(
  /* webpackChunkName: "ValidationMessage" */ './ValidationMessage'
)
const PasswordValidationMessage = () => import(
  /* webpackChunkName: "PasswordValidationMessage" */ './PasswordValidationMessage'
)
const Snackbar = () => import(
  /* webpackChunkName: "Snackbar" */ './Snackbar'
)

export default {
  mixins: [clickaway],
  name: 'Profile',
  data () {
    return {
      profileCredentials: {
        name: null
      },
      accountCredentials: {
        currentPassword: null,
        password: null,
        confirmPassword: null
      },
      casMemberMetadata: casServer.metadata.models.Member,
      auth: casServer.authenticator,
      member: null,
      status: null,
      message: null
    }
  },
  validations () {
    return {
      profileCredentials: {
        name: this.casMemberMetadata.fields.name.createValidator()
      },
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
  computed: {
    ...mapState([
      'CasMember'
    ])
  },
  methods: {
    updateMember () {
      this.clearMessage()
      this.member.save().send().then(resp => {
        this.message = 'Updated profile successfully'
        this.status = resp.status
        this.member = resp.models[0]
      }).catch(err => {
        this.status = err.status
        this.message = err.error
      })
    },
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
    getMember () {
      this.CasMember.get('me').send().then(resp => {
        this.member = resp.models[0]
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
    ValidationMessage,
    PasswordValidationMessage,
    Snackbar
  },
  beforeMount () {
    this.member = new this.CasMember()
  },
  mounted () {
    this.getMember()
  }
}
</script>
