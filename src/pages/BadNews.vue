<template>
  <div id="badNews">

    <!-- HEADER -->

    <div class="header">
      <breadcrumb :crumbs="currentBreadCrumbItem" />
      <div class="input-container search">
        <input
          type="text"
          class="light-primary-input"
          disabled
        >
        <simple-svg
          :filepath="require('@/assets/search.svg')"
          fill="#23232380"
          class="search-icon"
        />
      </div>
      <simple-svg
        :filepath="require('@/assets/column.svg')"
        fill="#F9F9F9"
        class="column-icon"
      />
    </div>

    <!-- CONTENT -->

    <div class="content">
      <div class="bad-news-tabs">
        <div
          class="tab"
          @click="goToDelayedNuggets"
          :class="{'selected-tab': selectedBadNewsTab === 'delayedNuggets'}"
        >
          <div
            class="counter"
            v-if="missingHoursCounter"
          >{{ formatCounter(missingHoursCounter) }}</div>
          <p>Delayed Nuggets</p>
        </div>
        <div
          class="tab"
          @click="goToMissingHoursItems"
          :class="{'selected-tab': selectedBadNewsTab === 'missingHours'}"
        >
          <div
            class="counter"
            v-if="missingHoursCounter"
          >{{ formatCounter(missingHoursCounter) }}</div>
          <p>Missing Hours</p>
        </div>
        <div
          class="tab"
          @click="goToMissingEstimateItems"
          :class="{'selected-tab': selectedBadNewsTab === 'missingEstimate'}"
        >
          <div
            class="counter"
            v-if="missingEstimateCounter"
          >{{ formatCounter(missingEstimateCounter) }}</div>
          <p>Missing Estimate</p>
        </div>
        <div
          class="tab"
          @click="goToExpiredTriageNuggets"
          :class="{'selected-tab': selectedBadNewsTab === 'expiredTriage'}"
        >
          <div
            class="counter"
            v-if="expiredTriageCounter"
          >{{ formatCounter(expiredTriageCounter) }}</div>
          <p>Expired Triage</p>
        </div>
        <button
          type="submit"
          class="secondary-button"
          @click="update"
          :disabled="!(currentListOfEntities.some(item => item.__status__ === 'dirty') || extendingCandidateItemIds.size)"
        >
          Save
        </button>
      </div>

      <router-view></router-view>

    </div>
  </div>
</template>

<script>
import server from './../server.js'
import { mapMutations, mapState, mapActions } from 'vuex'
import Breadcrumb from './../components/Breadcrumb.vue'
import { formatCounter } from '../helpers'

export default {
  name: 'BadNews',
  data () {
    return {
    }
  },
  computed: {
    currentListOfEntities () {
      switch (this.selectedBadNewsTab) {
        case 'delayedNuggets':
          return this.delayedNuggets
        case 'expiredTriage':
          return this.expiredTriageNuggets
        case 'missingHours':
          return this.missingHoursItems
        case 'missingEstimate':
          return this.missingEstimateItems
      }
    },
    currentBreadCrumbItem () {
      if (this.selectedBadNewsTab === 'expiredTriageNuggets') {
        return this.selectedNuggets.length ? [this.selectedNuggets[0]] : []
      } else {
        return this.selectedItem ? [this.selectedItem.issue] : []
      }
    },
    ...mapState([
      'selectedBadNewsTab',
      'missingHoursCounter',
      'missingEstimateCounter',
      'expiredTriageCounter',
      'selectedItem',
      'selectedNuggets',
      'expiredTriageNuggets',
      'missingHoursItems',
      'delayedNuggets',
      'missingEstimateItems',
      'Nugget',
      'Item',
      'extendingCandidateItemIds'
    ])
  },
  methods: {
    formatCounter,
    goToDelayedNuggets () {
      this.$router.push('delayed-nuggets')
    },
    goToMissingHoursItems () {
      this.$router.push('missing-hours')
      this.setSelectedBadNewsTab('missingHours')
    },
    goToMissingEstimateItems () {
      this.$router.push('missing-estimate')
      this.setSelectedBadNewsTab('missingEstimate')
    },
    goToExpiredTriageNuggets () {
      this.$router.push('expired-triage')
      this.setSelectedBadNewsTab('expiredTriage')
    },
    async update () {
      this.setGlobalLoading(true)
      let jsonPatchRequest
      switch (this.selectedBadNewsTab) {
        case 'expiredTriage':
          jsonPatchRequest = server.jsonPatchRequest('/')
          for (let nugget of this.expiredTriageNuggets) {
            if (nugget.__status__ === 'dirty') {
              if (nugget.batchTitle === null) {
                let resp = await this.Nugget.get(nugget.id).send()
                let lastBatchStatus = resp.models[0].batchTitle
                if (lastBatchStatus) {
                  jsonPatchRequest.addRequest(nugget.removeBatch())
                }
              } else {
                jsonPatchRequest.addRequest(nugget.appendBatch(nugget.batchTitle))
              }
              if (nugget.returntotriagejobs.length && !nugget.returntotriagejobs[nugget.returntotriagejobs.length - 1].createdAt) {
                jsonPatchRequest.addRequest(nugget.sendToTriage(nugget.returntotriagejobs[nugget.returntotriagejobs.length - 1].at))
              }
              jsonPatchRequest.addRequest(nugget.save())
            }
          }
          if (jsonPatchRequest.requests.length) {
            await jsonPatchRequest.send()
            await this.listBadNews()
          }
          break
        case 'missingHours':
          jsonPatchRequest = server.jsonPatchRequest('/')
          for (let item of this.missingHoursItems) {
            if (item.__status__ === 'dirty') {
              if (item.issue.batchTitle === null) {
                let resp = await this.Item.get(item.id).send()
                let lastBatchStatus = resp.models[0].batchTitle
                if (lastBatchStatus) {
                  jsonPatchRequest.addRequest(item.removeBatch())
                }
              } else {
                jsonPatchRequest.addRequest(item.appendBatch(item.issue.batchTitle))
              }
            }
          }
          if (jsonPatchRequest.requests.length) {
            await jsonPatchRequest.send()
            await this.listBadNews()
          }
          break
        case 'missingEstimate':
          jsonPatchRequest = server.jsonPatchRequest('/')
          for (let item of this.missingEstimateItems) {
            if (item.__status__ === 'dirty') {
              if (item.issue.batchTitle === null) {
                let resp = await this.Item.get(item.id).send()
                let lastBatchStatus = resp.models[0].batchTitle
                if (lastBatchStatus) {
                  jsonPatchRequest.addRequest(item.removeBatch())
                }
              } else {
                jsonPatchRequest.addRequest(item.appendBatch(item.issue.batchTitle))
              }
            }
            if (this.extendingCandidateItemIds.has(item.id)) {
              jsonPatchRequest.addRequest(item.extend())
            }
          }
          if (jsonPatchRequest.requests.length) {
            await jsonPatchRequest.send()
            await this.listBadNews()
          }
          break
      }
      this.setGlobalLoading(false)
    },
    ...mapActions([
      'listBadNews'
    ]),
    ...mapMutations([
      'setSelectedBadNewsTab',
      'setGlobalLoading'
    ])
  },
  components: {
    Breadcrumb
  }
}
</script>
