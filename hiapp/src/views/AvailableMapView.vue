<template>
    <div class="about phone-main-scree">
      <div class="view-context-contain">
        <div class="kakao-map">
          <div id="map">
            <div class="search-container">
              <img id="searchform" src="https://ifh.cc/g/pQQrAj.png" />
              <input 
                type="text" 
                v-model="query" 
                :placeholder="isFocused ? '장소 또는 주소 검색' : (address ? address.address.region_2depth_name + ' ' + address.address.region_3depth_name : '장소 또는 주소 검색')"
                @input="searchPlaces"
                @focus="clearQuery"
  @blur="isFocused = false"
              />
              <img id="searchicon" src="https://ifh.cc/g/zDdsL2.png" />
            </div>
            <img class="current-location-btn" src="https://ifh.cc/g/TaBa4C.png" @click="moveToCurrentLocation" :style="{ bottom: currentLocationButtonBottom }"/>
            <CarShareInformationComponent v-if="selectedCar" :car="selectedCar"/>
            <div v-if="searchResults.length > 0" class="address-list">
              <ul>
                <li v-for="(result, index) in searchResults" :key="index" @click="selectAddress(result)" class="search-item">
                  {{ result.place_name }} ({{ result.address }})
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import CarShareInformationComponent from '../components/CarShareInformationComponent.vue'
  
  export default {
    name: "KakaoMap",
    components: {
        CarShareInformationComponent,
    },

    data() {
      return {
        map: null,              // 카카오 지도 객체 저장
        latitude: 0,            // 사용자의 현재 위도 저장
        longitude: 0,           // 사용자의 현재 경도 저장
        marker: null,           // 마커 객체 저장
        markerImage: null,      // 마커 이미지 저장
        address: null,          // 주소 정보 저장
        query: '',              // 입력된 검색어
        searchResults: [],      // 검색된 장소 리스트
        carList: [],            // 차량 목록 저장
        searchMarkers: [],      // 검색 마커 저장
        selectedCar: null,      // 선택한 차량 정보 저장
        previousMarker: null,   // 이전에 클릭한 마커 저장
        isFocused: false,       // 검색창 포커스 여부 저장
      };
    },

    computed: {
      currentLocationButtonBottom() {
        return this.selectedCar ? "350px" : "70px"; 
      },
    },

    created() {
      if (!("geolocation" in navigator)) {
        alert("위치 정보를 사용할 수 없습니다.");
        return;
      }
  
      // 사용자의 현재 위도와 경도 추출
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.latitude = pos.coords.latitude;
          this.longitude = pos.coords.longitude;
  
          if (window.kakao && window.kakao.maps) {
            this.initMap();
          } else {
            this.loadKakaoMap();
          }
  
          this.getAddress();
        },
        (err) => {
          alert("위치를 가져올 수 없습니다 : " + err.message);
        }
      );
  
      // 차량 목록 가져오기
      this.fetchCarList();
    },
  
    methods: {
      // 카카오 지도 API를 사용하여 주소 가져오기
      async getAddress() {
        const apiUrl = 'https://dapi.kakao.com/v2/local/geo/coord2address.json';
        const params = {
          x: this.longitude,  
          y: this.latitude,   
          input_coord: 'WGS84',
        };
  
        try {
          const response = await axios.get(apiUrl, {
            params,
            headers: {
              Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_MAP_API_KEY}`, 
            },
          });
          this.address = response.data.documents[0];  
        } catch (error) {
          console.error('주소 정보를 가져오는 중 오류가 발생했습니다.', error);
        }
      },
  
      // 차량 목록 데이터 백엔드에 요청
      async fetchCarList() {
        try {
          const response = await axios.get("http://localhost:8080/api/carshare/registration/available-list");
          if (response.status === 200 && response.data) {
            this.carList = response.data;

            if(!window.kakao || !window.kakao.maps) {
                this.waitForKakaoMap().then(() => {
                    this.carList.forEach(car => {
                        this.createCarMarker(car.latitudePl, car.longitudePl, car);
                    });
                });
            } else {
                this.carList.forEach(car => {
                    this.createCarMarker(car.latitudePl, car.longitudePl, car);
                });
            }
          }
        } catch (error) {
          console.error('탑승 가능한 차량 목록을 가져오는 중 오류가 발생했습니다.', error);
        }
      },

      // 카카오 맵 로드 대기 함수 추가
      waitForKakaoMap() {
        return new Promise(resolve => {
            const checkKakao = setInterval(() => {
                if (window.kakao && window.kakao.maps) {
                    clearInterval(checkKakao);
                    resolve();
                }
            }, 100); 
        });
      },
  
      // 지도 로드
      loadKakaoMap() {
        if (document.getElementById("kakao-map-script")) return;
  
        const script = document.createElement("script");
        script.id = "kakao-map-script";
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${import.meta.env.VITE_KAKAO_MAP_JS_KEY}`;
        script.onload = () => kakao.maps.load(this.initMap);
        document.head.appendChild(script);
      },
  
      // 지도 초기설정
      initMap() {
        // 지도 중복 생성 방지
        if (this.map) return;
  
        const container = document.getElementById("map");                
        const options = {
          center: new kakao.maps.LatLng(this.latitude, this.longitude),  
          level: 2,
        };
  
        this.map = new kakao.maps.Map(container, options);
  
        this.createMarker(); 
      },
  
      // 마커 생성
      createMarker(car) {
        const imageSrc = "https://ifh.cc/g/7NpBWW.png";
        const imageSize = new kakao.maps.Size(50, 50);
        const imageOption = { offset: new kakao.maps.Point(25, 25) };
  
        this.markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
  
        this.marker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(this.latitude, this.longitude),
          image: this.markerImage,
        });
  
        this.marker.setMap(this.map);

        
      },

      // 출발 위치에 마커 추가
      createCarMarker(latitude, longitude, car) {
        const markerImageSrc = "https://ifh.cc/g/1Dp4XS.png";  
        const imageSize = new kakao.maps.Size(60, 80);  
        const imageOption = { offset: new kakao.maps.Point(30, 80) };  

        const markerImage = new kakao.maps.MarkerImage(markerImageSrc, imageSize, imageOption);

        const marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(latitude, longitude), 
            image: markerImage,
        });

        marker.setMap(this.map);  

        // 마커 클릭 시 이미지 변경 + 해당 차량 정보 설정
        kakao.maps.event.addListener(marker, 'click', () => {
            this.selectedCar = car;

            // 이전에 선택한 마커는 다시 원상태로 복귀
            if (this.previousMarker) {
                const originalImageSrc = "https://ifh.cc/g/1Dp4XS.png";
                const imageSize = new kakao.maps.Size(60, 80);  
                const imageOption = { offset: new kakao.maps.Point(30, 80) }; 
                const originalImage = new kakao.maps.MarkerImage(originalImageSrc, imageSize, imageOption);
                this.previousMarker.setImage(originalImage);
            }

            const clickedMarkerImageSrc = "https://ifh.cc/g/aDXoRv.png";  
            const imageSize = new kakao.maps.Size(80, 110);  
            const imageOption = { offset: new kakao.maps.Point(40, 110) };  
            const clickedMarkerImage = new kakao.maps.MarkerImage(clickedMarkerImageSrc, imageSize, imageOption);
            marker.setImage(clickedMarkerImage);  

            this.previousMarker = marker;
        });
      },

      // 검색 화면 초기화
      clearQuery() {
        this.isFocused = true;
        this.query = '';
      },
  
      // 장소 검색
      async searchPlaces() {
        if (!this.query) {
            this.searchResults = [];
            return;
        }
  
        const apiUrl = "https://dapi.kakao.com/v2/local/search/keyword.json";
        const params = {
            query: this.query,
            x: this.longitude,
            y: this.latitude,
        };
  
        try {
            const response = await axios.get(apiUrl, {
            params,
            headers: {
                Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_MAP_API_KEY}`,
            },
        });
  
            const keyword = this.query.trim();
            this.isAddressQuery = /\d{1,3}|\b(로|길|동|구|읍|면|리|시|도)\b/.test(keyword);   // 주소 여부 판단
  
            let results = response.data.documents.map((result) => {
                // displayAddress 기본값 지번 주소로 설정
                let displayAddress = result.address_name;
  
                // 검색어가 도로명 주소일 경우 displayAddress를 도로명 주소로 변경
                if (result.road_address_name && result.road_address_name.includes(keyword)) {
                    displayAddress = result.road_address_name;
                }
            
                return {
                    place_name: result.place_name,
                    address: displayAddress,
                    x: result.x,
                    y: result.y,
                };
            });
  
            // 리스트 중복 출력 방지
            const uniqueAddresses = new Set();
            this.searchResults = results.filter((result) => {
                if (uniqueAddresses.has(result.address)) {
                    return false;
                } else {
                    uniqueAddresses.add(result.address);
                    return true;
                }
            });
        } catch (error) {
            console.error("장소 검색 중 오류가 발생했습니다.", error);
        }
      },
  
      // 검색 후 장소 선택 시 지도 이동
      selectAddress(result) {
        this.query = `${result.place_name} (${result.address})`; 
        this.searchResults = []; 
  
        const lat = result.y;
        const lng = result.x;
  
        this.map.setCenter(new kakao.maps.LatLng(lat, lng)); 
        this.createSearchMarker(lat, lng);
      },
  
      // 검색 위치에 마커 추가
      createSearchMarker(lat, lng) {
        this.searchMarkers.forEach(marker => marker.setMap(null));
        this.searchMarkers = [];

        const imageSrc = "https://ifh.cc/g/Kg5BZx.png";
        const imageSize = new kakao.maps.Size(60, 72);
        const imageOption = { offset: new kakao.maps.Point(30, 72) };
  
        const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
  
        const marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(lat, lng), 
            image: markerImage, 
            map: this.map,
        });
  
        this.searchMarkers.push(marker);
      },

      // 현재 위치로 돌아가기
      moveToCurrentLocation() {
      if (!("geolocation" in navigator)) {
        alert("위치 정보를 사용할 수 없습니다.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.latitude = pos.coords.latitude;
          this.longitude = pos.coords.longitude;

          this.query = '';

          // 지도 중심 이동
          this.map.setCenter(new kakao.maps.LatLng(this.latitude, this.longitude));

          // 기존 마커 삭제 후 새 마커 추가
          if (this.marker) {
            this.marker.setMap(null);
          }
          this.createMarker();
        },
        (err) => {
          alert("현재 위치를 가져올 수 없습니다: " + err.message);
        }
      );
    },
    },
  };
  </script>
  
  <style scoped>
  @import "../style.css";
  @import "../assets/style/phone-main-view-common.css";

  .kakao-map {
    width: 100%;
    height: 100%;
  }
  
  #map {
    width: 100%;
    height: 100vh;
  }
  
  .view-context-contain {
    margin: 0 !important;
    position: relative;
  }
  
  .search-container {
    position: absolute;
    top: 125px;
    z-index: 12;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .result-container {
    position: absolute;
    bottom: 60px;
    z-index: 12;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  #searchform {
    width: 95%;
  }
  
  #searchicon {
    width: 25px;
    position: absolute;
    right: 40px;
  }
  
  input {
    position: absolute;
    width: 75%;
    right: 70px;
    border: none;
    outline: none;
  }
  
  .address-list {
    position: absolute;
    top: 195px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 11;
    width: 93%;
    max-height: 215px;  
    overflow-y: scroll; 
    background-color: white;
    border: 1px solid #d9d9d9;
    box-shadow: 0 5px 5px #878787;
    border-radius: 5px;
    padding: 5px;
    scrollbar-width: auto !important;
    scrollbar-color: initial !important;
}

.address-list::-webkit-scrollbar {
  width: 10px; 
}

.address-list::-webkit-scrollbar-thumb {
  background: rgba(65, 146, 255, 0.3); 
  border-radius: 10px; 
}

.address-list::-webkit-scrollbar-track {
  background: rgba(151, 151, 151, 0.1); 
}
  
.address-list ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
  
.address-list li {
  padding: 10px;
  cursor: pointer;
  font-size: 14px;
}
  
.address-list li:hover {
  background-color: rgba(65, 146, 255, 0.1);
}
  
.search-item {
  border-bottom: 1px solid #d9d9d9; 
}

.search-item:last-child {
  border-bottom: none; 
}

.current-location-btn {
  position: absolute;
  bottom: 360px;
  right: 12px;
  cursor: pointer;
  z-index: 15;
  width: 50px;
}
</style>
  