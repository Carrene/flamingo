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
                  :class="header.className"
                >
                  <div class="title-container ">
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
                <!-- <div class="left-align"> -->
                <td class="user-name cell">{{ user.title }}</td>
                <td class="full-name cell">{{ user.name ? user.name : '-' }}</td>
                <td class="email cell">{{ user.email }}</td>
                <!-- </div> -->
                <td
                  class="skills cell"
                  :title="user.skills.length ? user.skills.map(skill => skill.title).join(',') : '-'"
                >
                  <div
                    class="skills-card"
                    v-if="!user.skills.length"
                  >
                    <p>-</p>
                  </div>
                  <div
                    class="skills-card"
                    v-for="skill in user.skills"
                    :key="skill.id"
                    v-else
                  >
                    <p>{{ skill.title }}</p>
                  </div>
                </td>
                <td
                  class="group cell"
                  :title="user.groups.length ? user.groups.map(group => group.title).join(',') : '-'"
                >
                  <div
                    class="group-card"
                    v-if="!user.groups.length"
                  >
                    <p>-</p>
                  </div>
                  <div
                    class="group-card"
                    v-for="group in user.groups"
                    :key="group.id"
                    v-else
                  >
                    <p>{{ group.title }}</p>
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
          className: 'full-name'
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
        },
        {
          label: this.memberMetadata.fields.groups.label,
          field: 'group',
          className: 'group'
        }
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
    listOrganizationUsers () {
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
    this.listOrganizationUsers()
  }
}
</script>
