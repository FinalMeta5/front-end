<template>
    <div class="home phone-main-screen">
        <div class="view-context-contain">
            <TodayReservationListComponent/><br>
            <!-- <WeekReservationListComponent/> -->
            <BannerComponent/>
        </div>
    </div>
</template>

<script>
import BannerComponent from '../components/BannerComponent.vue';
import TodayReservationListComponent from '../components/home/TodayReservationListComponent.vue';
import WeekReservationListComponent from '../components/home/WeekReservationListComponent.vue';
    export default {
        name: 'HomeView',
        components: {
            BannerComponent,
            TodayReservationListComponent,
            WeekReservationListComponent
        }
    };
</script>

<style scoped>
@import "../style.css";
@import "../assets/style/phone-main-view-common.css";

.today-reservation-container {
    margin-top: 220px;
}
</style>