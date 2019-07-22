<template>
  <div id="mojoTableView">

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
              :class="[{'active-filtering': header.isFilteringActive, 'active-sorting': header.isSortingActive }, header.className]"
            >
              <div class="title-container">
                <p :title="header.label">{{ header.label }}</p>
                <simple-svg
                  :filepath="sortIconSrc"
                  :fill="sortIconColor"
                  class="icon"
                  v-if="header.isSortingActive"
                  :class="{ascending: !sortCriteria.descending}"
                ></simple-svg>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="content">
          <tr
            class="row"
            v-for="nugget in nuggets"
            :key="nugget.id"
          >
            <td
              class="cell id"
              :title="nugget.id"
            >
              <p>N{{ nugget.id }}</p>
            </td>
            <td
              class="cell title"
              :title="nugget.title"
            >
              <p>{{ nugget.title }}</p>
            </td>
            <td
              class="cell mojo"
              :title="`${nugget.phases.design.mojoProgress.toFixed(2)}%`"
            >
              <mojo
                :progress="nugget.phases.design.mojoProgress"
                :boarding="nugget.phases.design.mojoBoarding"
                :hours="nugget.phases.design.mojoHours"
              ></mojo>
            </td>
            <td
              class="cell mojo"
              :title="`${nugget.phases.development.mojoProgress.toFixed(2)}%`"
            >
              <mojo
                :progress="nugget.phases.development.mojoProgress"
                :boarding="nugget.phases.development.mojoBoarding"
                :hours="nugget.phases.development.mojoHours"
              ></mojo>
            </td>
            <td
              class="cell mojo"
              :title="`${nugget.phases.test.mojoProgress.toFixed(2)}%`"
            >
              <mojo
                :progress="nugget.phases.test.mojoProgress"
                :boarding="nugget.phases.test.mojoBoarding"
                :hours="nugget.phases.test.mojoHours"
              ></mojo>
            </td>
            <td class="cell empty">
              <p></p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import { mixin as clickout } from 'vue-clickout'
const Mojo = () => import(
  /* webpackChunkName: "Mojo" */ './Mojo'
)
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)

export default {
  mixins: [clickout],
  name: 'MojoTableView',
  data () {
    return {
      sortIconColor: '#008290',
      sortIconSrc: require('@/assets/chevron-down.svg'),
      status: null,
      message: null,
      checkboxLoadings: {},
      viewMenu: false,
      mouseEvent: null,
      showTooltip: null,
      isSelected: 'sort',
      showInfiniteLoader: false
    }
  },
  props: {
    nuggets: Array
  },
  computed: {
    headers () {
      return [
        {
          label: 'ID',
          isSortingActive: false,
          isFilteringActive: false,
          field: 'id',
          sortCriteria: 'id',
          className: 'id',
          filteringItems: null
        },
        {
          label: 'Title',
          isSortingActive: false,
          isFilteringActive: false,
          field: 'title',
          sortCriteria: 'title',
          className: 'title',
          filteringItems: null
        },
        {
          label: 'Design',
          isSortingActive: false,
          isFilteringActive: false,
          field: 'design',
          sortCriteria: 'design',
          className: 'design',
          filteringItems: null
        },
        {
          label: 'Development',
          isSortingActive: false,
          isFilteringActive: false,
          field: 'development',
          sortCriteria: 'development',
          className: 'development',
          filteringItems: null
        },
        {
          label: 'Test',
          isSortingActive: false,
          isFilteringActive: false,
          field: 'test',
          sortCriteria: 'test',
          className: 'test',
          filteringItems: null
        },
        {
          label: '',
          className: 'empty'
        }
      ]
    },
    ...mapState([
    ]),
    ...mapGetters([
    ])
  },
  methods: {
    ...mapMutations([
    ]),
    ...mapActions([
    ])
  },
  components: {
    Loading,
    Mojo
  }
}
</script>
