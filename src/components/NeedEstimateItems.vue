<template>
  <div id="needEstimateItems">

    <!-- TABLE -->

    <div class="table-box">

      <table class="table need-estimate-items">
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
            v-for="item in items"
            :key="item.id"
            @click="selectItem(item)"
            :class="{'selected-item': selectedItem.id === item.id}"
          >
            <td class="cell id">
              <p>{{ item.issueId }}</p>
            </td>
            <td class="cell name">
              <p>{{ item.issue.title }}</p>
            </td>

            <td class="cell tempo">
              <div class="tempo-card">
                <p>lorem</p>
              </div>
            </td>
            <td class="type cell">
              <p>{{ item.issue.kind }}</p>
            </td>
            <td class="cell response-time">
              <p>lorem</p>
            </td>
            <td class="cell project">
              <p>lorem</p>
            </td>
            <td class="cell priority">
              <p>{{ item.issue.priority}}</p>
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
  name: 'needEstimateItems',
  data () {
    return {
      selectedAssigned: null,
      showingTable: false
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
          label: 'Response Time',
          className: 'response-time'
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
      'items',
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
  },
  async beforeMount () {
    await this.listItems({ zone: 'needEstimate' })
    this.showingTable = true
  }
}
</script>
