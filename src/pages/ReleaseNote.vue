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
        >
          <p>{{ note.date }}</p>
          <h1>{{ note.title }}</h1>
          <p>{{ note.description }}</p>
        </div>

      </div>
    </div>

    <!-- TAG FORMS -->

    <div class="right-column">
      <!-- <new-release-note-form class="form" /> -->
      <!--    @created="selectTag"
        v-if="!selectedTag"
      /> -->
      <update-release-note-form class="form" />

      <!--         :selectedTag="selectedTag"
        @showNewReleaseNoteForm="emptySelectedTag"
        v-else -->
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import server from '../server'
const UpdateReleaseNoteForm = () => import(
  /* webpackChunkName: "UpdateReleaseNoteForm" */ '../components/UpdateReleaseNoteForm'
)
const NewReleaseNoteForm = () => import(
  /* webpackChunkName: "NewTagForm" */ '../components/NewTagForm'
)

export default {
  name: 'ReleaseNote',
  data () {
    return {
      releaseNotes: [
        {
          title: 'lorem',
          date: '1/1/1',
          description: `Lorem ipsum, dolor sit amet consectetur adipisicing elit.
           Ipsam eveniet, reprehenderit fugiat deserunt, laboriosam nulla maiores dolor,
           nostrum voluptatem temporibus amet exercitationem alias possimus quod modi distinctio.
            Aperiam, harum itaque.`
        },
        {
          title: 'lorem',
          date: '2/2/2',
          description: 'lorem lorem'
        },
        {
          title: 'lorem',
          date: '3/3/3',
          description: 'lorem lorem'
        },
        {
          title: 'lorem',
          date: '4/4/4',
          description: 'lorem lorem'
        },
        {
          title: 'lorem',
          date: '5/5/5',
          description: 'lorem lorem'
        }
      ]
    }
  },
  computed: {
    // headers () {
    //   return [
    //     {
    //       label: this.tagMetadata.fields.title.label,
    //       field: 'tagName',
    //       className: 'tag-name'
    //     },
    //     {
    //       label: 'Preview',
    //       field: 'preview',
    //       className: 'preview'
    //     },
    //     {
    //       label: this.tagMetadata.fields.description.label,
    //       field: 'tagDescription',
    //       className: 'tag-description'
    //     }
    //   ]
    // },
    ...mapState([
      // 'tags'
    ])
  },
  methods: {
    // emptySelectedTag () {
    //   this.selectedTag = null
    // },
    // selectTag (tag) {
    //   this.selectedTag = tag
    // }
  },
  components: {
    UpdateReleaseNoteForm,
    NewReleaseNoteForm
  },
  beforeMount () {
    // if (this.tags.length) {
    //   this.selectedTag = this.tags[0]
    // }
  }
}
</script>
