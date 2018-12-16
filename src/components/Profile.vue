<template>
  <div id="profile">
    <div class="header">
      <p class="title">Profile</p>
    </div>
    <div class="contents">

      <!-- PROFILE FORM -->

      <form
        class="form"
        @submit.prevent="updateMember"
      >

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
      <profile-picture class="profile-picture" />

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
import { mapState } from 'vuex'
import { casServer } from '../server'
import { mixin as clickout } from 'vue-clickout'
const ValidationMessage = () => import(
  /* webpackChunkName: "ValidationMessage" */ './ValidationMessage'
)
const Snackbar = () => import(
  /* webpackChunkName: "Snackbar" */ './Snackbar'
)
const ProfilePicture = () => import(
  /* webpackChunkName: "ProfilePicture" */ './ProfilePicture'
)
export default {
  mixins: [clickout],
  name: 'Profile',
  data () {
    return {
      profileCredentials: {
        name: null
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
    getMember () {
      this.CasMember.get('me').send().then(resp => {
        this.member = resp.models[0]
      })
    },
    clearMessage () {
      this.status = null
      this.message = null
    }
  },
  components: {
    ValidationMessage,
    Snackbar,
    ProfilePicture
  },
  beforeMount () {
    this.member = new this.CasMember()
  },
  mounted () {
    this.getMember()
  }
}
</script>
