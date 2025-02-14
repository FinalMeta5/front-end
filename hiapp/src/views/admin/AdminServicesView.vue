<template>
    <div class="about phone-main-screen">
        <h1 class="titleH1 mb-2">공유 서비스 관리</h1>
        <div class="view-context-contain">
            <ul class="list-group list-group-flush w-75">
                <hr>
                <router-link to="/admin/services/taxi">
                    <li class="list-group-item">
                        <div>
                            <h1 class="fs-1 p-3">택시 공유 서비스</h1>
                        </div>
                    </li>
                </router-link>
                <hr>
                <router-link to="/admin/services/car">
                    <li class="list-group-item">
                        <div>
                            <h1 class="fs-1 p-3">차량 공유 서비스</h1>
                        </div>
                    </li>
                </router-link>
                <hr>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AdminServicesView',
};
</script>

<style scoped>
@import "../../style.css";
@import "../../assets/style/phone-main-view-common.css";
</style>