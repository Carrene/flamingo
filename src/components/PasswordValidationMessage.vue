<template>
  <div
    class="validation-message error"
    v-if="validation.$error"
  >
    <!-- TODO: Convert to one p element -->
    <p v-if="validation.required === false">{{ metadata.label }} is required</p>
    <p v-else-if="validation.minLength  === false">{{ metadata.label }} should be more than {{ metadata.minLength }} characters</p>
    <p v-else-if="validation.maxLength  === false">{{ metadata.label }} should be less than {{ metadata.maxLength }} characters</p>
    <p v-else-if="validation.minValue  === false">{{ metadata.label }} can't be less than {{ metadata.minimum }}</p>
    <p v-else-if="validation.maxValue  === false">{{ metadata.label }} can't be more than {{ metadata.maximum }}</p>
    <p v-else-if="validation.pattern  === false">{{ metadata.patternDescription }}</p>
    <p v-else-if="validation.sameAs === false">Passwords don't match</p>
  </div>
  <div
    class="helper-text"
    v-else-if="confirmPassword || currentPassword || (metadata && metadata.message)"
  >
    <p v-if="confirmPassword">Please repeat your password</p>
    <p v-else-if="currentPassword">Please enter your current password</p>
    <p v-else>{{ metadata.message }}</p>
  </div>
</template>

<script>
export default {
  name: 'PasswordValidationMessage',
  props: {
    validation: Object,
    metadata: {
      type: Object
    },
    confirmPassword: {
      type: Boolean,
      default: false
    },
    currentPassword: {
      type: Boolean,
      default: false
    }
  }
}
</script>
