<template>
  <div id="groups">

    <!-- LEFT COLUMN -->

    <div class="left-column">

      <!-- HEADER -->

      <div class="header">
        <p class="title">Groups</p>

      </div>

      <!-- CONTENT -->

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
                  <div class="title-container">
                    <p
                      :title="header.label"
                    >{{ header.label }}</p>
                  </div>
                </th>

              </tr>

            </thead>

            <tbody class="table-content">
              <tr
                class="row"
                v-for="group in groups"
                :key="group.id"
                @click="selectGroup(group)"
                :class="{'selected-group': selectedGroup && (group.id === selectedGroup.id)}"
              >
                <td class="group-name cell">{{ group.title }}</td>
                <td class="group-description cell">{{ group.description ? group.description : '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- GROUPS FORM -->

    <div class="right-column">
      <update-group-form
        class="form"
        v-if="selectedGroup"
        :selectedGroup='selectedGroup'
        @showNewGroupForm="showingNewGroupForm"
      />
      <new-group-form
        class="form"
        @created="selectGroup"
        v-else
      />
    </div>
  </div>
</template>

<script>
import server from '../server'
import { mapState } from 'vuex'
const UpdateGroupForm = () => import(
  /* webpackChunkName: "UpdateGroupForm" */ '../components/UpdateGroupForm'
)
const NewGroupForm = () => import(
  /* webpackChunkName: "NewGroupForm" */ '../components/NewGroupForm'
)

export default {
  name: 'Groups',
  data () {
    return {
      selectedGroup: null,
      groupMetadata: server.metadata.models.Group
    }
  },
  computed: {
    headers () {
      return [
        {
          label: this.groupMetadata.fields.title.label,
          field: 'groupName',
          className: 'group-name'
        },
        {
          label: this.groupMetadata.fields.description.label,
          field: 'groupDescription',
          className: 'group-description'
        }
      ]
    },
    ...mapState([
      'groups'
    ])
  },
  methods: {
    selectGroup (group) {
      this.selectedGroup = group
    },
    showingNewGroupForm () {
      this.selectedGroup = null
    }
  },
  components: {
    UpdateGroupForm,
    NewGroupForm
  },
  beforeMount () {
    if (this.groups.length) {
      this.selectedGroup = this.groups[0]
    }
  }
}
</script>
