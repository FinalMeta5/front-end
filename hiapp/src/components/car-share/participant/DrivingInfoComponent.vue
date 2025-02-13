<template>
  <div class="driving-info">
    <div class="max-w-md mx-auto p-4">
      <span id="car-info">차량 정보</span>
      <hr class="divider-top"> 
      <div v-if="drivingInfo && Object.keys(drivingInfo).length > 0">
        <div class="driver-img-wrapper">
          <div id="map"></div>
        </div>
        <h2 id="driver-nickname">{{ nickname }}님의 차량 운행 정보</h2>
        <p>✔ 출발지 : {{ startRoadAddress }}</p>
        <p>✔ 도착지 : {{ endRoadAddress }}</p>
        <p>✔ 출발일 : {{ formattedPickupDate }}</p>
        <p>✔ 총인원 : {{ drivingInfo.passengersNum }}명</p>
        <p>✔ 잔여석 : {{ drivingInfo.leftoverNum }}명</p>
      </div>
      <hr class="divider-bottom"> 
    </div>

    <div v-if="isModalOpen" class="modal-overlay" @click="closeImageModal">
      <div class="modal-content" @click.stop>
        <button class="close-icon" @click="closeImageModal">✖</button>
        <img :src="modalImageUrl" alt="Modal Image" class="modal-image" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "DriverInfoComponent",
  props: {
    driverId: String,
    carShareRegiId: String,
    nickname: String,
    startRoadAddress: String,
    startAddress: String,
    endRoadAddress: String,
    endAddress: String,
    latitudePl: Number,
    longitudePl: Number,
    latitudeDs: Number,
    longitudeDs: Number,
  },
  data() {
    return {
      drivingInfo: null,        
      isModalOpen: false,      
      modalImageUrl: '',  
      map: null,  
      localLatitudePl: this.latitudePl, 
      localLongitudePl: this.longitudePl,
      localLatitudeDs: this.latitudeDs,
      localLongitudeDs: this.longitudeDs   
    };
  },

  watch: {
    driverId: {
      immediate: true,
      handler(newDriverId) {
        if (newDriverId && this.carShareRegiId) {
          this.fetchDrivingInfo(newDriverId, this.carShareRegiId);  
        }
      },
    },
    carShareRegiId: {
      immediate: true,
      handler(newCarShareRegiId) {
        if (this.driverId && newCarShareRegiId) {
          this.fetchDrivingInfo(this.driverId, newCarShareRegiId);  
        }
      },
    },
    latitudePl: {
      handler() {
        this.updateMap(); 
      }
    },
    longitudePl: {
      handler() {
        this.updateMap();  
      }
    },
    latitudeDs: {
      handler() {
        this.updateMap(); 
      }
    },
    longitudeDs: {
      handler() {
        this.updateMap();  
      }
    },
  },
  created() {
    console.log("파라미터 :", this.$route.query);
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
          setTimeout(() => {
          this.initMap();
        }, 800);
        } else {
          setTimeout(() => {
            this.loadKakaoMap();
        }, 800);
          
        }
      },
      (err) => {
        alert("위치를 가져올 수 없습니다 : " + err.message);
      }
    );
  },

  methods: {
    async fetchDrivingInfo(driverId, carShareRegiId) {
      const url = `http://localhost:8080/api/carshare/registration/driving-information`;
      try {
        const response = await axios.get(url, {
          params: {
            memberId: driverId,
            carShareRegiId: carShareRegiId 
          }
        });
        this.drivingInfo = response.data;
        
        if (this.drivingInfo.latitudePl && this.drivingInfo.longitudePl) {
        this.localLatitudePl = this.drivingInfo.latitudePl;
        this.localLongitudePl= this.drivingInfo.longitudePl;
        

        if (this.drivingInfo.latitudeDs && this.drivingInfo.longitudeDs) {
        this.localLatitudeDs = this.drivingInfo.latitudeDs;
        this.localLatitudeDs = this.drivingInfo.longitudeDs;
      }
      this.updateMap();
      }
      } catch (error) {
        console.error('Driver information fetch error:', error);
      }
    },

    // 지도 업데이트 함수
  updateMap() {
    if (this.map) {
      const newCenter = new kakao.maps.LatLng(this.latitude, this.longitude);
      this.map.setCenter(newCenter);
      const bounds = new kakao.maps.LatLngBounds();

      // 출발지 마커 생성
      if (this.drivingInfo.latitudePl && this.drivingInfo.longitudePl) {
        const markerPositionPl = new kakao.maps.LatLng(this.latitude, this.longitude);
        this.markerPl = new kakao.maps.Marker({
          position: markerPositionPl,
          map: this.map,
          title: "출발지"
        });
        bounds.extend(markerPositionPl);
      }

      // 도착지 마커 생성
      if (this.drivingInfo.latitudeDs && this.drivingInfo.longitudeDs) {
        const markerPositionDs = new kakao.maps.LatLng(this.latitudeDs, this.longitudeDs);
        this.markerDs = new kakao.maps.Marker({
          position: markerPositionDs,
          map: this.map,
          title: "도착지"
        });
        bounds.extend(markerPositionDs);
        
      }
      this.map.setBounds(bounds);
    }
  },

    // 카카오 맵 로드 대기 함수 추가
    

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
      
      // a가 null인지 확인 후 스타일을 처리
      if (container) {
        const computedStyle = container.currentStyle || window.getComputedStyle(container);
        if (computedStyle && computedStyle.position === "static") {
          console.log("Map container has a static position");
        }

        const options = {
          center: new kakao.maps.LatLng(this.latitude, this.longitude),  
          level: 2,
        };

        this.map = new kakao.maps.Map(container, options);
      } else {
        console.error("Map container element not found.");
      }
      this.updateMap();
    },
    openImageModal(imageUrl) {
      this.modalImageUrl = imageUrl;
      this.isModalOpen = true;
    },
    closeImageModal() {
      this.isModalOpen = false;
    },
  
  },

  computed: {
    formattedPickupDate() {
      if (!this.drivingInfo || !this.drivingInfo.pickupDate) return "날짜 정보 없음";

      const date = new Date(this.drivingInfo.pickupDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분`;
    }
  }
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 250px; /* 지도 크기 조정 */
}
.driving-info {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

#car-info {
  display: block;
  text-align: left;
  color: #5d5d5d;
  margin-left: 5px;
  font-size: 15px;
  margin-bottom: 10px;
}

.divider-top, .divider-bottom {
  border: none;
  height: 2px;
  background-color: #000000;
  margin: 5px;
}

.divider-top {
  margin-bottom: 25px;
}

.divider-bottom {
  margin-top: 25px;
}

#driver-nickname {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #5d5d5d;
}

.driver-img-wrapper {
  width: 95%;
  height: 250px;
  overflow: hidden; 
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  border: 2px solid #5d5d5d; 
  margin: 0 auto;
  margin-bottom: 30px;
}

.driver-img-placeholder {
  width: 100%;
  height: 3px;
  background-color: #5d5d5d;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #eaeaea;
  font-size: 16px;
  border-radius: 20px;
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

.modal-content img {
  width: 100%;
  height: auto;
}

.close-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  cursor: pointer;
}

p, h2 {
  text-align: left;
  margin-left: 10px;
  margin-bottom: 5px;
  color: #5d5d5d;
}

p {
  font-size: 15px;
}


@media (max-width: 480px) { 
  .driving-info {
    width: 100vw; 
  }

  .driver-img-placeholder {
    font-size: 13px;
  }

  .modal-content {
    width: 80vw;
  }
}
</style>
