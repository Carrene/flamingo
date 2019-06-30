<template>
  <div id="hoursReported">
    <div class="table-box">
      <table class="table">
        <thead class="header">
          <tr class="row">
            <th
              v-for="header in headers"
              :key="header.label"
              class="cell"
              :class="header.className"
            >
              <div class="title-container">
                <p :title="header.label">{{ header.label }}</p>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="content">
          <tr
            class="row"
            v-for="item of hoursReportedItems"
            :key="item.id"
            @click="selectItem(item)"
            :class="{'selected-item': selectedItem && selectedItem.id === item.id}"
          >
            <td class="cell id">
              <p>N{{ item.issue.id }} </p>
            </td>
            <td class="cell title">
              <p>{{ item.issue.title }}</p>
            </td>

            <td class="cell tempo">
              <div
                class="tempo-card"
                :class="item.issue.boarding"
              >
                <p>{{ item.issue.boarding.capitalize() }}</p>
              </div>
            </td>
            <td class="type cell">
              <p>{{ item.issue.kind.capitalize() }}</p>
            </td>
            <td class="cell mojo">
              <p>-</p>
            </td>
            <td class="cell project">
              <p>{{ item.issue.project.title.capitalize() }}</p>
            </td>
            <td class="cell lead-resource">
              <p>-</p>
            </td>
            <td class="cell priority">
              <p>{{ item.issue.priority.capitalize() }}</p>
            </td>
            <td class="cell empty">
              <p></p>
            </td>

          </tr>
        </tbody>
      </table>

      <infinite-loading
        spinner="spiral"
        @infinite="infiniteHandler"
        :identifier="infiniteLoaderIdentifier"
      >
        <div slot="spinner">
          <loading></loading>
        </div>
        <div slot="no-more"></div>
        <div slot="no-results"></div>
      </infinite-loading>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import InfiniteLoading from 'vue-infinite-loading'
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)
export default {
  name: 'HoursReported',
  data () {
    return {

    }
  },
  computed: {
    headers () {
      return [
        {
          label: 'ID',
          className: 'id',
          field: 'id'
        },
        {
          label: 'Name',
          className: 'title',
          field: 'title'
        },
        {
          label: 'Tempo',
          className: 'tempo',
          field: 'boarding'
        },
        {
          label: 'Type',
          className: 'type',
          field: 'kind'
        },
        {
          label: 'Mojo',
          className: 'mojo',
          field: 'mojo'
        },
        {
          label: 'Project',
          className: 'project',
          field: 'project'
        },
        {
          label: 'Lead Resource',
          className: 'lead-resource',
          field: 'leadResource'
        },
        {
          label: 'Priority',
          className: 'priority',
          field: 'priority'
        },
        {
          label: '',
          className: 'empty'
        }
      ]
    },
    ...mapState([
      'hoursReportedItems',
      'selectedItem',
      'infiniteLoaderIdentifier'
    ])
  },
  methods: {
    infiniteHandler ($state) {
      this.updateListGoodNews($state)
    },
    ...mapActions([
      'updateListGoodNews',
      'selectItem'
    ])
  },
  components: {
    InfiniteLoading,
    Loading
  }
}
</script>
