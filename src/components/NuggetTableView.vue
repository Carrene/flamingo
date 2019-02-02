<template>
  <div id="nuggetTableView">

    <!-- Nuggets LIST -->

    <div class="entities">

      <!-- TABLE -->

      <table class="table">
        <thead class="header">
          <tr class="row">
            <th class="cell notification"></th>
            <th
              v-for="header in headers"
              :key="header.label"
              class="cell"
              :class="[{active: header.isActive}, header.className]"
              @click="sort(header)"
            >
              <loading-checkbox
                v-if="header.field === 'isSubscribed'"
                :size="16"
                borderRadius="3px"
                borderColor="#232323"
                checkedBorderColor="#A63E5D"
                checkedBackgroundColor="#A63E5D"
                spinnerColor="#A63E5D"
              ></loading-checkbox>
              <div class="title-container">
                <p :title="header.label">{{ header.label }}</p>
                <simple-svg
                  :filepath="sortIconSrc"
                  :fill="sortIconColor"
                  class="icon"
                  v-if="header.isActive"
                  :class="{ascending: !nuggetSortCriteria.descending}"
                ></simple-svg>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="content">
          <tr
            :class="{selected: selectedNugget && selectedNugget.id === nugget.id}"
            class="row"
            v-for="nugget in nuggets"
            :key="nugget.id"
            @click.capture="selectAction({ nugget: nugget })"
          >
            <td class="notification cell">
              <img
                src="../assets/notification-dark.svg"
                alt="notifications"
              >
            </td>
            <td class="subscribe cell">
              <loading-checkbox
                :checked="nugget.isSubscribed"
                @click.native="toggleSubscription(nugget)"
                :size="16"
                :loading="checkboxLoadings[nugget.id]"
                borderRadius="3px"
                borderColor="#232323"
                checkedBorderColor="#A63E5D"
                checkedBackgroundColor="#A63E5D"
                spinnerColor="#A63E5D"
              ></loading-checkbox>
            </td>
            <td
              class="cell id"
              :title="nugget.id"
            >
              <p>{{ nugget.id }}</p>
            </td>
            <td
              class="cell title"
              :title="nugget.title"
            >
              <p>{{ nugget.title }}</p>
            </td>
            <td
              :class="['pace', nugget.boarding]"
              class="cell"
              :title="nugget.boarding.formatText()"
            >
              <p>{{ nugget.boarding.formatText() }}</p>
            </td>
            <td
              class="status cell"
              :title="nugget.status.formatText()"
            >
              <p>{{ nugget.status.formatText() }}</p>
            </td>
            <td
              class="priority cell"
              :title="nugget.priority.formatText()"
            >
              <p>{{ nugget.priority.formatText() }}</p>
            </td>
            <td
              class="kind cell"
              :title="nugget.kind.formatText()"
            >
              <p>{{ nugget.kind.formatText() }}</p>
            </td>
            <td
              class="phase cell"
              :title="getPhaseTitle(nugget)"
            >
              <p>{{ getPhaseTitle(nugget) }}</p>
            </td>
            <td
              class="tags cell"
              :title="nugget.tagTitles.join(',')"
            >
              <p>{{ nugget.tagTitles.join(',') }}</p>
            </td>
            <td
              class="days cell"
              :title="nugget.days"
            >
              <p>{{ nugget.days }}</p>
            </td>
            <td
              class="target-date cell"
              :title="formatTargetDate(nugget.dueDate)"
            >
              <p>{{ formatTargetDate(nugget.dueDate) }}</p>
            </td>
            <td
              class="created-at cell"
              :title="formatTargetDate(nugget.createdAt)"
            >
              <p>{{ formatTargetDate(nugget.createdAt) }}</p>
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
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import moment from 'moment'
import server from './../server'
import { mixin as clickout } from 'vue-clickout'
import LoadingCheckbox from 'vue-loading-checkbox'
import 'vue-loading-checkbox/dist/LoadingCheckbox.css'

const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)

const Snackbar = () => import(
  /* webpackChunkName: "Snack" */ './Snackbar'
)

export default {
  mixins: [clickout],
  name: 'NuggetTableView',
  data () {
    return {
      loading: false,
      nuggetMetadata: server.metadata.models.Issue,
      sortIconColor: '#5E5375',
      sortIconSrc: require('@/assets/chevron-down.svg'),
      status: null,
      message: null,
      checkboxLoadings: {}
    }
  },
  props: {
    nuggets: {
      type: Array,
      default: null
    },
    selectAction: {
      type: Function,
      default: null
    }
  },
  computed: {
    headers () {
      return [
        {
          label: this.nuggetMetadata.fields.isSubscribed.label,
          isActive: this.nuggetSortCriteria.field === 'isSubscribed',
          field: 'isSubscribed',
          className: 'subscribe'
        },
        {
          label: this.nuggetMetadata.fields.id.label,
          isActive: this.nuggetSortCriteria.field === 'id',
          field: 'id',
          className: 'id'
        },
        {
          label: this.nuggetMetadata.fields.title.label,
          isActive: this.nuggetSortCriteria.field === 'title',
          field: 'title',
          className: 'title'
        },
        {
          label: this.nuggetMetadata.fields.boarding.label,
          isActive: this.nuggetSortCriteria.field === 'boarding',
          field: 'boarding',
          className: 'pace'
        },
        {
          label: this.nuggetMetadata.fields.status.label,
          isActive: this.nuggetSortCriteria.field === 'status',
          field: 'status',
          className: 'status'
        },
        {
          label: this.nuggetMetadata.fields.priority.label,
          isActive: this.nuggetSortCriteria.field === 'priority',
          field: 'priority',
          className: 'priority'
        },
        {
          label: this.nuggetMetadata.fields.kind.label,
          isActive: this.nuggetSortCriteria.field === 'kind',
          field: 'kind',
          className: 'kind'
        },
        {
          label: this.nuggetMetadata.fields.phaseId.label,
          isActive: this.nuggetSortCriteria.field === 'phaseId',
          field: 'phaseId',
          className: 'phase'
        },
        {
          label: this.nuggetMetadata.fields.tags.label,
          isActive: this.nuggetSortCriteria.field === 'tags',
          field: 'tags',
          className: 'tags'
        },
        {
          label: this.nuggetMetadata.fields.days.label,
          isActive: this.nuggetSortCriteria.field === 'days',
          field: 'days',
          className: 'days'
        },
        {
          label: this.nuggetMetadata.fields.dueDate.label,
          isActive: this.nuggetSortCriteria.field === 'dueDate',
          field: 'dueDate',
          className: 'target-date'
        },
        {
          label: this.nuggetMetadata.fields.createdAt.label,
          isActive: this.nuggetSortCriteria.field === 'createdAt',
          field: 'createdAt',
          className: 'created-at'
        }
      ]
    },
    ...mapState([
      'selectedNugget',
      'nuggetSortCriteria',
      'phasesOfSelectedWorkflow',
      'Resource'
    ])
  },
  methods: {
    formatTargetDate (isoString) {
      return moment(isoString).format('DD/MM/YYYY')
    },
    toggleSubscription (nugget) {
      this.clearMessage()
      this.$set(this.checkboxLoadings, nugget.id, true)
      let request
      if (nugget.isSubscribed) {
        request = nugget.unsubscribe().send()
      } else {
        request = nugget.subscribe().send()
      }
      request.catch((err) => {
        this.status = err.status
        this.message = err.error
      }).finally(() => {
        this.$set(this.checkboxLoadings, nugget.id, false)
      })
    },
    sort (header) {
      this.setNuggetSortCriteria({
        field: header.field,
        descending: header.isActive ? !this.nuggetSortCriteria.descending : false
      })
    },
    clearMessage () {
      this.status = null
      this.message = null
    },
    getPhaseTitle (nugget) {
      let phase = nugget.getPhase(this.phasesOfSelectedWorkflow)
      return phase ? phase.title : 'Triage'
    },
    ...mapMutations([
      'setNuggetSortCriteria'
    ])
  },
  components: {
    Loading,
    Snackbar,
    LoadingCheckbox
  }
}
</script>
