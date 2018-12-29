<template>
  <dialog
    id="assign"
    ref="dialog"
    @cancel="closeModal"
  >
    <form
      method="dialog"
      class="form"
    >
      <v-select></v-select>
      <button type="submit">Submit</button>
    </form>
  </dialog>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Assign',
  data () {
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    'show' (newValue) {
      if (newValue) {
        this.$refs.dialog.showModal()
      }
    }
  },
  computed: {
    ...mapState([
      'selectedNugget',
      'selectedProject',
      'Workflow',
      'Phase'
    ])
  },
  methods: {
    closeModal () {
      this.$emit('close')
    }
  }
}
</script>
