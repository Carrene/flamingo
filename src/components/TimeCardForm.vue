<template>
  <form id="timeCardForm">

    <!-- HEADER -->

    <div class="header">
      <button
        type="button"
        class="secondary-button"
      >Submit Time Card</button>
    </div>

    <!-- LOADING -->

    <loading v-if="loading" />

    <!-- CONTENT -->

    <div class="content">

      <!-- ESTIMATE -->

      <div class="estimate">

        <!-- ESTIMATE HEADER -->

        <div class="header">
          <p>Estimate</p>
        </div>

        <!-- ESTIMATE FORM -->

        <form class="estimate-form">
          <div class="input-container">
            <label class="label">Start Date</label>
            <input
              type="text"
              class="light-primary-input"
            >
          </div>
          <div class="input-container">
            <label class="label">Target Date</label>
            <input
              type="text"
              class="light-primary-input"
            >
          </div>
          <div class="input-container">
            <label class="label">Estimate(hrs)</label>
            <input
              type="text"
              class="light-primary-input"
            >
          </div>

          <!-- ACTION -->

          <div class="action">
            <button
              class="secondary-button outlined"
              type="submit"
            >Submit Estimate</button>
          </div>
        </form>
      </div>

      <!-- TIME CARD -->

      <div class="time-card">

        <!-- ESTIMATE HEADER -->

        <div class="header">
          <p>Time Card</p>
        </div>

        <!-- TABLE -->

        <div class="time-card-table">
          <div class="table-box">
            <table class="table">
              <thead class="header">
                <tr class="row">
                  <th
                    class="cell"
                  >
                    <p>salam</p>
                    <p>sah</p>
                    <p>kdmncvdn</p>
                    <p>xkcvm</p>
                  </th>
                </tr>
              </thead>
              <tbody class="content">
                <tr
                  class="row"
                >

                  <!-- NAME -->

                  <td
                    class="name cell"
                  >
                    <p>dffggf</p>
                  </td>

                  <!-- TARGET DATE -->

                  <td
                    class="target-date cell"
                  >
                    <p>xvvdvxs</p>
                  </td>

                  <!-- CUTOFF -->

                  <td
                    class="cutoff cell"
                  >
                    <p>jnhmhbmhjm</p>
                  </td>

                  <!-- GROUP -->

                  <td
                    class="group cell"
                  >
                    <div class="group-card">
                      <p>zhdyxcgdhyg</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>

  </form>
</template>

<script>
import server from '.././server'
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)
export default {
  name: 'TimeCardForm',
  data () {
    return {
      loading: false,
      timeCardMetadata: server.metadata.models.TimeCard
    }
  },
  components: {
    Loading
  }
}
</script>
