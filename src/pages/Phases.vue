<template>
  <div id="phases">

    <!-- LEFT COLUMN -->

    <div class="left-column">

      <!-- HEADER -->

      <div class="header">
        <p class="title">Phases</p>

      </div>

      <div class="content">

        <!-- TABLE -->
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
                <td class="phase-name cell">lorem</td>
                <td class="associated-specialties cell">
                  <div class="associated-specialties-card">
                    <p>lorem</p>
                  </div>
                </td>
                <td class="phase-description cell">lorem</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- PHASE FORM -->

    <div class="right-column">
      <new-phase-form
        class="form"
        v-if="showingNewPhaseForm"
      />
      <update-phase-form
        class="form"
        v-else
      />
    </div>
  </div>
</template>

<script>
const UpdatePhaseForm = () => import(
  /* webpackChunkName: "UpdatePhaseForm" */ '../components/UpdatePhaseForm'
)
const NewPhaseForm = () => import(
  /* webpackChunkName: "NewPhaseForm" */ '../components/NewPhaseForm'
)

export default {
  name: 'Profile',
  data () {
    return {
      // TODO: THIS DATA IS STATIC, UPDATE LATER
      showingNewPhaseForm: false
    }
  },
  computed: {
    headers () {
      return [
        {
          label: 'Phase Name',
          field: 'phaseName',
          className: 'phase-name'
        },
        {
          label: 'Associated Specialties',
          field: 'associatedSpecialties',
          className: 'associated-specialties'
        },
        {
          label: 'Phase Description',
          field: 'phaseDescription',
          className: 'phase-description'
        }
      ]
    }
  },
  components: {
    UpdatePhaseForm,
    NewPhaseForm
  }
}
</script>
