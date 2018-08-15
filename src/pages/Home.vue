<template>
  <div class="home">
    <div class="left">
      <button type="button" class="button">New Project</button>
      <div class="projects">
        <div class="project-details">
          <p class="project-name">{{ projectName }}</p>
          <div class="unread-message">{{ unreadMessage }}</div>
          <div class="status">
          </div>
        </div>
      </div>
    </div>
    <div class="chat"></div>
    <div class="right"></div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      projectName: 'alpha',
      unreadMessage: '999'
    }
  }
}
</script>
