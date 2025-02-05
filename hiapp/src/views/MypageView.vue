<template>
    <div class="mypage phone-main-screen">
        <h1 class="titleH1">Mypage</h1>
        <div class="view-context-contain">
            <p>마이페이지입니다 :)</p>
            <router-link to="/">Home으로 이동</router-link>
            <router-link to="/about">About 페이지 보기</router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'MypageView',
    };
</script>

<style scoped>
@import "../style.css";
@import "../assets/style/phone-main-view-common.css";
</style>