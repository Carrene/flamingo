<template>
  <div
    class="validation-message error"
    v-if="validation.$error"
  >
    <img src="./../assets/checked.svg">

    <!-- TODO: Convert to one p element -->
    <p v-if="validation.required === false">{{ metadata.label }} is required</p>
    <p v-else-if="validation.minLength  === false">{{ metadata.label }} should be more than {{ metadata.minLength }} characters</p>
    <p v-else-if="validation.maxLength  === false">{{ metadata.label }} should be less than {{ metadata.maxLength }} characters</p>
    <p v-else-if="validation.minValue  === false">{{ metadata.label }} can't be less than {{ metadata.minimum }}</p>
    <p v-else-if="validation.maxValue  === false">{{ metadata.label }} can't be more than {{ metadata.maximum }}</p>
    <p v-else-if="validation.pattern  === false">{{ metadata.patternDescription }}</p>
  </div>
</template>

<script>
export default {
  name: 'ValidationMessage',
  props: {
    validation: Object,
    metadata: Object
  }
}
</script>
