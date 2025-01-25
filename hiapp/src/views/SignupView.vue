<template>
    <div class="signup">
        <h1>Sign up</h1>
        <div>
            <p>이름 : <input type="text"/></p>
            <p>이메일 : <input type="text"/></p>
            <p>비밀번호 : <input type="password"/></p>
            <p>비밀번호 확인: <input type="password"/></p>
            <p>연락처: <input type="text"/></p>
            <p>주소: <input type="text"/></p>
            <button>가입하기</button>
        </div>
        <hr/>
        <router-link to="/login">로그인</router-link>
    </div>
</template>

<script>
    export default {
        name: 'SignupView',
    };
</script>

<style scoped>
    .signup{
        text-align: center;
        margin-top: 50px;
    }
</style>