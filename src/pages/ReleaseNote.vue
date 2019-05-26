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
          :key="note.id"
          class="single-note"
        >
          <p class="date">{{ moment(note.date).format('DD MMMM, YYYY') }}</p>
          <p class="title">{{ note.title }}</p>
          <ul class="description">
            <li v-for="(item, index) in shortenReleaseNoteDescription(note)" :key="index">
              {{ item }}
            </li>
          </ul>
          <p
            class="link"
            @click="setSelectedReleaseNote(note)"
          >{{ note.id === selectedReleaseNote.id ? 'Read less' : 'Read More' }}</p>
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
      releaseNotes: require('../../static/release-notes.json').reverse(),
      selectedReleaseNote: {}
    }
  },
  methods: {
    shortenReleaseNoteDescription (note) {
      if (this.selectedReleaseNote.id === note.id) {
        return note.description
      } else {
        return note.description.slice(0, 3).concat(['...'])
      }
    },
    setSelectedReleaseNote (note) {
      if (note.id === this.selectedReleaseNote.id) {
        this.selectedReleaseNote = {}
      } else {
        this.selectedReleaseNote = note
      }
    },
    moment: moment
  }
}
</script>
