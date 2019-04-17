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
              <tr class="row">
                <td class="event-date cell">lorem</td>
                <td class="event-type cell">
                  lorem
                </td>
                <td class="event-repeat cell">lorem</td>
                <td class="event-description cell">lorem</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- EVENT FORMS -->

    <div class="right-column">
      <new-event-form class="form" v-if="showingNewEventForm"/>
      <update-event-form class="form" v-else/>
    </div>
  </div>
</template>

<script>
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
      showingNewEventForm: true
    }
  },
  computed: {
    headers () {
      return [
        {
          label: 'Date',
          field: 'date',
          className: 'date'
        },
        {
          label: 'Type',
          field: 'type',
          className: 'type'
        },
        {
          label: 'Repeat',
          field: 'repeat',
          className: 'repeat'
        },
        {
          label: 'Description',
          field: 'description',
          className: 'description'
        }
      ]
    }
  },
  components: {
    UpdateEventForm,
    NewEventForm,
    CalendarVisualizer
  }
}
</script>
