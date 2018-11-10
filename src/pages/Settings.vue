<template>
  <div id="settings">

    <!-- HEADER -->

    <div class="header">
      <p class="header-title">Personal Setting</p>
    </div>

    <!-- CONTENT -->

    <div class="settings-content">
      <p class="title">Public profile</p>
      <profile/>
    </div>

  </div>
</template>

<script>
import Profile from '../components/Profile'
import { casServer } from '../server'

export default {
  name: 'Settings',
  data () {
    return {

    }
  },
  mounted () {
    console.log(casServer.metadata.models.Member.fields)
  },
  components: {
    Profile
  }
}
</script>
