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
      <p class="title">{{ auth.member.title}}</p>
      <p class="email">{{ auth.member.email}}</p>
    </div>
    <snackbar
      :status="status"
      :message="message"
      @close="status = null"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { casServer } from '../server'
import Snackbar from './../components/Snackbar'

export default {
  name: 'SettingsLeftColumn',
  data () {
    return {
      auth: casServer.authenticator,
      member: null,
      status: null,
      message: null
    }
  },
  computed: {
    picSrc () {
      if (this.auth.member.avatar) {
        return this.auth.member.avatar
      } else {
        return require('./../assets/profile-default-picture.svg')
      }
    },
    ...mapState([
      'CasMember'
    ])
  },
  methods: {
    uploadImageFile () {
      this.$refs.imageFileInput.value = []
      this.$refs.imageFileInput.click()
    },
    updateAvatar (image) {
      this.status = null
      this.message = null
      this.member.updateAvatar(image).send().then(resp => {
        this.status = resp.status
        this.message = 'OK'
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
