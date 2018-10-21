<template>
  <div id="nuggetForm">
    <div class="header">
      <button
        type="button"
        class="primary-button small"
        v-if=" selectedScope === 'Projects' && selectedProject.id && !editing"
        @click="clearSelected"
      >
        <img src="./../assets/plus.svg" class="plus-icon">
        New Project
      </button>
      <button
        type="button"
        class="light-primary-button small"
        v-if=" selectedScope === 'Projects' && selectedProject.id && editing"
        @click="save"
      >
        <img src="./../assets/save.svg" class="save-icon">
        Save
      </button>
    </div>
      <form class="nugget-information">
        <div class="nugget-title">

          <!-- NUGGET TITLE -->

          <label class="label" :class="{error: $v.nugget.title.$error}">
            Nugget title
          </label>
          <input
            type="text"
            placeholder="Nugget"
            class="light-primary-input"
            v-model="nugget.title"
            @change="$v.nugget.title.$touch"
            @blur="$v.nugget.title.$touch"
            @focus="[$v.nugget.title.$reset, setEditing(true)]"
            :class="{error: $v.nugget.title.$error}"
          >
          <div v-if="$v.nugget.title.$error" class="validation-message">
            <span v-if="!$v.nugget.title.required">This field is required</span>
            <span v-if="!$v.nugget.title.maxLength">This field should be less than 50 characters.</span>
          </div>
          <div v-else class="helper">
            <span>*Please enter nugget title</span>
          </div>
        </div>

        <!-- STATUS -->

         <div class="nugget-status">
          <label class="label">
            Status
          </label>
          <div class="status-container">
            <input
              type="text"
              placeholder="Status"
              class="light-primary-input"
              :class="{'show-status-list' : showStatusList}"
              @click="statusListVisibility"
              @focus="setEditing(true)"
              v-model="nugget.status"
            >
            <img src="../assets/chevron-down.svg"
                 class="down-icon"
                 :class="!showStatusList ? 'down' : 'up'"
                 @click="statusListVisibility"
            >
            <div class="status-list" v-if="showStatusList">
              <p
                v-for="status in statuses"
                @click="selectStatus(status)"
              >
                {{ status }}
              </p>
            </div>
          </div>
          <div class="helper">
            <span>*Please enter status</span>
          </div>
        </div>

        <!-- DAYS -->

        <div class="days">
          <label class="label" :class="{error: $v.nugget.days.$error}">
            Days
          </label>
          <input
            type="number"
            placeholder="Days"
            class="light-primary-input"
            v-model="nugget.days"
            @change="$v.nugget.days.$touch"
            @blur="$v.nugget.days.$touch"
            @focus="[$v.nugget.days.$reset, setEditing(true)]"
            :class="{error: $v.nugget.days.$error}"
          >
          <div v-if="$v.nugget.days.$error" class="validation-message">
            <span v-if="!$v.nugget.days.integer">This field should be number.</span>
          </div>
          <div v-else class="helper">
            <span>*Please enter nugget days</span>
          </div>
        </div>

        <!-- DUE DATE -->

        <div class="nugget-due-date">
          <label class="label">
            Due date
          </label>
          <div class="input-container">
            <input
              type="text"
              placeholder="Nugget due date"
              class="light-primary-input"
              v-model="nugget.dueDate"
            >
          </div>
          <div>
            <span class="helper">*Project due date</span>
          </div>
        </div>

        <!-- KIND -->

         <div class="kind">
          <label class="label">
            kind
          </label>
          <div class="kind-container">
            <input
              type="text"
              placeholder="Kind"
              class="light-primary-input"
              :class="{'show-kind-list' : showKindList}"
              @click="kindListVisibility"
              @focus="setEditing(true)"
              v-model="nugget.kind"
            >
            <img src="../assets/chevron-down.svg"
                 class="down-icon"
                 :class="!showKindList ? 'down' : 'up'"
                 @click="kindListVisibility"
            >
            <div class="kind-list" v-if="showKindList">
              <p
                v-for="kind in kinds"
                @click="selectKind(kind)"
              >
                {{ kind }}
              </p>
            </div>
          </div>
          <div class="helper">
            <span>*Please enter kind</span>
          </div>
        </div>

        <!-- DESCRIPTION -->

        <div class="nugget-description">
          <label class="label" :class="{error: $v.nugget.description.$error}">Description (optional)</label>
          <div class="textarea-container">
            <textarea
              placeholder="Description"
              class="light-primary-input"
              v-model="nugget.description"
              @change="$v.nugget.description.$touch"
              :class="{error: $v.nugget.description.$error}"
              @focus="setEditing(true)"
            ></textarea>
            <p class="character-count" v-if="nugget.description">
              {{ nugget.description.length }}/512
            </p>
          </div>
          <div v-if="$v.nugget.description.$error" class="validation-message">
            <span v-if="!$v.nugget.description.maxLength">This field should be less than 512 characters.</span>
          </div>
          <div v-else class="helper">
            <span>*Please enter description</span>
          </div>
        </div>
      </form>
  </div>
</template>

<script>
import { required, maxLength, integer } from 'vuelidate/lib/validators'
import { mapState, mapMutations, mapActions } from 'vuex'
import { updateDateNugget } from '../helpers'

export default {
  name: 'NuggetForm',
  data () {
    return {
      selectedTab: 'details',
      nugget: {
        title: null,
        dueDate: null,
        description: '',
        kind: null,
        days: null
      },
      kinds: ['feature', 'bug', 'enhancement'],
      showKindList: false,
      statuses: ['in-progress', 'on-hold', 'delayed', 'complete'],
      showStatusList: false
    }
  },
  validations: {
    nugget: {
      title: {
        required,
        maxLength: maxLength(50)
      },
      description: {
        maxLength: maxLength(512)
      },
      days: {
        integer
      }
    }
  },
  computed: {
    ...mapState([
      'selectedNugget',
      'editing'
    ])
  },
  watch: {
    'selectedNugget': {
      deep: true,
      handler (newValue) {
        if (newValue) {
          this.nugget = Object.assign({}, updateDateNugget(newValue))
        }
      }
    }
  },
  methods: {
    kindListVisibility () {
      this.showKindList = !this.showKindList
    },
    statusListVisibility () {
      this.showStatusList = !this.showStatusList
    },
    selectStatus (status) {
      this.nugget.status = status
      this.showStatusList = false
    },
    selectKind (kind) {
      this.nugget.kind = kind
      this.showKindList = false
    },
    getSelectedNugget () {
      this.nugget = Object.assign({}, updateDateNugget(this.selectedNugget))
    },
    ...mapMutations([
      'clearSelectedNugget',
      'setEditing'
    ]),
    ...mapActions([
      'listNuggets'
    ])
  },
  mounted () {
    this.getSelectedNugget()
  }
}
</script>
