<template>
  <div class="home phone-main-screen">
      <h1 class="titleH1">차량 상세 정보</h1>
      <div class="view-context-contain">
          <DriverInfoComponent 
            :driver-id="driverId" 
            @update-nickname="handleNicknameUpdate"/>
          <CarInfoComponent :driver-id="driverId" :nickname="nickname"/>
          <DrivingInfoComponent 
            :driver-id="driverId" 
            :carShareRegiId="carShareRegiId" 
            :nickname="nickname"
            :startRoadAddress="startRoadAddress"
            :startAddress="startAddress"
            :endRoadAddress="endRoadAddress"
            :endAddress="endAddress"
            :latitudePl="latitudePl"
            :longitudePl="longitudePl"
            :latitudeDs="latitudeDs"
            :longitudeDs="longitudeDs"/>
          <div class="button-container">
              <button @click="makeReservation">예약</button>
              <button @click="cancelReservation">취소</button>
          </div>
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
import DriverInfoComponent from '../../../components/car-share/participant/DriverInfoComponent.vue';
import CarInfoComponent from '../../../components/car-share/participant/CarInfoComponent.vue';
import DrivingInfoComponent from '../../../components/car-share/participant/DrivingInfoComponent.vue';

import SuccessModal from "../../../components/modal/SuccessModal.vue"; 
import FailModal from "../../../components/modal/FailModal.vue"; 

import axios from 'axios';

export default {
  name: 'CarShareDetailInformationView',
  components: {
      DriverInfoComponent,
      CarInfoComponent,
      DrivingInfoComponent,
      SuccessModal,
      FailModal
  },
  data() {
      return {
          driverId: null,          // 운전자 아이디
          carShareRegiId: null,    // 차량 공유 등록 아이디
          userId: null,            // 로그인 사용자 아이디
          showSuccessModal: false,
          showFailModal: false,
          nickname: '',
          modalTitleS: '',            
          modalTextLine1S: '',       
          modalTextLine2S: '',        
          closeS: '',      
          modalTitleF: '',
          modalTextLine1F:'',
          modalTextLine2F: '',
          closeF: '', 
   
      };
  },
  created() {
      console.log("받은 쿼리 : ", this.$route.query);
      this.driverId = this.$route.query.driverId;
      this.carShareRegiId = this.$route.query.carShareRegiId;
      this.userId = localStorage.getItem('memberId');

      this.startRoadAddress = this.$route.query.startRoadAddress;
      this.startAddress = this.$route.query.startAddress;
      this.endRoadAddress = this.$route.query.endRoadAddress;
      this.endAddress =  this.$route.query.endAddress;
      this.latitudePl = this.$route.query.latitudePl;
      this.longitudePl = this.$route.query.longitudePl;
      this.latitudeDs = this.$route.query.latitudeDs;
      this.longitudeDs = this.$route.query.longitudeDs;
  },
  methods: {
    async makeReservation() {
      if (!this.userId) {
        alert("로그인 정보가 없습니다.");
        return;
      }

      const url = `http://localhost:8080/api/carshare/registration/reservation?carShareRegiId=${this.carShareRegiId}&userId=${this.userId}`;

      try {
        const response = await axios.post(url);
        if (response.data) {
            if (response.data === "차량 공유 예약에 성공했습니다.") {
            await this.handleCreditDeduction();
          } else {
            this.modalTitleF = '🚨';
            this.modalTextLine1F = '크레딧이 부족합니다';
            this.modalTextLine2F = '차량 탑승을 위해서는 7 크레딧이 필요합니다';
            this.closeF = '크레딧 구매하기';
            this.showFailModal = true;
          }
    
        }
      } catch (error) {
        alert('예약에 실패했습니다. 콘솔에서 에러를 확인해 주세요.');
      }
    },
    
    handleModalClose() {
      this.showSuccessModal = false;
      this.showFailModal = false;
    },

    async handleCreditDeduction() {
      const url = `http://localhost:8080/api/carshare/registration/deducted-credit?userId=${this.userId}`;

      try {
        const response = await axios.post(url);

        if(response.data) {
            this.modalTitleS = '💡';
            this.modalTextLine1S = '탑승 예약이 완료되었습니다';
            this.modalTextLine2S = '약속 시간에 맞춰 출발지에 도착해주세요';
            this.closeS = '확인';
            this.showSuccessModal = true;
        } else {
          this.modalTitleF = '🚨';
          this.modalTextLine1F = '크레딧이 부족합니다';
          this.modalTextLine2F = '차량 탑승을 위해서는 7 크레딧이 필요합니다';
          this.closeF = '크레딧 구매하기';
          this.showFailModal = true;
        }
        
      } catch (error) {
        console.error("크레딧 차감 요청에서 오류 발생:", error);
        alert('크레딧 차감에 실패했습니다.');
      }
    },

    handleNicknameUpdate(newNickname) {
      this.nickname = newNickname; 
    },

    cancelReservation() {
      this.$router.push('/carshare/map');
    }
  }
};
</script>

<style scoped>
@import "../../../style.css";
@import "../../../assets/style/phone-main-view-common.css";

.button-container {
  display: flex;
  justify-content: space-between;
  width: 90%;
}

.button-container button {
  flex-grow: 1; 
  margin: 0 5px; 
  border: none;
  padding: 10px 20px; 
}
@media (max-width: 600px) {
  .button-container {
  width: 90vw;
}
}
</style>
