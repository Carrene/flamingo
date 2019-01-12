<template>
  <div id="invite">

    <!-- HEADER -->

    <div class="header">

      <!-- HEADER TITLE -->

      <p class="title">
        Invite organization members
      </p>
    </div>

    <!-- CONTENT -->

    <div class="contents">
      <form
        class="form"
        @submit.prevent="invite"
      >

        <!-- EMAIL -->

        <div class="input-container">
          <label
            for="organizationName"
            class="label"
          >{{ organizationMemberMetadata.fields.email.label }}</label>
          <input
            type="text"
            id="organizationName"
            class="light-primary-input"
            v-model="$v.member.email.$model"
          >
          <validation-message
            :validation="$v.member.email"
            :metadata="organizationMemberMetadata.fields.email"
          />
        </div>

        <!-- ROLE -->

        <div class="input-container">
          <label
            for="role"
            class="label"
          >{{ organizationMemberMetadata.fields.organizationRole.label }}</label>
          <v-select
            :options="decoratedRoles"
            v-model="member.organizationRole"
            index="value"
            inputId="role"
            :clearable="!organizationMemberMetadata.fields.organizationRole.required"
          ></v-select>
          <validation-message
            :validation="$v.member.organizationRole"
            :metadata="organizationMemberMetadata.fields.organizationRole"
          />
        </div>
        <div class="actions">
          <button
            class="primary-button medium"
            type="submit"
            :disabled="$v.member.$invalid"
          >Invite</button>
        </div>
      </form>
      <div class="helper">
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Recusandae libero dicta repudiandae similique quia, quisquam, eos dolorum doloremque nisi delectus qui, inventore fugit animi? Ex quibusdam beatae rem sunt iste..</p>
      </div>
    </div>
    <snackbar
      :status="status"
      :message="message"
      @close="clearMessage"
      v-on-clickout="clearMessage"
    />
  </div>
</template>

<script>
import server from '../server'
import { mapState } from 'vuex'
import { mixin as clickout } from 'vue-clickout'
const ValidationMessage = () => import(
  /* webpackChunkName: "ValidationMessage" */ './../components/ValidationMessage.vue'
)
const Snackbar = () => import(
  /* webpackChunkName: "Snackbar" */ './../components/Snackbar.vue'
)

export default {
  mixins: [clickout],
  name: 'Invite',
  data () {
    return {
      status: null,
      member: null,
      message: null,
      organizationMemberMetadata: server.metadata.models.OrganizationMember,
      organization: null,
      showRolesList: false,
      roles: ['owner', 'member']
    }
  },
  validations () {
    return {
      member: {
        email: this.organizationMemberMetadata.fields.email.createValidator(),
        organizationRole: this.organizationMemberMetadata.fields.organizationRole.createValidator()
      }
    }
  },
  computed: {
    decoratedRoles () {
      return this.roles.map(role => {
        return {
          label: role.formatText(),
          value: role
        }
      })
    },
    ...mapState([
      'OrganizationMember',
      'Organization'
    ])
  },
  methods: {
    invite () {
      this.clearMessage()
      this.organization.invite(this.member).send().then(resp => {
        this.status = resp.status
        this.message = `${this.member.email} has been successfully invited`
      }).catch(err => {
        this.status = err.status
        this.message = err.error
      })
    },
    clearMessage () {
      this.status = null
      this.message = null
    }
  },
  components: {
    ValidationMessage,
    Snackbar
  },
  beforeMount () {
    this.organization = new this.Organization({ id: this.$route.params.id })
    this.member = new this.OrganizationMember()
  }
}
</script>
