<template>
  <div id="upcomingItems">

    <!-- TABLE -->

    <div class="table-box">

      <table class="table upcoming-items">
        <thead class="header">
          <tr class="row">
            <th
              v-for="header in headers"
              :key="header.label"
              class="cell"
              :class="header.className"
            >
              <div class="title-container" :title="header.label">
                {{ header.label }}
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
            <td class="cell starts-in">
              <p>lorem</p>
            </td>
            <td class="cell my-start">
              <p>lorem</p>
            </td>
            <td class="cell my-target">
              <p>lorem</p>
            </td>
            <td class="cell hours-worked">
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
  name: 'UpcomingItems',
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
          label: 'Starts In',
          className: 'starts-in'
        },
        {
          label: 'My Start',
          className: 'my-start'
        },
        {
          label: 'My Target',
          className: 'my-target'
        },
        {
          label: 'Hours Worked',
          className: 'hours-worked'
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
