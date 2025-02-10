<template>
    <div class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
            <h2 class="modal-title">출발지 검색</h2>

            <!-- 출발지 입력 -->
            <div class="search-input-container">
                <input v-model="searchQuery" @input="searchPlaces" placeholder="출발지를 입력하세요." class="search-input" />
                <span class="search-icon" @click="getCurrentLocation">
                    <img src="../../assets/images/현위치.png" alt="현재 위치 아이콘">
                </span>
            </div>
            <!-- 검색 결과 -->
            <ul v-if="searchResults.length" class="search-results">
                <li v-for="(place, index) in searchResults.slice(0, 10)" :key="index" @click="selectPlace(place)">
                    {{ place.place_name }}<br>
                    {{ place.road_address_name }}
                </li>
            </ul>

            <!-- 카카오 지도 -->
            <div ref="mapContainer" class="map-container"></div>

            <!-- 닫기 버튼 -->
            <button @click="closeModal" class="close-button">확인</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const emit = defineEmits(["close", "select", "current"]);

const searchQuery = ref("");
const searchResults = ref<any[]>([]);
const mapContainer = ref<HTMLElement | null>(null); // ✅ mapContainer 정의
const userLatitude = ref<number | null>(null); // ✅ 사용자 위치를 반응형으로 변경
const userLongitude = ref<number | null>(null);
const userAddress = ref<any | null>(null);

let placesService: any = null;
let map: any = null;
let markers: any[] = [];

// ✅ 사용자 위치 가져오기
const getUserLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLatitude.value = position.coords.latitude;
                userLongitude.value = position.coords.longitude;
                initializeMap(); // 위치 정보를 가져온 후 지도 초기화
            },
            (error) => {
                console.error("위치 정보를 가져올 수 없습니다: ", error);
                initializeMap(); // 위치 정보가 없을 때 기본값(서울)으로 지도 초기화
            }
        );
    } else {
        console.warn("Geolocation을 지원하지 않는 브라우저입니다.");
        initializeMap();
    }
};

// ✅ 카카오맵 API 로드
onMounted(() => {
    if ((window as any).kakao && (window as any).kakao.maps) {
        getUserLocation();
    } else {
        const script = document.createElement("script");
        const apikey = '25b1da76d2662810e4ed8f926629b445';
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apikey}&autoload=false&libraries=services`;
        script.onload = () => {
            (window as any).kakao.maps.load(getUserLocation);
        };
        document.head.appendChild(script);
    }
});

// ✅ 지도 초기화
const initializeMap = () => {
    if (!mapContainer.value) return; // ✅ mapContainer가 렌더링되지 않으면 실행 X

    let lat = userLatitude.value || 37.5665; // 기본 서울 좌표
    let lng = userLongitude.value || 126.9780;

    map = new (window as any).kakao.maps.Map(mapContainer.value, {
        center: new (window as any).kakao.maps.LatLng(lat, lng),
        level: 3,
    });

    placesService = new (window as any).kakao.maps.services.Places();
};

// 현재 사용자위치 따서 인풋값 넣기
const getCurrentLocation = () => {
    if (!userLatitude || !userLongitude) {
        alert("현재 위치를 가져올 수 없습니다.");
        return;
    }

    const geocoder = new kakao.maps.services.Geocoder();
    const coord = new kakao.maps.LatLng(userLatitude.value, userLongitude.value);
    console.log(coord);

    geocoder.coord2Address(coord.getLng(), coord.getLat(), (result, status) => {
        if (status === kakao.maps.services.Status.OK && result[0]) {
            const address = result[0].road_address?.address_name || result[0].address.address_name;

            // 입력 필드에 즉시 반영
            searchQuery.value = address;
            userAddress.value = address;

            // 지도 위치 이동 및 마커 표시
            const position = new kakao.maps.LatLng(userLatitude.value, userLongitude.value);
            selectCurrentPlace(position);
            displayMarker(position);
        } else {
            console.error("주소를 가져올 수 없습니다.");
            alert("🚨현재 위치를 가져올 수 없습니다.");
        }
    });
};

// ✅ 장소 검색
const searchPlaces = () => {
    if (!searchQuery.value.trim()) {
        searchResults.value = [];
        return;
    }

    placesService.keywordSearch(searchQuery.value, (data: any, status: any) => {
        if (status === (window as any).kakao.maps.services.Status.OK) {
            searchResults.value = data;
        } else {
            searchResults.value = [];
        }
    });
};

// ✅ 지도에 마커 표시
const displayMarker = (position: any) => {
    const marker = new (window as any).kakao.maps.Marker({ position });

    clearMarkers();
    markers.push(marker);
    marker.setMap(map); // ✅ this.map 대신 map 사용
    map.panTo(position);
};

// ✅ 기존 마커 삭제
const clearMarkers = () => {
    markers.forEach((marker) => marker.setMap(null));
    markers = [];
};

// ✅ 장소 선택
const selectPlace = (place: any) => {
    const position = new (window as any).kakao.maps.LatLng(place.y, place.x);
    console.log(place);
    displayMarker(position);
    console.log(position);
    // 검색 결과를 숨김
    searchResults.value = [];
    emit("select", place);
};
// 현재 위치 장소로 선택
const selectCurrentPlace = (coord: any) => {
    displayMarker(coord);

    const currentInfo = {
        searchQuery: searchQuery,
        userAddress: userAddress,
        coord: coord,
    }

    emit("current", currentInfo);
};

// ✅ 모달 닫기
const closeModal = () => {
    emit("close");
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

.search-input-container {
    position: relative;
    width: 100%;
}

.search-icon img {
    width: 24px;
    height: 24px;
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
}

.search-input {
    width: 100%;
    padding: 10px 40px 10px 10px;
    /* 오른쪽 여백을 늘려서 아이콘 위치 공간 확보 */
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    outline: none;
}

.search-results {
    margin-top: 10px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    max-height: 200px;
    overflow-y: auto;
    padding: 0;
}

.search-results li {
    padding: 12px;
    cursor: pointer;
    transition: background 0.2s;
    list-style: none;
    border-bottom: 1px solid #f0f0f0;
}

.search-results li:last-child {
    border-bottom: none;
}

.search-results li:hover {
    background: #f0f8ff;
}

.map-container {
    width: 100%;
    height: 300px;
    margin-top: 10px;
    border-radius: 8px;
    overflow: hidden;
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