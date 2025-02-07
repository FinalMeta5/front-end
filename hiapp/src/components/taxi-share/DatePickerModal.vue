<template>
    <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
            <h2 class="text-xl font-bold mb-2">날짜 선택</h2>
            <input type="date" v-model="localDate" class="date-input" />
            <div class="flex justify-between mt-4">
                <button @click="closeModal" class="btn btn-cancel">취소</button>
                <button @click="confirmDate" class="btn btn-confirm">확인</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from "vue";

const props = defineProps({
    modelValue: Boolean, // 모달 상태
    selectedDate: String // 부모 컴포넌트에서 전달받을 날짜
});
const emit = defineEmits(["update:modelValue", "update:selectedDate"]);

const isOpen = ref(props.modelValue);
const localDate = ref(props.selectedDate || new Date().toISOString().split("T")[0]); // 오늘 날짜 기본값

// 모달 닫기
const closeModal = () => {
    emit("update:modelValue", false);
};

// 날짜 선택 후 부모로 전달
const confirmDate = () => {
    emit("update:selectedDate", localDate.value);
    closeModal();
};

// 모달 상태 동기화
watch(() => props.modelValue, (newVal) => {
    isOpen.value = newVal;
});
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
    align-items: center;
    justify-content: center;
}

.modal {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 300px;
}

.date-input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.btn-cancel {
    background: #ccc;
}

.btn-confirm {
    background: #007bff;
    color: white;
}
</style>