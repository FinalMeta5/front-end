<template>
    <div class="home">
        <h1>Home</h1>
        <p>홈페이지 접속을 환영합니다.</p>
        <router-link to="/about">About 페이지 보기</router-link>
        <router-link to="/mypage">Mypage 보기</router-link>
    </div>
</template>

<script>
    export default {
        name: 'HomeView',
    };
</script>

<style scoped>
    .home{
        text-align: center;
        margin-top: 50px;
    }
</style>