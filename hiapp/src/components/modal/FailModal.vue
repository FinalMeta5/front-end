<template>
  <div class="home phone-main-screen">
    <div class="modal-backdrop" @click.self="closeModal">
      <div class="modal-container">
      <div v-if="isVisible" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2 class="modal-title">{{ title }}</h2>
        <p class="modal-text">{{ textLine1 }}</p>
        <p class="modal-text">{{ textLine2 }}</p>
        <button @click="closeModal" class="modal-button">{{ close }}</button>
      </div>
      </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
  import { ref } from 'vue';
  export default {
  name: "FailModal",
  props: {
    title: String,
    textLine1: String,
    textLine2: String,
    close: String,
  },
  data() {
    return {
      isVisible: ref(true),  
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
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-container {
    background-color: #fff;
    width: 300px;
    padding: 2rem;
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
  max-width: 400px;
  text-align: center;
}

.modal-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 25px;
  color: red;
}

.modal-text {
  font-size: 16px;
  margin-bottom: 5px;
  font-weight: bold;
}

.modal-button {
  margin-top: 25px;
  background: linear-gradient(to right, #F23030, #F23030);
  color: rgb(236, 233, 233);
  padding: 9px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.modal-button:hover {
  background: linear-gradient(to right, #F23030, #F23030);
}

@media (max-width: 500px) {
  .modal-text {
    font-size: 3vw; 
  }
}
  </style>
  