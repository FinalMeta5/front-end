<template>
    <div class="car-registration phone-main-screen">
        <h1 class="titleH3">차량 등록</h1>
        <div class="view-context-contain">
            <p class="Instructions">등록 후 인증까지 14일 이내 소요됩니다</p>
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
.Instructions {
    border-radius: 10px;
    background-color: rgb(245, 245, 245);
    border: 1px;
    padding: 10px;
    color: rgb(29, 48, 251);
    font-weight: 500;
}
</style>