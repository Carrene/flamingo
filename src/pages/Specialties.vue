<template>
  <div id="specialties">

    <!-- LEFT COLUMN -->

    <div class="left-column">

      <!-- HEADER -->

      <div class="header">
        <p class="title">Specialties</p>
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
                  :class="header.className"
                >
                  <div class="title-container">
                    <p
                      :title="header.label"
                    >{{ header.label }}</p>
                  </div>
                </th>

              </tr>

            </thead>

            <tbody class="table-content">
              <tr
                class="row"
                v-for="specialty in specialties"
                :key="specialty.id"
                @click="selectSpecialty(specialty)"
                :class="{'selected-specialty': selectedSpecialty && (specialty.id === selectedSpecialty.id)}"
              >
                  <td class="specialty-name cell">{{ specialty.title }}</td>
                  <td class="specialty-description cell">{{ specialty.description ? specialty.description : '-' }}</td>

              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- SPECIALTY FORMs -->

    <div class="right-column">
      <update-specialty-form
        class="form"
        v-if="selectedSpecialty"
        :selectedSpecialty="selectedSpecialty"
        @showNewSpecialtyForm="showingNewSpecialtyForm"
      />
      <new-specialty-form
        class="form"
        @created="selectSpecialty"
        v-else
      />
    </div>
  </div>
</template>

<script>
import server from '../server'
import { mapState } from 'vuex'
const UpdateSpecialtyForm = () => import(
  /* webpackChunkName: "UpdateSpecialtyForm" */ '../components/UpdateSpecialtyForm'
)
const NewSpecialtyForm = () => import(
  /* webpackChunkName: "NewSpecialtyForm" */ '../components/NewSpecialtyForm'
)

export default {
  name: 'Specialties',
  data () {
    return {
      selectedSpecialty: null,
      specialtyMetadata: server.metadata.models.Specialty
    }
  },
  computed: {
    headers () {
      return [
        {
          label: this.specialtyMetadata.fields.title.label,
          field: 'specialtyName',
          className: 'specialty-name'
        },
        {
          label: this.specialtyMetadata.fields.description.label,
          field: 'specialtyDescription',
          className: 'specialty-description'
        }
      ]
    },
    ...mapState([
      'specialties'
    ])
  },
  methods: {
    selectSpecialty (specialty) {
      this.selectedSpecialty = specialty
    },
    showingNewSpecialtyForm () {
      this.selectedSpecialty = null
    }
  },
  components: {
    UpdateSpecialtyForm,
    NewSpecialtyForm
  },
  beforeMount () {
    if (this.specialties.length) {
      this.selectedSpecialty = this.specialties[0]
    }
  }
}
</script>
