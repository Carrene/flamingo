<template>
  <div id="settingsLeftColumn">
    <input v-show="false"
           type="file"
           @change="imageFileChanged"
           ref="imageFileInput"
           accept="image/*"
    >

    <!-- PICTURE -->

    <div class="avatar">
      <img class="pic" :src="picSrc">
      <img class="icon" src="../assets/edit-picture-icon.svg" @click="uploadImageFile">
    </div>

    <!-- CONTENT -->

    <div class="content">
      <p class="name">{{ member.name }}</p>
      <p class="title">{{ member.title}}</p>
      <p class="email">{{ member.email}}</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { casServer } from '../server'

export default {
  name: 'SettingsLeftColumn',
  data () {
    return {
      auth: casServer.authenticator,
      member: null
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
      this.member.updateAvatar(image).send().then(resp => {
        console.log(resp)
        console.log(this.auth.member)
      })
    },
    imageFileChanged (event) {
      let image = event.target.files[0]
      if (image) {
        this.updateAvatar(image)
      }
    },
    getMember () {
      this.CasMember.get(this.auth.member.referenceId).send().then(resp => {
        this.member = resp.models[0]
      })
    }
  },
  beforeMount () {
    this.member = new this.CasMember()
  },
  mounted () {
    this.getMember()
  }
}
</script>
