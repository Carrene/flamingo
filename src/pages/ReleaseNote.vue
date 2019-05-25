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
          <p class="description">{{ selectedReleaseNote.id === note.id ? toggleReleaseNoteData(note.description) : note.description.slice(0, 100) }}</p>
          <p
            class="link"
            v-if="showingReadLess"
            @click="[showingReadLess = !showingReadLess, selectedReleaseNote = note]"
          >Read less</p>
          <p
            class="link"
            v-if="!showingReadLess"
            @click="[showingReadLess = !showingReadLess, selectedReleaseNote = note]"
          >Read more</p>
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
      showingReadLess: false,
      selectedReleaseNote: {}
    }
  },
  watch: {
    'showingReadLess' () {
      this.toggleReleaseNoteData(this.selectedReleaseNote)
    }
  },
  methods: {
    toggleReleaseNoteData (noteDescription) {
      if (this.showingReadLess) {
        return noteDescription
      } else if (!this.showingReadLess) {
        return noteDescription.slice(0, 100)
      }
    },
    moment
  }
}
</script>
