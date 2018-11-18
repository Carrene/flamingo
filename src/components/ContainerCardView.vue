<template>
  <div id="containerCardView">

    <!-- CONTAINERS LIST -->

    <div class="entities">
      <div
        class="entity-details"
        v-for="container in containers"
        :key="container.id"
        :class="{selected: selectedContainer && (container.id === selectedContainer.id)}"
        @click="selectContainer(container)"
        @dblclick="activateNuggetView(container)"
      >
        <div class="row-1">
          <p class="container-name">{{ container.title }}</p>
          <div class="event-log">
            <p class="number"></p>
            <img
              src="../assets/events.svg"
              class="event-icon icons"
            >
          </div>
          <div class="unread-msg">
            <p class="number"></p>
            <img
              src="../assets/message.svg"
              class="unread-msg-icon icons"
            >
          </div>
        </div>
        <div class="row-2">
          <div :class="container.boarding ? container.boarding : 'status'">
            <img
              :src="require(`@/assets/${container.boarding}.svg`)"
              class="status-icon"
              v-if="container.boarding"
            >
            <p>
              {{ container.status }}
            </p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  name: 'ContainerCardView',
  data () {
    return {
    }
  },
  computed: {
    ...mapState([
      'containers',
      'selectedContainer'
    ])
  },
  methods: {
    activateNuggetView (container) {
      this.selectContainer(container)
    },
    ...mapMutations([
      'selectContainer'
    ])
  }
}
</script>
