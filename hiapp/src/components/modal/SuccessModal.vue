<template>
  <div class="home phone-main-screen">
    <!-- 모달 배경 -->
    <div class="modal-backdrop" @click.self="closeModal">
      <!-- 모달 컨테이너 -->
      <div class="modal-container">
        <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <!-- <img :src="imageSrc" alt="modal image" class="modal-image"/> -->
      <h2 class="modal-title">{{ title }}</h2>
      <p class="modal-text">{{ textLine1 }}</p>
      <p class="modal-text">{{ textLine2 }}</p>
      <button @click="closeModal" class="modal-button">Close</button>
    </div>
  </div>
      </div>
    </div>
  </div>
    
  </template>
  
  <script>
  import { ref } from 'vue';
  export default {
  name: "SuccessModal",
  data() {
    return {
      isVisible: ref(true),  // Controls the visibility of the modal
      // imageSrc: 'https://via.placeholder.com/400x200',  
      title: 'Modal Title',
      textLine1: 'This is the first line of the text.',
      textLine2: 'This is the second line of the text.'
    };
  },
  methods: {
    closeModal() {
      this.isVisible = false;
      this.$emit('close'); 
    }
  }
};
  </script>
  
  <style scoped>


  /* 모달 전체 배경 (회색 반투명) */
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
  
    /* 화면 가운데 정렬 */
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* 모달 컨테이너 스타일 */
  .modal-container {
    background-color: #fff;
    width: 320px;
    padding: 2rem;
    border-radius: 8px;
    position: relative;
  }
  
  .modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 500px;
  text-align: center;
}

.modal-image {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 20px;
}

.modal-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.modal-text {
  font-size: 16px;
  color: #555;
  margin-bottom: 10px;
}

.modal-button {
  background: linear-gradient(to right, #4CAF50, #45a049);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.modal-button:hover {
  background: linear-gradient(to right, #45a049, #4CAF50);
}
  </style>
  