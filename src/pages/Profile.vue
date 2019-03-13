<template>
  <div id="profile">

    <!-- HEADER -->

    <div class="header">

      <!-- HEADER TITLE -->

      <p class="title">Public profile</p>

      <!-- ACTION -->

      <button
        class="secondary-button small"
        :disabled="member.__status__ !== 'dirty'"
        @click="updateMember()"
      >Update Profile</button>
    </div>

    <!-- PROFILE CONTENTS -->

    <div class="content">

      <!-- PROFILE DASHBOARD -->

      <div class="left-column"></div>

      <!-- PROFILE FORM -->

      <form
        class="right-column"
        @submit.prevent="updateMember"
      >

        <!-- PROFILE PICTURE -->

        <profile-picture class="profile-picture" />

        <!-- INPUTS -->

        <div class="inputs">
          <div class="input-container">
            <label
              for="title"
              class="label"
            >{{ casMemberMetadata.fields.title.label }}</label>
            <input
              type="text"
              id="title"
              class="light-primary-input disabled"
              v-model.trim="member.title"
              readonly
            >
          </div>
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
          <div class="input-container">
            <label
              for="email"
              class="label"
            >{{ casMemberMetadata.fields.email.label }}</label>
            <input
              type="email"
              id="email"
              class="light-primary-input disabled"
              v-model.trim="member.email"
              readonly
            >
          </div>
        </div>
        <snackbar
          :status="status"
          :message="message"
          @close="clearMessage"
          v-on-clickout="clearMessage"
        />
      </form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { casServer } from '../server'
import { mixin as clickout } from 'vue-clickout'
const ValidationMessage = () => import(
  /* webpackChunkName: "ValidationMessage" */ '../components/ValidationMessage'
)
const Snackbar = () => import(
  /* webpackChunkName: "Snackbar" */ '../components/Snackbar'
)
const ProfilePicture = () => import(
  /* webpackChunkName: "ProfilePicture" */ '../components/ProfilePicture'
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
