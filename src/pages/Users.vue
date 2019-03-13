<template>
  <div id="users">

    <!-- LEFT COLUMN -->

    <div class="left-column">

      <!-- HEADER -->

      <div class="header">
        <p class="title">Users</p>

      </div>
      <div class="content">

        <!-- TABLE -->
        <div class="table-box">

          <table class="table">

            <thead class="table-header">

              <tr class="row">

                <th
                  v-for="header in headers"
                  :key="header.label"
                  class="cell"
                >
                  <div class="title-container">
                    <p :title="header.label">{{ header.label }}</p>
                  </div>
                </th>

              </tr>

            </thead>

            <tbody class="table-content">
              <tr class="row">
                <td class="user-nmae cell">lorem</td>
                <td class="full-name cell">lorem</td>
                <td class="email cell">lorem</td>
                <td class="skills cell">
                  <div class="skills-card">
                    <p>lorem</p>
                  </div>
                </td>
                <td class="group cell">
                  <div class="group-card">
                    <p>lorem</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- USERS FORMS -->

    <div class="right-column">
      <users-form class="form" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { casServer } from '../server'
const ValidationMessage = () => import(
  /* webpackChunkName: "ValidationMessage" */ '../components/ValidationMessage'
)
const Snackbar = () => import(
  /* webpackChunkName: "Snackbar" */ '../components/Snackbar'
)
const ProfilePicture = () => import(
  /* webpackChunkName: "ProfilePicture" */ '../components/ProfilePicture'
)
const UsersForm = () => import(
  /* webpackChunkName: "UsersForm" */ '../components/UsersForm'
)
export default {
  name: 'Users',
  data () {
    return {
      profileCredentials: {
        name: null
      },
      casMemberMetadata: casServer.metadata.models.Member,
      auth: casServer.authenticator,
      member: null,
      status: null,
      message: null
    }
  },
  validations () {
    return {
      profileCredentials: {
        name: this.casMemberMetadata.fields.name.createValidator()
      }
    }
  },
  computed: {
    headers () {
      return [
        {
          label: 'User Name',
          field: 'userName',
          className: 'user-name'
        },
        {
          label: 'Full Name',
          field: 'fullName',
          className: 'full-Name'
        },
        {
          label: 'Email',
          field: 'email',
          className: 'email'
        },
        {
          label: 'Skills',
          field: 'skills',
          className: 'skills'
        },
        {
          label: 'Group',
          field: 'group',
          className: 'group'
        }
      ]
    },
    ...mapState([
      'CasMember'
    ])
  },
  methods: {
    updateMember () {
      this.clearMessage()
      this.member.save().send().then(resp => {
        this.message = 'Updated profile successfully'
        this.status = resp.status
      }).catch(err => {
        this.status = err.status
        this.message = err.error
      })
    },
    getMember () {
      this.CasMember.get('me').send().then(resp => {
        this.member = resp.models[0]
      })
    },
    clearMessage () {
      this.status = null
      this.message = null
    }
  },
  components: {
    ValidationMessage,
    Snackbar,
    ProfilePicture,
    UsersForm
  },
  beforeMount () {
    this.member = new this.CasMember()
  },
  mounted () {
    this.getMember()
  }
}
</script>
