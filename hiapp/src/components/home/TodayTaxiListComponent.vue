<template>
  <div class="today-car-container">
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
    </div>

    <div v-else-if="todayParticipationList && todayParticipationList.length === 0">
      <div class="message">오늘은 예약 내역이 없습니다.</div>
      <img src="http://ifh.cc/g/KAROcS.png" alt="이미지" class="image" />
      <div class="subtitle">여러 사람과 함께 차량을 이용해 보세요</div>
    </div>

    <div v-else>
      <div class="message">오늘의 예약 내역</div>
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

    <div v-if="!isLoading" class="button-container">
      <button class="today-button" @click="goToTaxiShareRegistration1">서비스 등록하기</button>
      <button class="today-button" @click="goToTaxiShareRegistration2">서비스 이용하기</button>
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
      isLoading: false, // 로딩 상태 추가
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
    async fetchTodayParticipationList() {
      this.isLoading = true;  // 데이터 로딩 시작
      try {
        const response = await axios.get(
          `http://localhost:8080/api/taxi/join/count/byMemberIdToday?memberId={this.userId}`
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
    goToTaxiShareRegistration1() {
      if (this.$router) {
        this.$router.push('/taxi-share/list');
      } else {
        console.error('Router is not defined');
      }
    },
    goToTaxiShareRegistration2() {
      if (this.$router) {
        this.$router.push('/taxi-share');
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
  max-height: 147px; /* 원하는 최대 높이 설정 */
  overflow-y: auto; /* 내용이 넘칠 경우 스크롤 생성 */
  width: 100%;
}

.b {
  margin-top: 10px;
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
</style>