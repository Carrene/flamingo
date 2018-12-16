
<template>
  <div id="leftSide">
    <div class="logo">
      <img src="../assets/maestro-logo-light.svg">
    </div>
    <div class="carousel">
      <div
        class="carousel-wrapper"
        ref="carousel"
      >
        <transition name="fade">
          <div
            v-for="(image, index) in images"
            :key="index"
            class="slide"
            @click="nextSlide"
            v-if="activeImage === index + 1"
          >
            <div class="title-container">
              <p class="title">{{ image.title }}</p>
              <p class="sub-title">{{ image.subTitle }}</p>
            </div>
            <div class="image">
              <img
                :src="image.src"
                alt=""
              >
            </div>
          </div>
        </transition>
      </div>
      <div class="pagination">
        <div
          class="bullet"
          v-for="(image, index) in images"
          :key="index"
          :class="{selected: (index + 1) === activeImage}"
          @click="selectSlide(index)"
        >
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'LeftSide',
  data () {
    return {
      images: [
        {
          src: require('../assets/better-communicate-feature.svg'),
          title: 'Better Communication',
          subTitle: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas lorem.'
        },
        {
          src: require('../assets/accessibility-feature.svg'),
          title: 'Accessibility',
          subTitle: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid amet'
        },
        {
          src: require('../assets/accountibility-feature.svg'),
          title: 'Accountability',
          subTitle: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid amet'
        },
        {
          src: require('../assets/transparency-feature.svg'),
          title: 'Transparency',
          subTitle: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.' +
            'Aliquid amet aspernatur autem cum dolores eveniet'
        }
      ],
      activeImage: 1,
      activeInterval: null
    }
  },
  watch: {
    'activeImage' (newValue) {
      if (newValue > this.images.length) {
        this.activeImage = 1
      }
    }
  },
  mounted () {
    this.activeInterval = setInterval(() => {
      this.activeImage++
    }, 4000)
  },
  methods: {
    nextSlide () {
      clearInterval(this.activeInterval)
      this.activeImage++
      this.activeInterval = setInterval(() => {
        this.activeImage++
      }, 4000)
    },
    selectSlide (index) {
      if ((index + 1) !== this.activeImage) {
        clearInterval(this.activeInterval)
        this.activeImage = index + 1
        this.activeInterval = setInterval(() => {
          this.activeImage++
        }, 4000)
      }
    }
  }
}
</script>
