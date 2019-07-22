<template>
  <div id="unread">

    <!-- HEADER -->

    <div class="header">
    </div>

    <!-- CONTENT -->

    <div class="content">

      <div class="table-container">
        <mojo-table-view :nuggets="nuggets" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

const MojoTableView = () => import(
  /* webpackChunkName: "MojoTableView" */ './../components/MojoTableView'
)

export default {
  name: 'MojoMeter',
  data () {
    return {
      nuggets: [
        {
          id: 1,
          title: 'Nugget 1',
          phases: {
            design: {
              mojoProgress: 50,
              mojoBoarding: 'on-time',
              mojoHours: 2
            },
            development: {
              mojoProgress: 20,
              mojoBoarding: 'delayed',
              mojoHours: 10
            },
            test: {
              mojoProgress: 10,
              mojoBoarding: 'on-time',
              mojoHours: 12
            }
          }
        },
        {
          id: 2,
          title: 'Nugget 2',
          phases: {
            design: {
              mojoProgress: 40,
              mojoBoarding: 'at-risk',
              mojoHours: 6
            },
            development: {
              mojoProgress: 80,
              mojoBoarding: 'on-time',
              mojoHours: 5
            },
            test: {
              mojoProgress: 100,
              mojoBoarding: 'on-time',
              mojoHours: 0
            }
          }
        },
        {
          id: 3,
          title: 'Nugget 3',
          phases: {
            design: {
              mojoProgress: 80,
              mojoBoarding: 'delayed',
              mojoHours: 12
            },
            development: {
              mojoProgress: 60,
              mojoBoarding: 'delayed',
              mojoHours: 10
            },
            test: {
              mojoProgress: 10,
              mojoBoarding: 'at-risk',
              mojoHours: 1
            }
          }
        },
        {
          id: 4,
          title: 'Nugget 4',
          phases: {
            design: {
              mojoProgress: 5,
              mojoBoarding: 'on-time',
              mojoHours: 20
            },
            development: {
              mojoProgress: 28,
              mojoBoarding: 'on-time',
              mojoHours: 16
            },
            test: {
              mojoProgress: 100,
              mojoBoarding: 'on-time',
              mojoHours: 0
            }
          }
        },
        {
          id: 5,
          title: 'Nugget 5',
          phases: {
            design: {
              mojoProgress: 80,
              mojoBoarding: 'at-risk',
              mojoHours: 2
            },
            development: {
              mojoProgress: 50,
              mojoBoarding: 'delayed',
              mojoHours: 17
            },
            test: {
              mojoProgress: 35,
              mojoBoarding: 'on-time',
              mojoHours: 2
            }
          }
        }
      ]
    }
  },
  computed: {
    ...mapState([
    ])
  },
  methods: {
    ...mapMutations([
    ]),
    ...mapActions([
    ])
  },
  components: {
    MojoTableView
  }
}
</script>
