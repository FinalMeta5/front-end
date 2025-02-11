<template>
  <div class="path-view">
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
        <div class="final-loca"><img class="loca-mark" src="../../assets/images/출발마크.png"><p class="final-addr">{{ startAddress ? ` ${startAddress}` : '' }}</p></div>
        <div class="final-loca"><img class="loca-mark" src="../../assets/images/도착마크.png"><p class="final-addr">{{ endAddress ? ` ${endAddress}` : '' }}</p></div>
      </div>

      <button class="next-button" @click="nextStep">다음</button>
  </div>
</template>

<script>
export default {
  name: "CarShareServiceRegiFirstView",
  data() {
      return {
          startLocation: "", // 출발지
          endLocation: "", // 도착지
          startSearchResults: [],
          endSearchResults: [],
          userLatitude: null, // 사용자 위도
          userLongitude: null, // 사용자 경도
          userAddress: "", // 사용자 주소
          map: null, 
          geocoder: null,
          markers: [],
          placesService: null,
          startLatLng: null, // 출발지 위도
          endLatLng: null, // 도착지 위도
          startAddress: "",
          endAddress: "",
          startSido: "",
          startSigungu: "",
          startRodName: ""
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
              level: 2,
          });

          this.placesService = new kakao.maps.services.Places();
          this.geocoder = new kakao.maps.services.Geocoder();
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

          const coord = new kakao.maps.LatLng(this.userLatitude, this.userLongitude);

          this.geocoder.coord2Address(coord.getLng(), coord.getLat(), (result, status) => {
              if (status === kakao.maps.services.Status.OK && result[0]) {
                  const address = result[0].road_address?.address_name || result[0].address.address_name;

                  // 입력 필드에 즉시 반영
                  if (type === "start") {
                      this.startLocation = address;
                      this.startAddress = address;
                      console.log(coord);
                      this.startLatLng = coord;
                      this.startRoadName = result[0].road_address?.road_name || ""; // ✅ 도로명 저장
                      this.searchPlacesByAddress("start", address);
                  } else {
                      this.endLocation = address;
                      this.endAddress = address;
                      this.endLatLng = coord;
                      this.endRoadName = result[0].road_address?.road_name || "";
                      this.searchPlacesByAddress("end", address);
                  }

                  // 지도 위치 이동 및 마커 표시
                  const position = new kakao.maps.LatLng(this.userLatitude, this.userLongitude);
                  this.displayMarker(position);
              } else {
                  console.error("주소를 가져올 수 없습니다.");
              }
          });
                // ✅ 2. 시도/시군구 변환
              this.geocoder.coord2RegionCode(coord.getLng(), coord.getLat(), (result, status) => {
                if (status === kakao.maps.services.Status.OK && result.length > 0) {
                  if (type === "start") {
                    this.startSido = result[0].region_1depth_name; // ✅ 시도 저장
                    this.startSigungu = result[0].region_2depth_name; // ✅ 시군구 저장
                  } else {
                    this.endSido = result[0].region_1depth_name;
                    this.endSigungu = result[0].region_2depth_name;
                  }
                }
              });
              
            },
            searchPlacesByAddress(type, address) {
    if (!address) return;

      this.placesService.keywordSearch(address, (data, status) => {
              if (status === kakao.maps.services.Status.OK && data.length > 0) {
                  // 🔹 검색된 첫 번째 장소명을 사용
                  this[`${type}Location`] = data[0].place_name;
              } else {
                  console.warn("📌 해당 주소로 장소명을 찾을 수 없음:", address);
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
          this[`${type}Address`] = place.road_address_name || place.address_name;
          const position = new kakao.maps.LatLng(place.y, place.x);
          this.displayMarker(position);
        // ✅ 선택한 장소의 상세 주소 (도로명, 시도, 시군구 가져오기)
        this.geocoder.coord2Address(place.x, place.y, (result, status) => {
            if (status === kakao.maps.services.Status.OK && result[0]) {
                this[`${type}RoadName`] = result[0].road_address?.road_name || "";
            }
        });

        this.geocoder.coord2RegionCode(place.x, place.y, (result, status) => {
            if (status === kakao.maps.services.Status.OK && result.length > 0) {
                this[`${type}Sido`] = result[0].region_1depth_name;
                this[`${type}Sigungu`] = result[0].region_2depth_name;
            }
        });
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
            path: "/car-share/service/registration/second",
            query: {
                startLocation: this.startLocation,
                endLocation: this.endLocation,
                startLat: this.startLatLng?.getLat(),
                startLng: this.startLatLng?.getLng(),
                endLat: this.endLatLng?.getLat(),
                endLng: this.endLatLng?.getLng(),
                startSido: this.startSido,
                startSigungu: this.startSigungu,
                startRoadName: this.startRoadName,
                endSido: this.endSido,
                endSigungu: this.endSigungu,
                endRoadName: this.endRoadName
            }
        });
      },
  },
};
</script>

<style scoped>
.final-loca{
  display: flex;
  justify-content: space-between;
  padding: 2px;
}

.final-addr{
  font-weight: bold;
  font-size: 0.1rem;
}

.loca-mark{
  width: 30px;
  height: 40px;
}
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
  /* 상대 위치 지정 (search-results 위치 조정용) */
  margin-bottom: 15px;
  background: #f3f3f3;
  border-radius: 10px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.input-group input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 10px;
  font-size: 16px;
  outline: none;
  color: #333;
}

.input-group input::placeholder {
  color: #aaa;
}

.input-group .icon {
  font-size: 18px;
  color: #777;
}

.input-group .search-icon {
  margin-left: auto;
  cursor: pointer;
  font-size: 18px;
  color: #777;
  transition: color 0.3s;
}

.input-group .search-icon:hover {
  color: #333;
}

.search-results {
  position: absolute;
  top: 100%;
  /* input-group 바로 아래 배치 */
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  list-style: none;
  padding: 0;
  margin: 5px 0 0;
  /* 입력창과 간격 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.search-results li {
  padding: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.search-results li:hover {
  background: #f0f8ff;
}

.search-icon img {
  width: 24px;
  /* 원하는 크기로 조정 */
  height: 24px;
  cursor: pointer;
  /* 클릭 가능하게 설정 */
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
