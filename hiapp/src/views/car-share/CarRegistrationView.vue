<template>
    <div class="car-registration phone-main-screen">
        <h1 class="titleH1">차량 등록 페이지</h1>
        <div class="view-context-contain">
            <p>올바른 차량 정보를 입력해주세요.</p>
            <CarRegiForm/>
        </div>
    </div>
</template>

<script>
import CarRegiForm from '../../components/car-share/CarRegiForm.vue';
    export default {
        name: 'CarRegistrationView',
        components: {
            CarRegiForm,
        },
    };
</script>

<style scoped>
@import "../../style.css";
@import "../../assets/style/phone-main-view-common.css";
</style>