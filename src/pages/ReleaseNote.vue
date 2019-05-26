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
          <p class="description">
            {{ shortenReleaseNoteDescription(note) }}
          </p>
          <p
            class="link"
            @click="setSelectedReleaseNote(note)"
          >{{ note.id === selectedReleaseNote.id ? 'Read less' : 'ReadMore' }}</p>
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
      releaseNotes: require('../../static/release-notes.json'),
      selectedReleaseNote: {}
    }
  },
  methods: {
    shortenReleaseNoteDescription (note) {
      if (this.selectedReleaseNote.id === note.id) {
        return note.description
      } else {
        return note.description.slice(0, 200) + '...'
      }
    },
    setSelectedReleaseNote (note) {
      this.selectedReleaseNote = note
    },
    moment: moment
  }
}
</script>
