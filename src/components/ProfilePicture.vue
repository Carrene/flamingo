<template>
  <div id="profilePicture">
    <picture-crop
      v-if="showingPictureCrop"
      @close="showingPictureCrop = false"
      @setImage="updateAvatar"
    />

    <!-- PICTURE -->

    <div
      class="avatar large"
      @click="showingPictureCrop = true"
    >
      <img
        class="pic"
        :src="auth.member.avatar"
        v-if="auth.member.avatar"
      >
      <simple-svg
        v-else
        :filepath="require('./../assets/profile-default-picture.svg')"
        fill="#C9C9C9"
        class="pic"
      />
    </div>

    <!-- CONTENT -->

    <div class="content">
      <p class="name">{{ auth.member.name }}</p>
      <p class="title">@{{ auth.member.title}}</p>
      <p class="email">{{ auth.member.email}}</p>
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
const Snackbar = () => import(
  /* webpackChunkName: "Snackbar" */ './Snackbar'
)
const PictureCrop = () => import(
  /* webpackChunkName: "PictureCrop" */ './PictureCrop'
)

export default {
  mixins: [clickout],
  name: 'ProfilePicture',
  data () {
    return {
      auth: casServer.authenticator,
      member: null,
      status: null,
      message: null,
      showingPictureCrop: false
    }
  },
  computed: mapState([
    'CasMember'
  ]),
  methods: {
    updateAvatar (image) {
      this.clearMessage()
      this.member.updateAvatar(image).send().then(resp => {
        this.status = resp.status
        this.message = 'Uploaded image successfully'
      }).catch(err => {
        this.message = err.error
        this.status = err.status
      })
    },
    clearMessage () {
      this.status = null
      this.message = null
    }
  },
  components: {
    Snackbar,
    PictureCrop
  },
  beforeMount () {
    this.member = new this.CasMember({ id: this.auth.member.referenceId })
  }
}
</script>
