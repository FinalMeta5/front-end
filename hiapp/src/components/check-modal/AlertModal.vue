<template>
  <div class="modal-overlay" v-if="isVisible">
    <div class="modal-content">
      <h3>⚠ 필수 입력 항목 누락</h3>
      <ul class="missing-fields">
        <li v-for="(field, index) in missingFields" :key="index">
          <FontAwesomeIcon :icon="faExclamationCircle" class="icon" />
          <span>{{ field }}항목 (필수) 입력</span>
        </li>
      </ul>
      <button class="modal-button" @click="closeModal">확인</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

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
/* 🔹 배경 오버레이 */
.modal-overlay {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background: rgba(0, 0, 0, 0.5);
display: flex;
align-items: center;
justify-content: center;
z-index: 999;
}

/* 🔹 모달 본체 */
.modal-content {
background: #fff;
padding: 24px;
border-radius: 12px;
text-align: center;
color: #333;
max-width: 310px;
width: 90%;
box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.25);
animation: fadeIn 0.3s ease-in-out;
}

/* 🔹 제목 */
h3 {
font-size: 20px;
font-weight: bold;
color: #000000;
margin-bottom: 16px;
}

/* 🔹 누락된 필드 리스트 */
.missing-fields {
list-style: none;
padding: 0;
margin: 0;
}

.missing-fields li {
display: flex;
align-items: center;
justify-content: flex-start;
background: #fff3f3;
padding: 10px;
margin-bottom: 8px;
border-radius: 6px;
font-weight: bold;
color: #d32f2f;
font-size: 13px;
}

/* 🔹 아이콘 스타일 */
.icon {
color: #ff4d4f;
margin-right: 8px;
font-size: 18px;
}

/* 🔹 버튼 */
.modal-button {
background: linear-gradient(90deg, #ff4d4f, #ff6b6b);
color: white;
border: none;
padding: 12px 18px;
margin-top: 10px;
cursor: pointer;
border-radius: 6px;
font-size: 15px;
font-weight: bold;
transition: all 0.2s ease-in-out;
display: block;
width: 100%;
}

.modal-button:hover {
background: linear-gradient(90deg, #ff6b6b, #ff4d4f);
}

/* 🔹 페이드 인 애니메이션 */
@keyframes fadeIn {
from {
  opacity: 0;
  transform: translateY(-10px);
}
to {
  opacity: 1;
  transform: translateY(0);
}
}
</style>
