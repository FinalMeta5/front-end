<template>
    <div class="login phone-main-screen">
        <h1 class="titleH1">Login</h1>
        <div class="view-context-contain">
            <div>
                <p>아이디 : <input type="text"/></p>
                <p>비밀번호 : <input type="password"/></p>
                <button>로그인</button>
            </div>
            <hr/>
            <router-link to="/signup">회원가입</router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'LoginView',
    };
</script>

<style scoped>
@import "../style.css";
@import "../assets/style/phone-main-view-common.css";
</style>