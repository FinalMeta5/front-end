<template>
    <div class="home phone-main-screen">
        <h1 class="titleH1">Home</h1>
        <div class="view-context-contain">
            <p>홈페이지 접속을 환영합니다.</p>
            <router-link to="/carshare/list">지도</router-link>
            <router-link to="/about">About 페이지 보기</router-link>
            <router-link to="/mypage">Mypage 보기</router-link>
            
            <BannerComponent/>
        </div>
    </div>
</template>

<script>
import BannerComponent from '../components/BannerComponent.vue';
    export default {
        name: 'HomeView',
        components: {
            BannerComponent,
        }
    };
</script>

<style scoped>
@import "../style.css";
@import "../assets/style/phone-main-view-common.css";
</style>