<template>
  <div id="settingsLeftColumn">
    <input
      v-show="false"
      type="file"
      @change="imageFileChanged"
      ref="imageFileInput"
      accept="image/*"
    >

    <!-- PICTURE -->

    <div class="avatar large">
      <img
        class="pic"
        :src="auth.member.avatar"
        v-if="auth.member.avatar"
      >
      <simple-svg
        v-else
        :filepath="require('./../assets/profile-default-picture.svg')"
        fill="#23232332"
        class="pic"
      />
      <img
        class="icon"
        src="../assets/edit-picture-icon.svg"
        @click="uploadImageFile"
      >
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
      v-on-clickaway="clearMessage"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { casServer } from '../server'
import { mixin as clickaway } from 'vue-clickaway'
const Snackbar = () => import(
  /* webpackChunkName: "Snackbar" */ './Snackbar'
)

export default {
  mixins: [clickaway],
  name: 'SettingsLeftColumn',
  data () {
    return {
      auth: casServer.authenticator,
      member: null,
      status: null,
      message: null
    }
  },
  computed: mapState([
    'CasMember'
  ]),
  methods: {
    uploadImageFile () {
      this.$refs.imageFileInput.value = []
      this.$refs.imageFileInput.click()
    },
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
    imageFileChanged (event) {
      let image = event.target.files[0]
      if (image) {
        this.updateAvatar(image)
      }
    },
    clearMessage () {
      this.status = null
      this.message = null
    }
  },
  components: {
    Snackbar
  },
  beforeMount () {
    this.member = new this.CasMember({ id: this.auth.member.referenceId })
  }
}
</script>
