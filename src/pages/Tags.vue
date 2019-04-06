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
              <tr class="row"
                  v-for="tag in tags"
                  :key="tag.id"
              >
                <td class="tag-name cell">{{ tag.title }}</td>
                <td class="tag-preview cell">
                  <div class="tag-preview-card">
                    <p>{{ tag.title }}</p>
                  </div>
                </td>
                <!-- FIXME: Get description from metadata when it was ready -->
                <td class="tag-description cell">lorem</td>
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
        v-if="showingNewTagForm"
      />
      <update-tag-form
        class="form"
        v-else
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
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
      showingNewTagForm: false
    }
  },
  computed: {
    headers () {
      return [
        {
          label: 'Tag Name',
          field: 'tagName',
          className: 'tag-name'
        },
        {
          label: 'Preview',
          field: 'preview',
          className: 'preview'
        },
        {
          label: 'Tag Description',
          field: 'tagDescription',
          className: 'tag-description'
        }
      ]
    },
    ...mapState([
      'tags'
    ])
  },
  components: {
    UpdateTagForm,
    NewTagForm
  }
}
</script>
