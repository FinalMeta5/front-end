<template>
    <div class="memberList">
        <h1>MemberList</h1>
        <MemberListComponent />
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
    .memberList{
        text-align: center;
        margin-top: 50px;
    }
</style>