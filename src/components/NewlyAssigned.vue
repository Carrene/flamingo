<template>
  <div id="newlyAssigned">

    <!-- TABLE -->

    <div class="table-box">

      <table
        class="table newly-assigned"
        v-if="showingTable"
      >
        <thead class="header">
          <tr class="row">
            <th
              v-for="header in headers"
              :key="header.label"
              class="cell"
              :class="header.className"
            >
              <div class="title-container">
                <p :title="header.label">{{ header.label }}</p>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="content">
          <tr
            class="row"
            v-for="item of newlyAssignedItems"
            :key="item.id"
            @click="selectItem(item)"
            :class="{'selected-item': selectedItem && selectedItem.id === item.id}"
          >
            <td class="cell id">
              <p>{{ item.issueId}}</p>
            </td>
            <td class="cell name">
              <p>{{ item.issue.title }}</p>
            </td>

            <td class="cell tempo">
              <div
                class="tempo-card"
                :class="item.issue.boarding"
              >
                <p>{{ item.issue.boarding }}</p>
              </div>
            </td>
            <td class="type cell">
              <p>{{ item.issue.kind }}</p>
            </td>

            <td class="cell project">
              <p>{{ item.issue.project.title }}</p>
            </td>
            <td class="cell priority">
              <p>{{ item.issue.priority }}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'NewlyAssigned',
  data () {
    return {
      selectedAssigned: null,
      showingTable: true
    }
  },
  computed: {
    headers () {
      return [
        {
          label: 'ID',
          className: 'id'
        },
        {
          label: 'Name',
          className: 'name'
        },
        {
          label: 'Tempo',
          className: 'tempo'
        },
        {
          label: 'Type',
          className: 'type'
        },
        {
          label: 'Project',
          className: 'project'
        },
        {
          label: 'Priority',
          className: 'priority'
        }
      ]
    },
    ...mapState([
      'newlyAssignedItems',
      'selectedItem'
    ])
  },
  methods: {
    ...mapActions([
      'listItems'
    ]),
    ...mapMutations([
      'selectItem'
    ])
  }
}
</script>
