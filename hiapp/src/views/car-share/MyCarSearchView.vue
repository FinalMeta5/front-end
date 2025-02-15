<template>
    <div class="car-registration phone-main-screen">
        <h1 class="titleH3">내 차량 정보</h1>
        <div class="view-context-contain">
            <CarEditForm/>
        </div>
    </div>
</template>

<script>
import CarEditForm from '../../components/car-share/CarEditForm.vue';
    export default {
        name: 'MyCarSearchView',
        components: {
            CarEditForm,
        },
    };
</script>

<style scoped>
@import "../../style.css";
@import "../../assets/style/phone-main-view-common.css";
</style>