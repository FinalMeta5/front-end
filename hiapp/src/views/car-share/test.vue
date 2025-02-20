<template>
    <div class="path-view">
        <div class="header">
            <router-link to="/" class="back-button">←</router-link>
            <h1>경로 등록</h1>
        </div>
  
        <!-- 출발지 입력 -->
        <div class="input-group">
            <input v-model="startLocation" @input="searchPlaces('start')" placeholder="출발지를 입력하세요." />
            <ul v-if="startSearchResults.length" class="search-results">
                <li v-for="(place, index) in startSearchResults.slice(0, 7)" :key="index"
                    @click="selectPlace('start', place)">
                    {{ place.place_name }}({{ place.road_address_name }})
                </li>
            </ul>
        </div>
  
        <!-- 도착지 입력 -->
        <div class="input-group">
            <input v-model="endLocation" @input="searchPlaces('end')" placeholder="도착지를 입력하세요." />
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
            <p>출발지: {{ startLocation }}</p>
            <p>도착지: {{ endLocation }}</p>
        </div>
  
        <button class="next-button" @click="nextStep">다음</button>
    </div>
  </template>
  
  <script>
  export default {
    name: "PathView",
    data() {
        return {
            startLocation: "",
            endLocation: "",
            startSearchResults: [],
            endSearchResults: [],
            userLatitude: null,
            userLongitude: null,
            map: null,
            markers: [],
            placesService: null,
            startLatLng: null,
            endLatLng: null,
        };
    },
    mounted() {
        this.getUserLocation();
  
        if (window.kakao && window.kakao.maps) {
            this.initializeMap();
        } else {
            this.loadScript();
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
    },
  };
  </script>
  
  <style scoped>
  .path-view {
    padding: 24px;
    margin-top: 110px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    background: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }
  
  .header h1 {
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }
  
  .back-button {
    position: absolute;
    left: 480px;
    text-decoration: none;
    font-size: 24px;
    color: #007bff;
  }
  
  .input-group {
    position: relative;
    margin-bottom: 20px;
  }
  
  .input-group input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-size: 16px;
  }
  
  .input-group input:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 2px 8px rgba(0, 123, 255, 0.2);
  }
  
  .search-results {
    position: absolute;
    width: 100%;
    background: white;
    border: 1px solid #ddd;
    border-radius: 10px;
    list-style: none;
    padding: 0;
    margin: 50px 0 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 10;
  }
  
  .search-results li {
    padding: 12px;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .search-results li:hover {
    background: #f0f8ff;
  }
  
  .map-container {
    width: 100%;
    height: 450px;
    margin-top: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .address-info {
    margin-top: 20px;
    padding: 15px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  .address-info p {
    margin: 0;
    font-size: 16px;
    color: #555;
  }
  
  .next-button {
    width: 100%;
    padding: 12px;
    background: #007bff;
    color: #fff;
    border: none;
    border-radius: 25px;
    font-size: 18px;
    font-weight: bold;
    margin-top: 20px;
    cursor: pointer;
    transition: background 0.3s;
  }
  
  .next-button:hover {
    background: #0056b3;
  }
  </style>
  