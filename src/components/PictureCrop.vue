<template>
  <div id="pictureCrop">
    <div class="popup-box">
      <input
        v-show="false"
        type="file"
        @change="setImage"
        ref="imageFileInput"
        accept="image/*"
      />
      <div class="box-header">
        <div class="header-title">Select profile photo</div>
        <simple-svg
          :filepath="require('@/assets/close.svg')"
          fill="#FFFFFF"
          class="close-icon"
          @click.native="closeBox"
        />
      </div>
      <div class="box-content">
        <div
          class="image-placeholder"
          v-show="!imageSrc"
        >
          <button
            class="primary-button small"
            @click="getImage"
          >Browse Disk</button>
        </div>
        <vue-cropper
          v-show="imageSrc"
          ref="cropper"
          :src="imageSrc"
          alt="Avatar"
          :aspectRatio="1"
          :zoomable="false"
          :viewMode="2"
          :minCanvasWidth="200"
          :minCanvasHeight="200"
          :minContainerWidth="200"
          :minContainerHeight="200"
          :img-style="{ 'maxWidth': '80vw', 'maxHeight': '70vh' }"
        />
        <div class="caption">
          We only accept JEPG and PNG files. Your picture size should be at least 300px.
        </div>
        <div class="button">
          <button
            :disabled="!imageSrc"
            @click="cropImage"
            class="primary-button medium"
          >Set as profile photo</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueCropper from 'vue-cropperjs'

export default {
  name: 'PictureCrop',
  data () {
    return {
      imageSrc: null
    }
  },
  methods: {
    calculateAspectRatioFit (srcWidth, srcHeight, maxWidth, maxHeight) {
      let ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight)
      return { width: Math.floor(srcWidth * ratio), height: Math.floor(srcHeight * ratio) }
    },
    resizeImage (image, maxHeight = 300, maxWidth = 300) {
      let img = new Image()
      img.src = image
      let vueInstance = this
      img.onload = function () {
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        let targetSize = vueInstance.calculateAspectRatioFit(this.width, this.height, maxHeight, maxWidth)
        canvas.width = targetSize.width
        canvas.height = targetSize.height
        ctx.drawImage(img, 0, 0, targetSize.width, targetSize.height)
        ctx.canvas.toBlob(blob => {
          vueInstance.$emit('setImage', blob)
          vueInstance.closeBox()
        })
      }
    },
    closeBox () {
      this.$emit('close')
    },
    getImage () {
      this.$refs.imageFileInput.value = []
      this.$refs.imageFileInput.click()
    },
    setImage (e) {
      const file = e.target.files[0]
      if (!file.type.includes('image/')) {
        alert('Please select an image file')
        return
      }
      if (typeof FileReader === 'function') {
        const reader = new FileReader()
        reader.onload = (event) => {
          this.imageSrc = event.target.result
          this.$refs.cropper.replace(event.target.result)
        }
        reader.readAsDataURL(file)
      } else {
        alert('Sorry, FileReader API not supported')
      }
    },
    cropImage () {
      let croppedImage = this.$refs.cropper.getCroppedCanvas().toDataURL()
      this.resizeImage(croppedImage)
    }
  },
  components: {
    VueCropper
  }
}
</script>
