<template>
  <form
    id="profile"
    @submit.prevent="updateMember"
  >
    <div class="contents">
      <div class="info">
        <p>Profile</p>

        <!--INPUT-->

        <div class="input-container">
          <label
            for="name"
            class="label"
          >{{ casMemberMetadata.fields.name.label }}</label>
          <input
            type="text"
            id="name"
            class="light-primary-input"
            :placeholder="casMemberMetadata.fields.name.watermark"
            v-model="member.name"
            @input="$v.member.name.$touch"
          >
          <validation-message
            :validation="$v.member.name"
            :metadata="casMemberMetadata.fields.name"
          />
        </div>
      </div>

      <!-- TODO: Complete this when organization is ready -->

      <!--ORGANIZATION-->

      <div class="organization">
        <div class="organization-action">
          <p>Organizations</p>
          <button
            class="primary-button small"
            type="button"
            disabled
          >New</button>
        </div>
        <div class="organization-info">
          <img
            src=""
            alt=""
          >
          <button
            class="light-primary-button small"
            type="button"
            disabled
          >Leave</button>
        </div>
      </div>
    </div>
    <snackbar
      :status="status"
      :message="message"
      @close="status = null"
    />

    <!--ACTIONS-->

    <div class="actions">
      <button
        class="primary-button medium"
        type="submit"
        :disabled="member.__status__ !== 'dirty'"
      >Save changes</button>
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
      casMemberMetadata: casServer.metadata.models.Member,
      auth: casServer.authenticator,
      member: null,
      status: null,
      message: null
    }
  },
  validations () {
    return {
      member: {
        name: this.casMemberMetadata.fields.name.createValidator()
      }
    }
  },
  computed: {
    ...mapState([
      'CasMember'
    ])
  },
  methods: {
    updateMember () {
      this.status = null
      this.message = null
      this.member.save().send().then(resp => {
        this.message = 'OK'
        this.status = resp.status
        this.member = resp.models[0]
      }).catch(err => {
        this.status = err.status
        this.message = err.error
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
