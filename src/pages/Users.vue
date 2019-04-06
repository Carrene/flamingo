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
              <tr
                class="row"
                v-for="user in users"
                :key="user.id"
                @click="selectUser(user)"
                :class="{'selected-user': selectedUser && (user.id === selectedUser.id)}"
              >
                <td class="user-nmae cell">{{ user.title }}</td>
                <td class="full-name cell">{{ user.name ? user.name : '-' }}</td>
                <td class="email cell">{{ user.email }}</td>
                <td class="skills cell">
                  <div class="skills-card">
                    <p>{{ user.skillId ? user.skillId : '-' }}</p>
                  </div>
                </td>
                <!-- FIXME: NOT IMPLEMENTED YET -->

                <!-- <td class="group cell">
                  <div class="group-card">
                    <p>lorem</p>
                  </div>
                </td> -->
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- USERS FORMS -->

    <div class="right-column">
      <users-form
        class="form"
        :selectedUser="selectedUser"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import server from '../server'
const UsersForm = () => import(
  /* webpackChunkName: "UsersForm" */ '../components/UsersForm'
)
export default {
  name: 'Users',
  data () {
    return {
      auth: server.authenticator,
      organization: null,
      users: null,
      selectedUser: null
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
        }
        // FIXME: NOT IMPLEMENTED YET
        // {
        //   label: 'Group',
        //   field: 'group',
        //   className: 'group'
        // }
      ]
    },
    ...mapState([
      'Organization'
    ])
  },
  components: {
    UsersForm
  },
  // watch: {
  //   'selectedUser' (newValue) {
  //     console.log(this.selectedUser)
  //   }
  // },
  methods: {
    listOrganiszationUsers () {
      this.organization.listMembers().send().then(resp => {
        this.users = resp.models
        this.selectedUser = resp.models[0]
      })
    },
    selectUser (user) {
      this.selectedUser = user
    }
  },
  beforeMount () {
    this.organization = new this.Organization({ id: this.auth.member.organizationId })
    this.listOrganiszationUsers()
  }
}
</script>
