<template>
    <div class="login">
        <h1>Login</h1>
        <div>
            <p>아이디 : <input type="text"/></p>
            <p>비밀번호 : <input type="password"/></p>
            <button>로그인</button>
        </div>
        <hr/>
        <router-link to="/signup">회원가입</router-link>
    </div>
</template>

<script>
    export default {
        name: 'LoginView',
    };
</script>

<style scoped>
    .login{
        text-align: center;
        margin-top: 50px;
    }
</style>