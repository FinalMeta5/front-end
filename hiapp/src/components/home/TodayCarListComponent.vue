<template>
  <div class="today-car-container">
    <!-- 로딩 화면 -->
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
    </div>

    <!-- 예약 내역이 없는 경우 -->
    <div v-else-if="todayParticipationList && todayParticipationList.length === 0">
      <div class="message">{{$t('context.noReservationsToday')}}</div>
      <img src="http://ifh.cc/g/KAROcS.png" alt="이미지" class="image" />
      <div class="subtitle">{{$t('context.shareACarService')}}</div>
    </div>

    <!-- 예약 내역이 있는 경우 -->
    <div v-else>
      <div class="message">{{ $t('context.todayReservations') }}</div>
      <div class="detail-info-wrapper">
        <div v-for="item in todayParticipationList" :key="item.carShareRegiId">
          <DetailInfoComponent
            :pickupLoc="item.pickupLoc"
            :destination="item.destination"
            :pickupDate="formatTime(item.pickupDate)"
            :expectedNum="item.expectedNum"
            :state="item.state"
            :carShareJoinId="item.carShareJoinId"
            @click="openModal(item)" 
          />
        </div>
      </div>
    </div>

    <!-- 하단 버튼들 (로딩이 끝난 후) -->
    <div v-if="!isLoading" class="button-container">
      <CarShareServiceRegiButton/>
      <button class="today-button" @click="goToCarShareRegistration2">{{ $t('button.UseService') }}</button>
    </div>

    <!-- 모달 창 (선택된 예약 항목의 탑승 신청/취소 버튼들) -->
    <transition name="modal">
    <div v-if="selectedCar" class="modal-overlay">
    <div class="modal-content">
      <span class="modal-close" @click="closeModal">&times;</span>
      <div class="modal-buttons">
        <div class="ride" @click="updateStateOK(selectedCar.carShareJoinId)">
          <div class="b">
            <img class="moving-image1" src="https://ifh.cc/g/AhHHf8.png" alt="움직이는 이미지">
            <span id="map-btn1">탑승 신청</span>
          </div>
        </div>
        <div class="unride" @click="updateStateNO(selectedCar.carShareJoinId)">
          <div class="b">
            <img class="moving-image2" src="https://ifh.cc/g/1CcglF.png" alt="움직이는 이미지">
            <span id="map-btn2">탑승 취소</span>
          </div>
        </div>
      </div>
    </div>
    </div>
    </transition>
    <SuccessModal 
      v-if="showSuccessModal" 
      @close="handleModalClose"
      :title="modalTitleS" 
      :textLine1="modalTextLine1S" 
      :textLine2="modalTextLine2S"
      :close="closeS" />
    
    <FailModal 
      v-if="showFailModal" 
      @close="handleModalClose"
      :title="modalTitleF" 
      :textLine1="modalTextLine1F" 
      :textLine2="modalTextLine2F"
      :close="closeF" />
  </div>
</template>

<script>
import axios from "axios";
import DetailInfoComponent from "./DetailInfoComponent.vue";
import SuccessModal from "../modal/SuccessModal.vue";  
import FailModal from "../modal/FailModal.vue";  
import CarShareServiceRegiButton from '../car-share/CarShareServiceRegiButton.vue';

export default {
  name: "TodayCarListComponent",
  components: {
    DetailInfoComponent,
    SuccessModal,
    FailModal,
    CarShareServiceRegiButton
  },
  data() {
    return {
      todayParticipationList: null, 
      isLoading: false, // 로딩 상태
      userId: localStorage.getItem("memberId"),
      selectedCar: null, 
      showSuccessModal: false, 
      showFailModal: false, 
      modalTitle: '',            // 모달 제목
      modalTextLine1: '',        // 모달 텍스트 1
      modalTextLine2: '',        // 모달 텍스트 2
      close: '',                 // 버튼 텍스트
    };
  },
  methods: {
    openModal(item) {
      // 항목 클릭 시 모달을 띄움
      this.selectedCar = item;
    },
    closeModal() {
      this.selectedCar = null;
    },
    handleModalClose() {
      this.showSuccessModal = false;
      this.showFailModal = false;
      this.selectedCar = null;
      this.fetchTodayParticipationList();
    },
    async updateStateOK(carShareJoinId) {
    const currentTime = new Date();
    const pickupTime = new Date(this.selectedCar.pickupDate);
    const timeDifference = (pickupTime - currentTime) / (1000 * 60 * 60); // 시간 차이 계산 (분으로 나누고 다시 시간으로 변환)

    if (timeDifference < 1) {
      this.closeModal();
      this.modalTitleF = '🚨';
      this.modalTextLine1F = '탑승 1시간 전까지만 변경이 가능합니다';
      this.modalTextLine2F = '노쇼 시 서비스 이용에 제한이 있을 수 있습니다';
      this.closeF = '확인';
      this.showFailModal = true;
      return;
    }

    this.closeModal();
    try {
      const response = await  authAxios.put(
        `/api/carshare/registration/${carShareJoinId}/state-ok`
      );
      console.log("상태 변경 응답:", response.data);
      if (response.data === 1) {
        this.modalTitleS = '💡';
        this.modalTextLine1S = '탑승 신청이 완료되었습니다';
        this.modalTextLine2S = '약속 시간에 맞춰 출발지에 도착해주세요';
        this.closeS = '확인';
        this.showSuccessModal = true;
      } else {
        this.modalTitleF = '🚨';
        this.modalTextLine1F = '탑승 1시간 전까지만 변경이 가능합니다';
        this.modalTextLine2F = '노쇼 시 서비스 이용에 제한이 있을 수 있습니다';
        this.closeF = '확인';
        this.showFailModal = true;
      }
    } catch (error) {
      console.error("상태 변경 요청에 오류가 발생했습니다:", error);
      this.showFailModal = true;
    }
  },
  async updateStateNO(carShareJoinId) {
    const currentTime = new Date();
    const pickupTime = new Date(this.selectedCar.pickupDate);
    const timeDifference = (pickupTime - currentTime) / (1000 * 60 * 60); // 시간 차이 계산

    if (timeDifference < 1) {
      this.closeModal();
      this.modalTitleF = '🚨';
      this.modalTextLine1F = '탑승 1시간 전까지만 변경이 가능합니다';
      this.modalTextLine2F = '노쇼 시 서비스 이용에 제한이 있을 수 있습니다';
      this.closeF = '확인';
      this.showFailModal = true;
      return;
    }

    // API 호출 등 상태 변경 로직
    this.closeModal();
    try {
      const response = await  authAxios.put(
        `/api/carshare/registration/${carShareJoinId}/state-no`
      );
      console.log("상태 변경 응답:", response.data);
      if (response.data === 1) {
        this.modalTitleS = '💡';
        this.modalTextLine1S = '탑승 취소가 완료되었습니다';
        this.modalTextLine2S = '취소 상태에서는 차량 탑승이 불가능합니다';
        this.closeS = '확인';
        this.showSuccessModal = true;
      } else {
        this.modalTitleF = '🚨';
        this.modalTextLine1F = '탑승 1시간 전까지만 변경이 가능합니다';
        this.modalTextLine2F = '노쇼 시 서비스 이용에 제한이 있을 수 있습니다';
        this.closeF = '확인';
        this.showFailModal = true;
      }
    } catch (error) {
      console.error("상태 변경 요청에 오류가 발생했습니다:", error);
      this.showFailModal = true;
    }
  },
    async fetchTodayParticipationList() {
      this.isLoading = true;
      try {
        const response = await  authAxios.get(
          `/api/carshare/registration/today-list?userId=${this.userId}`
        );
        this.todayParticipationList = Array.isArray(response.data)
          ? response.data
          : [response.data];
        console.log("data : ", this.todayParticipationList);
      } catch (error) {
        console.error("오늘 탑승 내역을 가져오는 데 오류가 발생했습니다:", error);
      } finally {
        this.isLoading = false;
      }
    },
    formatTime(pickupDate) {
      const date = new Date(pickupDate);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    },
    goToCarShareRegistration2() {
      if (this.$router) {
        this.$router.push('/carshare/map');
      } else {
        console.error('Router is not defined');
      }
    },
  },
  mounted() {
    this.fetchTodayParticipationList();
  },
};
</script>

<style scoped>
.detail-info-wrapper {
  max-height: 147px; /* 원하는 최대 높이 */
  overflow-y: auto;
  width: 100%;
}
.b {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.today-car-container {
  text-align: center;
}
.message {
  font-size: 17px;
  margin-bottom: 20px;
  font-weight: bold;
}
.image {
  width: 90px;
  height: auto;
  margin-bottom: 20px;
}
.subtitle {
  font-size: 14px;
  margin-bottom: 20px;
  color: #555;
}
.divider {
  border-top: 1px dashed #878787;
  margin: 20px 0;
}
.action-buttons {
  margin-top: 20px;
}
.button-container2 {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
.ride {
  width: 80%;
  height: 140px;
  /* background-color: #4192FF; */
  border: 2px solid #004AAD;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.unride {
  width: 80%;
  height: 140px;
  /* background-color: #4192FF; */
  border: 2px solid #737373;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.today-button {
  display: inline-block;
  width: 95%;
  height: 30px;
  color: white;
  background-color: #878787;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 8px;
  font-size: 13px;
}
.moving-image1, .moving-image2 {
  transform: rotate(45deg);
}
img {
  width: 20%;
  vertical-align: middle;
}
.image-button {
  width: 100%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.image-button img {
  width: 100%;
  height: 100%;
  border-radius: 10px;
}
#map-btn1, #map-btn2 {
  width: 100%;
  font-size: 18px;
  cursor: pointer;
  text-align: center;
  text-transform: uppercase;
  border: none;
  position: relative;
  margin-bottom: 10px;
}
#map-btn1 {
  color: #004AAD;
}
#map-btn2 {
  color: #737373;
}
.button {
  display: inline-block;
  margin: 10px;
  padding: 15px 30px;
  color: white;
  background-color: #878787;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 280px;
  flex-direction: column;
}
.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
}
.loading-message {
  margin-top: 10px;
  font-size: 18px;
  color: #555;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Modal 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  text-align: center;
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  color: #aaa;
}

.modal-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
  margin: 20px 0; /* 필요에 따라 여백 추가 */
}

.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s;
}
.modal-enter, .modal-leave-to {
  opacity: 0;
}

@media (max-width:380) {
  .modal-content {
    width: 100px;
  }
}
</style>
