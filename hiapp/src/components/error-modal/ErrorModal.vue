<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-content">
      <h2>🚨</h2>
      <p>{{ message }}</p>
      <button @click="closeModal">닫기</button>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";

export default {
  props: {
    show: Boolean,
    message: String
  },
  emits: ["update:show"],
  setup(props, { emit }) {
    const isVisible = computed(() => props.show); // ✅ 반응형 computed 적용
    console.log("🚨 ErrorModal - show 값 변경됨:", isVisible.value);

    const closeModal = () => {
      console.log("🛑 모달 닫기 버튼 클릭됨");
      emit("update:show", false);
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
    z-index: 1100;
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
