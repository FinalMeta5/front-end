<template>
    <div class="taxi-share-list">
        <div class="max-w-md mx-auto p-4">
            <!-- 헤더 -->
            <h1>{{ $t('context.shareTaxi') }}</h1>
            <p id="content">{{ $t('context.whereAreUGoing') }}</p>

            <!-- 출발지, 도착지, 날짜 선택 -->
            <div class="search-container">
                <button @click="showSearchModal = true">
                    <img src="../../assets/images/출발마크.png" alt="출발지" class="w-5 h-5 text-gray-500" width="20px" />
                    <span v-if="departure && departureAdr">
                        {{ departure }} ({{ departureAdr }})
                    </span>
                    <span v-else-if="departure">
                        {{ departure }}
                    </span>
                    <span v-else>
                        {{ $t('context.selectDepartureLocation') }}
                    </span>
                </button>

                <button @click="showDateTimeModal = true">
                    <img src="../../assets/images/calendar.png" alt="날짜 선택" class="w-5 h-5 text-gray-500"
                        width="20px" />
                    {{ formattedSelectedDate || '날짜 선택' }}
                </button>
            </div>

            <!-- 로딩 상태 -->
            <div v-if="loading" class="text-center text-gray-500 my-4">
                {{ $t('context.loading') }}
            </div>

            <!-- 에러 메시지 -->
            <div v-if="errorMessage" class="text-red-500 text-center my-4">
                ⚠ {{ errorMessage }}
            </div>

            <!-- 택시 공유 리스트 -->
            <div v-if="rideList.length > 0">
                <div v-for="(ride, index) in rideList" :key="index"
                    :class="['ride-card', ride.status !== 'Y' ? 'disabled' : '']"
                    @click="ride.status === 'Y' ? showJoinModal(ride.taxiShareId) : null" class="ride-card">
                    <div class="ride-header">
                        <span class="time">🕒 {{ formatDate(ride.pickupTime) }}&nbsp;{{ ride.pickupTimeOnly }} 출발</span>
                        <span :class="['status', ride.status === 'Y' ? 'open' : 'closed']">
                            {{ ride.status === 'Y' ? '모집중' : '모집완료' }}
                        </span>
                    </div>
                    <div class="ride-info">
                        <p>📍 출발지: {{ ride.pickupLocation }}</p>
                        <p>📍 도착지: {{ ride.destination }}</p>
                    </div>
                    <div class="host-info">
                        <img v-if="ride.memberImageUrl" :src="ride.memberImageUrl" />
                        <img v-else src="https://ifh.cc/g/qsAZyn.png" />
                        <span v-if="ride.memberId === memberId" class="host-name"> 나</span>
                        <span v-else class="host-name"> {{ ride.memberNickname }}</span>
                        <span class="passenger-count">
                            승차인원: {{ ride.currentPassengerNum }} / {{ ride.passengersNum }}
                        </span>
                    </div>
                </div>
            </div>
            <!-- rideList가 비어 있을 경우 슬픈 아이콘과 함께 모달 표시 -->
            <div v-else class="no-rides-modal">
                <font-awesome-icon :icon="['fas', 'face-frown']" class="sad-icon" />
                <p>{{ $t('context.noTaxi') }}</p>
                <p>{{ $t('context.withUs') }}</p>
                <!-- <p>선택하신 날짜와 출발지 근처에<br> 이용 가능한 택시 공유가 업습니다.</p>
                <p>직접 택스 공유 호스트가 되어<br> 동승자를 모집해보세요!</p> -->
                <!-- 리스트 이동 버튼 -->
                <div class="mg-t-60">
                    <button class="move-button" @click="goToRegist">{{ $t('context.becomeATaxiShareHost') }}</button>
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
            <PlaceSearchModal v-if="showSearchModal" @close="showSearchModal = false" @select="setDeparture"
                @current="setCurrentDeparture" />
            <!-- 디테일/신청 모달 -->
            <TaxiShareJoinModal v-if="isModalOpen" :taxiShareId="selectedTaxiShareId"
                :selectedMemberId="selectedTaxiShareMemberId" @close="handleModalClose" />


        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref, onMounted, computed, watchEffect } from "vue";
import axios from "axios";
import PlaceSearchModal from "./PlaceSearchModal.vue";
import TaxiShareJoinModal from "./TaxiShareJoinModal.vue";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFaceFrown } from '@fortawesome/free-solid-svg-icons';
const router = useRouter();
library.add(faFaceFrown);
//멤버 아이디 local storage에서 가져오기
const memberId = ref<number | null>(null); // null 또는 number를 허용
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

// localStorage에서 memberId를 가져오는 함수
const getMemberIdFromLocalStorage = () => {
    const storedMemberId = localStorage.getItem('memberId');
    return storedMemberId ? parseInt(storedMemberId) : null;
};

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
        const url = `/api/taxi/list?pickupTime=${selectedDate.value}`;

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
    console.log(place);
};

const setCurrentDeparture = (currentInfo: any) => {
    console.log(currentInfo);
    departure.value = currentInfo.userAddress.value;
    departureLat.value = currentInfo.coord.getLat();
    departureLng.value = currentInfo.coord.getLng();
}

const goToRegist = () => {
    router.push('/taxi-share');
}

// 컴포넌트가 마운트될 때 데이터 불러오기
onMounted(() => {
    memberId.value = getMemberIdFromLocalStorage();
    fetchTaxiList();
});
</script>

<style scoped>
.taxi-share-list {
    margin-top: 140px;
    padding: 20px;
    text-align: center;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 80px;
}

#content {
    font-size: 13px;
}

/* 📌 모바일 화면에서 크기 자동 조정 */
@media (max-width: 768px) {
    .taxi-share-list {
        width: 85%;
        padding: 15px;
        margin-top: 140px;
    }
}

h1 {
    font-size: 22px;
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
    border: 1px solid #ddd;
    padding: 10px;
    margin: 10px 0;
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

/* 모집 완료된 카드 스타일 */
.ride-card.disabled {
    background-color: #f1f1f1;
    /* 회색 배경 */
    cursor: not-allowed;
    opacity: 0.7;
}

.ride-card.disabled:hover {
    transform: none;
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
    /* 이미지와 텍스트를 세로로 가운데 정렬 */
    margin-top: 8px;
}

.host-info img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #ddd;
    margin-right: 8px;
    /* 이미지와 호스트 이름 사이에 여백 추가 */
}

.host-info .host-name {
    font-size: 14px;
    color: #555;
}

.passenger-count {
    font-size: 12px;
    color: #888;
    margin-left: auto;
    /* 탑승자 정보는 오른쪽 끝으로 배치 */
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

.no-rides-modal {
    text-align: center;
    padding: 40px;
    color: #555;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    /* 그림자 추가 */
    max-width: 400px;
    /* 최대 너비 설정 */
    margin: 0 auto;
}

.sad-icon {
    font-size: 70px;
    /* 아이콘 크기 크게 */
    color: #ff6347;
    /* 슬픈 아이콘 색상 */
    margin-bottom: 40px;
    /* 아이콘과 텍스트 간의 간격 */
}

.no-rides-modal p {
    font-size: 13px;
    /* 텍스트 크기 조정 */
    line-height: 1.5;
    /* 텍스트 간의 줄 간격 */
    margin-bottom: 20px;
    /* 텍스트 간의 간격 */
    color: #333;
    /* 텍스트 색상 */
}

.mg-t-60 {
    margin-top: 50px;
}

.move-button {
    padding: 10px 28px;
    /* 버튼 패딩 조정 */
    background-color: #FF6347;
    /* 파란색 배경 */
    color: white;
    /* 텍스트 색상 */
    border: none;
    border-radius: 8px;
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    width: 100%;
}

.move-button:hover {
    background-color: #0056b3;
    /* 버튼 hover 시 색상 변경 */
}
</style>