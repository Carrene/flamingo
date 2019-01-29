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
      <button
        class="small primary-button"
        @click="redirectToGithub"
      >Create Issue</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
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
    },
    repository: {
      type: 'String',
      default: null
    }
  },
  computed: {
    ...mapState([
      'debug'
    ])
  },
  methods: {
    redirectToGithub () {
      if (this.repository) {
        let header = `### Stacktrace\n\n`
        let openingQuotes = `\`\`\`\n`
        let closingQuotes = `\n\`\`\``
        let body = `${header}${openingQuotes}${this.stackTrace}${closingQuotes}`
        let labels = 'bug'
        window.open(`https://www.github.com/Carrene/${this.repository}/issues/new?body=${encodeURIComponent(body)}&labels=${labels}`, '_blank')
      }
    }
  },
  mounted () {
    if (this.debug && this.response) {
      this.stackTrace = this.response.stackTrace
    }
  }
}
</script>
