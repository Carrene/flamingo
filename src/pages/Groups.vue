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
      <new-group-form class="form" v-if="showingNewGroupsForm"/>
      <update-group-form class="form" v-else/>
    </div>
  </div>
</template>

<script>
const UpdateGroupForm = () => import(
  /* webpackChunkName: "UpdateGroupForm" */ '../components/UpdateGroupForm'
)
const NewGroupForm = () => import(
  /* webpackChunkName: "NewGroupForm" */ '../components/NewGroupForm'
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
    UpdateGroupForm,
    NewGroupForm
  }
}
</script>
