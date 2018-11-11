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
      image: null,
      member: null
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
    ])
  },
  methods: {
    uploadImageFile () {
      this.$refs.imageFileInput.value = []
      this.$refs.imageFileInput.click()
    },
    imageFileChanged (event) {
      this.image = event.target.files[0]
    },
    updateMember () {

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
