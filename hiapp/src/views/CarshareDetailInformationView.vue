<template>
    <div class="home phone-main-screen">
        <h1 class="titleH1">차량 상세 정보</h1>
        <div class="view-context-contain">
            <DriverInfoComponent :driver-id="driverId"/>
            <CarInfoComponent :driver-id="driverId"/>
            <DrivingInfoComponent :driver-id="driverId" :carShareRegiId="carShareRegiId"/>
            <button>예 약 꼬</button>
            <button>취 소 꼬옥</button>
        </div>
    </div>
</template>

<script>
import DriverInfoComponent from '../components/car-share/participant/DriverInfoComponent.vue';
import CarInfoComponent from '../components/car-share/participant/CarInfoComponent.vue';
import DrivingInfoComponent from '../components/car-share/participant/DrivingInfoComponent.vue';

export default {
    name: 'HomeView',
    components: {
        DriverInfoComponent,
        CarInfoComponent,
        DrivingInfoComponent
    },
    data() {
        return {
            driverId: null,
            carShareRegiId: null,
        };
    },
    created() {
        this.driverId = this.$route.query.driverId;
        this.carShareRegiId = this.$route.query.carShareRegiId;
    }
};
</script>

<style scoped>
@import "../style.css";
@import "../assets/style/phone-main-view-common.css";
</style>