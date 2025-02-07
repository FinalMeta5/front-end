<template>
    <div class="banner-container">
        <div class="slider" @mouseenter="pauseSlider" @mouseleave="resumeSlider">
            <div class="slides" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
                <div v-for="(image, index) in images" :key="index" class="slide">
                <img :src="image" alt="Slide image" />
                </div>
            </div>
        <button class="prev" @click="prevSlide">‹</button>
        <button class="next" @click="nextSlide">›</button>
        </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "BannerComponent",
    data() {
      return {
        images: [
          "https://ifh.cc/g/bvzz9G.jpg",
          "https://ifh.cc/g/MKlkZr.jpg",
          "https://ifh.cc/g/AdBMnM.jpg",
        ],
        currentIndex: 0,
        interval: null,
      };
    },
    methods: {
      nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
      },
      prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
      },
      startSlider() {
        this.interval = setInterval(this.nextSlide, 2000);
      },
      pauseSlider() {
        clearInterval(this.interval);
      },
      resumeSlider() {
        this.startSlider();
      },
    },
    mounted() {
      this.startSlider();
    },
    beforeUnmount() {
      this.pauseSlider();
    },
  };
  </script>
  
  <style scoped>
  .banner-container {
    position: relative;
  }

  .slider {
    position: relative;
    width: 100%;
    overflow: hidden;
  }
  
  .slides {
    display: flex;
    transition: transform 0.5s ease-in-out;
  }
  
  .slide {
    min-width: 100%;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
  }
  
  .prev {
    left: 10px;
  }
  
  .next {
    right: 10px;
  }
  </style>
  