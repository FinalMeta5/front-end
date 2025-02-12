<template>
    <div class="about phone-main-screen">
        <h1 class="titleH1">{{ $t('about') }}</h1>
        <div class="view-context-contain">
            <p>홈페이지에 대해서 ...</p>
            <router-link to="/">Home으로 이동</router-link>
            <router-link to="/mypage">Mypage 보기</router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AboutView',
};
</script>

<style scoped>
@import "../style.css";
@import "../assets/style/phone-main-view-common.css";
</style>
