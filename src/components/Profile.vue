<template>
  <form id="profile" @submit.prevent>
    <div class="contents">
      <div class="avatar">
        <p>Profile picture</p>
        <img src="./../assets/profile-default-picture.svg">
        <button class="primary-button medium">Upload new picture</button>
      </div>
      <div class="info">
        <!-- FIXME: Use CAS metadata for labels, watermarks and validation -->
        <div class="input-container">
          <label for="name" class="label"></label>
          <input type="text"
                 id="name"
                 placeholder="John Buchheister"
          >
        </div>
        <!-- FIXME: Use CAS metadata for labels, watermarks and validation -->
        <div class="input-container">
          <label for="phoneNumber" class="label"></label>
          <input type="text"
                 id="phoneNumber"
                 placeholder="(123)555-5555"
          >
        </div>
      </div>
    </div>
    <div class="actions">
      <button class="light-primary-button medium">Cancel</button>
      <button class="primary-button medium" type="submit">Save changes</button>
    </div>
  </form>
</template>

<script>

export default {
  name: 'Profile'
}
</script>
