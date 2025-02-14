<template>
    <div class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">

            <p v-if="load || isSubmitting">🚖 로딩 중...</p>
            <p v-else-if="errorMessage">{{ errorMessage }}</p>

            <div v-else-if="detail" class="modal-text">
                <div id="destination"><b>도착&emsp;{{ detail.destination }}</b></div>
                <h2 class="modal-title">{{ detail.pickupTime }}&nbsp;{{ detail.pickupTimeOnly }}&ensp;출발</h2>
                <div :class="['time-negotiation', detail.timeNego === 'true' ? 'possible' : 'impossible']">{{
                    detail.timeNego
                        === 'true' ? '(시간협의 가능)' : '(시간협의 불가)' }}</div>
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

            <!-- 내가 올린 게시글이면 "삭제하기" 버튼, 아니면 "신청" 버튼 -->
            <button v-if="detail && detail.memberId === memberId" @click="deletePost" class="delete-button"
                :disabled="isSubmitting">
                {{ isSubmitting ? "삭제 중..." : "삭제하기" }}
            </button>
            <button v-else @click="joinApply" class="apply-button" :disabled="isSubmitting">
                {{ isSubmitting ? "신청 중..." : "신청" }}
            </button>
        </div>
        <!-- 로그인 모달 -->
        <LoginModalView v-if="showLoginModal" @close="closeLoginModal" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps, defineEmits } from "vue";
import axios from "axios";
import LoginModalView from "../../views/LoginModalView.vue";

// 부모에게 받은 props
const props = defineProps<{ taxiShareId: number | null }>();

// LocalStorage에서 멤버 ID 가져오기
const memberId = ref<number | null>(null);
const getMemberIdFromLocalStorage = () => {
    const storedMemberId = localStorage.getItem('memberId');
    return storedMemberId ? parseInt(storedMemberId) : null;
};

// 닫기 이벤트 전달
const emit = defineEmits(["close"]);

// 통신 관련 상태
const detail = ref<any | null>(null);
const load = ref(false);
const errorMessage = ref("");
const isSubmitting = ref(false); // 신청/삭제 요청 로딩 상태
const showLoginModal = ref(false);

// 🚀 서버에서 택시 디테일 가져오기
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
};

onMounted(() => {
    memberId.value = getMemberIdFromLocalStorage();
    fetchTaxiDetail();
});

// 모달 닫기
const closeModal = () => {
    emit("close");
};

// 🚖 신청 버튼 클릭
const joinApply = async () => {
    if (!memberId.value) {
        showLoginModal.value = true;
        alert("🚨 택시 공유에 참여하시려면 로그인을 해주세요!");
        return;
    }
    if (!props.taxiShareId) {
        alert("🚨 택시 공유 ID가 유효하지 않습니다.");
        return;
    }
    if (isSubmitting.value) return;
    isSubmitting.value = true;

    try {
        const response = await axios.post("http://localhost:8080/api/taxi/join/insert", {
            taxiShareId: props.taxiShareId,
            memberId: memberId.value,
        });

        if (response.status === 201) {
            alert("🚖택시 공유 신청이 완료되었습니다! \n (캐시 🪙2 차감)");
        } else {
            alert("택시 공유 신청이 정상적으로 처리되지 않았습니다.");
        }
    } catch (error) {
        alert(`🚨 ${error.response?.data?.message || "신청에 실패했습니다."}`);
    } finally {
        isSubmitting.value = false;
        closeModal();
    }
};

// 🚮 삭제 버튼 클릭
const deletePost = async () => {
    if (!detail.value || detail.value.memberId !== memberId.value) {
        alert("🚨 당신의 게시물이 아닙니다.");
        return;
    }

    const isConfirmed = confirm("정말로 삭제하시겠습니까?");
    if (!isConfirmed) return;
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    try {
        const response = await axios.post("http://localhost:8080/api/taxi/delete", {
            taxiShareId: props.taxiShareId,
            memberId: memberId.value,
        });

        if (response.status === 200) {
            alert("🚖 택시 공유 게시글이 삭제되었습니다.");
        } else {
            alert("🚨 삭제가 정상적으로 처리되지 않았습니다.");
        }

        closeModal();
    } catch (error) {
        alert(`🚨 ${error.response?.data?.message || "삭제에 실패했습니다. 다시 시도해주세요."}`);
    } finally {
        isSubmitting.value = false;
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

.time-negotiation {
    font-size: 12px;
    text-align: center;
    margin: 5px;
    font-weight: bold;
}

.time-negotiation.possible {
    color: #0056b3;
}

.time-negotiation.impossible {
    color: #c82333;
}

.apply-button,
.delete-button {
    margin-top: 12px;
    padding: 10px;
    width: 100%;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
}

.apply-button {
    background-color: #007bff;
    color: white;
}

.apply-button:hover {
    background-color: #0056b3;
}

.delete-button {
    background-color: #dc3545;
    color: white;
}

.delete-button:hover {
    background-color: #c82333;
}

button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
</style>
