<template>
  <div class="today-car-container">
    <div v-if="!todayParticipationList">
      <div class="message">오늘은 예약이 없습니다.</div>
      <img src="https://ifh.cc/g/KAROcS.png" alt="이미지" class="image" />
      <div class="title">차량 경로 등록</div>
      <div class="subtitle">여러 사람과 함께 차량을 이용해 보세요</div>
      <button class="button">운전자로 이용하기</button>
      <button class="button">탑승자로 이용하기</button>
    </div>

    <div v-else>
      <div class="message">오늘의 예약 내역</div>
      <hr class="divider"> 
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

        <div v-if="selectedCar && selectedCar.carShareJoinId === item.carShareJoinId" class="action-buttons">
          <div class="button-container2">
            <div class="ride" @click="updateStateOK(item.carShareJoinId)">
              <div class="b">
                <img class="moving-image1" src="https://ifh.cc/g/4DpadZ.png" alt="움직이는 이미지">
              <span id="map-btn">
                탑승 신청
              </span>
              </div>
            </div>

            <div class="unride" @click="updateStateNO(item.carShareJoinId)">
              <div class="b">
                <img class="moving-image2" src="https://ifh.cc/g/p1xNCK.png" alt="움직이는 이미지">
              <span id="map-btn">
                탑승 취소
              </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button class="button">운전자로 이용하기</button>
      <button class="button">탑승자로 이용하기</button>
      <hr class="divider"> 
    </div>

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

export default {
  name: "TodayCarListComponent",
  components: {
    DetailInfoComponent,
    SuccessModal,
    FailModal,
  },
  data() {
    return {
      todayParticipationList: null, 
      userId: localStorage.getItem("memberId"),
      selectedCar: null, 
      showSuccessModal: false, 
      showFailModal: false, 
      modalTitle: '',            // 모달에 전달할 제목
      modalTextLine1: '',        // 모달에 전달할 텍스트 1
      modalTextLine2: '',        // 모달에 전달할 텍스트 2
      close: '',                 // 버튼 텍스트
    };
  },
  methods: {
    openModal(item) {
      if (this.selectedCar && this.selectedCar.carShareJoinId === item.carShareJoinId) {
        this.selectedCar = null;
      } else {
        this.selectedCar = item;
      }
    },
    handleModalClose() {
      this.showSuccessModal = false;
      this.showFailModal = false;
      this.selectedCar = null;
      this.fetchTodayParticipationList(); 
    },
    async updateStateOK(carShareJoinId) {
      try {
        const response = await axios.put(
        `http://localhost:8080/api/carshare/registration/${carShareJoinId}/state-ok`
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
      try {
        const response = await axios.put(
          `http://localhost:8080/api/carshare/registration/${carShareJoinId}/state-no`
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
      try {
        const response = await axios.get(
          `http://localhost:8080/api/carshare/registration/today-list?userId=${this.userId}`
        );
        this.todayParticipationList = Array.isArray(response.data)
          ? response.data
          : [response.data];
        console.log("data : ", this.todayParticipationList);
      } catch (error) {
        console.error("오늘 탑승 내역을 가져오는 데 오류가 발생했습니다:", error);
      }
    },
    formatTime(pickupDate) {
      const date = new Date(pickupDate); 
      const hours = date.getHours().toString().padStart(2, '0'); 
      const minutes = date.getMinutes().toString().padStart(2, '0'); 
      return `${hours}:${minutes}`; 
    },
  },
  mounted() {
    this.fetchTodayParticipationList();
  },
};
</script>

<style scoped>
.b {
  margin-top: 10px;
}

.today-car-container {
  text-align: center;
}

.message {
  font-size: 18px;
  margin-bottom: 20px;
}

.image {
  width: 100px;
  height: auto;
  margin-bottom: 20px;
}

.title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 16px;
  margin-bottom: 30px;
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
    height: 50px;
    background-color: #4192FF;
    border: 1px solid #4192FF;
    border-radius: 10px;
    flex-direction: row; 
    justify-content: center;
   align-items: center; 
}

.unride {
    width: 80%;
    height: 50px;
    background-color: #4192FF;
    border: 1px solid #4192FF;
    border-radius: 10px;
    flex-direction: row; 
    justify-content: center; 
    align-items: center; 
} 

img {
  width: 20%;
  vertical-align: middle;
}

button {
    padding: 10px;
    border: 2px solid #4192FF;
    color: white;
    font-size: 16px;
    border-radius: 10px;
    cursor: pointer;
    text-align: center;
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

#map-btn {
    width: 100%;
    color: #ffffff;
    font-size: 18px;
    cursor: pointer;
    text-align: center;
    text-transform: uppercase;
    background-color: #4192FF;
    border: none;
    position: relative; 
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

</style>