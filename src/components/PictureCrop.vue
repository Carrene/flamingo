<template>
  <div id="pictureCrop">
    <div
      class="popup-box"
      v-on-clickaway="closeBox"
    >
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
          :minCropBoxWidth="200"
          :minCropBoxHeight="200"
          :img-style="{ 'width': '300px', 'height': '300px' }"
        />
        <div class="caption">
          We only accept JEPG and PNG files. The longer edge of the image should be at least 300px.
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
import { mixin as clickaway } from 'vue-clickaway'
import VueCropper from 'vue-cropperjs'

export default {
  mixins: [clickaway],
  name: 'PictureCrop',
  data () {
    return {
      imageSrc: null
    }
  },
  methods: {
    calculateAspectRatioFit (srcWidth, srcHeight, maxWidth, maxHeight) {
      let ratio = Math.max(maxWidth / srcWidth, maxHeight / srcHeight)
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
        vueInstance.imageSrc = ctx.canvas.toDataURL()
        vueInstance.$refs.cropper.replace(ctx.canvas.toDataURL())
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
          this.resizeImage(event.target.result)
        }
        reader.readAsDataURL(file)
      } else {
        alert('Sorry, FileReader API not supported')
      }
    },
    cropImage () {
      this.$refs.cropper.getCroppedCanvas().toBlob(blob => {
        this.$emit('setImage', blob)
        this.closeBox()
      })
    }
  },
  components: {
    VueCropper
  }
}
</script>
