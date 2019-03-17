<template>
  <div id="invite">

    <!-- HEADER -->

    <div class="header">

      <!-- HEADER TITLE -->

      <p class="title">
        Invite organization members
      </p>

      <!-- ACTION -->

      <button
        class="secondary-button"
        @click="invite"
        :disabled="!memberList.length"
      >Confirm</button>
    </div>

    <!-- CONTENT -->

    <div class="content">
      <div class="right-column">
        <form
          class="form"
          @submit.prevent="addToMemberList"
        >

          <!-- EMAIL -->

          <div class="input-container">
            <label
              for="organizationName"
              class="label"
            >{{ organizationMemberMetadata.fields.email.label }}</label>
            <input
              type="email"
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
            <!-- FIXME: Change validation condition -->
            <button
              class="secondary-button outlined"
              type="submit"
              :disabled="$v.member.email.$invalid || !$v.member.email.$model"
            >Invite</button>
          </div>
        </form>
        <div
          class="email-list"
          v-if="memberList.length"
        >
          <div
            class="info"
            v-for="(member, index) in memberList"
            :key="index"
          >
            <simple-svg
              :filepath="require('@/assets/email-envelope.svg')"
              fill="#6A6A6A"
              width=30
              class="email-icon"
            />
            <p class="email">{{ member.email }}</p>
            <p class="text">invited</p>
            <div class="close-icon" @click="removeFromMemberList(index)">
              <simple-svg
                :filepath="require('@/assets/close.svg')"
                fill="#6A6A6A"
                width=14
              />
            </div>
          </div>
        </div>
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
      roles: ['owner', 'member'],
      memberList: []
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
      let jsonPatchRequest = server.jsonPatchRequest(`${this.organization.updateURL}/invitations`)
      for (let member of this.memberList) {
        jsonPatchRequest.addRequest(this.organization.invite(member))
      }
      jsonPatchRequest.send().then(resps => {
        this.status = resps[0].status
        this.message = `${resps.length} person(s) has been successfully invited`
        this.memberList = []
      }).catch(err => {
        this.status = err[0].status
        this.message = err[0].error
      })
    },
    addToMemberList () {
      this.memberList.push(this.member)
      this.member = new this.OrganizationMember({ organizationRole: 'member' })
    },
    removeFromMemberList (index) {
      this.memberList.splice(index, 1)
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
    this.member = new this.OrganizationMember({ organizationRole: 'member' })
  },
  mounted () {
    console.log(this.$v.member)
  }
}
</script>
