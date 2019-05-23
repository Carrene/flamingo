<template>
  <div id="releaseNote">

    <!-- LEFT COLUMN -->

    <div class="left-column">

      <!-- HEADER -->

      <div class="header">
        <p class="title">Release Note</p>
      </div>

      <!-- CONTENT -->

      <div class="content">
        <div
          v-for="note in releaseNotes"
          :key="note.date"
          class="single-note"
        >
          <p class="date">{{ moment(note.date).format('DD MMMM, YYYY') }}</p>
          <p class="title">{{ note.title }}</p>
          <p class="description">{{ note.description }}</p>
        </div>

      </div>
    </div>

    <!-- RELEASE NOTE FORMS -->

    <div class="right-column">
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'ReleaseNote',
  data () {
    return {
      releaseNotes: require('../../static/release-notes.json')
    }
  },
  methods: {
    moment
  }
}
</script>
