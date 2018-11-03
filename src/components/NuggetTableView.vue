<template>
  <div id="nuggetTableView">

    <!-- LOADING -->

    <loading v-if="loading"></loading>

    <!-- Nuggets LIST -->

    <div class="entities" v-else>
      <div class="table">
        <div class="row header">
          <div></div>
          <div>Subscribe</div>
          <div>Title</div>
          <div>Pace</div>
          <div>Status</div>
          <div>Priority</div>
          <div>Type</div>
          <div>Days</div>
          <div>Target Date</div>
        </div>
        <div :class="{selected: selectedNugget && selectedNugget.id === nugget.id}"
             class="row content"
             v-for="nugget in nuggetsOfSelectedProject"
             :key="nugget.id"
             @click="selectNugget(nugget)"
        >
          <!-- TODO: add notifications later -->
          <div class="notification">
            <img src="../assets/notification-dark.svg" alt="notifications">
          </div>
          <div class="checkbox-container subscribe">
                <input type="checkbox"
                       :id="`checkbox${nugget.id}`"
                       name="subscribe" class="checkbox"
                       :checked="nugget.isSubscribed"
                       @change="toggleSubscription(nugget)"
                />
                <label :for="`checkbox${nugget.id}`" class="check"></label>
          </div>
          <div class="title">
            {{ nugget.title }}
          </div>
          <div :class="['pace', nugget.boarding]">
            {{ formatText(nugget.boarding) }}
          </div>
          <div class="status">
            {{ formatText(nugget.status) }}
          </div>
          <!-- TODO: add priority later -->
          <div class="priority">
            High
          </div>
          <div class="kind">
            {{ formatText(nugget.kind) }}
          </div>
          <div class="days">
            {{ nugget.days }}
          </div>
          <div class="target-date">
            {{ formatTargetDate(nugget.dueDate) }}
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
export default {
  name: 'NuggetTableView',
  data () {
    return {
      loading: false
    }
  },
  computed: {
    ...mapState([
      'selectedNugget',
      'nuggetsOfSelectedProject'
    ])
  },
  methods: {
    formatText (input) {
      return input.split('-').join(' ').capitalize()
    },
    formatTargetDate (isoString) {
      return moment(isoString).format('DD/MM/YYYY')
    },
    toggleSubscription (nugget) {
      this.loading = true
      if (nugget.isSubscribed) {
        nugget.unsubscribe().send().finally(() => {
          this.listNuggets([nugget.id, () => {
            this.loading = false
          }])
        })
      } else {
        nugget.subscribe().send().finally(() => {
          this.listNuggets([nugget.id, () => {
            this.loading = false
          }])
        })
      }
    },
    ...mapMutations([
      'selectNugget'
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
