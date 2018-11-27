<template>
  <form
    id="profile"
    @submit.prevent="updateMember"
  >
    <div class="contents">
      <form class="form">
        <p>Profile</p>

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
            type="button"
            :disabled="member.__status__ !== 'dirty'"
            @click="updateMember"
          >Update profile</button>
        </div>
      </form>
      <form class="form">
        <p>Account</p>

        <!-- OLD PASSWORD -->

        <div class="input-container">
          <label
            for="oldPassword"
            class="label"
          >Old password</label>
          <input
            type="password"
            id="oldPassword"
            class="light-primary-input"
            v-model="$v.accountCredentials.oldPassword.$model"
          >
          <validation-message
            :validation="$v.accountCredentials.oldPassword"
            :metadata="casMemberMetadata.fields.password"
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
          <validation-message
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
          <validation-message
            :validation="$v.accountCredentials.confirmPassword"
            :confirmPassword="true"
          />
        </div>
        <div class="actions">
          <button
            class="primary-button medium"
            type="button"
            :disabled="$v.accountCredentials.$invalid"
            @click="changePassword"
          >Update password</button>
        </div>
      </form>
    </div>
    <snackbar
      :status="status"
      :message="message"
      @close="status = null"
    />
  </form>
</template>

<script>
import { mapState } from 'vuex'
import { casServer } from '../server'
import ValidationMessage from './ValidationMessage'
import Snackbar from './../components/Snackbar'
import { sameAs, required } from 'vuelidate/lib/validators'

export default {
  name: 'Profile',
  data () {
    return {
      profileCredentials: {
        name: null
      },
      accountCredentials: {
        oldPassword: null,
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
        oldPassword: {
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
      this.status = null
      this.message = null
      this.member.save().send().then(resp => {
        this.message = 'OK'
        this.status = resp.status
        this.member = resp.models[0]
      }).catch(err => {
        this.status = err.status
        this.message = err.error
      })
    },
    changePassword () {
      this.status = null
      this.message = null
      casServer
        .request('passwords')
        .setVerb('CHANGE')
        .addParameters({
          currentPassword: this.accountCredentials.oldPassword,
          newPassword: this.accountCredentials.confirmPassword
        })
        .send()
        .then(resp => {
          this.message = 'OK'
          this.status = resp.status
          console.log(resp)
        }).catch(err => {
          this.status = err.status
          this.message = err.error
        })
    },
    getMember () {
      this.CasMember.get('me').send().then(resp => {
        this.member = resp.models[0]
      })
    }
  },
  components: {
    ValidationMessage,
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
