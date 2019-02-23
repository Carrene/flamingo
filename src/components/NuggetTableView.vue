<template>
  <div id="nuggetTableView">

    <!-- Nuggets LIST -->

    <div class="entities">

      <!-- TABLE -->

      <table class="table">
        <thead class="header">
          <tr class="row">
            <th
              v-for="header in headers"
              :key="header.label"
              class="cell"
              :class="[{active: header.isActive}, header.className]"
              @click="sortAction(header)"
            >
              <div class="title-container">
                <p :title="header.label">{{ header.label }}</p>
                <simple-svg
                  :filepath="sortIconSrc"
                  :fill="sortIconColor"
                  class="icon"
                  v-if="header.isActive"
                  :class="{ascending: !sortCriteria.descending}"
                ></simple-svg>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="content">
          <tr
            :class="{selected: selectedNuggets.some(item => nugget.id === item.id), 'not-read': nugget.seenAt && nugget.isSubscribed}"
            class="row"
            v-for="nugget in nuggets"
            :key="nugget.id"
            @click="selectAction({ nugget: nugget })"
            @contextmenu.prevent="showMenu"
          >
            <td
              class="cell id"
              :title="nugget.id"
            >
              <p>{{ nugget.id }}</p>
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
              class="cell title"
              :title="nugget.title"
              @click.stop="eventHandler($event, nugget)"
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
          <nuggets-menu
            v-if="viewMenu && selectedNuggets.length"
            ref="menu"
            @mounted="setMenuPosition"
            @hideMenu="hideMenu"
            v-on-clickout.capture="hideMenu"
          />
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
import { mapState, mapActions } from 'vuex'
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
const NuggetsMenu = () => import(
  /* webpackChunkName: "NuggetsMenu" */ './NuggetsMenu'
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
      checkboxLoadings: {},
      viewMenu: false,
      mouseEvent: null
    }
  },
  props: {
    nuggets: Array,
    selectAction: Function,
    sortAction: Function,
    sortCriteria: Object
  },
  computed: {
    headers () {
      return [
        {
          label: this.nuggetMetadata.fields.id.label,
          isActive: this.sortCriteria.field === 'id',
          field: 'id',
          className: 'id'
        },
        {
          label: this.nuggetMetadata.fields.isSubscribed.label,
          isActive: this.sortCriteria.field === 'isSubscribed',
          field: 'isSubscribed',
          className: 'subscribe'
        },
        {
          label: this.nuggetMetadata.fields.title.label,
          isActive: this.sortCriteria.field === 'title',
          field: 'title',
          className: 'title'
        },
        {
          label: this.nuggetMetadata.fields.boarding.label,
          isActive: this.sortCriteria.field === 'boarding',
          field: 'boarding',
          className: 'pace'
        },
        {
          label: this.nuggetMetadata.fields.status.label,
          isActive: this.sortCriteria.field === 'status',
          field: 'status',
          className: 'status'
        },
        {
          label: this.nuggetMetadata.fields.priority.label,
          isActive: this.sortCriteria.field === 'priority',
          field: 'priority',
          className: 'priority'
        },
        {
          label: this.nuggetMetadata.fields.kind.label,
          isActive: this.sortCriteria.field === 'kind',
          field: 'kind',
          className: 'kind'
        },
        {
          label: this.nuggetMetadata.fields.phaseId.label,
          isActive: this.sortCriteria.field === 'phaseId',
          field: 'phaseId',
          className: 'phase'
        },
        {
          label: this.nuggetMetadata.fields.tagId.label,
          isActive: this.sortCriteria.field === 'tagId',
          field: 'tagId',
          className: 'tags'
        },
        {
          label: this.nuggetMetadata.fields.days.label,
          isActive: this.sortCriteria.field === 'days',
          field: 'days',
          className: 'days'
        },
        {
          label: this.nuggetMetadata.fields.dueDate.label,
          isActive: this.sortCriteria.field === 'dueDate',
          field: 'dueDate',
          className: 'target-date'
        },
        {
          label: this.nuggetMetadata.fields.createdAt.label,
          isActive: this.sortCriteria.field === 'createdAt',
          field: 'createdAt',
          className: 'created-at'
        }
      ]
    },
    ...mapState([
      'selectedNuggets',
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
    clearMessage () {
      this.status = null
      this.message = null
    },
    getPhaseTitle (nugget) {
      let phase = nugget.getPhase(this.phasesOfSelectedWorkflow)
      return phase ? phase.title : 'Triage'
    },
    eventHandler (event, requestedNugget) {
      if (event.ctrlKey) {
        this.updateSelectedNuggets(requestedNugget)
      } else {
        this.selectAction({ nugget: requestedNugget })
      }
    },
    hideMenu () {
      this.viewMenu = false
    },
    showMenu (event) {
      this.hideMenu()
      this.viewMenu = true
      this.mouseEvent = event
    },
    setMenuPosition () {
      let mouseX = this.mouseEvent.x
      let mouseY = this.mouseEvent.y
      let menuHeight = this.$refs.menu.$el.clientHeight
      let menuWidth = this.$refs.menu.$el.clientWidth
      if (Math.min(0, window.innerHeight - menuHeight - mouseY) < 0) {
        this.$refs.menu.$el.style.bottom = `${window.innerHeight - mouseY}px`
        this.$refs.menu.$el.classList.add('top')
      } else {
        this.$refs.menu.$el.style.top = `${mouseY}px`
      }
      this.$refs.menu.$el.style.left = `${mouseX - Math.abs(Math.min(0, window.innerWidth - menuWidth - mouseX))}px`
    },
    ...mapActions([
      'updateSelectedNuggets'
    ])
  },
  components: {
    Loading,
    Snackbar,
    LoadingCheckbox,
    NuggetsMenu
  }
}
</script>
