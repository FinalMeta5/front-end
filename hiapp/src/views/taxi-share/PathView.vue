<template>
    <div class="path-view main-wrapper">
        <!-- 로그인 모달 -->
        <LoginModalView v-if="showLoginModal" @close="closeLoginModal" />
        <div class="header">
            <h1>경로 등록</h1>
        </div>

        <!-- 출발지 입력 -->
        <div class="input-group">
            <font-awesome-icon :icon="['fas', 'location-arrow']" class="icon" />
            <input v-model="startLocation" @input="searchPlaces('start')" placeholder="출발지를 입력하세요." />
            <span class="search-icon" @click="getCurrentLocation('start')">
                <img src="../../assets/images/현위치.png" alt="현재 위치 아이콘">
            </span>
            <ul v-if="startSearchResults.length" class="search-results">
                <li v-for="(place, index) in startSearchResults.slice(0, 7)" :key="index"
                    @click="selectPlace('start', place)">
                    {{ place.place_name }}({{ place.road_address_name }})
                </li>
            </ul>
        </div>

        <!-- 도착지 입력 -->
        <div class="input-group">
            <font-awesome-icon :icon="['fas', 'location-dot']" class="icon" />
            <input v-model="endLocation" @input="searchPlaces('end')" placeholder="도착지를 입력하세요." />
            <span class="search-icon" @click="getCurrentLocation('end')">
                <img src="../../assets/images/현위치.png" alt="현재 위치 아이콘">
            </span>
            <ul v-if="endSearchResults.length" class="search-results">
                <li v-for="(place, index) in endSearchResults.slice(0, 7)" :key="index"
                    @click="selectPlace('end', place)">
                    {{ place.place_name }}({{ place.road_address_name }})
                </li>
            </ul>
        </div>

        <!-- 카카오 지도 -->
        <div id="mapContainer" ref="mapContainer" class="map-container"></div>

        <!-- 선택된 주소 정보 -->
        <div class="address-info">
            <p>출발지: {{ startAddress ? ` ${startAddress}` : '' }}</p>
            <p>도착지: {{ endAddress ? ` ${endAddress}` : '' }}</p>
        </div>

        <button class="next-button" @click="nextStep">다음</button>
    </div>
</template>

<script>
import LoginModalView from "../../views/LoginModalView.vue";

export default {
    name: "PathView",
    components: {
        LoginModalView,
    },
    data() {
        return {
            startLocation: "",
            endLocation: "",
            startSearchResults: [],
            endSearchResults: [],
            userLatitude: null,
            userLongitude: null,
            userAddress: "",
            map: null,
            markers: [],
            placesService: null,
            startLatLng: null,
            endLatLng: null,
            startAddress: "",
            endAddress: "",
            showLoginModal: false, // 로그인 모달 표시 여부
        };
    },
    mounted() {
        // localStorage에서 memberId 확인
        const memberId = localStorage.getItem("memberId");

        // memberId가 없으면 로그인 모달을 띄운다.
        if (!memberId) {
            this.showLoginModal = true;
        } else {
            // memberId가 있으면 정상적으로 경로 등록 화면을 로드
            this.getUserLocation();

            if (window.kakao && window.kakao.maps) {
                this.initializeMap();
            } else {
                this.loadScript();
            }
        }
    },
    methods: {
        // Kakao 지도 API 스크립트 로드
        loadScript() {
            const script = document.createElement("script");
            const apikey = "25b1da76d2662810e4ed8f926629b445";
            script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apikey}&autoload=false&libraries=services`;
            script.onload = () => {
                window.kakao.maps.load(this.initializeMap);
            };
            document.head.appendChild(script);
        },

        // 지도 초기화
        initializeMap() {
            const lat = this.userLatitude || 37.5665; // 기본 서울 좌표
            const lng = this.userLongitude || 126.9780;

            this.map = new kakao.maps.Map(this.$refs.mapContainer, {
                center: new kakao.maps.LatLng(lat, lng),
                level: 3,
            });

            this.placesService = new kakao.maps.services.Places();
        },

        // 사용자 현재 위치 가져오기
        getUserLocation() {
            if (!navigator.geolocation) {
                alert("위치 정보를 사용할 수 없습니다.");
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    console.log(pos.coords);
                    this.userLatitude = pos.coords.latitude;
                    this.userLongitude = pos.coords.longitude;

                    if (this.map) {
                        this.map.setCenter(new kakao.maps.LatLng(this.userLatitude, this.userLongitude));
                    }
                },
                (err) => {
                    console.error("위치 정보를 가져올 수 없습니다: ", err.message);
                }
            );
        },
        getCurrentLocation(type) {
            if (!this.userLatitude || !this.userLongitude) {
                alert("현재 위치를 가져올 수 없습니다.");
                return;
            }

            const geocoder = new kakao.maps.services.Geocoder();
            const coord = new kakao.maps.LatLng(this.userLatitude, this.userLongitude);

            geocoder.coord2Address(coord.getLng(), coord.getLat(), (result, status) => {
                if (status === kakao.maps.services.Status.OK && result[0]) {
                    const address = result[0].road_address?.address_name || result[0].address.address_name;

                    // 입력 필드에 즉시 반영
                    if (type === "start") {
                        this.startLocation = address;
                        this.startAddress = address;
                        console.log(coord);
                        this.startLatLng = coord;
                    } else {
                        this.endLocation = address;
                        this.endAddress = address;
                        this.endLatLng = coord;
                    }

                    // 지도 위치 이동 및 마커 표시
                    const position = new kakao.maps.LatLng(this.userLatitude, this.userLongitude);
                    this.displayMarker(position);
                } else {
                    console.error("주소를 가져올 수 없습니다.");
                }
            });
        },
        // 장소 검색
        searchPlaces(type) {
            const query = type === "start" ? this.startLocation : this.endLocation;
            if (!query.trim()) {
                this[`${type}SearchResults`] = [];
                return;
            }

            this.placesService.keywordSearch(query, (data, status) => {
                if (status === kakao.maps.services.Status.OK) {
                    this[`${type}SearchResults`] = data;
                } else {
                    this[`${type}SearchResults`] = [];
                }
            });
        },

        // 장소 선택
        selectPlace(type, place) {
            this[`${type}Location`] = place.place_name;
            this[`${type}SearchResults`] = [];
            this[`${type}LatLng`] = new kakao.maps.LatLng(place.y, place.x);

            this[`${type}Address`] = place.road_address_name;
            const position = new kakao.maps.LatLng(place.y, place.x);
            this.displayMarker(position);
        },

        // 지도에 마커 표시
        displayMarker(position) {
            const marker = new kakao.maps.Marker({ position });

            this.clearMarkers();
            this.markers.push(marker);
            marker.setMap(this.map);
            this.map.panTo(position);
        },

        // 기존 마커 삭제
        clearMarkers() {
            this.markers.forEach((marker) => marker.setMap(null));
            this.markers = [];
        },

        // 다음 단계 버튼 클릭
        nextStep() {
            if (!this.startLocation || !this.endLocation) {
                alert("출발지와 도착지를 입력해주세요.");
                return;
            }

            this.$router.push({
                path: "/taxi-share/regist",
                state: {
                    latLngInfo: {
                        startLocation: this.startLocation,
                        endLocation: this.endLocation,
                        startLat: this.startLatLng.getLat(),
                        startLng: this.startLatLng.getLng(),
                        endLat: this.endLatLng.getLat(),
                        endLng: this.endLatLng.getLng(),
                    },

                },
            });
        },
        // 로그인 모달을 닫는 메서드
        closeLoginModal() {
            this.showLoginModal = false;
        },
    },
};
</script>

<style scoped>
.path-view {
    padding: 16px;
    margin-top: 140px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    background: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
}

/* 📌 모바일 화면에서 크기 조정 */
@media (max-width: 768px) {
    .path-view {
        width: 85%;
        /* 모바일에서는 더 넓게 */
        padding: 12px;
        margin-top: 140px;
    }
}

.header {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
}

.header h1 {
    font-size: 22px;
    font-weight: bold;
    color: #333;
}

/* 📌 입력 그룹 반응형 스타일 */
.input-group {
    position: relative;
    margin-bottom: 12px;
    background: #f3f3f3;
    border-radius: 10px;
    padding: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 📌 모바일에서 폰트 크기 조정 */
.input-group input {
    flex: 1;
    border: none;
    background: transparent;
    padding: 8px;
    font-size: 14px;
    outline: none;
    color: #333;
}

.input-group .icon {
    font-size: 16px;
    color: #777;
}

.search-results {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: white;
    border: 1px solid #ddd;
    border-radius: 10px;
    list-style: none;
    padding: 0;
    margin: 4px 0 0;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 100;
}

.search-results li {
    padding: 10px;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.2s;
}

.search-results li:hover {
    background: #f0f8ff;
}

/* 📌 모바일에서 지도 크기 조정 */
.map-container {
    width: 100%;
    height: 400px;
    margin-top: 16px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* 📌 모바일에서는 지도 높이 줄이기 */
@media (max-width: 768px) {
    .map-container {
        height: 300px;
    }
}

/* 📌 주소 정보 */
.address-info {
    margin-top: 16px;
    padding: 12px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.address-info p {
    margin: 0;
    font-size: 14px;
    color: #555;
}

/* 📌 버튼 크기 조정 */
.next-button {
    width: 100%;
    padding: 12px;
    background: #007bff;
    color: #fff;
    border: none;
    border-radius: 25px;
    font-size: 16px;
    font-weight: bold;
    margin-top: 16px;
    cursor: pointer;
    transition: background 0.3s;
}

/* 📌 모바일에서는 버튼 크기 조정 */
@media (max-width: 768px) {
    .next-button {
        font-size: 14px;
        padding: 10px;
    }
}

.next-button:hover {
    background: #0056b3;
}

.search-icon img {
    width: 24px;
    height: 24px;
    cursor: pointer;
    transition: transform 0.2s ease-in-out;
}

/* 📌 모바일 화면에서 아이콘 크기 줄이기 */
@media (max-width: 768px) {
    .search-icon img {
        width: 20px;
        height: 20px;
    }
}

/* 📌 더 작은 모바일 화면 (예: 480px 이하) */
@media (max-width: 480px) {
    .search-icon img {
        width: 18px;
        height: 18px;
    }
}

/* 📌 클릭 시 효과 */
.search-icon img:active {
    transform: scale(0.9);
}
</style>
