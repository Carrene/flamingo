<template>
  <div id="nuggetTableView">

    <!-- LOADING -->

    <loading v-if="loading"></loading>

    <!-- Nuggets LIST -->

    <div
      class="entities"
      v-else
    >

      <!-- TABLE -->

      <div class="table">
        <div class="row header">
          <div></div>
          <div
            v-for="header in headers"
            :key="header.label"
            class="cell"
            :class="{active: header.isActive}"
            @click="sort(header)"
          >
            <p :title="header.label">{{ header.label }}</p>
            <simple-svg
              :filepath="sortIconSrc"
              :fill="sortIconColor"
              class="icon"
              v-if="header.isActive"
              :class="{ascending: !nuggetSortCriteria.descending}"
            ></simple-svg>
          </div>
          <div class="cell">
            <p title="Actions">Actions</p>
          </div>
        </div>
        <div
          :class="{selected: selectedNugget && selectedNugget.id === nugget.id}"
          class="row content"
          v-for="nugget in nuggetsOfSelectedProject"
          :key="nugget.id"
          @click.capture="selectNugget(nugget)"
        >
          <!-- TODO: add notifications later -->
          <div class="notification cell">
            <img
              src="../assets/notification-dark.svg"
              alt="notifications"
            >
          </div>
          <div class="checkbox-container subscribe cell">
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
          <div
            class="cell title"
            :title="nugget.title"
          >
            <p>{{ nugget.title }}</p>
          </div>
          <div
            :class="['pace', nugget.boarding]"
            class="cell"
            :title="nugget.boarding.formatText()"
          >
            <p>{{ nugget.boarding.formatText() }}</p>
          </div>
          <div
            class="status cell"
            :title="nugget.status.formatText()"
          >
            <p>{{ nugget.status.formatText() }}</p>
          </div>
          <div
            class="priority cell"
            :title="nugget.priority.formatText()"
          >
            <p>{{ nugget.priority.formatText() }}</p>
          </div>
          <div
            class="kind cell"
            :title="nugget.kind.formatText()"
          >
            <p>{{ nugget.kind.formatText() }}</p>
          </div>
          <div
            class="phase cell"
            :title="getPhaseTitles(nugget.phases).join(',')"
          >
            <p>{{ getPhaseTitles(nugget.phases).join(',') }}</p>
          </div>
          <div
            class="days cell"
            :title="nugget.days"
          >
            <p>{{ nugget.days }}</p>
          </div>
          <div
            class="target-date cell"
            :title="formatTargetDate(nugget.dueDate)"
          >
            <p>{{ formatTargetDate(nugget.dueDate) }}</p>
          </div>
          <div
            class="created-at cell"
            :title="formatTargetDate(nugget.createdAt)"
          >
            <p>{{ formatTargetDate(nugget.createdAt) }}</p>
          </div>
          <div class="actions cell">
            <simple-svg
              :filepath="assignIconSrc"
              @click.native="showAssignModal"
            >
            </simple-svg>
          </div>
        </div>
      </div>

    </div>
    <assign
      ref="assign"
      v-if="showingAssignModal"
      @close="hideAssignModal"
    ></assign>
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
const Assign = () => import(
  /* webpackChunkName: "Assign" */ './Assign'
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
      assignIconSrc: require('@/assets/assign.svg'),
      showingAssignModal: false,
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
          field: 'isSubscribed'
        },
        {
          label: this.nuggetMetadata.fields.title.label,
          isActive: this.nuggetSortCriteria.field === 'title',
          field: 'title'
        },
        {
          label: this.nuggetMetadata.fields.boarding.label,
          isActive: this.nuggetSortCriteria.field === 'boarding',
          field: 'boarding'
        },
        {
          label: this.nuggetMetadata.fields.status.label,
          isActive: this.nuggetSortCriteria.field === 'status',
          field: 'status'
        },
        {
          label: this.nuggetMetadata.fields.priority.label,
          isActive: this.nuggetSortCriteria.field === 'priority',
          field: 'priority'
        },
        {
          label: this.nuggetMetadata.fields.kind.label,
          isActive: this.nuggetSortCriteria.field === 'kind',
          field: 'kind'
        },
        {
          label: this.nuggetMetadata.fields.phaseId.label,
          isActive: this.nuggetSortCriteria.field === 'phaseId',
          field: 'phaseId'
        },
        {
          label: this.nuggetMetadata.fields.days.label,
          isActive: this.nuggetSortCriteria.field === 'days',
          field: 'days'
        },
        {
          label: this.nuggetMetadata.fields.dueDate.label,
          isActive: this.nuggetSortCriteria.field === 'dueDate',
          field: 'dueDate'
        },
        {
          label: this.nuggetMetadata.fields.createdAt.label,
          isActive: this.nuggetSortCriteria.field === 'createdAt',
          field: 'createdAt'
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
    showAssignModal () {
      this.showingAssignModal = true
    },
    hideAssignModal (returnValue, error) {
      this.showingAssignModal = false
      if (returnValue === 'confirm') {
        this.loading = true
        this.listNuggets([this.$route.params.projectId, this.selectedNugget.id, () => {
          this.loading = false
        }])
      } else if (error) {
        this.status = error.status
        this.message = error.error
      }
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
    Assign,
    Snackbar
  }
}
</script>
