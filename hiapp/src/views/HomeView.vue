<template>
    <div class="home phone-main-screen">
        <h1 class="titleH1">Home</h1>
        <div class="view-context-contain">
            <TodayReservationListComponent/>
            <WeekReservationListComponent/>
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
</style>