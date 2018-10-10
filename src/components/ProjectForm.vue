<template>
  <div id="project-information">
    <div class="project-information" v-if="selectedTab === 'details'">
      <form class="project-form">
        <div class="project-title">

          <!-- PROJECT TITLE -->

          <label class="label" :class="{error: $v.project.title.$error}">
            Project title
          </label>
          <input
            type="text"
            placeholder="Project"
            class="light-primary-input"
            v-model="project.title"
            @change="$v.project.title.$touch"
            @blur="$v.project.title.$touch"
            @focus="[$v.project.title.$reset, editing = true]"
            :class="{error: $v.project.title.$error}"
          >
          <div v-if="$v.project.title.$error" class="validation-message">
            <span v-if="!$v.project.title.required">This field is required</span>
            <span v-if="!$v.project.title.maxLength">This field should be less than 50 characters.</span>
          </div>
          <div v-else class="helper">
            <span>*Please enter project title</span>
          </div>
        </div>

        <!-- RELEASE -->

        <div class="project-release">
          <label class="label">
            Release (optional)
          </label>
          <div class="release-container">
            <input
              type="text"
              placeholder="Release"
              class="light-primary-input"
              :class="{'show-release-list' : showReleaseList}"
              @click="releaseListVisibility"
              :disabled="project.id"
              @focus="editing = true"
              v-model="selectedRelease"
              readonly
            >
            <img src="../assets/chevron-down.svg"
                 class="down-icon"
                 :class="!showReleaseList ? 'down' : 'up'"
                 @click="releaseListVisibility"
                 v-if="!project.id"
            >
            <div class="release-list" v-if="showReleaseList">
              <p
                v-for="release in releases"
                :key="release.id"
                @click="selectRelease(release)"
              >
                {{ release.title }}
              </p>
            </div>
          </div>
          <div class="helper">
            <span>*Please enter release</span>
          </div>
        </div>

        <!-- DUE DATE -->

        <div class="project-due-date">
          <label class="label" :class="{error: $v.project.dueDate.$error}">
            Due date
          </label>
          <div class="input-container">
            <input
              type="text"
              placeholder="MM/DD/YY"
              class="light-primary-input"
              v-model="project.dueDate"
              :class="{error: $v.project.dueDate.$error}"
              @click="showDatepicker = !showDatepicker"
              @focus="editing = true"
            >
            <div v-if="showDatepicker" class="datepicker">
              <custom-datepicker
                primary-color="#2F2445"
                :wrapperStyles="wrapperStyles"
                @dateSelected="setDate($event)"
                :date="project.dueDate"
              />
            </div>
          </div>
          <div v-if="$v.project.dueDate.$error" class="validation-message">
            <span v-if="!$v.project.dueDate.required">This field is required</span>
          </div>
          <div v-else class="helper">
            <span>*Please enter due-date</span>
          </div>
        </div>

        <!-- DESCRIPTION -->

        <div class="project-description">
          <label class="label" :class="{error: $v.project.description.$error}">Description (optional)</label>
          <div class="textarea-container">
            <textarea
              placeholder="Description"
              class="light-primary-input"
              v-model="project.description"
              @change="$v.project.description.$touch"
              :class="{error: $v.project.description.$error}"
              @focus="editing = true"
            ></textarea>
            <p class="character-count" v-if="project.description">
              {{ project.description.length }}/512
            </p>
          </div>
          <div v-if="$v.project.description.$error" class="validation-message">
            <span v-if="!$v.project.description.maxLength">This field should be less than 512 characters.</span>
          </div>
          <div v-else class="helper">
            <span>*Please enter description</span>
          </div>
        </div>
      </form>
    </div>
    <div class="response-message">
      <p :class="createStatus === 200 ? 'success' : updateStatus === 200 ? 'success' : 'error'">
        {{ message }}
      </p>
    </div>
    <div class="popup" v-if="showNewProjectPopup">
      <div class="newProjectPopupBox">
        <p>Leave new project view?</p>
        <div class="buttonContainer">
          <button type="button" class="yes" @click="confirmPopup('new')">Yes</button>
          <button type="button" class="no" @click="cancelPopup('new')">No</button>
        </div>
      </div>
    </div>
    <div class="popup" v-if="showUpdatePopup && $v.project.$anyDirty">
      <div class="updatePopupBox">
        <p>Save changes?</p>
        <div class="buttonContainer">
          <button type="button" class="yes" @click="confirmPopup('update')">Yes</button>
          <button type="button" class="no" @click="cancelPopup('update')">No</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ProjectForm',
  data () {
    return {

    }
  }
}
</script>
