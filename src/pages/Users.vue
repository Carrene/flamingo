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
                <!-- FIXME: NOT IMPLEMENTED YET -->

                <td class="skills cell">
                  <div
                    class="skills-card"
                    v-for="skill in user.skills"
                    :key="skill.id"
                  >
                    <p>{{ skill.title || '-' }}</p>
                  </div>
                </td>
                <!-- <td class="group cell">
                  <div class="group-card">
                    <p>{{ user.groups ? user.groups[0].title : '-' }}</p>
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
        :users="users"
        v-if="selectedUser "
      />
    </div>
  </div>
</template>

<script>
import server from '../server'
import { mapState } from 'vuex'
const UsersForm = () => import(
  /* webpackChunkName: "UsersForm" */ '../components/UsersForm'
)
export default {
  name: 'Users',
  data () {
    return {
      memberMetadata: server.metadata.models.Member,
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
          label: this.memberMetadata.fields.title.label,
          field: 'userName',
          className: 'user-name'
        },
        {
          label: this.memberMetadata.fields.name.label,
          field: 'fullName',
          className: 'full-Name'
        },
        {
          label: this.memberMetadata.fields.email.label,
          field: 'email',
          className: 'email'
        },
        {
          label: this.memberMetadata.fields.skills.label,
          field: 'skills',
          className: 'skills'
        }
        // FIXME: NOT IMPLEMENTED YET
        // {
        //   label: this.memberMetadata.fields.groups.label,
        //   field: 'group',
        //   className: 'group'
        // }
      ]
    },
    ...mapState([
      'Organization',
      'Skill',
      'Member'
    ])
  },
  components: {
    UsersForm
  },
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
