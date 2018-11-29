<template>
  <div id="nuggetTableView">

    <!-- LOADING -->

    <loading v-if="loading"></loading>

    <!-- Nuggets LIST -->

    <div
      class="entities"
      v-else
    >

      <!-- FILTERS -->

      <div class="filters">
        <p>Filter By</p>

        <!-- SUBSCRIBED FILTER -->

        <div class="filter-type">
          <button
            class="small"
            :class="filters.subscribed !== 'all' ? 'primary-button' : 'light-primary-button'"
            @click="toggleSubscribedTooltip"
          >
            {{ nuggetMetadata.fields.isSubscribed.label }}
          </button>
          <div
            class="tooltip-container center filter"
            v-if="showSubscribedTooltip"
            v-on-clickaway="toggleSubscribedTooltip.bind(undefined, false)"
          >
            <div class="tooltip-header">
              <p>{{ nuggetMetadata.fields.isSubscribed.label }}</p>
            </div>
            <div class="tooltip-content">
              <div class="radio-container">
                <input
                  type="radio"
                  class="radio"
                  name="subscribed"
                  id="all"
                  v-model="filters.isSubscribed"
                  value="all"
                >
                <label
                  for="all"
                  class="check"
                ></label>
                <label
                  for="all"
                  class="label"
                >All</label>
              </div>

              <div class="radio-container">
                <input
                  type="radio"
                  class="radio"
                  name="subscribed"
                  id="notSubscribed"
                  v-model="filters.isSubscribed"
                  value="0"
                >
                <label
                  for="notSubscribed"
                  class="check"
                ></label>
                <label
                  for="notSubscribed"
                  class="label"
                >Not Subscribed</label>
              </div>

              <div class="radio-container">
                <input
                  type="radio"
                  class="radio"
                  name="subscribed"
                  id="Subscribed"
                  v-model="filters.isSubscribed"
                  value="1"
                >
                <label
                  for="Subscribed"
                  class="check"
                ></label>
                <label
                  for="Subscribed"
                  class="label"
                >Subscribed</label>
              </div>
            </div>
          </div>
        </div>

        <!-- BOARDING FILTER -->

        <div class="filter-type">
          <button
            class="small"
            :class="filters.boardings.length ? 'primary-button' : 'light-primary-button'"
            @click="toggleBoardingTooltip"
          >
            {{ nuggetMetadata.fields.boarding.label }}
          </button>
          <div
            class="tooltip-container center filter"
            v-if="showBoardingTooltip"
            v-on-clickaway="toggleBoardingTooltip.bind(undefined, false)"
          >
            <div class="tooltip-header">
              <p>{{ nuggetMetadata.fields.boarding.label }}</p>
            </div>
            <div class="tooltip-content">
              <div
                class="checkbox-container"
                v-for="(boarding, index) in boardings"
                :key="boarding"
              >
                <input
                  type="checkbox"
                  class="checkbox"
                  name="boarding"
                  :id="`boarding${index}`"
                  v-model="filters.boardings"
                  :value="boarding"
                >
                <label
                  :for="`boarding${index}`"
                  class="check"
                ></label>
                <label
                  :for="`boarding${index}`"
                  class="label"
                >{{ boarding.formatText() }}</label>
              </div>
            </div>
          </div>
        </div>

        <!-- STATUS FILTER -->

        <div class="filter-type">
          <button
            class="small"
            :class="filters.statuses.length ? 'primary-button' : 'light-primary-button'"
            @click="toggleStatusTooltip"
          >
            {{ nuggetMetadata.fields.status.label }}
          </button>
          <div
            class="tooltip-container center filter"
            v-if="showStatusTooltip"
            v-on-clickaway="toggleStatusTooltip.bind(undefined, false)"
          >
            <div class="tooltip-header">
              <p>{{ nuggetMetadata.fields.status.label }}</p>
            </div>
            <div class="tooltip-content">
              <div
                class="checkbox-container"
                v-for="(status, index) in nuggetStatuses"
                :key="status"
              >
                <input
                  type="checkbox"
                  class="checkbox"
                  name="status"
                  :id="`status${index}`"
                  v-model="filters.statuses"
                  :value="status"
                >
                <label
                  :for="`status${index}`"
                  class="check"
                ></label>
                <label
                  :for="`status${index}`"
                  class="label"
                >{{ status.formatText() }}</label>
              </div>
            </div>
          </div>
        </div>

        <!-- KIND FILTER -->

        <div class="filter-type">
          <button
            class="small"
            :class="filters.kinds.length ? 'primary-button' : 'light-primary-button'"
            @click="toggleKindTooltip"
          >
            {{ nuggetMetadata.fields.kind.label }}
          </button>
          <div
            class="tooltip-container center filter"
            v-if="showKindTooltip"
            v-on-clickaway="toggleKindTooltip.bind(undefined, false)"
          >
            <div class="tooltip-header">
              <p>{{ nuggetMetadata.fields.kind.label }}</p>
            </div>
            <div class="tooltip-content">
              <div
                class="checkbox-container"
                v-for="(kind, index) in nuggetKinds"
                :key="kind"
              >
                <input
                  type="checkbox"
                  class="checkbox"
                  name="kind"
                  :id="`kind${index}`"
                  v-model="filters.kinds"
                  :value="kind"
                >
                <label
                  :for="`kind${index}`"
                  class="check"
                ></label>
                <label
                  :for="`kind${index}`"
                  class="label"
                >{{ kind.formatText() }}</label>
              </div>
            </div>
          </div>
        </div>
      </div>

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
            <p>{{ header.label }}</p>
            <simple-svg
              :filepath="iconSrc"
              :fill="sortIconColor"
              class="icon"
              v-if="header.isActive"
              :class="{ascending: !nuggetSortCriteria.descending}"
            ></simple-svg>
          </div>
        </div>
        <div
          :class="{selected: selectedNugget && selectedNugget.id === nugget.id}"
          class="row content"
          v-for="nugget in nuggetsOfSelectedProject"
          :key="nugget.id"
          @click="selectNugget(nugget)"
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
          <div class="cell title">
            {{ nugget.title }}
          </div>
          <div
            :class="['pace', nugget.boarding]"
            class="cell"
          >
            {{ nugget.boarding.formatText() }}
          </div>
          <div class="status cell">
            {{ nugget.status.formatText() }}
          </div>
          <div class="kind cell">
            {{ nugget.kind.formatText() }}
          </div>
          <div class="days cell">
            {{ nugget.days }}
          </div>
          <div class="target-date cell">
            {{ formatTargetDate(nugget.dueDate) }}
          </div>
          <div class="created-at cell">
            {{ formatTargetDate(nugget.createdAt) }}
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'
import Loading from './Loading'
import moment from 'moment'
import server from './../server'
import { mixin as clickaway } from 'vue-clickaway'

export default {
  name: 'NuggetTableView',
  mixins: [clickaway],
  data () {
    return {
      loading: false,
      nuggetMetadata: server.metadata.models.Issue,
      sortIconColor: '#5E5375',
      iconSrc: require('@/assets/chevron-down.svg'),
      showSubscribedTooltip: false,
      showBoardingTooltip: false,
      showStatusTooltip: false,
      showKindTooltip: false,
      filters: null
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
          label: this.nuggetMetadata.fields.kind.label,
          isActive: this.nuggetSortCriteria.field === 'kind',
          field: 'kind'
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
      'nuggetSortCriteria',
      'boardings',
      'nuggetStatuses',
      'nuggetKinds',
      'nuggetFilters'
    ])
  },
  watch: {
    'filters': {
      deep: true,
      handler (newValue) {
        this.setNuggetFilters(newValue)
      }
    }
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
    toggleBoardingTooltip (value) {
      if (typeof value === 'boolean') {
        this.showBoardingTooltip = value
      } else {
        this.showBoardingTooltip = !this.showBoardingTooltip
      }
    },
    toggleStatusTooltip (value) {
      if (typeof value === 'boolean') {
        this.showStatusTooltip = value
      } else {
        this.showStatusTooltip = !this.showStatusTooltip
      }
    },
    toggleSubscribedTooltip (value) {
      if (typeof value === 'boolean') {
        this.showSubscribedTooltip = value
      } else {
        this.showSubscribedTooltip = !this.showSubscribedTooltip
      }
    },
    toggleKindTooltip (value) {
      if (typeof value === 'boolean') {
        this.showKindTooltip = value
      } else {
        this.showKindTooltip = !this.showKindTooltip
      }
    },
    ...mapMutations([
      'selectNugget',
      'setNuggetSortCriteria',
      'setNuggetFilters'
    ]),
    ...mapActions([
      'listNuggets'
    ])
  },
  beforeMount () {
    this.filters = Object.assign(this.nuggetFilters)
  },
  components: {
    Loading
  }
}
</script>
