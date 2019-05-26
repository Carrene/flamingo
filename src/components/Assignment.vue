<template>
  <div id="assignment">

    <!-- HEADER -->
    <div class="header">
      <!--TODO: ADD THIS LATER! -->
      <button
        type="button"
        class="secondary-button"
        disabled
      >Submit Assign</button>
      <avatar />
    </div>

    <!-- LOADING -->

    <loading v-if="loading" />

    <!-- CONTENT -->

    <div
      class="content"
      v-if="selectedItem"
    >

      <!-- ITEM NAME -->

      <div class="input-container">
        <label
          class="label"
          :for="ItemMetadata.fields.issue.name"
        >
          Name
        </label>
        <input
          type="text"
          class="light-primary-input"
          :id="ItemMetadata.fields.issue.name"
          :value="selectedItem.issue.title"
          readonly
        >
      </div>

      <!-- ITEMS TABLE -->

      <div
        class="table-box"
        v-if="items.length"
      >
        <table class="table items-table">
          <thead class="header">
            <tr class="row">
              <th
                v-for="header in itemHeaders"
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
              :class="{selected: selectedPhaseItem && selectedPhaseItem.id === item.id}"
              v-for="item in items"
              :key="item.id"
              @click=selectPhaseItem(item)
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
                <p>{{ item.estimatedHours ? `${item.hoursWorked.toFixed(2) || '0.00'} / ${item.estimatedHours.toFixed(2)}` : '-' }}</p>
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
        v-if="true"
      >
        <table class="table resources-table">
          <thead class="header">
            <tr class="row">
              <th
                v-for="header in resourceHeaders"
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
              v-for="resource in decoratedResources"
              :key="resource.id"
            >

              <!-- ASSIGN BUTTON -->

              <td class="assign cell">
                <div>
                  <button
                    title="Unassign"
                    class="unassign-button"
                    v-if="currentPhaseItems.some(item => item.memberId === resource.id)"
                    @click="unAssign(resource.id)"
                  >-</button>
                  <button
                    title="Assign"
                    class="assign-button"
                    @click="assign(resource.id)"
                    v-else
                  >+</button>
                </div>
              </td>

              <!-- RESOURCE -->

              <td
                class="resource cell"
                title="lorem ipsum"
              >
                <p>{{ resource.title }}</p>
              </td>

              <!-- STATUS -->

              <td
                class="status cell"
                title="lorem ipsum"
              >
                <p v-if="currentPhaseItems.some(item => item.memberId === resource.id)">
                  {{ selectedPhaseItem.status }}
                </p>
                <p v-else> - </p>
              </td>

              <!-- START DATE -->

              <td
                class="start cell"
                title="lorem ipsum"
              >
                <p v-if="currentPhaseItems.some(item => item.memberId === resource.id)">
                  {{ formatedDate(selectedPhaseItem.startDate) }}
                </p>
                <p v-else> - </p>
              </td>

              <!-- TARGET DATE -->

              <td
                class="target cell"
                title="lorem ipsum"
              >
                <p v-if="currentPhaseItems.some(item => item.memberId === resource.id)">
                  {{ formatedDate(selectedPhaseItem.endDate) }}
                </p>
                <p v-else> - </p>
              </td>

              <!-- HOURS WORKED -->

              <td
                class="hours cell"
                title="lorem ipsum"
              >
                <p v-if="currentPhaseItems.some(item => item.memberId === resource.id)">
                  {{ selectedPhaseItem.hoursWorked.toFixed(2) }}
                </p>
                <p v-else> - </p>
              </td>

              <!-- RESOURCE LOAD -->

              <td
                class="load cell"
                title="lorem ipsum"
              >
                <p> - </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <loading-checkbox
        class="check-box"
        :checked="resourceFiltered"
        @click.native="resourceFiltered = !resourceFiltered"
        :size="14"
        :fontSize="14"
        :gap="8"
        label="Only show assigned resource"
        borderRadius="3px"
        checkedBorderColor="#008290"
        checkedBackgroundColor="#008290"
        spinnerColor="#008290"
      ></loading-checkbox>

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
import LoadingCheckbox from 'vue-loading-checkbox'
import 'vue-loading-checkbox/dist/LoadingCheckbox.css'
import { mapState, mapActions } from 'vuex'
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)
const Snackbar = () => import(
  /* webpackChunkName: "Snackbar" */ './Snackbar'
)
const Avatar = () => import(
  /* webpackChunkName: "Avarat" */ '../components/Avatar'
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
      resourceFiltered: false,
      assignmentRequests: [],
      selectedPhaseItem: null,
      nugget: null
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
          className: 'resource'
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
    currentPhaseItems () {
      return this
        .nugget
        .items
        .filter(item => item.phaseId === this.selectedPhaseItem.phaseId)
    },
    decoratedResources () {
      if (this.resourceFiltered) {
        return this.resources
          .filter(resource => {
            return this.currentPhaseItems
              .some(item => item.memberId === resource.id)
          })
      } else {
        return this.resources
      }
    },
    ...mapState([
      'Item',
      'Nugget',
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
    async selectPhaseItem (item) {
      this.loading = true
      this.selectedPhaseItem = item
      await this.listResources()
      this.loading = false
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
      let resourceResp = await phase.listResources().send()
      let nuggetResp = await this.Nugget.get(this.selectedItem.issueId).send()
      this.resources = resourceResp.models
      this.nugget = nuggetResp.models[0]
    },
    async assign (memberId) {
      this.loading = true
      await this.nugget.assign(this.selectedPhaseItem.phaseId, memberId).send()
      await this.listResources()
      this.loading = false
    },
    async unAssign (memberId) {
      this.loading = true
      await this.nugget.unAssign(this.selectedPhaseItem.phaseId, memberId).send()
      await this.listResources()
      this.loading = false
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
          this.loading = true
          if (!this.phases.length) {
            await this.listWorkflows()
            await this.listPhases()
          }
          await this.listItems()
          this.selectPhaseItem(this.items[0] || null)
          this.loading = false
        }
      }
    }
  },
  components: {
    Loading,
    Snackbar,
    Avatar,
    LoadingCheckbox
  }
}
</script>
