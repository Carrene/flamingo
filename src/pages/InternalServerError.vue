<template>
  <div id="internalServerError">
    <img
      src="./../assets/internal-server-error.svg"
      class="img"
    >
    <div class="content">
      <p class="title">500</p>
      <p class="subtitle">Internal Server Error</p>
    </div>
    <router-link
      to="/"
      tag="button"
      type="button"
      class="primary-button medium"
    >Go back home</router-link>
    <div
      class="error-info"
      v-if="stackTrace"
    >
      <pre>{{ stackTrace }}</pre>
      <button class="small primary-button">Create Issue</button>
    </div>
  </div>
</template>

<script>
const ENV = process.env.NODE_ENV
// const newGithubIssueUrl = require('new-github-issue-url')
// const opn = require('opn')

export default {
  name: 'InternalServerError',
  data () {
    return {
      stackTrace: null
    }
  },
  props: {
    response: {
      type: Object,
      default: null
    }
  },
  mounted () {
    if (ENV === 'development' && this.response) {
      this.stackTrace = this.response.stackTrace
      console.log('You are in development mode')
      let body = `\`\`\`\n${this.stackTrace}\n\`\`\``
      window.open(`https://www.github.com/Carrene/dolphin/issues/new?body=${encodeURIComponent(body)}`, '_blank')
    }
  }
}
</script>
