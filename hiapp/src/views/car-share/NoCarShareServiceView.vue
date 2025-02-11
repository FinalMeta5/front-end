<template>
    <div class="login phone-main-screen">
        <div class="view-context-contain mg-t-250">
            <div class="icon-container">
                <!-- ✅ Font Awesome 아이콘 적용 -->
                <font-awesome-icon :icon="faSquareXmark" size="10x" class="car-icon" />
            </div>
            <div class="context2">
                게시한 차량 공유 서비스가 없습니다.
            </div>
            <p class="context3">
                차량 공유 서비스 게시해보세요.
            </p>
            <p class="context4">
                나와 너의 동행 파트너 부르릉
            </p>
            <div class="mg-t-60">
                <CarShareServiceRegiButton/>
            </div>
        </div>    
    </div>
</template>

<script>
import CarRegiButton from '../../components/car-share/CarRegiButton.vue';
import CarShareServiceRegiButton from '../../components/car-share/CarShareServiceRegiButton.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSquareXmark } from '@fortawesome/free-solid-svg-icons';

export default {
    name: 'NoCarShareServiceView',
    components: {
        CarRegiButton,
        FontAwesomeIcon,
        CarShareServiceRegiButton,
    },
    setup() {
        return { faSquareXmark };  // ✅ setup()에서 faSquareXmark 반환
    }
};
</script>

<style scoped>
@import "../../style.css";
@import "../../assets/style/phone-main-view-common.css";

/* 🚗 Font Awesome 아이콘 스타일 */
.car-icon {
    color: gray;
}
</style>
