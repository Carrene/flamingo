<template>
  <div id="calendar">

    <calendar-visualizer class="calendar-visualizer"></calendar-visualizer>

    <!-- LEFT COLUMN -->

    <div class="left-column">

      <!-- HEADER -->

      <div class="header">
      </div>

      <div class="content">
        <div class="table-box">

          <table class="table">

            <thead class="table-header">

              <tr class="row">

                <th
                  v-for="header in headers"
                  :key="header.label"
                  class="cell"
                >
                  <div class="title-container">
                    <p
                      :title="header.label"
                      :class="header.className"
                    >{{ header.label }}</p>
                  </div>
                </th>

              </tr>

            </thead>

            <tbody class="table-content">
              <tr
                class="row"
                v-for="event of events"
                :key="event.id"
                @click="selectEvent(event)"
                :class="{'selected-event': selectedEvent && (event.id === selectedEvent.id)}"
              >
                <td class="event-title cell">
                  {{ event.title }}
                </td>
                <td class="event-date cell">{{
                  event.startDate === event.endDate ? formatTargetDate(event.startDate) : `${formatTargetDate(event.startDate)} - ${formatTargetDate(event.endDate)}`
                  }}
                </td>
                <td class="event-type cell">
                  {{ eventTypes.find(item => item.id === event.eventTypeId).title }}
                </td>
                <td class="event-repeat cell">{{ event.repeat }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- EVENT FORMS -->

    <div class="right-column">
      <new-event-form
        class="form"
        v-if="!selectedEvent"
        @created="selectEvent"
      />
      <update-event-form
        class="form"
        :selectedEvent="selectedEvent"
        @showNewEventForm="emptySelectedEvent"
        v-else
      />
    </div>
  </div>
</template>

<script>
import server from '../server'
import { mapState } from 'vuex'
import moment from 'moment'

const UpdateEventForm = () => import(
  /* webpackChunkName: "UpdateEventForm" */ '../components/UpdateEventForm'
)
const NewEventForm = () => import(
  /* webpackChunkName: "NewEventForm" */ '../components/NewEventForm'
)
const CalendarVisualizer = () => import(
  /* webpackChunkName: "CalendarVisualizer" */ '../components/CalendarVisualizer'
)

export default {
  name: 'Calendar',
  data () {
    return {
      selectedEvent: null,
      eventMetadata: server.metadata.models.Event

    }
  },
  computed: {
    headers () {
      return [
        {
          label: this.eventMetadata.fields.title.label,
          field: 'title',
          className: 'title'
        },
        {
          label: 'Date(s)',
          field: 'date',
          className: 'date'
        },
        {
          label: this.eventMetadata.fields.eventTypeId.label,
          field: 'type',
          className: 'type'
        },
        {
          label: this.eventMetadata.fields.repeat.label,
          field: 'repeat',
          className: 'repeat'
        }
      ]
    },
    ...mapState([
      'events',
      'eventTypes'
    ])
  },
  methods: {
    formatTargetDate (isoString) {
      return moment(isoString).format('DD/MM/YYYY')
    },
    emptySelectedEvent () {
      this.selectedEvent = null
    },
    selectEvent (event) {
      this.selectedEvent = event
    }
  },
  beforeMount () {
    if (this.events.length) {
      this.selectedEvent = this.events[0]
    }
  },
  components: {
    UpdateEventForm,
    NewEventForm,
    CalendarVisualizer
  }
}
</script>
