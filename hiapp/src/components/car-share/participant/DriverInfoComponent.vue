<template>
  <div class="driver-info">
    <div class="max-w-md mx-auto p-4">
      <span id="driver-info">운전자 정보</span>
      <hr class="divider-top"> 
      <div v-if="driverInfo && Object.keys(driverInfo).length > 0">
        <div class="driver-img-wrapper">
          <img 
            v-if="driverInfo.imageUrl" 
            id="driver-img" 
            :src="driverInfo.imageUrl" 
            alt="Driver Image" 
            @click="openImageModal(driverInfo.imageUrl)" 
          />
          <div v-else class="driver-img-placeholder">
            ✖ &nbsp;&nbsp;등록된 사용자 이미지가 없습니다 &nbsp;&nbsp;✖
          </div>
        </div>
        <h2 id="driver-nickname">{{ driverInfo.nickname }}님의 정보</h2>
        <p id="driver-age">✔ 만 {{ driverInfo.age }}세 {{ driverInfo.gender === 'M' ? '남자' : driverInfo.gender === 'W' ? '여자' : '정보 없음' }}</p>
        <p>✔  평균 평점 {{ driverRating }}점</p>
        <p id="driver-criminal">✔  범죄기록 인증 {{ driverInfo.criminalStatus == 'N' ? '보류' :  driverInfo.criminalStatus == 'Y' ? '완료 ' : '정보 없음' }}</p>
        <p id="driver-criminal">✔  차량등록 인증 완료</p>
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
    driverId: String
  },
  data() {
    return {
      driverInfo: null,
      driverRating: null,
      isModalOpen: false,
      modalImageUrl: '',
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
        this.$emit("update-nickname", this.driverInfo.nickname);
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
    closeImageModal() {
      this.isModalOpen = false;
    }
  },
  mounted() {
    if (this.driverId) {
      this.fetchDriverInfo(this.driverId);
    }
  },
};
</script>

<style scoped>
.driver-info {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
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

.driver-img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover; 
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
  position: relative;
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

#driver-info {
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

p, h2 {
  text-align: left;
  margin-left: 10px;
  margin-bottom: 5px;
  color: #5d5d5d;
}

p {
  font-size: 15px;
}

#driver-nickname {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #5d5d5d;
}

@media (max-width: 480px) { 
  .driver-info {
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
