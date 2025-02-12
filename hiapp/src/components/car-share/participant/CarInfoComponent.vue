<template>
  <div class="car-info">
    <div class="max-w-md mx-auto p-4">
      <span id="car-info">차량 정보</span>
      <hr class="divider-top"> 
      <div v-if="carInfo && Object.keys(carInfo).length > 0">
        <div class="driver-img-wrapper">
          <img 
            v-if="carInfo.imageUrl" 
            id="car-img" 
            :src="carInfo.imageUrl" 
            alt="Car Image" 
            @click="openImageModal(carInfo.imageUrl)"
          />
          <div v-else class="driver-img-placeholder">
            ✖ &nbsp;&nbsp;등록된 차량 이미지가 없습니다 &nbsp;&nbsp;✖
          </div>
        </div>
        <h2 id="driver-nickname">{{ nickname }}님의 차량 정보</h2>
        <p id="car-model">✔ 차량 모델 : {{ carInfo.carModel }}</p>
        <p id="car-number">✔ 차량 번호 : {{ carInfo.carNumber }}</p>
        <p id="car-color">✔ 차량 색상 : {{ carInfo.color }}</p>
        <p id="car-description">✔ 차량 설명 : {{ carInfo.carDescription }}</p>
      </div>
      <hr class="divider-bottom"> 
    </div>

    <!-- 모달 오버레이 및 콘텐츠 -->
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
  name: "CarInfoComponent",
  props: {
    driverId: String, 
    nickname: String
  },
  data() {
    return {
      carInfo: null,        // 차량 정보 저장
      isModalOpen: false,   // 모달 오픈 상태 저장
      modalImageUrl: '',    // 모달에 표시할 이미지 URL 저장
    };
  },
  watch: {
    driverId: {
      immediate: true,
      handler(newDriverId) {
        if (newDriverId) {
          this.fetchCarInfo(newDriverId);  
        }
      },
    },
  },
  methods: {
    async fetchCarInfo(driverId) {
      const url = `http://localhost:8080/api/carshare/registration/car-information/${driverId}`;
  
      try {
        const response = await axios.get(url);
        this.carInfo = response.data;  
      } catch (error) {
        console.error('Car information fetch error:', error);
      }
    },
    openImageModal(imageUrl) {
      this.modalImageUrl = imageUrl;
      this.isModalOpen = true;
    },
    closeImageModal() {
      this.isModalOpen = false;
    }
  },
  mounted() {
    if (this.driverId) {
      this.fetchCarInfo(this.driverId);  
    }
  },
};
</script>

<style scoped>
.car-info {
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

.driver-img-wrapper {
  width: 95%;
  height: 150px;
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
  height: 250px;
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
  width: 350px;
}

.modal-image {
  width: 100%;
  max-height: 500px;
  object-fit: contain;
}

.close-icon {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  color: #878787;
  cursor: pointer;
}

.close-icon:hover {
  color: #878787;
}

#driver-nickname {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #5d5d5d;
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
  .car-info {
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
