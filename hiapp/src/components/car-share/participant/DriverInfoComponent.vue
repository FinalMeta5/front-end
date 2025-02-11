<template>
  <div class="taxi-share-list">
      <div class="max-w-md mx-auto p-4">
        <span id="driver-info">운전자 정보</span>
      <!-- <img id="showDetail" src="https://ifh.cc/g/OaJOh2.png" /> -->
      <div v-if="driverInfo && Object.keys(driverInfo).length > 0">
        <div v-if="driverInfo.imageUrl">
            <img id="driver-img" :src="driverInfo.imageUrl" alt="Driver Image" @click="openImageModal(driverInfo.imageUrl)"/>
        </div>

        <p id="driver-nickname">{{ driverInfo.nickname }}</p>
        <p id="driver-age">만 {{ driverInfo.age }}세 {{ driverInfo.gender === 'M' ? '남자' : driverInfo.gender === 'W' ? '여자' : '정보 없음' }}</p>
        <p>평균 평점 {{ driverRating }}점</p>
        <p id="driver-criminal">범죄기록 인증 {{ driverInfo.criminalStatus == 'N' ? '보류' :  driverInfo.criminalStatus == 'Y' ? '완료 ' : '정보 없음'}}</p>
        <p id="driver-criminal">차량등록 인증 완료</p>
      </div>

      </div>

  </div>
</template>

<script>
import axios from 'axios';
  
  export default {
    name: "DriverInfoComponent",
    props: {
      driverId: String 
    },
    data() {
      return {
        driverInfo: null,     // 드라이버 정보 저장
        driverRating: null,   // 드라이버 평점 정보 저장
        isModalOpen: false,   // 모달 오픈 상태 저장
        modalImageUrl: '',    // 모달에 표시할 이미지 URL 저장
      };
    },
    watch: {
      driverId: {
        immediate: true,
        handler(newDriverId) {
          if (newDriverId) {
            this.fetchDriverInfo(newDriverId);  
            this.fetchDriverRating(newDriverId);
          }
        },
      },
    },
    methods: {
      async fetchDriverInfo(driverId) {
        const url = `http://localhost:8080/api/carshare/registration/driver-information/${driverId}`;
  
        try {
          const response = await axios.get(url);
          this.driverInfo = response.data;  
          console.log(this.driverInfo);
        } catch (error) {
          console.error('Driver information fetch error:', error);
        }
      },
      async fetchDriverRating(driverId) {
        const url = `http://localhost:8080/api/carshare/registration/rating/${driverId}`;

        try {
          const response = await axios.get(url);
          this.driverRating = response.data;  
        } catch (error) {
         console.error('Driver rating fetch error:', error);
        }
      },
    openImageModal(imageUrl) {
      this.modalImageUrl = imageUrl;
      this.isModalOpen = true;
    },
    // 모달 닫기
    closeImageModal() {
      this.isModalOpen = false;
    }
    },
    mounted() {
      if (this.driverId) {
        this.fetchDriverInfo(this.driverId);  // 컴포넌트가 마운트될 때 driverId로 정보 요청
      }
    },
  };
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