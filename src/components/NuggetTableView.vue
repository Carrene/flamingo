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
            class="kind cell"
            :title="nugget.kind.formatText()"
          >
            <p>{{ nugget.kind.formatText() }}</p>
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
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'
import moment from 'moment'
import server from './../server'
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)

export default {
  name: 'NuggetTableView',
  data () {
    return {
      loading: false,
      nuggetMetadata: server.metadata.models.Issue,
      sortIconColor: '#5E5375',
      iconSrc: require('@/assets/chevron-down.svg')
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
    ...mapMutations([
      'selectNugget',
      'setNuggetSortCriteria'
    ]),
    ...mapActions([
      'listNuggets'
    ])
  },
  components: {
    Loading
  }
}
</script>
