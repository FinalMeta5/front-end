<template>
    <div class="modal-overlay" v-show="isVisible">
      <div class="modal-content">
        <h3>🚗 차량 삭제 확인</h3>
        <p>{{ message }}</p>
        <div class="button-group">
          <button class="confirm-button" @click="confirmAction">예</button>
          <button class="cancel-button" @click="cancelAction">아니오</button>
        </div>
      </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    isVisible: Boolean, // 모달 표시 여부
    message: String     // 모달에 표시할 메시지
});

const emit = defineEmits(["confirm", "cancel"]); // 확인, 취소 이벤트

// ✅ 확인 버튼 클릭 시
const confirmAction = () => {
    emit("confirm"); // 부모 컴포넌트에 확인 이벤트 전달
};

// ❌ 취소 버튼 클릭 시
const cancelAction = () => {
    emit("cancel"); // 부모 컴포넌트에 취소 이벤트 전달
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
    z-index: 9999;
}

/* 🔹 모달 본체 */
.modal-content {
    background: white;
    padding: 24px;
    border-radius: 12px;
    text-align: center;
    color: #333;
    max-width: 400px;
    width: 90%;
    box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.25);
}

/* 🔹 제목 */
h3 {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 16px;
}

/* 🔹 버튼 그룹 */
.button-group {
    display: flex;
    justify-content: space-around;
    margin-top: 16px;
}

/* 🔹 예 버튼 */
.confirm-button {
    background: red;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
}

/* 🔹 아니오 버튼 */
.cancel-button {
    background: gray;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
}
</style>
