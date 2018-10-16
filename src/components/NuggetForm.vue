<!--<template>-->
  <!--<div id="nuggetForm">-->
    <!--<div class="nugget-information">-->
      <!--<form class="nugget-form">-->
        <!--<div class="nugget-title">-->

          <!--&lt;!&ndash; nugget TITLE &ndash;&gt;-->

          <!--<label class="label" :class="{error: $v.nugget.title.$error}">-->
            <!--Project title-->
          <!--</label>-->
          <!--<input-->
            <!--type="text"-->
            <!--placeholder="Project"-->
            <!--class="light-primary-input"-->
            <!--v-model="project.title"-->
            <!--@change="$v.project.title.$touch"-->
            <!--@blur="$v.project.title.$touch"-->
            <!--@focus="[$v.project.title.$reset, setEditing(true)]"-->
            <!--:class="{error: $v.project.title.$error}"-->
          <!--&gt;-->
          <!--<div v-if="$v.project.title.$error" class="validation-message">-->
            <!--<span v-if="!$v.project.title.required">This field is required</span>-->
            <!--<span v-if="!$v.project.title.maxLength">This field should be less than 50 characters.</span>-->
          <!--</div>-->
          <!--<div v-else class="helper">-->
            <!--<span>*Please enter project title</span>-->
          <!--</div>-->
        <!--</div>-->

        <!--&lt;!&ndash; RELEASE &ndash;&gt;-->

        <!--<div class="project-release">-->
          <!--<label class="label">-->
            <!--Release (optional)-->
          <!--</label>-->
          <!--<div class="release-container">-->
            <!--<input-->
              <!--type="text"-->
              <!--placeholder="Release"-->
              <!--class="light-primary-input"-->
              <!--:class="{'show-release-list' : showReleaseList}"-->
              <!--@click="releaseListVisibility"-->
              <!--:disabled="project.id"-->
              <!--@focus="setEditing(true)"-->
              <!--v-model="selectedRelease"-->
              <!--readonly-->
            <!--&gt;-->
            <!--<img src="../assets/chevron-down.svg"-->
                 <!--class="down-icon"-->
                 <!--:class="!showReleaseList ? 'down' : 'up'"-->
                 <!--@click="releaseListVisibility"-->
                 <!--v-if="!project.id"-->
            <!--&gt;-->
            <!--<div class="release-list" v-if="showReleaseList">-->
              <!--<p-->
                <!--v-for="release in releases"-->
                <!--:key="release.id"-->
                <!--@click="selectRelease(release)"-->
              <!--&gt;-->
                <!--{{ release.title }}-->
              <!--</p>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="helper">-->
            <!--<span>*Please enter release</span>-->
          <!--</div>-->
        <!--</div>-->

        <!--&lt;!&ndash; DUE DATE &ndash;&gt;-->

        <!--<div class="project-due-date">-->
          <!--<label class="label">-->
            <!--Due date-->
          <!--</label>-->
          <!--<div class="input-container">-->
            <!--<input-->
              <!--type="text"-->
              <!--placeholder="Project due date"-->
              <!--class="light-primary-input"-->
              <!--:value="setDuedate"-->
              <!--disabled-->
              <!--readonly-->
            <!--&gt;-->
          <!--</div>-->
          <!--<div>-->
            <!--<span class="helper">*Project due date</span>-->
          <!--</div>-->
        <!--</div>-->

        <!--&lt;!&ndash; DESCRIPTION &ndash;&gt;-->

        <!--<div class="project-description">-->
          <!--<label class="label" :class="{error: $v.project.description.$error}">Description (optional)</label>-->
          <!--<div class="textarea-container">-->
            <!--<textarea-->
              <!--placeholder="Description"-->
              <!--class="light-primary-input"-->
              <!--v-model="project.description"-->
              <!--@change="$v.project.description.$touch"-->
              <!--:class="{error: $v.project.description.$error}"-->
              <!--@focus="setEditing(true)"-->
            <!--&gt;</textarea>-->
            <!--<p class="character-count" v-if="project.description">-->
              <!--{{ project.description.length }}/512-->
            <!--</p>-->
          <!--</div>-->
          <!--<div v-if="$v.project.description.$error" class="validation-message">-->
            <!--<span v-if="!$v.project.description.maxLength">This field should be less than 512 characters.</span>-->
          <!--</div>-->
          <!--<div v-else class="helper">-->
            <!--<span>*Please enter description</span>-->
          <!--</div>-->
        <!--</div>-->
      <!--</form>-->
    <!--</div>-->
  <!--</div>-->
<!--</template>-->

<!--<script>-->

<!--export default {-->
  <!--name: 'NuggetForm',-->
  <!--data () {-->
    <!--return {-->
    <!--}-->
  <!--}-->
<!--}-->
<!--</script>-->
