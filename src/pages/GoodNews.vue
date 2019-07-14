<template>
  <div id="goodNews">

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
      <div class="good-news-tabs">
        <div
          class="tab"
          @click="goToTriageNuggets"
          :class="{'selected-tab': selectedGoodNewsTab === 'triageNuggets'}"
        >
          <div
            class="counter"
            v-if="triageNuggetsCounter"
          >{{ formatCounter(triageNuggetsCounter) }}</div>
          <p>Triage</p>
        </div>
        <div
          class="tab"
          @click="goToNeedApprovalItems"
          :class="{'selected-tab': selectedGoodNewsTab === 'needApprovalItems'}"
        >
          <div
            class="counter"
            v-if="needApprovalItemsCounter"
          >{{ formatCounter(needApprovalItemsCounter) }}</div>
          <p>Need Approval</p>
        </div>
        <div
          class="tab"
          @click="goToHoursReportedItems"
          :class="{'selected-tab': selectedGoodNewsTab === 'hoursReportedItems'}"
        >
          <div
            class="counter"
            v-if="hoursReportedItemsCounter"
          >{{ formatCounter(hoursReportedItemsCounter) }}</div>
          <p>Hours Reported</p>
        </div>
        <div
          class="tab"
          @click="goToBacklogNuggets"
          :class="{'selected-tab': selectedGoodNewsTab === 'backlogNuggets'}"
        >
          <div
            class="counter"
            v-if="backlogNuggetsCounter"
          >{{ formatCounter(backlogNuggetsCounter) }}</div>
          <p>Backlog</p>
        </div>
        <button
          type="submit"
          class="secondary-button"
          @click="update"
          :disabled="!currentListOfEntities.some(item => item.__status__ === 'dirty')"
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
import { formatCounter } from '../helpers'
const Breadcrumb = () => import(
  /* webpackChunkName: "Breadcrumb" */ './../components/Breadcrumb.vue'
)
export default {
  name: 'GoodNews',
  data () {
    return {
    }
  },
  computed: {
    currentListOfEntities () {
      switch (this.selectedGoodNewsTab) {
        case 'triageNuggets':
          return this.triageNuggets
        case 'backlogNuggets':
          return this.backlogNuggets
        case 'needApprovalItems':
          return this.needApprovalItems
        case 'hoursReportedItems':
          return this.hoursReportedItems
      }
    },
    currentBreadCrumbItem () {
      if (this.selectedGoodNewsTab === 'needApprovalItems') {
        return this.selectedItem ? [this.selectedItem.issue] : []
      } else {
        return this.selectedNuggets.length ? [this.selectedNuggets[0]] : []
      }
    },
    ...mapState([
      'selectedGoodNewsTab',
      'backlogNuggetsCounter',
      'triageNuggetsCounter',
      'needApprovalItemsCounter',
      'hoursReportedItemsCounter',
      'triageNuggets',
      'backlogNuggets',
      'needApprovalItems',
      'hoursReportedItems',
      'Nugget',
      'Item',
      'selectedItem',
      'selectedNuggets',
      'selectedGoodNewsTab'
    ])
  },
  methods: {
    formatCounter,
    goToBacklogNuggets () {
      this.$router.push('backlog')
    },
    goToTriageNuggets () {
      this.$router.push('triage')
    },
    goToNeedApprovalItems () {
      this.$router.push('need-approval')
    },
    goToHoursReportedItems () {
      this.$router.push('hours-reported')
    },
    async update () {
      this.setGlobalLoading(true)
      let jsonPatchRequest
      switch (this.selectedGoodNewsTab) {
        case 'triageNuggets':
          jsonPatchRequest = server.jsonPatchRequest('/')
          for (let nugget of this.triageNuggets) {
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
            await this.listGoodNews()
          }
          break
        case 'backlogNuggets':
          jsonPatchRequest = server.jsonPatchRequest(this.Nugget.__url__)
          for (let nugget of this.backlogNuggets) {
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
            await this.listGoodNews()
          }
          break
        case 'needApprovalItems':
          jsonPatchRequest = server.jsonPatchRequest('/')
          for (let item of this.needApprovalItems) {
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
              jsonPatchRequest.addRequest(item.save())
            }
          }
          if (jsonPatchRequest.requests.length) {
            await jsonPatchRequest.send()
            await this.listGoodNews()
          }
          break
      }
      this.setGlobalLoading(false)
    },
    ...mapActions([
      'listGoodNews'
    ]),
    ...mapMutations([
      'setSelectedGoodNewsTab',
      'setGlobalLoading'
    ])
  },
  components: {
    Breadcrumb
  }
}
</script>
