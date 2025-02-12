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
              :endAddress="endAddress"/>
            <button @click="makeReservation">예약</button>
            <button>취소</button>
        </div>
        
        <SuccessModal v-if="showSuccessModal" @close="showSuccessModal = false" @confirm="handleCreditDeduction" />
        <FailModal v-if="showFailModal" @close="showFailModal = false" @confirm="handleCreditDeduction" />
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
        };
    },
    created() {
        this.driverId = this.$route.query.driverId;
        this.carShareRegiId = this.$route.query.carShareRegiId;
        this.userId = localStorage.getItem('memberId');

        this.startRoadAddress = this.$route.query.startRoadAddress;
        this.startAddress = this.$route.query.startAddress;
        this.endRoadAddress = this.$route.query.endRoadAddress;
        this.endAddress =  this.$route.query.endAddress;
        this.latitudePl = this.$route.query.latitudePl;
        this.longitudePl = this.$route.query.longitudePl;

        console.log('latitudePl:', this.latitudePl);
        console.log('longitudePl:', this.longitudePl);
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

            if(response.data) {
            this.showFailModal = true;
        }
        }
        }
      } catch (error) {
        alert('예약에 실패했습니다. 콘솔에서 에러를 확인해 주세요.');
      }
    },

    async handleCreditDeduction() {
      const url = `http://localhost:8080/api/carshare/registration/deducted-credit?userId=${this.userId}`;

      try {
        const response = await axios.post(url);

        if(response.data) {
            this.showSuccessModal = true;
        }
        
      } catch (error) {
        console.error("크레딧 차감 요청에서 오류 발생:", error);
        alert('크레딧 차감에 실패했습니다.');
      }
    },

    handleNicknameUpdate(newNickname) {
      this.nickname = newNickname; 
    },
  }
};
</script>

<style scoped>
@import "../../../style.css";
@import "../../../assets/style/phone-main-view-common.css";
</style>