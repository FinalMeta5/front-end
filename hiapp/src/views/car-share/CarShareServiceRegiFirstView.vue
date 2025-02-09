<template>

<div class="mypage phone-main-screen">
        <h1 class="titleH2">차량 공유 경로 등록</h1>
        <div class="view-context-contain2">
          <div class="input-back">
            <!-- 출발지 입력 -->
            <div class="input-group">
              <font-awesome-icon :icon="['fas', 'location-arrow']" class="input-icon"/>
              <input v-model="startLocation" @input="searchPlaces('start')" placeholder="출발지를 입력하세요." />
              <img src="../../assets/images/현위치.png" class="geo-icon" @click="getUserLocation('start')" />
              <ul v-if="startSearchResults.length" class="search-results">
                    <li v-for="(place, index) in startSearchResults.slice(0, 7)" :key="index"
                        @click="selectPlace('start', place)">
                        {{ place.place_name }}({{ place.road_address_name }})
                    </li>
                </ul>
            </div>
            <div class="divider"></div>
            <!-- 도착지 입력 -->
            <div class="input-group">
              <font-awesome-icon :icon="['fas', 'location-dot']" class="input-icon"/>
                <input v-model="endLocation" @input="searchPlaces('end')" placeholder="도착지를 입력하세요." />
                <img src="../../assets/images/현위치.png" class="geo-icon" @click="getUserLocation('end')" />
                <ul v-if="endSearchResults.length" class="search-results">
                    <li v-for="(place, index) in endSearchResults.slice(0, 7)" :key="index"
                        @click="selectPlace('end', place)">
                        {{ place.place_name }}({{ place.road_address_name }})
                    </li>
                </ul>
            </div>
          </div>
          <!-- 카카오 지도 -->
          <div id="mapContainer" ref="mapContainer" class="map-container"></div>
            <!-- 선택된 주소 정보 -->
              <div class="address-info">
                <p>{{ startLocation }}</p>
                <font-awesome-icon :icon="['fas', 'route']" class="farout-icn" />
                <p>{{ endLocation }}</p>
              </div>


      <button class="next-button" @click="nextStep">다음</button>
        </div> 

    </div>
</template>

<script>
export default {
  name: "CarShareServiceRegiFirstView",
  data() {
      return {
          map:null,
          latitude : 0,
          longitude : 0,
          startLocation: "",
          endLocation: "",
          startSearchResults: [],
          endSearchResults: [],
          userLatitude: null,
          userLongitude: null,
          map: null,
          markers: [],
          marker: null,
          address: null,
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
    goBack() {
      this.$router.go(-1);
    },
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

      initMap() {
          if (this.map) return;

          const container = document.getElementById("map");                
          const options = {
            center: new kakao.maps.LatLng(this.latitude, this.longitude),  
            level: 2,
          };

          this.map = new kakao.maps.Map(container, options);
          this.createMarker();
        },

      // 사용자 현재 위치 가져오기
      async getUserLocation(type) {
          if (!navigator.geolocation) {
              alert("위치 정보를 사용할 수 없습니다.");
              return;
          }

          navigator.geolocation.getCurrentPosition(
              async (pos) => {
                const latitude = pos.coords.latitude;
                const longitude = pos.coords.longitude;
                console.log(`현재 위치 : ${latitude}, ${longitude}`)
                
                // 카카오 API 이용해 좌표 -> 주소 
                const address = await this.convertCoordsToAddress(latitude, longitude)
                console.log(`🏠 변환된 주소: ${address}`);

                if (address) {
                  if(type === 'start') {
                    this.startLocation = address;
                    this.startLatLng = new kakao.maps.LatLng(latitude, longitude);
                  } else if (type === 'end') {
                    this.endLocation = address;
                    this.endLatLng = new kakao.maps.LatLng(latitude, longitude);
                  }
                  // 마커 업데이트
                  this.displayMarker(new kakao.maps.LatLng(latitude, longitude));
                }
              },
              (err) => {
            alert("현재 위치를 가져올 수 없습니다: " + err.message);
        }
      );
      },

      // kakao API 로 좌표 -> 주로 변환
      async convertCoordsToAddress(lat, lng) {
            return new Promise((resolve, reject) => {
                const geocoder = new kakao.maps.services.Geocoder();
                const coord = new kakao.maps.LatLng(lat, lng);

                geocoder.coord2Address(lng, lat, (result, status) => {
                    if (status === kakao.maps.services.Status.OK) {
                        const address = result[0].road_address
                            ? result[0].road_address.address_name  // 도로명 주소
                            : result[0].address.address_name;  // 지번 주소
                        resolve(address);
                    } else {
                        reject("주소 변환 실패");
                    }
                });
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
              path: "/car-share/service/registration/second",
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
@import "../../style.css";
@import "../../assets/style/phone-main-view-common.css";
.farout-icn {
  width: 22px;
  height: 22px;;
}

/* 🔹 구분선 */
.divider {
  background: #ccc;
  margin: 5px 0;
}

/* 📍 아이콘 스타일 */
.input-icon {
  width: 30px;
  margin-right: 10px;
}

/* 🎯 위치 아이콘 */
.geo-icon {
  width: 24px;
  margin-left: auto;
  cursor: pointer;
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
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.input-group {
  min-width: 380px;
  max-width: 380px;
  justify-self: center;
  align-items: center;
  background: white;
  padding: 12px;
  border-radius: 8px;
}

.input-group input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.2);
}

/* 🏷 입력창 */
input {
  flex: 1;
  font-size: 16px;
  border: none;
  outline: none;
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
  justify-self: center;
  width: 100%;
  height: 400px;
  margin-top: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.address-info {
  margin-top: 20px;
  display: flex;
  justify-content: space-evenly;
  padding: 15px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.address-info p {
  flex : 1;
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

.input-back {
  background-color: #ccc;
  padding: 5px;
  display: flex;
  flex-direction: column;

}

/* 📌 입력 박스 배경 */
.input-back {
  background-color: #e9e9e9;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 150px;
}
</style>
