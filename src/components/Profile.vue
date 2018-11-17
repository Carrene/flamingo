<template>
  <form id="profile" @submit.prevent="updateMember">
    <div class="contents">
      <div class="info">
        <p>Profile</p>
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
      </div>
      <div class="organization">
        <p>Organizations</p>
        <div class="organization-box">
          <button class="primary-button medium" type="button" disabled>New Organization</button>
        </div>
      </div>
    </div>
    <snackbar :status="status" :message="message"  @close="status = null" />
    <div class="actions">
      <button class="primary-button medium" type="submit" :disabled="member.__status__ !== 'dirty'">Save changes</button>
    </div>
  </form>
</template>

<script>
import { mapState } from 'vuex'
import { casServer } from '../server'
import ValidationMessage from './ValidationMessage'
import Snackbar from './../components/Snackbar'

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
    ...mapState([
      'CasMember'
    ]),
    message () {
      if (this.status === 400) {
        return 'Empty Form'
      } else if (this.status === 404) {
        return 'Not Found'
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
      } else {
        return null
      }
    }
  },
  methods: {
    updateMember () {
      this.member.save().send().then(resp => {
        this.status = resp.status
        this.member = resp.models[0]
      }).catch(err => {
        this.status = err.status
      })
    },
    getMember () {
      this.CasMember.get(this.auth.member.referenceId).send().then(resp => {
        this.member = resp.models[0]
      })
    }
  },
  components: {
    ValidationMessage,
    Snackbar
  },
  beforeMount () {
    this.member = new this.CasMember()
  },
  mounted () {
    this.getMember()
  }
}
</script>
