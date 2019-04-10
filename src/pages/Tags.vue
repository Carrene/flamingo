<template>
  <div id="tags">

    <!-- LEFT COLUMN -->

    <div class="left-column">

      <!-- HEADER -->

      <div class="header">
        <p class="title">Tags</p>
      </div>

      <div class="content">
        <div class="table-box">

          <table class="table">

            <thead class="table-header">

              <tr class="row">

                <th
                  v-for="header in headers"
                  :key="header.label"
                  class="cell"
                >
                  <div class="title-container">
                    <p
                      :title="header.label"
                      :class="header.className"
                    >{{ header.label }}</p>
                  </div>
                </th>

              </tr>

            </thead>

            <tbody class="table-content">
              <tr
                class="row"
                v-for="tag in tags"
                :key="tag.id"
                @click="selectTag(tag)"
                :class="{'selected-tag': selectedTag && (tag.id === selectedTag.id)}"
              >
                <td class="tag-name cell">{{ tag.title }}</td>
                <td class="tag-preview cell">
                  <div class="tag-preview-card">
                    <p>{{ tag.title }}</p>
                  </div>
                </td>
                <td class="tag-description cell">{{ tag.description }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAG FORMS -->

    <div class="right-column">
      <new-tag-form
        class="form"
        v-if="!selectedTag"
      />
      <update-tag-form
        class="form"
        :selectedTag="selectedTag"
        @showNewTagForm="emptySelectedTag"
        v-else
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import server from '../server'
const UpdateTagForm = () => import(
  /* webpackChunkName: "UpdateTagForm" */ '../components/UpdateTagForm'
)
const NewTagForm = () => import(
  /* webpackChunkName: "NewTagForm" */ '../components/NewTagForm'
)

export default {
  name: 'Tags',
  data () {
    return {
      tagMetadata: server.metadata.models.Tag,
      selectedTag: null
    }
  },
  computed: {
    headers () {
      return [
        {
          label: this.tagMetadata.fields.title.label,
          field: 'tagName',
          className: 'tag-name'
        },
        {
          label: 'Preview',
          field: 'preview',
          className: 'preview'
        },
        {
          label: this.tagMetadata.fields.description.label,
          field: 'tagDescription',
          className: 'tag-description'
        }
      ]
    },
    ...mapState([
      'tags'
    ])
  },
  methods: {
    selectTag (tag) {
      this.selectedTag = tag
    },
    emptySelectedTag () {
      this.selectedTag = null
    }
  },
  components: {
    UpdateTagForm,
    NewTagForm
  },
  beforeMount () {
    if (this.tags.length) {
      this.selectedTag = this.tags[0]
    }
  }
}
</script>
