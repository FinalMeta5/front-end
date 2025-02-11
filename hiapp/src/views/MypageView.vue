<template>
    <div class="mypage phone-main-screen">
        <h1 class="titleH1">Mypage</h1>
        <div class="view-context-contain">
            <p>마이페이지입니다 :)</p>
            <router-link to="/">Home으로 이동</router-link>
            <router-link to="/about">About 페이지 보기</router-link>
            <CarRegiButton/>
            <CarSearchButton/>
            <CarShareServiceRegiButton/>
            <MyCarShareSearchButton/>
        </div>
    </div>
</template>

<script>
import CarRegiButton from '../components/car-share/CarRegiButton.vue';
import CarSearchButton from '../components/car-share/CarSearchButton.vue';
import CarShareServiceRegiButton from '../components/car-share/CarShareServiceRegiButton.vue';
import MyCarShareSearchButton from '../components/car-share/MyCarShareSearchButton.vue';
    export default {
        name: 'MypageView',
        components: {
            CarRegiButton,
            CarSearchButton,
            CarShareServiceRegiButton,
            MyCarShareSearchButton,
        },
    };
</script>

<style scoped>
@import "../style.css";
@import "../assets/style/phone-main-view-common.css";
</style>