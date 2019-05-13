<template>
  <div id="needEstimateItems">

    <!-- TABLE -->

    <div class="table-box">

      <table class="table">
        <thead class="header">
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
        <tbody class="content">
          <tr class="row">
            <td class="cell id">
              <p>lorem</p>
            </td>
            <td class="cell name">
              <p>lorem</p>
            </td>

            <td class="cell tempo">
              <div class="tempo-card">
                <p>lorem</p>
              </div>
            </td>
            <td class="type cell">
              <p>lorem}</p>
            </td>
            <td class="cell response-time">
              <p>lorem</p>
            </td>
            <td class="cell project">
              <p>lorem</p>
            </td>
            <td class="cell priority">
              <p>lorem</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
import server from '../server'
import { mapState } from 'vuex'

export default {
  name: 'needEstimateItems',
  data () {
    return {
      selectedAssigned: null,
      itemMetadata: server.metadata.models.Item
    }
  },
  computed: {
    headers () {
      return [
        {
          label: this.itemMetadata.fields.id.label,
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
      'items'
    ])
  }
}
</script>
