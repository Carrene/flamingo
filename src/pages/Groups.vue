<template>
  <div id="groups">

    <!-- LEFT COLUMN -->

    <div class="left-column">

      <!-- HEADER -->

      <div class="header">
        <p class="title">Groups</p>

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
                    <p
                      :title="header.label"
                      :class="header.className"
                    >{{ header.label }}</p>
                  </div>
                </th>

              </tr>

            </thead>

            <tbody class="table-content">
              <tr class="row">
                <td class="group-name cell">lorem</td>
                <td class="group-description cell">lorem</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- GROUPS FORM -->

    <div class="right-column">
      <new-groups-form class="form" v-if="showingNewGroupsForm"/>
      <update-groups-form class="form" v-else/>
    </div>
  </div>
</template>

<script>
const UpdateGroupsForm = () => import(
  /* webpackChunkName: "UpdateGroupsForm" */ '../components/UpdateGroupsForm'
)
const NewGroupsForm = () => import(
  /* webpackChunkName: "NewGroupsForm" */ '../components/NewGroupsForm'
)

export default {
  name: 'Profile',
  data () {
    return {
      // TODO: THIS DATA IS STATIC, UPDATE LATER
      showingNewGroupsForm: true
    }
  },
  computed: {
    headers () {
      return [
        {
          label: 'Group Name',
          field: 'groupName',
          className: 'group-name'
        },
        {
          label: 'Group escription',
          field: 'groupDescription',
          className: 'group-description'
        }
      ]
    }
  },
  components: {
    UpdateGroupsForm,
    NewGroupsForm
  }
}
</script>
