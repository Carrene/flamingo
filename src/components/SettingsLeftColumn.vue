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

    <div class="avatar">
      <img
        class="pic"
        :src="picSrc"
      >
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
      status: null
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
    ]),
    message () {
      if (this.status === 716) {
        return 'Invalid Name Format'
      } else if (this.status === 717) {
        return 'Invalid Field, Only The Name And Avatar Parameters Are Accepted'
      } else if (this.status === 618) {
        return 'Maximum allowed width is: 300, but the 550 is given.'
      } else if (this.status === 619) {
        return 'Invalid aspect ratio 300 / 200 = 1.5,accepted_range: 1 - 1'
      } else if (this.status === 620) {
        return ' Content type is not supported application/pdf.Valid options are: image/jpeg, image/png'
      } else if (this.status === 621) {
        return 'Cannot store files larger than: 51200 bytes'
      } else {
        return 'OK'
      }
    }
  },
  methods: {
    uploadImageFile () {
      this.$refs.imageFileInput.value = []
      this.$refs.imageFileInput.click()
    },
    updateAvatar (image) {
      this.status = null
      this.member.updateAvatar(image).send().then(resp => {
        this.status = resp.status
        console.log(resp)
        console.log(this.auth.member)
      }).catch(err => {
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
