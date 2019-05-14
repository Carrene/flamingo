<template>
  <div id="inprogressItems">

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
        <tbody class="content" v-if="showingTable">
          <tr
            class="row"
            v-for="item of items"
            :key="item.id"
            @click="selectItem(item)"
            :class="{'selected-item': selectedItem.id === item.id}"
          >
            <td class="cell id">
              <p>{{ item.issueId }}</p>
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
              <p>lorem</p>
            </td>
            <td class="cell time-card">
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
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'InprogressItems',
  data () {
    return {
      selectedAssigned: null,
      itemMetadata: server.metadata.models.Item,
      showingTable: false
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
          label: 'Time Card',
          className: 'time-card'
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
    await this.listItems({ zone: 'inProcessNuggets' })
    this.showingTable = true
  }
}
</script>
