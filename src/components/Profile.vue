<template>
  <form id="profile" @submit.prevent="updateMember">
    <input v-show="false"
           type="file"
           @change="imageFileChanged"
           ref="imageFileInput"
           accept="image/*"
    >
    <div class="contents">
      <div class="avatar">
        <p>Profile picture</p>
        <img :src="picSrc">
        <button type="button" class="primary-button medium" @click="uploadImageFile">Upload new picture</button>
      </div>
      <div class="info">
        <!-- FIXME: Use CAS metadata for labels, watermarks and validation -->
        <div class="input-container">
          <label for="name" class="label">{{ memberMetadata.fields.name.label }}</label>
          <input type="text"
                 id="name"
                 class="light-primary-input"
                 :placeholder="memberMetadata.fields.name.watermark"
                 v-model="member.name"
          >
          <validation-message :validation="$v.member.name" :metadata="memberMetadata.fields.name" />
        </div>
        <!-- FIXME: Use CAS metadata for labels, watermarks and validation -->
        <div class="input-container">
          <label for="phoneNumber" class="label">{{ memberMetadata.fields.phone.label }}</label>
          <input type="text"
                 id="phoneNumber"
                 class="light-primary-input"
                 :placeholder="memberMetadata.fields.phone.watermark"
                 v-model="member.phone"
          >
          <validation-message :validation="$v.member.phone" :metadata="memberMetadata.fields.phone" />
        </div>
      </div>
    </div>
    <div class="actions">
      <button class="light-primary-button medium">Cancel</button>
      <button class="primary-button medium" type="submit">Save changes</button>
    </div>
  </form>
</template>

<script>
import { mapState } from 'vuex'
import { casServer } from '../server'
import ValidationMessage from './ValidationMessage'

export default {
  name: 'Profile',
  data () {
    return {
      memberMetadata: casServer.metadata.models.Member,
      auth: casServer.authenticator,
      member: null,
      status: null
    }
  },
  validations () {
    return {
      member: {
        name: this.memberMetadata.fields.name.createValidator(),
        phone: this.memberMetadata.fields.phone.createValidator()
      }
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
      if (this.status === 400) {
        return 'Empty Form'
      } else if (this.status === 716) {
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
      } else if (this.status === 401) {
        return ' Unauthorized'
      } else {
        return null
      }
    }
  },
  methods: {
    uploadImageFile () {
      this.$refs.imageFileInput.value = []
      this.$refs.imageFileInput.click()
    },
    imageFileChanged (event) {
      let image = event.target.files[0]
      if (image) {
        this.updateAvatar(image)
      }
    },
    updateMember () {
      this.member.save().send().then(resp => {
        this.status = resp.status
      })
    },
    updateAvatar (image) {
      this.member.updateAvatar(image).send().then(resp => {
        console.log(resp)
        console.log(this.auth.member)
      })
    },
    getMember () {
      this.CasMember.get(this.auth.member.referenceId).send().then(resp => {
        this.member = resp.models[0]
      })
    }
  },
  components: {
    ValidationMessage
  },
  beforeMount () {
    this.member = new this.CasMember()
  },
  mounted () {
    this.getMember()
  }
}
</script>
