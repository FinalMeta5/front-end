<template>
    <div class="home phone-main-screen">
        <h1 class="titleH1">통계 보기</h1>
        <div class="view-context-contain">
            <div class="components">
                <GenderRatioComponent />
            </div>
            <div class="components">
                <AgeGroupRatioComponent />
            </div>
            <div class="components">
                <MonthlyNewMemberComponent />
            </div>
            <div class="components">
                <MemberRate />
            </div>
        </div>
    </div>
</template>

<script>
import AgeGroupRatioComponent from '../../components/statistics/AgeGroupRatioComponent.vue';
import GenderRatioComponent from '../../components/statistics/GenderRatioComponent.vue';
import MonthlyNewMemberComponent from '../../components/statistics/MonthlyNewMemberComponent.vue';
import MemberRate from '../../components/statistics/MemberRate.vue';

export default {
    name: 'StatisticsView',
    components: {
        GenderRatioComponent,
        AgeGroupRatioComponent,
        MonthlyNewMemberComponent,
        MemberRate,
    },
};
</script>

<style scoped>
@import "../../style.css";
@import "../../assets/style/phone-main-view-common.css";
.components {
    margin-top: 50px;
    width: 80%;
}
</style>