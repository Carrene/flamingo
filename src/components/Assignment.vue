<template>
  <div id="assignment">

    <!-- HEADER -->
    <div class="header">
      <!--TODO: ADD THIS LATER! -->
      <button
        v-if="false"
        type="button"
        class="secondary-button"
      >Submit Assign</button>
    </div>

    <!-- LOADING -->

    <loading v-if="loading" />

    <!-- CONTENT -->

    <div
      class="content"
      v-if="selectedItem"
    >

      <!-- ITEMS TABLE -->
      <div
        class="table-box"
        v-if="items.length"
      >
        <table class="table">
          <thead class="header">
            <tr class="row">
              <th
                v-for="header in itemHeaders"
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
            <tr
              class="row"
              :class="{selected: selectedPhaseItem && selectedPhaseItem.id === item.id}"
              v-for="item in items"
              :key="item.id"
            >

              <!-- PHASE -->

              <td class="phase cell">
                <p>{{ phases.find(phase => phase.id === item.phaseId).title }}</p>
              </td>

              <!-- STATUS -->

              <td class="status cell">
                <p>{{ item.status }}</p>
              </td>

              <!-- START DATE -->

              <td class="start cell">
                <p>{{ formatedDate(item.startDate) || '-' }}</p>
              </td>

              <!-- TARGET DATE -->

              <td class="target cell">
                <p>{{ formatedDate(item.endDate) || '-' }}</p>
              </td>

              <!-- HOURS WORKED -->

              <td class="hours cell">
                <p>{{ item.estimatedHours ? `${item.hoursWorked || 0} / ${item.estimatedHours}` : '-' }}</p>
              </td>

              <!-- RESOURCE LOAD -->

              <td class="load cell">
                <p>-</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- RESOURCE TABLE -->
      <!--TODO: ADD THIS LATER! -->
      <div
        class="table-box"
        v-if="false"
      >
        <table class="table">
          <thead class="header">
            <tr class="row">
              <th
                v-for="header in resourceHeaders"
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
            <tr
              class="row"
              v-for="resource in resources"
              :key="resource.id"
            >

              <!-- ASSIGN BUTTON -->

              <td
                class="assign-button cell"
                title="lorem ipsum"
              >
                <p></p>
              </td>

              <!-- RESOURCE -->

              <td
                class="resource cell"
                title="lorem ipsum"
              >
                <p>lorem ipsum</p>
              </td>

              <!-- STATUS -->

              <td
                class="status cell"
                title="lorem ipsum"
              >
                <p>lorem ipsum</p>
              </td>

              <!-- START DATE -->

              <td
                class="start cell"
                title="lorem ipsum"
              >
                <p>lorem ipsum</p>
              </td>

              <!-- TARGET DATE -->

              <td
                class="target cell"
                title="lorem ipsum"
              >
                <p>lorem ipsum</p>
              </td>

              <!-- HOURS WORKED -->

              <td
                class="hours cell"
                title="lorem ipsum"
              >
                <p>lorem ipsum</p>
              </td>

              <!-- RESOURCE LOAD -->

              <td
                class="load cell"
                title="lorem ipsum"
              >
                <p>lorem ipsum</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <snackbar
        :status="status"
        :message="message"
        @close="clearMessage"
        v-on-clickout="clearMessage"
      ></snackbar>
    </div>
    <div
      class="empty-state"
      v-else
    >
      <img
        class="empty-state-icon"
        src="../assets/assigned-empty-state.svg"
      >
      <div class="empty-state-content">
        <p class="content-title">You don't have nugget</p>
        <p class="content-sub-title">No nugget exists</p>
      </div>
    </div>
  </div>
</template>
<script>
import server from '../server'
import { mixin as clickout } from 'vue-clickout'
import moment from 'moment'
import { mapState, mapActions } from 'vuex'
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)
const Snackbar = () => import(
  /* webpackChunkName: "Snackbar" */ './Snackbar'
)
export default {
  name: 'Assignment',
  mixins: [clickout],
  data () {
    return {
      ItemMetadata: server.metadata.models.Item,
      status: null,
      message: null,
      loading: false,
      items: [],
      resources: [],
      selectedPhaseItem: null
    }
  },
  computed: {
    itemHeaders () {
      return [
        {
          label: 'Phase',
          className: 'phase'
        },
        {
          label: 'Status',
          className: 'status'
        },
        {
          label: 'Start',
          className: 'start-date'
        },
        {
          label: 'Target',
          className: 'target-date'
        },
        {
          label: 'Hours Worked',
          className: 'hours-worked'
        },
        {
          label: 'Load',
          className: 'load-resource'
        }
      ]
    },
    resourceHeaders () {
      return [
        {
          label: '',
          className: 'empty'
        },
        {
          label: 'Resource',
          className: 'phase'
        },
        {
          label: 'Status',
          className: 'status'
        },
        {
          label: 'Start',
          className: 'start-date'
        },
        {
          label: 'Target',
          className: 'target-date'
        },
        {
          label: 'Hours Worked',
          className: 'hours-worked'
        },
        {
          label: 'Load',
          className: 'load-resource'
        }
      ]
    },
    ...mapState([
      'Item',
      'selectedItem',
      'phases'
    ])
  },
  methods: {
    formatedDate (date) {
      if (date) {
        return moment(date).format('YYYY-MM-DD')
      } else {
        return null
      }
    },
    selectPhaseItem (item) {
      this.selectedPhaseItem = item
      this.listResources()
    },
    clearMessage () {
      this.status = null
      this.message = null
    },
    async listItems () {
      let resp = await this.Item.load({ issueId: this.selectedItem.issueId }).send()
      this.items = resp.models
    },
    async listResources () {
      let phase = this.phases.find(phase => this.selectedPhaseItem.phaseId === phase.id)
      let resp = await phase.listResources().send()
      this.resources = resp.models
    },
    ...mapActions([
      'listWorkflows',
      'listPhases'
    ])
  },
  watch: {
    'selectedItem.id': {
      immediate: true,
      async handler (newValue) {
        if (newValue) {
          if (!this.phases.length) {
            await this.listWorkflows()
            await this.listPhases()
          }
          await this.listItems()
          this.selectPhaseItem(this.items[0] || null)
        }
      }
    }
  },
  components: {
    Loading,
    Snackbar
  }
}
</script>
