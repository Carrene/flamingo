<template>
  <div id="upcomingItems">

    <!-- TABLE -->

    <div class="table-box">

      <table
        class="table upcoming-items"
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
              <div
                class="title-container"
                :title="header.label"
              >
                {{ header.label }}
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="content">
          <tr
            class="row"
            v-for="item in upcomingItems"
            :key="item.id"
            @click="selectItem(item)"
            :class="{'selected-item': selectedItem && selectedItem.id === item.id}"
          >
            <td class="cell id">
              <p>{{ item.issueId }}</p>
            </td>
            <td class="cell name">
              <p>{{ item.issue.title }}</p>
            </td>

            <td class="cell tempo">
              <div
                class="tempo-card"
                :class="item.issue.boarding"
              >
                <p>{{ item.issue.boarding.capitalize() }}</p>
              </div>
            </td>
            <td class="type cell">
              <p>{{ item.issue.kind.capitalize() }}</p>
            </td>
            <td class="cell starts-in">
              <p>{{ calculateStartingDate(item.startDate) }} Day</p>
            </td>
            <td class="cell my-start">
              <p>{{ formatDate(item.startDate) }}</p>
            </td>
            <td class="cell my-target">
              <p>{{ formatDate(item.endDate) }}</p>
            </td>
            <td class="cell hours-worked">
              <p><span>{{ item.hoursWorked ? Math.round(item.hoursWorked) : "0" }} </span>/ <span>{{ Math.round(item.estimatedHours) }}</span></p>
            </td>
            <td class="cell project">
              <p>{{ item.issue.project.title }}</p>
            </td>
            <td class="cell priority">
              <p>{{ item.issue.priority.capitalize() }}</p>
            </td>
            <td class="cell phase">
              <p>{{ phases.find(phase => item.phaseId === phase.id).title }}</p>
            </td>
          </tr>
        </tbody>
      </table>
      <infinite-loading
        spinner="spiral"
        @infinite="infiniteHandler"
        :identifier="infiniteLoaderIdentifier"
      >
        <div slot="spinner">
          <loading></loading>
        </div>
        <div slot="no-more"></div>
        <div slot="no-results"></div>
      </infinite-loading>
    </div>

  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { formatDate } from './../helpers.js'
import InfiniteLoading from 'vue-infinite-loading'
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)

export default {
  name: 'UpcomingItems',
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
        },
        {
          label: 'Phase',
          className: 'phase'
        }
      ]
    },
    ...mapState([
      'selectedItem',
      'upcomingItems',
      'infiniteLoaderIdentifier',
      'phases'
    ])
  },
  methods: {
    calculateStartingDate (startDate) {
      let today = new Date()
      let startDateObject = new Date(startDate)
      let timeDiff = Math.abs(startDateObject.getTime() - today.getTime())
      var diffDays = Math.ceil(timeDiff / (86400000)) // 1000 * 3600 * 24 = 86400000 (Number of milliseconds in one day)
      return diffDays
    },
    infiniteHandler ($state) {
      this.updateListItem($state)
    },
    formatDate: formatDate,
    ...mapActions([
      'listItems',
      'updateListItem',
      'selectItem'
    ])
  },
  components: {
    InfiniteLoading,
    Loading
  }
}
</script>
