<template>
    <div class="home phone-main-screen">
        <h1 class="titleH1">Home</h1>
        <div class="view-context-contain">
            <p>홈페이지 접속을 환영합니다.</p>
            <router-link to="/about">About 페이지 보기</router-link>
            <router-link to="/mypage">Mypage 보기</router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'HomeView',
    };
</script>

<style scoped>
@import "../style.css";
@import "../assets/style/phone-main-view-common.css";
</style>