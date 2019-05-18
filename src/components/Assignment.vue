<template>
  <div id="assignment">

    <!-- HEADER -->

    <div class="header">
      <button
        type="button"
        class="secondary-button"
      >Submit Assign</button>
    </div>

    <!-- LOADING -->

    <loading v-if="loading" />

    <!-- CONTENT -->

    <div
      class="content"
      v-if="true"
    >

      <!-- ITEMS TABLE -->
      <div class="table-box">
        <table class="table">
          <thead class="header">
            <tr class="row">
              <th
                v-for="header in itemHeaders"
                :key="header.label"
                class="cell"
              >
                <div class="title-container">
                  <p :title="header.label">{{ header.label }}</p>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="content">
            <tr class="row">

              <!-- PHASE -->

              <td
                class="phase cell"
                title="lorem ipsum"
              >
                <p>lorem ipsum</p>
              </td>

              <!-- STATUS -->

              <td
                class="status cell"
                title="lorem ipsum"
              >
                <p>lorem ipsum</p>
              </td>

              <!-- START DATE -->

              <td
                class="start cell"
                title="lorem ipsum"
              >
                <p>lorem ipsum</p>
              </td>

              <!-- TARGET DATE -->

              <td
                class="target cell"
                title="lorem ipsum"
              >
                <p>lorem ipsum</p>
              </td>

              <!-- HOURS WORKED -->

              <td
                class="hours cell"
                title="lorem ipsum"
              >
                <p>lorem ipsum</p>
              </td>

              <!-- RESOURCE LOAD -->

              <td
                class="load cell"
                title="lorem ipsum"
              >
                <p>lorem ipsum</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- RESOURCE TABLE -->
      <div class="table-box">
        <table class="table">
          <thead class="header">
            <tr class="row">
              <th
                v-for="header in resourceHeaders"
                :key="header.label"
                class="cell"
              >
                <div class="title-container">
                  <p :title="header.label">{{ header.label }}</p>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="content">
            <tr class="row">

              <!-- ASSIGN BUTTON -->

              <td
                class="assign-button cell"
                title="lorem ipsum"
              >
                <p></p>
              </td>

              <!-- RESOURCE -->

              <td
                class="resource cell"
                title="lorem ipsum"
              >
                <p>lorem ipsum</p>
              </td>

              <!-- STATUS -->

              <td
                class="status cell"
                title="lorem ipsum"
              >
                <p>lorem ipsum</p>
              </td>

              <!-- START DATE -->

              <td
                class="start cell"
                title="lorem ipsum"
              >
                <p>lorem ipsum</p>
              </td>

              <!-- TARGET DATE -->

              <td
                class="target cell"
                title="lorem ipsum"
              >
                <p>lorem ipsum</p>
              </td>

              <!-- HOURS WORKED -->

              <td
                class="hours cell"
                title="lorem ipsum"
              >
                <p>lorem ipsum</p>
              </td>

              <!-- RESOURCE LOAD -->

              <td
                class="load cell"
                title="lorem ipsum"
              >
                <p>lorem ipsum</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

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
import server from '../server'
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)
const Snackbar = () => import(
  /* webpackChunkName: "Snackbar" */ './Snackbar'
)
export default {
  name: 'Assignment',
  data () {
    return {
      ItemMetadata: server.metadata.models.Item,
      status: null,
      message: null,
      loading: false
    }
  },
  computed: {
    itemHeaders () {
      return [
        {
          label: 'Phase',
          className: 'phase'
        },
        {
          label: 'Status',
          className: 'status'
        },
        {
          label: 'Start',
          className: 'start-date'
        },
        {
          label: 'Target',
          className: 'target-date'
        },
        {
          label: 'Hours Worked',
          className: 'hours-worked'
        },
        {
          label: 'Load',
          className: 'load-resource'
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
          label: 'Resource',
          className: 'phase'
        },
        {
          label: 'Status',
          className: 'status'
        },
        {
          label: 'Start',
          className: 'start-date'
        },
        {
          label: 'Target',
          className: 'target-date'
        },
        {
          label: 'Hours Worked',
          className: 'hours-worked'
        },
        {
          label: 'Load',
          className: 'load-resource'
        }
      ]
    }
  },
  methods: {
    clearMessage () {
      this.status = null
      this.message = null
    }
  },
  components: {
    Loading,
    Snackbar
  }
}
</script>
