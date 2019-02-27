<template>
  <div id="releaseTableView">

    <!-- RELEASES LIST -->

    <div class="entities">

      <table class="table">
        <thead class="header">
          <tr class="row">
            <th
              v-for="header in headers"
              :key="header.label"
              class="cell"
              :class="{active: header.isActive}"
            >
              <div class="title-container">
                <p :title="header.label">{{ header.label }}</p>
                <simple-svg
                  :filepath="iconSrc"
                  :fill="sortIconColor"
                  class="icon"
                  v-if="header.isActive"
                  :class="{ascending: !releaseSortCriteria.descending}"
                ></simple-svg>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="content">
          <tr
            class="row"
            :class="{selected: selectedRelease && (release.id === selectedRelease.id)}"
            v-for="release in releases"
            :key="release.id"
            @click="activateRelease({release: release})"
            @dblclick="activateProjectView(release)"
          >
            <td
              class="name cell"
              :title="release.title"
            >
              <p>{{ release.title }}</p>
            </td>
            <td
              class="target-date cell"
              :title="formatDate(release.dueDate)"
            >
              <p>{{ formatDate(release.dueDate) }}</p>
            </td>
            <td
              class="created-at cell"
              :title="formatDate(release.createdAt)"
            >
              <p>{{ formatDate(release.createdAt) }}</p>
            </td>
            <td
              class="cutoff cell"
              :title="formatDate(release.cutoff)"
            >
              <p>{{ formatDate(release.cutoff) }}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'
import server from '../server'
import moment from 'moment'

export default {
  name: 'ReleaseTableView',
  data () {
    return {
      releaseMetadata: server.metadata.models.Release,
      sortIconColor: '#5E5375',
      iconSrc: require('@/assets/chevron-down.svg')
    }
  },
  computed: {
    headers () {
      return [
        {
          label: this.releaseMetadata.fields.title.label,
          isActive: this.releaseSortCriteria.field === 'title',
          field: 'title'
        },
        {
          label: this.releaseMetadata.fields.dueDate.label,
          isActive: this.releaseSortCriteria.field === 'dueDate',
          field: 'dueDate'
        },
        {
          label: this.releaseMetadata.fields.createdAt.label,
          isActive: this.releaseSortCriteria.field === 'createdAt',
          field: 'createdAt'
        },
        {
          label: this.releaseMetadata.fields.cutoff.label,
          isActive: this.releaseSortCriteria.field === 'cutoff',
          field: 'cutoff'
        }
      ]
    },
    ...mapState([
      'releases',
      'selectedRelease',
      'selectedProject',
      'releaseSortCriteria'
    ])
  },
  methods: {
    activateProjectView (release) {
      this.activateRelease({ release: release, updateRoute: false })
      this.activateProject({ project: this.selectedProject })
    },
    formatDate (isoString) {
      if (isoString) {
        return moment(isoString).format('DD/MM/YYYY')
      } else {
        return '-'
      }
    },
    sort (header) {
      this.setReleaseSortCriteria({
        field: header.field,
        descending: header.isActive ? !this.releaseSortCriteria.descending : false
      })
    },
    ...mapMutations([
      'setReleaseSortCriteria'
    ]),
    ...mapActions([
      'activateRelease',
      'activateProject'
    ])
  }
}
</script>
