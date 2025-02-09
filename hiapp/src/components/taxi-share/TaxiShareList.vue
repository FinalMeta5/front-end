<template>
    <div class="taxi-share-list">
        <div class="max-w-md mx-auto p-4">
            <!-- 헤더 -->
            <h1>택시 같이 타요!</h1>
            <p>어디서 출발하시나요?</p>

            <!-- 출발지, 도착지, 날짜 선택 -->
            <div class="search-container">
                <button @click="showSearchModal = true">
                    <img src="../../assets/images/출발마크.png" alt="출발지" class="w-5 h-5 text-gray-500" width="20px" />
                    {{ departure ? `${departure} (${departureAdr})` : '출발지 선택' }}
                </button>
                <!-- <span>➡</span>
                <button @click="openPlaceSearch('destination')"
                    class="flex items-center gap-1 bg-white px-3 py-2 rounded shadow">
                    <img src="../../assets/images/도착마크.png" alt="도착지" class="w-5 h-5 text-red-500" width="20px" />
                    {{ destination || '도착지 선택' }}
                </button> -->
                <button @click="showDateTimeModal = true">
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
            <div v-for="(ride, index) in rideList" :key="index" @click="showJoinModal(ride.taxiShareId)"
                class="ride-card">
                <div class="ride-header">
                    <span class="time">🕒 {{ formatDate(ride.pickupTime) }}&nbsp;{{ ride.pickupTimeOnly }}
                        출발</span>
                    <span :class="['status', ride.status === 'Y' ? 'open' : 'closed']">
                        {{ ride.status === 'Y' ? '모집중' : '모집완료' }}
                    </span>
                </div>
                <div class="ride-info">
                    <p>📍 출발지: {{ ride.pickupLocation }}</p>
                    <p>📍 도착지: {{ ride.destination }}</p>
                </div>
                <div class="host-info">
                    <img src="" />
                    <span>호스트: {{ ride.memberNickname }}</span>
                    <span class="passenger-count">탑승자: {{ ride.currentPassengerNum }} / {{
                        ride.passengersNum }}</span>
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
        <!-- 출발지 검색 모달 -->
        <PlaceSearchModal v-if="showSearchModal" @close="showSearchModal = false" @select="setDeparture" />
        <TaxiShareJoinModal v-if="isModalOpen" :taxiShareId="selectedTaxiShareId" @close="handleModalClose" />
        <!-- 디테일/신청 모달 -->

    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watchEffect } from "vue";
import axios from "axios";
import PlaceSearchModal from "./PlaceSearchModal.vue";
import TaxiShareJoinModal from "./TaxiShareJoinModal.vue";

// 출발지, 도착지, 날짜 상태
const departure = ref("");
const showSearchModal = ref(false);
const departureLat = ref("");
const departureLng = ref("");
const departureAdr = ref("");

const isModalOpen = ref(false);
const selectedTaxiShareId = ref<number | null>(null);

const selectedDate = ref(new Date().toISOString().split("T")[0]); // 현재 날짜 기본값 설w정
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
        const url = `http://localhost:8080/api/taxi/list?pickupTime=${selectedDate.value}`;

        const requestBody = departureLat.value && departureLng.value ? {
            lat: departureLat.value,
            lng: departureLng.value
        } : null;

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const response = await axios.post(url, requestBody, config);

        console.log(response.data);
        rideList.value = response.data;
    } catch (error) {
        errorMessage.value = "🚨 데이터를 불러오지 못했습니다.";
        console.error("API 요청 오류:", error);
    } finally {
        loading.value = false;
    }
};
//신청모달 오픈 함수
const showJoinModal = (id: number) => {
    isModalOpen.value = true;
    selectedTaxiShareId.value = id;
}
// 날짜 변경 감지하여 API 요청 실행
watchEffect(() => {
    fetchTaxiList();
});

// 신청 모달 닫혔을때 리스트 다시불러오기
const handleModalClose = () => {
    isModalOpen.value = false;
    fetchTaxiList(); // 리스트 다시 불러오기
};

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

// 출발지 선택 시 업데이트
const setDeparture = (place: any) => {
    departure.value = place.place_name;
    departureLat.value = place.y;
    departureLng.value = place.x;
    departureAdr.value = place.road_address_name;
};
// 컴포넌트가 마운트될 때 데이터 불러오기
onMounted(() => {
    fetchTaxiList();
});
</script>

<style scoped>
.taxi-share-list {
    margin-top: 110px;
    padding: 20px;
    text-align: center;
}

h1 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
}

.search-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 15px;
}

.search-container button {
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: white;
    border: 1px solid #ddd;
    padding: 12px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-container button:hover {
    background-color: #f3f3f3;
}

/* 택시 공유 리스트 스타일 */
.ride-card {
    background-color: white;
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease-in-out;
    cursor: pointer;
}

.ride-card:hover {
    transform: translateY(-2px);
}

.ride-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.ride-header .time {
    font-size: 14px;
    color: #666;
}

.status {
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 5px;
    font-weight: bold;
}

.status.open {
    color: white;
    background-color: #007bff;
}

.status.closed {
    color: white;
    background-color: #dc3545;
}

.ride-info {
    font-size: 14px;
    color: #333;
    margin-bottom: 8px;
}

.ride-info p {
    display: flex;
    align-items: center;
    gap: 6px;
}

.host-info {
    display: flex;
    align-items: center;
    margin-top: 8px;
}

.host-info img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #ddd;
}

.host-info span {
    font-size: 14px;
    color: #555;
    margin-left: 8px;
}

.passenger-count {
    margin-left: auto;
    font-size: 12px;
    color: #888;
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