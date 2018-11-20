<template>
  <form id="profile" @submit.prevent="updateMember">
    <div class="contents">
      <div class="info">
        <p>Profile</p>

        <!--INPUT-->

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

      <!--ORGANIZATION-->

      <div class="organization">
        <div class="org-action">
          <p>Organizations</p>
          <button class="primary-button small" type="button" disabled>New</button>
        </div>
        <div class="org-info">
          <img src="" alt="">
          <button class="light-primary-button small" type="button" disabled>Leave</button>
        </div>
      </div>
    </div>
    <snackbar :status="status" :message="message"  @close="status = null" />

    <!--ACTIONS-->

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
      } else {
        return 'OK'
      }
    }
  },
  methods: {
    updateMember () {
      this.status = null
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
    console.log(this.auth.member)
  }
}
</script>
