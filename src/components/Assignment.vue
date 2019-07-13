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
      v-if="selectedNuggets && selectedNuggets.length === 1"
    >

      <!-- ITEM NAME -->

      <div class="title">

        <!-- TITLE ID -->

        <div class="id">
          <p>N{{ selectedNuggets[0].id }}</p>
        </div>

        <!-- TITLE NAME -->

        <div class="name">
          <p>{{ selectedNuggets[0].title }}</p>
        </div>
      </div>

      <div class="tables">

        <!-- PHASE SUMMARIES TABLE -->

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
                  <p>{{ phase.status ? phase.status.formatText() : '-' }}</p>
                </td>

                <!-- START DATE -->

                <td class="start-date cell">
                  <p>{{ formatDate(phase.startDate) || '-' }}</p>
                </td>

                <!-- TARGET DATE -->

                <td class="target-date cell">
                  <p>{{ formatDate(phase.endDate) || '-' }}</p>
                </td>

                <!-- HOURS WORKED -->

                <td class="hours-worked cell">
                  <p>
                    {{
                    phase.estimatedHours ?
                    `${convertHoursToHoursAndMinutes(phase.hours)}/${convertHoursToHoursAndMinutes(phase.estimatedHours)}` :
                    '-'
                    }}
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
                :class="{selected: selectedResourceSummary && selectedResourceSummary.id === resource.id}"
                v-for="resource in currentResources"
                :key="resource.id"
                @click="selectResourceSummary(resource)"
              >

                <!-- ASSIGN BUTTON -->

                <td class="assign cell">
                  <div>
                    <button
                      title="Unassign"
                      class="unassign-button"
                      v-if="currentPhaseItems.some(item => item.memberId === resource.id)"
                      :class="{loading: singleResourceLoading === resource.id }"
                      @click.stop="unAssign(resource.id)"
                    >-</button>
                    <button
                      title="Assign"
                      class="assign-button"
                      :class="{loading: singleResourceLoading === resource.id }"
                      @click.stop="assign(resource.id)"
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
                    {{ resource.status ? resource.status.formatText() : '-' }}
                  </p>
                </td>

                <!-- START DATE -->

                <td
                  class="start cell"
                  :title="formatDate(resource.startDate)"
                >
                  <p>
                    {{ formatDate(resource.startDate) }}
                  </p>
                </td>

                <!-- TARGET DATE -->

                <td
                  class="target cell"
                  :title="formatDate(resource.endDate)"
                >
                  <p>
                    {{ formatDate(resource.endDate) }}
                  </p>
                </td>

                <!-- HOURS WORKED -->

                <td
                  class="hours cell"
                  :title="resource.hours ? convertHoursToHoursAndMinutes(resource.hours) : '-'"
                >
                  <p>
                    {{ resource.hours ? convertHoursToHoursAndMinutes(resource.hours) : '-' }}
                  </p>
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
      </div>

      <div
        class="time-card"
        v-if="selectedResourceSummary"
      >

        <!-- TIME CARD HEADER -->

        <div class="header">
          <p>Time Card</p>
        </div>

        <!-- TABLE -->

        <div class="table-box">
          <table class="table time-card-table">
            <thead class="header">
              <tr class="row">
                <th
                  v-for="header in timeCardHeaders"
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
                v-for="dailyReport in dailyReports"
                :key="dailyReport.id"
                :class="{'empty-daily-report': !dailyReport.id }"
              >

                <!-- REPORT DATE -->

                <td
                  class="report-date cell"
                  :title="formatDate(dailyReport.date)"
                >
                  <p>{{ formatDate(dailyReport.date) }}</p>
                </td>

                <!-- HOURS -->

                <td
                  class="hours cell"
                  :title="convertHoursToHoursAndMinutes(dailyReport.hours)"
                >
                  <p>{{ convertHoursToHoursAndMinutes(dailyReport.hours) }}</p>
                </td>

                <!-- NOTE -->

                <td
                  class="note cell"
                  :title="dailyReport.note"
                >
                  <vue-markdown
                    v-if="dailyReport.note"
                    :html="false"
                    :breaks="false"
                    :source="dailyReport.note"
                  ></vue-markdown>
                </td>
              </tr>
            </tbody>

          </table>
        </div>
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
import VueMarkdown from 'vue-markdown'
import DailyReportMixin from './../mixins/DailyReportMixin'
import LoadingCheckbox from 'vue-loading-checkbox'
import 'vue-loading-checkbox/dist/LoadingCheckbox.css'
import { formatDate, convertHoursToHoursAndMinutes } from '../helpers'
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
  mixins: [clickout, DailyReportMixin],
  data () {
    return {
      phasesSummaryMetadata: server.metadata.models.PhasesSummary,
      resourcesSummaryMetadata: server.metadata.models.ResourcesSummary,
      dailyReportMetadata: server.metadata.models.DailyReport,
      status: null,
      message: null,
      loading: false,
      resourceTableLoading: false,
      items: [],
      resources: [],
      resourceFiltered: false,
      assignmentRequests: [],
      singleResourceLoading: null,
      selectedPhaseSummary: null,
      selectedResourceSummary: null,
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
    timeCardHeaders () {
      return [
        {
          label: this.dailyReportMetadata.fields.date.label,
          className: 'report-date'
        },
        {
          label: this.dailyReportMetadata.fields.hours.label,
          className: 'hours'
        },
        {
          label: this.dailyReportMetadata.fields.note.label,
          className: 'note'
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
      'selectedNuggets',
      'phases',
      'ResourcesSummary',
      'Item'
    ])
  },
  methods: {
    async selectPhaseSummary (phase) {
      this.selectedPhaseSummary = phase
      await this.listResources()
    },
    async selectResourceSummary (resource) {
      // TODO: Add HOURS REPORTER LATER
      if (this.$route.name.match(/NeedApprovalItems|MissingHours|MissingEstimate|HoursReported/)) {
        this.selectedResourceSummary = resource
        if (this.selectedResourceSummary) {
          let itemResponse = await this.Item.load({
            memberId: this.selectedResourceSummary.id,
            phaseId: this.selectedPhaseSummary.id,
            issueId: this.selectedNuggets[0].id
          }).send()
          let item = itemResponse.models[0]
          this.listDailyReports(item)
        }
      } else {
        this.selectedResourceSummary = null
      }
    },
    clearMessage () {
      this.status = null
      this.message = null
    },
    async listResources () {
      let resourceResp = await this.ResourcesSummary.listResourcesSummary(this.selectedPhaseSummary.id, this.selectedNuggets[0].id).send()
      this.resources = resourceResp.models
      this.nugget = this.selectedNuggets[0]
    },
    async assign (memberId) {
      this.singleResourceLoading = memberId
      await this.nugget.assign(this.selectedPhaseSummary.id, memberId).send()
      await this.listResources()
      this.singleResourceLoading = null
      this.listItems()
    },
    async unAssign (memberId) {
      this.singleResourceLoading = memberId
      await this.nugget.unAssign(this.selectedPhaseSummary.id, memberId).send()
      await this.listResources()
      this.singleResourceLoading = null
      this.listItems()
    },
    async listPhasesSummary () {
      let resp = await this.selectedNuggets[0].listPhasesSummary().send()
      this.phasesSummaries = resp.models
    },
    convertHoursToHoursAndMinutes,
    formatDate,
    ...mapActions([
      'listWorkflows',
      'listPhases',
      'listResourcesSummary',
      'listItems'
    ])
  },
  watch: {
    'selectedNuggets': {
      immediate: true,
      async handler (newValue, oldValue) {
        if (
          newValue &&
          newValue.length === 1 &&
          (oldValue && oldValue.length === 1 ? newValue[0].id !== oldValue[0].id : true)
        ) {
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
    },
    'selectedPhaseSummary': {
      immediate: true,
      async handler (newValue) {
        if (newValue) {
          this.resourceTableLoading = true
          await this.listResources()
          this.resourceTableLoading = false
        }
        this.selectResourceSummary(this.currentResources[0] || null)
      }
    }
  },
  components: {
    Loading,
    Snackbar,
    Avatar,
    LoadingCheckbox,
    VueMarkdown
  }
}
</script>
