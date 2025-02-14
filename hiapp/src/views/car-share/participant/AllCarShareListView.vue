<template>
    <div class="home phone-main-screen">
        <AllCarListComponent/>
    </div>
</template>
<script>
import AllCarListComponent from '../../../components/car-share/participant/AllCarListComponent.vue';
export default {
    components: {
        AllCarListComponent,
    }
}
</script>
<style scoped>
@import "../../../style.css";
@import "../../../assets/style/phone-main-view-common.css";


</style>
