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
                <p>{{ item.issue.boarding }}</p>
              </div>
            </td>
            <td class="type cell">
              <p>{{ item.issue.kind }}</p>
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
              <p><span>{{ item.hoursWrked ? item.hoursWorked : "0.00" }} </span>/ <span>{{ item.estimatedHours }}</span></p>
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
import { mapState, mapActions, mapMutations } from 'vuex'
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
        }
      ]
    },
    ...mapState([
      'selectedItem',
      'upcomingItems',
      'infiniteLoaderIdentifier'
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
    ...mapActions([
      'listItems',
      'updateListItem'
    ]),
    ...mapMutations([
      'selectItem'
    ]),
    formatDate
  },
  components: {
    InfiniteLoading,
    Loading
  }
}
</script>
