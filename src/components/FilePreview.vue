<template>
  <div id="filePreview">
    <div class="preview-box">
      <div class="preview-header">
        <p class="title">Preview</p>
        <simple-svg
          :filepath="require('@/assets/close.svg')"
          fill="#FFF"
          class="close-icon"
        />
      </div>
      <div class="file">
        <span class="file-name">desktop-illus.png</span>
        <div class="image-box">
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b6/Felis_catus-cat_on_snow.jpg">
        </div>
      </div>
      <div class="file-details">
        <h3 class="sender">
          Lorem ipsum
        </h3>
        <p class="file-description">
          Lorem ipsum dolor sit amet consectetur,
          adipisicing elit. Soluta consectetur commodi saepe!
          Facilis ducimus accusamus voluptatum eligendi quaerat,
          maiores, temporibus omnis, voluptatibus ipsum nemo reiciendis rerum!
          Veniam aliquam doloribus optio!
        </p>
        <div class="file-metadata">
          <p class="file-date">
            September 20
          </p>
          <p class="file-time">
            05:30 PM
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilePreview',
  data () {
    return {
    }
  }
}
</script>
