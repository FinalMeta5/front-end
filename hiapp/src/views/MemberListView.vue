<template>
    <div class="memberList phone-main-screen">
        <h1 class="titleH1">MemberList</h1>
        <div class="view-context-contain">
            <MemberListComponent /> 
        </div>
    </div>
</template>

<script>
import MemberListComponent from '../components/MemberListComponent.vue';
    export default {
        name: 'MemberListView',
        components: {
        MemberListComponent,
        },
    };
</script>

<style scoped>
@import "../style.css";
@import "../assets/style/phone-main-view-common.css";
.memberList {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>