<template>
    <div class="taxi-share-list">
        <div class="max-w-md mx-auto p-4">
            <!-- 헤더 -->
            <h1 class="text-2xl font-bold mb-2">택시 같이 타요!</h1>

            <!-- 출발지, 도착지, 날짜 선택 -->
            <div class="bg-gray-100 p-4 rounded-lg flex items-center gap-2 mb-4">
                <button @click="openPlaceSearch('departure')"
                    class="flex items-center gap-1 bg-white px-3 py-2 rounded shadow">
                    <img src="../../assets/images/출발마크.png" alt="출발지" class="w-5 h-5 text-gray-500" width="20px" />
                    {{ departure || '출발지 선택' }}
                </button>
                <span>➡</span>
                <button @click="openPlaceSearch('destination')"
                    class="flex items-center gap-1 bg-white px-3 py-2 rounded shadow">
                    <img src="../../assets/images/도착마크.png" alt="도착지" class="w-5 h-5 text-red-500" width="20px" />
                    {{ destination || '도착지 선택' }}
                </button>
                <button @click="showDateTimeModal = true"
                    class="ml-auto flex items-center gap-1 bg-white px-3 py-2 rounded shadow">
                    <img src="../../assets/images/calendar.png" alt="날짜 선택" class="w-5 h-5 text-gray-500"
                        width="20px" />
                    {{ formattedSelectedDate || '날짜 선택' }}
                </button>
            </div>

            <!-- 로딩 상태 -->
            <div v-if="loading" class="text-center text-gray-500 my-4">
                🚖 데이터를 불러오는 중...
            </div>

            <!-- 에러 메시지 -->
            <div v-if="errorMessage" class="text-red-500 text-center my-4">
                ⚠ {{ errorMessage }}
            </div>

            <!-- 택시 공유 리스트 -->
            <div v-for="(ride, index) in rideList" :key="index" class="bg-white p-4 rounded-lg shadow mb-3">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-gray-600">{{ formatDate(ride.pickupTime) }} 출발</span>
                    <span :class="ride.status === 'Y' ? 'text-blue-500' : 'text-red-500'">
                        {{ ride.status === 'Y' ? '모집중' : '모집완료' }}
                    </span>
                </div>
                <div class="text-sm text-gray-700">
                    <p>📍 출발지: {{ ride.pickupLocation }}</p>
                    <p>📍 도착지: {{ ride.destination }}</p>
                </div>
                <div class="flex items-center mt-2">
                    <img src="" class="w-8 h-8 rounded-full" />
                    <span class="ml-2 text-gray-700">ID: {{ ride.memberId }}</span>
                    <span class="ml-auto text-gray-500 text-sm">탑승자: /{{ ride.passengersNum }}</span>
                </div>
            </div>
        </div>

        <!-- 날짜/시간 선택 모달 -->
        <div v-if="showDateTimeModal" class="modal-overlay" @click="showDateTimeModal = false">
            <div class="modal-content" @click.stop>
                <h3>날짜 선택</h3>
                <input type="date" v-model="tempSelectedDate">
                <button @click="confirmDate">확인</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watchEffect } from "vue";
import axios from "axios";

// 출발지, 도착지, 날짜 상태
const departure = ref("");
const destination = ref("");
const selectedDate = ref(new Date().toISOString().split("T")[0]); // 현재 날짜 기본값 설정
const showDateTimeModal = ref(false);
const tempSelectedDate = ref(selectedDate.value);

// 날짜 표시 포맷 (YYYY-MM-DD → YYYY년 MM월 DD일)
const formattedSelectedDate = computed(() => {
    const date = new Date(selectedDate.value);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
});

// 택시 공유 리스트 상태
const rideList = ref<any[]>([]);
const loading = ref(false);
const errorMessage = ref("");

// 서버에서 선택된 날짜의 택시 공유 리스트 가져오기
const fetchTaxiList = async () => {
    if (!selectedDate.value) return;
    loading.value = true;
    errorMessage.value = "";

    try {
        const response = await axios.get(`http://localhost:8080/api/taxi/list/${selectedDate.value}`);
        console.log(response.data);
        rideList.value = response.data;
    } catch (error) {
        errorMessage.value = "🚨 데이터를 불러오지 못했습니다.";
        console.error("API 요청 오류:", error);
    } finally {
        loading.value = false;
    }
};

// 날짜 변경 감지하여 API 요청 실행
watchEffect(() => {
    fetchTaxiList();
});

// 날짜 선택 후 업데이트
const confirmDate = () => {
    if (tempSelectedDate.value) {
        selectedDate.value = tempSelectedDate.value;
        showDateTimeModal.value = false;
    }
};

// 날짜 변환 함수 (YYYY-MM-DD → MM월 DD일)
const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

// 장소 검색 모달 열기
const openPlaceSearch = (type: "departure" | "destination") => {
    console.log(`${type} 검색 모달 열기`);
};

// 컴포넌트가 마운트될 때 데이터 불러오기
onMounted(() => {
    fetchTaxiList();
});
</script>

<style scoped>
.taxi-share-list {
    padding: 20px;
    margin-top: 120px;
}

button {
    transition: all 0.2s;
}

button:hover {
    background-color: #f3f3f3;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 300px;
}

.modal-content input {
    width: 100%;
    margin-bottom: 10px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.modal-content button {
    width: 100%;
    padding: 10px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.modal-content button:hover {
    background-color: #0056b3;
}
</style>
