<template>
    <div class="car-registration phone-main-screen">
        <h1 class="titleH3">내 차량 공유 서비스</h1>
        <div class="view-context-contain">
            <MyCarShareServiceListForm/>
        </div>
    </div>
</template>

<script>
import MyCarShareServiceListForm from '../../components/car-share/MyCarShareServiceListForm.vue';
    export default {
        name: 'MyCarShareServiceView',
        components: {
            MyCarShareServiceListForm,
        },
    };
</script>

<style scoped>
@import "../../style.css";
@import "../../assets/style/phone-main-view-common.css";

</style>