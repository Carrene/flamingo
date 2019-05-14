<template>
  <div id="newlyAssigned">

    <!-- TABLE -->

    <div class="table-box">

      <table class="table newly-assigned">
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

export default {
  name: 'NewlyAssigned',
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
          label: 'Project',
          className: 'project'
        },
        {
          label: 'Priority',
          className: 'priority'
        }
      ]
    }
  }
}
</script>
