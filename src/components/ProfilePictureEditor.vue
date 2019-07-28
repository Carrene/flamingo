<template>
  <div id="profilePictureEditor">
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
      <profile-picture
        class="profile-picture"
        :picture="auth.member.avatar"
      />
    </div>
    <div class="user-name">{{ member.title }}</div>
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

const ProfilePicture = () => import(
  /* webpackChunkName: "ProfilePicture" */ '../components/ProfilePicture'
)

export default {
  mixins: [clickout],
  name: 'ProfilePictureEditor',
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
    PictureCrop,
    ProfilePicture
  },
  beforeMount () {
    this.member = new this.CasMember({ id: this.auth.member.referenceId })
    console.log(this.member)
  }
}
</script>
