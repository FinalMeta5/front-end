<template>
    <div class="about">
        <h1>About</h1>
        <p>홈페이지에 대해서 ...</p>
        <router-link to="/">Home으로 이동</router-link>
        <router-link to="/mypage">Mypage 보기</router-link>
    </div>
</template>

<script>
    export default {
        name: 'AboutView',
    };
</script>

<style scoped>
    .about{
        text-align: center;
        margin-top: 50px;
    }
</style>