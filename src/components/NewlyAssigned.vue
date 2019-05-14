<template>
  <div id="newlyAssigned">

    <!-- TABLE -->

    <div class="table-box">

      <table class="table newly-assigned" v-if="showingTable">
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
            v-for="item of items"
            :key="item.id"
            @click="selectItem(item)"
            :class="{'selected-item': selectedItem.id === item.id}"
          >
            <td class="cell id">
              <p>{{ item.issueId}}</p>
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

            <td class="cell project">
              <p>lorem</p>
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
import server from '../server'
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'NewlyAssigned',
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
    await this.listItems()
    this.showingTable = true
  }
}
</script>
