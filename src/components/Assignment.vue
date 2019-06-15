<template>
  <div id="assignment">

    <!-- HEADER -->

    <div class="header">
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

      <div class="title">
        <p>{{ selectedItem.issue.title }}</p>
      </div>

      <div class="tables">

        <!-- ITEMS TABLE -->

        <div
          class="table-box"
          v-if="phasesSummaries.length"
        >
          <table class="table items-table">
            <thead class="header">
              <tr class="row">
                <th
                  v-for="header in phasesSummaryHeaders"
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
                :class="{selected: selectedPhaseSummary && selectedPhaseSummary.id === phase.id}"
                v-for="phase in phasesSummaries"
                :key="phase.id"
                @click=selectPhaseSummary(phase)
              >

                <!-- PHASE -->

                <td class="phase cell">
                  <p>{{ phase.title }}</p>
                </td>

                <!-- STATUS -->

                <td class="status cell">
                  <p>{{ phase.status }}</p>
                </td>

                <!-- START DATE -->

                <td class="start cell">
                  <p>{{ formatedDate(phase.startDate) || '-' }}</p>
                </td>

                <!-- TARGET DATE -->

                <td class="target cell">
                  <p>{{ formatedDate(phase.endDate) || '-' }}</p>
                </td>

                <!-- HOURS WORKED -->

                <td class="hours cell">
                  <p>
                    {{ phase.estimatedHours ? `${phase.hours ? phase.hours.toFixed(2) : '0.00'} / ${phase.estimatedHours.toFixed(2)}` : '-' }}
                  </p>
                </td>

              </tr>
            </tbody>
          </table>
        </div>

        <!-- RESOURCE TABLE -->

        <div class="table-box">
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
                v-for="resource in currentResources"
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
                  :title="resource.title"
                >
                  <p>{{ resource.title }}</p>
                </td>

                <!-- STATUS -->

                <td
                  class="status cell"
                  :title="resource.status"
                >
                  <p>
                    {{ resource.status }}
                  </p>
                </td>

                <!-- START DATE -->

                <td
                  class="start cell"
                  :title="formatedDate(resource.startDate)"
                >
                  <p>
                    {{ formatedDate(resource.startDate) }}
                  </p>
                </td>

                <!-- TARGET DATE -->

                <td
                  class="target cell"
                  :title="formatedDate(resource.endDate)"
                >
                  <p>
                    {{ formatedDate(resource.endDate) }}
                  </p>
                </td>

                <!-- HOURS WORKED -->

                <td
                  class="hours cell"
                  :title="resource.hours ? resource.hours.toFixed(2) : '-'"
                >
                  <p>
                    {{ resource.hours ? resource.hours.toFixed(2) : '-' }}
                  </p>
                  <p></p>
                </td>

                <!-- RESOURCE LOAD -->

                <td
                  class="load cell"
                  :title="resource.load"
                >
                  <p> {{ resource.load }} </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ACTIONS -->

      <div class="actions">

        <!-- CHECK BOX -->

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

        <!-- SUBMIT BUTTON -->

        <!--TODO: ADD THIS LATER! -->
        <button
          type="button"
          class="secondary-button"
          disabled
        >Submit Assign</button>
      </div>

      <!-- SNACKBAR -->

      <snackbar
        :status="status"
        :message="message"
        @close="clearMessage"
        v-on-clickout="clearMessage"
      ></snackbar>
    </div>

    <!-- EMPTY STATE -->

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
      phasesSummaryMetadata: server.metadata.models.PhasesSummary,
      resourcesSummaryMetadata: server.metadata.models.ResourcesSummary,
      status: null,
      message: null,
      loading: false,
      items: [],
      resources: [],
      resourceFiltered: false,
      assignmentRequests: [],
      selectedPhaseSummary: null,
      nugget: null,
      phasesSummaries: []
    }
  },
  computed: {
    phasesSummaryHeaders () {
      return [
        {
          label: this.phasesSummaryMetadata.fields.title.label,
          className: 'phase'
        },
        {
          label: 'Status',
          className: 'status'
        },
        {
          label: this.phasesSummaryMetadata.fields.startDate.label,
          className: 'start-date'
        },
        {
          label: this.phasesSummaryMetadata.fields.endDate.label,
          className: 'target-date'
        },
        {
          label: this.phasesSummaryMetadata.fields.hours.label,
          className: 'hours-worked'
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
          label: this.resourcesSummaryMetadata.fields.title.label,
          className: 'resource'
        },
        {
          label: 'Status',
          className: 'status'
        },
        {
          label: this.resourcesSummaryMetadata.fields.startDate.label,
          className: 'start'
        },
        {
          label: this.resourcesSummaryMetadata.fields.endDate.label,
          className: 'target'
        },
        {
          label: this.resourcesSummaryMetadata.fields.hours.label,
          className: 'hours'
        },
        {
          label: this.resourcesSummaryMetadata.fields.load.label,
          className: 'load'
        }
      ]
    },
    currentPhaseItems () {
      return this
        .nugget
        .items
        .filter(item => item.phaseId === this.selectedPhaseSummary.id)
    },
    currentResources () {
      if (!this.resourceFiltered) {
        return this.assignedResources.concat(this.unassignedResources)
      } else {
        return this.assignedResources
      }
    },
    assignedResources () {
      return this.resources.filter(resource => {
        return this.nugget.items
          .filter(item => this.selectedPhaseSummary.id === item.phaseId)
          .some(item => item.memberId === resource.id)
      })
    },
    unassignedResources () {
      return this.resources.filter(resource => {
        return this.nugget.items
          .filter(item => this.selectedPhaseSummary.id === item.phaseId)
          .every(item => item.memberId !== resource.id)
      })
    },
    ...mapState([
      'Nugget',
      'selectedItem',
      'phases',
      'ResourcesSummary'
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
    async selectPhaseSummary (phase) {
      this.loading = true
      this.selectedPhaseSummary = phase
      await this.listResources()
      this.loading = false
    },
    clearMessage () {
      this.status = null
      this.message = null
    },
    async listResources () {
      let resourceResp = await this.ResourcesSummary.listResourcesSummary(this.selectedPhaseSummary.id, this.selectedItem.issueId).send()
      let nuggetResp = await this.Nugget.get(this.selectedItem.issueId).send()
      this.resources = resourceResp.models
      this.nugget = nuggetResp.models[0]
    },
    async assign (memberId) {
      this.loading = true
      await this.nugget.assign(this.selectedPhaseSummary.id, memberId).send()
      await this.listResources()
      await this.listItems()
      this.loading = false
    },
    async unAssign (memberId) {
      this.loading = true
      await this.nugget.unAssign(this.selectedPhaseSummary.id, memberId).send()
      await this.listResources()
      await this.listItems()
      this.loading = false
    },
    async listPhasesSummary () {
      let resp = await this.selectedItem.listPhasesSummary().send()
      this.phasesSummaries = resp.models
    },
    ...mapActions([
      'listWorkflows',
      'listPhases',
      'listResourcesSummary',
      'listItems'
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
          await this.listPhasesSummary()
          this.selectPhaseSummary(this.phasesSummaries[0] || null)
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
