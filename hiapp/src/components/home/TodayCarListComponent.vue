<template>
  <div class="today-car-container">
    <!-- 오늘 탑승 내역이 없을 때 -->
    <div v-if="!todayParticipationList">
      <div class="message">오늘은 예약이 없습니다.</div>
      <img src="https://ifh.cc/g/KAROcS.png" alt="이미지" class="image" />
      <div class="title">차량 경로 등록</div>
      <div class="subtitle">여러 사람과 함께 차량을 이용해 보세요</div>
      <button class="button" @click="hostAction">운전자로 이용하기</button>
      <button class="button" @click="guestAction">탑승자로 이용하기</button>
    </div>

    <!-- 오늘 탑승 내역이 있을 때 -->
    <div v-else>
      <div v-for="item in todayParticipationList" :key="item.carShareRegiId">
        <div class="message">오늘 탑승 예정:</div>
        <DetailInfoComponent
          :pickupLoc="item.pickupLoc"
          :destination="item.destination"
          :pickupDate="item.pickupDate"
          :expectedNum="item.expectedNum"
          @click="openModal(item)"
        />
      </div>
    </div>

    <!-- 모달창 -->
    <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3>탑승 여부 선택</h3>
        <p>이 차량을 이용하시겠습니까?</p>
        <button class="confirm-btn" @click="selectOption(true)">탄다</button>
        <button class="cancel-btn" @click="selectOption(false)">안 탄다</button>
        <button class="close-btn" @click="closeModal">닫기</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import DetailInfoComponent from "./DetailInfoComponent.vue";

export default {
  name: "TodayCarListComponent",
  components: {
    DetailInfoComponent,
  },
  data() {
    return {
      todayParticipationList: null, // 오늘 차량 탑승 예약 내역 저장
      userId: localStorage.getItem("memberId"),
      isModalOpen: false, // 모달창 상태
      selectedCar: null, // 선택된 차량 정보 저장
    };
  },
  methods: {
    hostAction() {
      console.log("호스트로 이용하기");
    },
    guestAction() {
      console.log("게스트로 이용하기");
    },
    openModal(item) {
      this.selectedCar = item;
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
      this.selectedCar = null;
    },
    selectOption(isRiding) {
      if (isRiding) {
        console.log("🚗 탄다 선택:", this.selectedCar);
      } else {
        console.log("🚗 안 탄다 선택:", this.selectedCar);
      }
      this.closeModal();
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
  },
  mounted() {
    this.fetchTodayParticipationList();
  },
};
</script>

<style scoped>
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

.button:hover {
  background-color: #6b6b6b;
}

/* 모달창 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.modal-content h3 {
  margin-bottom: 10px;
}

.confirm-btn {
  background: #4caf50;
  color: white;
  padding: 10px 20px;
  margin: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-btn {
  background: #f44336;
  color: white;
  padding: 10px 20px;
  margin: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.close-btn {
  background: #aaa;
  color: white;
  padding: 5px 15px;
  margin-top: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
