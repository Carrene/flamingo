<template>
  <div id="assigned">
    <!-- HEADER -->

    <div class="header">
      <breadcrumb
        v-if="selectedAssigned"
        :crumbs="[selectedAssigned]"
      />
      <div class="input-container search">
        <input
          type="text"
          class="light-primary-input"
        >
        <simple-svg
          :filepath="require('@/assets/search.svg')"
          fill="#23232380"
          class="search-icon"
        />
      </div>
      <simple-svg
        :filepath="require('@/assets/column.svg')"
        fill="#232323"
        class="column-icon disabled"
      />
    </div>

    <!-- CONTENT -->

    <div class="content">
      <div class="assgin-tabs">
        <div class="tab">In Process Nuggets</div>
        <div class="tab">Upcoming Nuggets</div>
        <div class="tab">Need Estimate</div>
        <div class="tab">Newly Assgined</div>

      </div>

      <!-- TABLE -->

      <div class="table-box">

        <table class="table">
          <thead class="header">
            <tr class="row">
              <th
                v-for="header in headers"
                :key="header.label"
                class="cell"
              >
                <div class="title-container">
                  <p :title="header.label">{{ header.label }}</p>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="content">
            <tr class="row">
              <td class="cell id">
                <p>lorem</p>
              </td>
              <td class="cell name">
                <p>lorem</p>
              </td>

              <td class="cell tempo">
                <div class="tempo-card">
                  <p>lorem</p>
                </div>
              </td>
              <td class="type cell">
                <p>lorem}</p>
              </td>
              <td class="cell time-card">
                <p>lorem</p>
              </td>
              <td class="cell my-start">
                <p>lorem</p>
              </td>
              <td class="cell my-target">
                <p>lorem</p>
              </td>
              <td class="cell hours-worked">
                <p>lorem</p>
              </td>
              <td class="cell project">
                <p>lorem</p>
              </td>
              <td class="cell priority">
                <p>lorem</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>

<script>

export default {
  name: 'Assigned',
  data () {
    return {
      selectedAssigned: null
    }
  },
  computed: {
    headers () {
      return [
        {
          label: 'Id',
          className: 'id'
        },
        {
          label: 'Name',
          className: 'name'
        },
        {
          label: 'Tempo',
          className: 'tempo'
        },
        {
          label: 'Type',
          className: 'type'
        },
        {
          label: 'Time Card',
          className: 'time-card'
        },
        {
          label: 'My Start',
          className: 'my-start'
        },
        {
          label: 'My Target',
          className: 'my-target'
        },
        {
          label: 'Hours Worked',
          className: 'hours-worked'
        },
        {
          label: 'Project',
          className: 'project'
        },
        {
          label: 'Priority',
          className: 'priority'
        }
      ]
    }
  }
}
</script>
