<template>
    <div class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">

            <p v-if="load">🚖로딩 중...</p>
            <p v-else-if="errorMessage">{{ errorMessage }}</p>
            <div v-else-if="detail" class="modal-text">
                <div id="destination"><b>도착</b>&emsp;{{ detail.destination }}</div>
                <h2 class="modal-title">{{ detail.pickupTime }}&ensp;출발</h2>
                <div id="passenger-number">현재인원&ensp;{{ detail.currentPassengerNum }} / {{ detail.passengersNum }}</div>
                <div id="estimated-amount">
                    {{ detail.passengersNum }}명 모이면,
                    <del :style="{ color: 'red' }">
                        {{ (detail.estimatedAmount).toLocaleString() }}원
                    </del>
                    →
                    <span :style="{ color: 'blue', fontWeight: 'bold' }">
                        약 {{ Math.round(detail.estimatedAmount / detail.passengersNum).toLocaleString() }}원
                    </span>
                </div>
                <div>약 {{ (detail.estimatedAmount - Math.round(detail.estimatedAmount /
                    detail.passengersNum)).toLocaleString() }}원을 절약해보세요!</div>
            </div>

            <!-- 닫기 버튼 -->
            <button @click="joinApply" class="close-button">신청</button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed, watchEffect, defineProps, defineEmits } from "vue";
import axios from "axios";

//부모한테 받은 props
const props = defineProps<{
    taxiShareId: number | null;
}>();

//기타 변수들
const memberId = ref<number>(4); //일단 4번 회원... 나중에 바꿔야됨!!localStorage에서가져옴!


// 닫기 이벤트 전달
const emit = defineEmits(["close"]);

//통신할때 쓰는 변수
const detail = ref<any[]>();
const load = ref(false);
const errorMessage = ref("");
//신청버튼 클릭시 로딩상태
const isSubmitting = ref(false);

//서버에서 택시 디테일 가져오기
const fetchTaxiDetail = async () => {
    load.value = true;
    errorMessage.value = "";

    try {
        const response = await axios.get(`http://localhost:8080/api/taxi/detail/${props.taxiShareId}`);
        detail.value = response.data;
        console.log(response.data);
    } catch (error) {
        errorMessage.value = "데이터를 불러오는 데 실패했습니다.";
    } finally {
        load.value = false;
    }

}
onMounted(fetchTaxiDetail);
// 모달 닫기 함수
const closeModal = () => {
    emit("close");
};

// 신청 버튼 클릭 핸들러 (예제)
const joinApply = async () => {
    console.log(`택시 공유 ${props.taxiShareId} 신청`);
    if (!props.taxiShareId) {
        alert("택시 공유 ID가 유효하지 않습니다.");
        return;
    }
    if (isSubmitting.value) return;
    isSubmitting.value = true;

    const taxiShareJoinRequest = {
        taxiShareId: props.taxiShareId,
        memberId: 2 //하드코딩 - 나중에 session에서 가져오기!!!
        // const memberId = ref<number>(parseInt(localStorage.getItem("memberId") || "0"));
    };
    try {
        const response = await axios.post("http://localhost:8080/api/taxi/join/insert", taxiShareJoinRequest);

        if (response.status === 201) {
            alert("택시 공유 신청이 완료되었습니다! 🚖");
        } else {
            alert("택시 공유 신청이 정상적으로 처리되지 않았습니다.");
        }
    } catch (error) {
        if (error.response) {
            alert(`🚨 ${error.response.data.message || "신청에 실패했습니다."}`);
        } else {
            alert("🚨 서버와의 통신 중 오류가 발생했습니다.");
        }
    } finally {
        isSubmitting.value = false;
        closeModal();
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
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 20px;
    width: 80%;
    max-width: 400px;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    text-align: center;
}

.modal-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 12px;
}

#estimated-amount {
    display: flex;
    align-items: center;
    /* 수직 가운데 정렬 */
    justify-content: center;
    /* 가로 중앙 정렬 */
    gap: 8px;
    /* 요소 간격 */
    white-space: nowrap;
    /* 줄 바꿈 방지 */
    font-size: 14px;
    width: 100%;
    /* 부모 요소 기준으로 중앙 정렬 */
    text-align: center;
    /* 텍스트 자체도 가운데 정렬 */
}

.close-button {
    margin-top: 12px;
    padding: 10px;
    width: 100%;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
}

.close-button:hover {
    background-color: #0056b3;
}
</style>