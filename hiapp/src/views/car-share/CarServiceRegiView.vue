<template>
    <div class="car-registration phone-main-screen">
        <h1 class="titleH1">차량 공유 서비스 </h1>
        <div class="view-context-contain">
            <p>등록할 차량 공유 서비스 내용을 입력해주세요.</p>
            <CarServiceForm/>
        </div>
    </div>
</template>

<script>
import CarServiceForm from '../../components/car-share/CarServiceForm.vue';
    export default {
        name: 'CarServiceRegiView',
        components: {
            CarServiceForm,
        },
    };
</script>

<style scoped>
@import "../../style.css";
@import "../../assets/style/phone-main-view-common.css";
</style>