<template>
  <div id="profile">

    <!-- HEADER -->

    <div class="header">

      <!-- HEADER TITLE -->

      <p class="title">Profile</p>

      <!-- ACTION -->

      <button
        class="secondary-button"
        :disabled="member.__status__ !== 'dirty'"
        @click="updateMember()"
      >Update Profile</button>
    </div>

    <!-- PROFILE CONTENTS -->

    <div class="content">

      <!-- PROFILE DASHBOARD -->

      <div class="left-column">
        <div class="title">
          <simple-svg
            :filepath="require('@/assets/shield.svg')"
            height="120"
            class="icon"
          ></simple-svg>
          <p class="text">Personal Information</p>
        </div>

        <!-- FORMS -->

        <form class="form">

          <!-- LEFT SIDE -->

          <div class="left-side inputs">
            <div class="input-container">
              <label class="label">
                First Name
              </label>
              <input
                type="text"
                class="light-primary-input"
              >
            </div>
            <div class="input-container">
              <label class="label">
                ID
              </label>
              <input
                type="text"
                class="light-primary-input"
              >
            </div>
            <div class="input-container select-country">
              <label for="">Country</label>
              <v-select
                :clearable="false"
                :options="countries"
                label="emojiWithCode"
                v-model="selectedCountry"
              >
                <template
                  slot="option"
                  slot-scope="country"
                  class="template"
                >
                  <span
                    class="flag-icon"
                    :class="`flag-icon-${country.alpha2.toLowerCase()}`"
                  ></span>
                  {{ country.name }}
                </template>
              </v-select>
            </div>
            <div class="contact-me">
              <div class="input-container">
                <label class="label">
                  Contact Me
                </label>
                <v-select></v-select>
              </div>
              <button
                class="secondary-button outlined"
                type="button"
              >
                <img
                  src="./../assets/plus.svg"
                  class="plus-icon"
                >
                ADD
              </button>
            </div>
          </div>

          <!-- RIGHT SIDE -->

          <div class="right-side inputs">
            <div class="input-container">
              <label class="label">
                Last Name
              </label>
              <input
                type="text"
                class="light-primary-input"
              >
            </div>
            <div class="input-container">
              <label class="label">
                Email
              </label>
              <input
                type="text"
                class="light-primary-input"
              >
            </div>
            <div class="input-container">
              <label class="label">
                Phone
              </label>
              <input
                type="text"
                class="light-primary-input"
                :value="selectedCountry.countryCallingCodes"
              >
            </div>
            <div class="input-container">
              <label class="label">
                Birth
              </label>
              <input
                type="text"
                class="light-primary-input"
              >
            </div>
          </div>
        </form>
      </div>

      <!-- PROFILE FORM -->

      <form
        class="right-column"
        @submit.prevent="updateMember"
      >

        <!-- PROFILE PICTURE -->

        <profile-picture-editor class="profile-picture-editor" />

        <!-- INPUTS -->

        <div class="inputs">
          <div class="input-container">
            <label class="label">Skills</label>
            <v-select></v-select>
          </div>
          <div class="input-container">
            <label>Group</label>
            <v-select></v-select>
          </div>
          <div class="input-container">
            <label
              for="email"
              class="label"
            >Specialties</label>
            <v-select></v-select>
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
const ProfilePictureEditor = () => import(
  /* webpackChunkName: "ProfilePictureEditor" */ '../components/ProfilePictureEditor'
)
export default {
  mixins: [clickout],
  name: 'Profile',
  data () {
    return {
      member: {
        title: null,
        name: null,
        email: null
      },
      casMemberMetadata: casServer.metadata.models.Member,
      auth: casServer.authenticator,
      status: null,
      message: null,
      selectedCountry: null
    }
  },
  validations () {
    return {
      member: {
        firstName: this.casMemberMetadata.fields.firstName.createValidator(),
        lastName: this.casMemberMetadata.fields.lastName.createValidator(),
        email: this.casMemberMetadata.fields.email.createValidator()
      }
    }
  },
  computed: {
    ...mapState([
      'CasMember',
      'countries'
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
    ProfilePictureEditor
  },
  beforeMount () {
    this.member = new this.CasMember()
  },
  mounted () {
    console.log(this.countries)
    this.getMember()
    this.selectedCountry = this.countries.find(country => {
      return country.alpha2 === 'US'
    })
  }
}
</script>
