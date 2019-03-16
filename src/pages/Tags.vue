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
              <tr class="row">
                <td class="tag-name cell">lorem</td>
                <td class="tag-preview cell">
                  <div class="tag-preview-card">
                    <p>lorem</p>
                  </div>
                </td>
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
          label: 'Tag escription',
          field: 'tagDescription',
          className: 'tag-description'
        }
      ]
    }
  },
  components: {
    UpdateTagForm,
    NewTagForm
  }
}
</script>
