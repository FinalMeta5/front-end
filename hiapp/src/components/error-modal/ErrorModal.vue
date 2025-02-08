<template>
    <div v-if="isVisible" class="modal-overlay">
      <div class="modal-content">
        <h2>🚨 오류 발생</h2>
        <p>{{ message }}</p>
        <button @click="closeModal">닫기</button>
      </div>
    </div>
</template>

<script>
import { computed } from "vue";

export default {
  props: {
    show: Boolean, // ✅ 부모에서 v-model로 show를 받음
    message: String // ✅ 동적으로 전달받는 에러 메시지
  },
  emits: ["update:show"], // ✅ 부모의 v-model을 업데이트하기 위해 emit 필요
  setup(props, { emit }) {
    // ✅ 부모의 show 값을 반응형으로 감지
    const isVisible = computed(() => props.show);

    const closeModal = () => {
      emit("update:show", false); // ✅ 부모의 showErrorModal 값을 false로 변경
    };

    return { isVisible, closeModal };
  }
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    width: 300px;
}

button {
    background-color: #ff3b30;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
}
</style>
