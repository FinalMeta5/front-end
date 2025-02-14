<template>
    <div class="login phone-main-screen">
        <div class="view-context-contain mg-t-250">
            <div class="icon-container">
                <!-- ✅ Font Awesome 아이콘 적용 -->
                <font-awesome-icon :icon="faSquareXmark" size="10x" class="car-icon" />
            </div>
            <div class="context2">
                등록된 차량이 존재하지 않습니다
            </div>
            <p class="context3">
                차량을 등록하고 드라이버로 활동해보세요
            </p>
            <p class="context4">
                드라이버에게는 활동에 따른 크레딧이 제공됩니다.
            </p>
            <div class="mg-t-60">
                <CarRegiButton/>
            </div>
        </div>    
    </div>
</template>

<script>
import CarRegiButton from '../../components/car-share/CarRegiButton.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSquareXmark } from '@fortawesome/free-solid-svg-icons';

export default {
    name: 'NoCarInfoView',
    components: {
        CarRegiButton,
        FontAwesomeIcon,
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
