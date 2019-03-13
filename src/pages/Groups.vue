<template>
  <div id="groups">

    <!-- HEADER -->

    <div class="header">
      <p class="title">Groups</p>

    </div>

    <!-- GROUPS CONTENTS -->

    <div class="tab-content">

      <!-- LEFT COLUMN -->

      <div class="left-column">

        <table class="table">

          <thead class="table-header">

            <tr class="row">

              <th
                v-for="header in headers"
                :key="header.label"
                class="cell"
              >
                <div class="title-container">
                  <p :title="header.label" :class="header.className">{{ header.label }}</p>
                </div>
              </th>

            </tr>

          </thead>

          <tbody class="table-content">
            <tr class="row">
              <td class="group-name cell">lorem</td>
              <td class="group-description cell">lorem</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- GROUPS FORM -->

      <form class="right-column">
        <div class="input-container">
          <label
            for="groupName"
            class="label"
          >group Name</label>
          <input
            type="text"
            class="light-primary-input disabled"
          >
        </div>
        <div class="input-container">
          <label
            for="groupName"
            class="label"
          >group Description</label>
          <div class="textarea-container large">
            <textarea class="light-primary-input"></textarea>
          </div>
          <!-- <p
            class="character-count"
            v-if="group.description"
          >
            {{ group.description.length }}/{{grup.fields.description.maxLength }}
          </p> -->
        </div>
      </form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Profile',
  data () {
    return {
    }
  },
  computed: {
    headers () {
      return [
        {
          label: 'Group Name',
          field: 'groupName',
          className: 'group-name'
        },
        {
          label: 'Group escription',
          field: 'groupDescription',
          className: 'group-description'
        }
      ]
    }
  }
}
</script>
