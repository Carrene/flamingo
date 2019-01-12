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
            v-for="nugget in nuggetsOfSelectedProject"
            :key="nugget.id"
            @click.capture="selectNugget(nugget)"
          >
            <td class="notification cell">
              <img
                src="../assets/notification-dark.svg"
                alt="notifications"
              >
            </td>
            <td class="subscribe cell">
              <div class="checkbox-container">
                <input
                  type="checkbox"
                  :id="`checkbox${nugget.id}`"
                  name="subscribe"
                  class="checkbox"
                  :checked="nugget.isSubscribed"
                  @change="toggleSubscription(nugget)"
                />
                <label
                  :for="`checkbox${nugget.id}`"
                  class="check"
                ></label>
              </div>
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
              :title="getPhaseTitles(nugget.phases).join(', ')"
            >
              <p>{{ getPhaseTitles(nugget.phases).join(', ') || 'Triage' }}</p>
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
import { mapMutations, mapState, mapActions } from 'vuex'
import moment from 'moment'
import server from './../server'
import { mixin as clickout } from 'vue-clickout'

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
      message: null
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
      'nuggetsOfSelectedProject',
      'nuggetSortCriteria'
    ])
  },
  methods: {
    formatTargetDate (isoString) {
      return moment(isoString).format('DD/MM/YYYY')
    },
    toggleSubscription (nugget) {
      this.loading = true
      if (nugget.isSubscribed) {
        nugget.unsubscribe().send().finally(() => {
          this.listNuggets([this.$route.params.projectId, nugget.id, () => {
            this.loading = false
          }])
        })
      } else {
        nugget.subscribe().send().finally(() => {
          this.listNuggets([this.$route.params.projectId, nugget.id, () => {
            this.loading = false
          }])
        })
      }
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
    getPhaseTitles (phases) {
      return phases.map(phase => {
        return phase.title
      })
    },
    ...mapMutations([
      'selectNugget',
      'setNuggetSortCriteria'
    ]),
    ...mapActions([
      'listNuggets'
    ])
  },
  components: {
    Loading,
    Snackbar
  }
}
</script>
