<template>
  <div id="filters">
    <!-- SUBSCRIBED FILTER -->

    <div
      class="filter-type"
    >
      <loading-checkbox
        :size="16"
        borderRadius="3px"
        checkedBorderColor="#008290"
        checkedBackgroundColor="#008290"
        spinnerColor="#008290"
      ></loading-checkbox>
      <!-- <button
          class="small"
          :class="filters.subscribed !== 'all' ? 'primary-button' : 'secondary-button'"
          @click="toggleSubscribedTooltip"
        >
          {{ metadata.fields.isSubscribed.label }}
        </button> -->
      <!-- <div
          class="tooltip-container center filter"
          v-if="showSubscribedTooltip"
          v-on-clickout="toggleSubscribedTooltip.bind(undefined, false)"
        >
          <div class="tooltip-header">
            <p>{{ metadata.fields.isSubscribed.label }}</p>
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
        </div> -->
    </div>

    <!-- BOARDING FILTER -->

    <div class="filter-type">
      <!-- <button
          class="small"
          :class="filters.boardings.length ? 'primary-button' : 'secondary-button'"
          @click="toggleBoardingTooltip"
        >
          {{ metadata.fields.boarding.label }}
        </button>
        <div
          class="tooltip-container center filter"
          v-if="showBoardingTooltip"
          v-on-clickout="toggleBoardingTooltip.bind(undefined, false)"
        >
          <div class="tooltip-header">
            <p>{{ metadata.fields.boarding.label }}</p>
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
        </div> -->
    </div>

    <!-- STATUS FILTER -->

    <div
      class="filter-type"
    >
      <!-- <button
          class="small"
          :class="filters.statuses.length ? 'primary-button' : 'secondary-button'"
          @click="toggleStatusTooltip"
        >
          {{ metadata.fields.status.label }}
        </button>
        <div
          class="tooltip-container center filter"
          v-if="showStatusTooltip"
          v-on-clickout="toggleStatusTooltip.bind(undefined, false)"
        >
          <div class="tooltip-header">
            <p>{{ metadata.fields.status.label }}</p>
          </div>
          <div class="tooltip-content">
            <div
              class="checkbox-container"
              v-for="(status, index) in statuses"
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
        </div> -->
    </div>

    <!-- PRIORITY FILTER -->

    <div class="filter-type">
      <!-- <button
          class="small"
          :class="filters.priorities.length ? 'primary-button' : 'secondary-button'"
          @click="togglePriorityTooltip"
        >
          {{ metadata.fields.priority.label }}
        </button>
        <div
          class="tooltip-container center filter"
          v-if="showPriorityTooltip"
          v-on-clickout="togglePriorityTooltip.bind(undefined, false)"
        >
          <div class="tooltip-header">
            <p>{{ metadata.fields.priority.label }}</p>
          </div>
          <div class="tooltip-content">
            <div
              class="checkbox-container"
              v-for="(priority, index) in priorities"
              :key="priority"
            >
              <input
                type="checkbox"
                class="checkbox"
                name="priority"
                :id="`priority${index}`"
                v-model="filters.priorities"
                :value="priority"
              >
              <label
                :for="`priority${index}`"
                class="check"
              ></label>
              <label
                :for="`priority${index}`"
                class="label"
              >{{ priority.formatText() }}</label>
            </div>
          </div>
        </div> -->
    </div>

    <!-- KIND FILTER -->

    <div
      class="filter-type"
    >
      <!-- <button
          class="small"
          :class="filters.kinds.length ? 'primary-button' : 'secondary-button'"
          @click="toggleKindTooltip"
        >
          {{ metadata.fields.kind.label }}
        </button>
        <div
          class="tooltip-container center filter"
          v-if="showKindTooltip"
          v-on-clickout="toggleKindTooltip.bind(undefined, false)"
        >
          <div class="tooltip-header">
            <p>{{ metadata.fields.kind.label }}</p>
          </div>
          <div class="tooltip-content">
            <div
              class="checkbox-container"
              v-for="(kind, index) in kinds"
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
        </div> -->
    </div>

    <!-- PHASE FILTER -->

    <div
      class="filter-type"
    >
      <!-- <button
          class="small"
          :class="filters.phases.length ? 'primary-button' : 'secondary-button'"
          @click="togglePhaseTooltip"
        > -->
      <!-- FIXME: Change this when metadata fixed! -->
      <!-- {{ metadata.fields.phaseId.label }}
          Phase
        </button> -->
      <!-- <div
          class="tooltip-container center filter"
          v-if="showPhaseTooltip"
          v-on-clickout="togglePhaseTooltip.bind(undefined, false)"
        >
          <div class="tooltip-header">
            <p> -->
      <!-- FIXME: Change this when metadata fixed! -->
      <!-- {{ metadata.fields.phaseId.label }} -->
      <!-- Phase -->
      <!-- </p> -->
      <!-- </div>
          <div class="tooltip-content">
            <div
              class="checkbox-container"
              v-for="phase in phasesOfSelectedWorkflow"
              :key="phase.id"
            >
              <input
                type="checkbox"
                class="checkbox"
                name="phase"
                :id="`phase${phase.id}`"
                v-model="filters.phases"
                :value="phase.id"
              >
              <label
                :for="`phase${phase.id}`"
                class="check"
              ></label>
              <label
                :for="`phase${phase.id}`"
                class="label"
              >{{ phase.title }}</label>
            </div>
          </div>
        </div> -->
    </div>

    <!-- TAG FILTER -->

    <div
      class="filter-type"
    >
      <!-- <button
          class="small"
          :class="filters.tags.length ? 'primary-button' : 'secondary-button'"
          @click="toggleTagTooltip"
        >
          {{ metadata.fields.tags.label }}
        </button>
        <div
          class="tooltip-container center filter"
          v-if="showTagTooltip"
          v-on-clickout="toggleTagTooltip.bind(undefined, false)"
        >
          <div class="tooltip-header">
            <p>{{ metadata.fields.tags.label }}</p>
          </div>
          <div class="tooltip-content">
            <div
              class="checkbox-container"
              v-for="tag in tags"
              :key="tag.id"
            >
              <input
                type="checkbox"
                class="checkbox"
                name="tag"
                :id="`tag${tag.id}`"
                v-model="filters.tags"
                :value="tag.id"
              >
              <label
                :for="`tag${tag.id}`"
                class="check"
              ></label>
              <label
                :for="`tag${tag.id}`"
                class="label"
              >{{ tag.title }}</label>
            </div>
          </div>
        </div> -->
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mixin as clickout } from 'vue-clickout'
import LoadingCheckbox from 'vue-loading-checkbox'
import 'vue-loading-checkbox/dist/LoadingCheckbox.css'

export default {
  name: 'Filters',
  mixins: [clickout],
  data () {
    return {
      showSubscribedTooltip: false,
      showBoardingTooltip: false,
      showStatusTooltip: false,
      showKindTooltip: false,
      showPhaseTooltip: false,
      showPriorityTooltip: false,
      showTagTooltip: false,
      filters: null
    }
  },
  props: ['changeAction', 'mutation', 'metadata', 'bordings', 'statuses', 'priorities', 'kinds', 'tooltipHandler'],
  computed: {
    ...mapState([
      'phasesOfSelectedWorkflow',
      'tags'
    ])
  },
  watch: {
    'filters': {
      deep: true,
      handler (newValue) {
        this.mutation(newValue)
      }
    }
    // 'items': {
    //   deep: true,
    //   handler () {
    //     this.changeAction()
    //   }

    // }
  },
  methods: {
    // toggleSubscribedTooltip (value) {
    //   if (typeof value === 'boolean') {
    //     this.showSubscribedTooltip = value
    //   } else {
    //     this.showSubscribedTooltip = !this.showSubscribedTooltip
    //   }
    // },
    // toggleBoardingTooltip (value) {
    //   if (typeof value === 'boolean') {
    //     this.showBoardingTooltip = value
    //   } else {
    //     this.showBoardingTooltip = !this.showBoardingTooltip
    //   }
    // },
    // toggleStatusTooltip (value) {
    //   if (typeof value === 'boolean') {
    //     this.showStatusTooltip = value
    //   } else {
    //     this.showStatusTooltip = !this.showStatusTooltip
    //   }
    // },
    // togglePriorityTooltip (value) {
    //   if (typeof value === 'boolean') {
    //     this.showPriorityTooltip = value
    //   } else {
    //     this.showPriorityTooltip = !this.showPriorityTooltip
    //   }
    // },
    // toggleKindTooltip (value) {
    //   if (typeof value === 'boolean') {
    //     this.showKindTooltip = value
    //   } else {
    //     this.showKindTooltip = !this.showKindTooltip
    //   }
    // },
    // togglePhaseTooltip (value) {
    //   if (typeof value === 'boolean') {
    //     this.showPhaseTooltip = value
    //   } else {
    //     this.showPhaseTooltip = !this.showPhaseTooltip
    //   }
    // },
    // toggleTagTooltip (value) {
    //   if (typeof value === 'boolean') {
    //     this.showTagTooltip = value
    //   } else {
    //     this.showTagTooltip = !this.showTagTooltip
    //   }
    // }
  },
  components: {
    LoadingCheckbox
  }
  // beforeMount () {
  //   this.filters = Object.assign(this.items)
  // }
}
</script>
