<template>
    <div class="modal-overlay" v-if="isVisible">
      <div class="modal-content">
        <h3>⚠ 필수 입력 항목 누락</h3>
        <p v-for="(field, index) in missingFields" :key="index">
          {{ field }}을(를) 입력해주세요.
        </p>
        <button class="modal-button" @click="closeModal">확인</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    isVisible: Boolean,
    missingFields: Array
  });
  const emit = defineEmits(["close"]);
  
  const closeModal = () => {
    emit("close");
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;color: #000;
    max-width : 380px;
    min-width : 380px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  }
  
  h3 {
    margin-bottom: 10px;
  }
  
  p {
    color: red;
    font-weight: bold;
  }
  
  .modal-button {
    background: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    margin-top: 10px;
    cursor: pointer;
    border-radius: 5px;
  }
  </style>
  