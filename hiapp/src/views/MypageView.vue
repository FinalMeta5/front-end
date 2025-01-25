<template>
    <div class="mypage">
        <h1>Mypage</h1>
        <p>마이페이지입니다 :)</p>
        <router-link to="/">Home으로 이동</router-link>
        <router-link to="/about">About 페이지 보기</router-link>
    </div>
</template>

<script>
    export default {
        name: 'MypageView',
    };
</script>

<style scoped>
    .mypage{
        text-align: center;
        margin-top: 50px;
    }
</style>