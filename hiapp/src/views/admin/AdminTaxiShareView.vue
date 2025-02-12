<template>
    <div class="about phone-main-screen">
        <h1 class="titleH1 mb-2">택시 공유 서비스</h1>
        <div class="view-context-contain">
            <ul class="list-group list-group-flush w-75">
                <li v-for="(taxiShare, index) in taxiShareList" :key="index" class="list-group-item">
                    <div class="row">
                        <div class="col-1">
                            {{ taxiShare.taxiShareId }}
                        </div>
                        <div class="col-1">
                            {{ taxiShare.memberId }}
                        </div>
                        <div class="col-3">
                            {{ taxiShare.joinCount }} / {{ taxiShare.passengersNum }}
                        </div>
                        <div class="col-4">
                            {{ taxiShare.destination }}
                        </div>
                        <div class="col-3">
                            {{ taxiShare.createdDate }}
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { authAxios } from '../../store/auth/auth';
export default {
    name: 'AdminTaxiShareView',
    data() {
        return {
            taxiShareList: [],
        }
    },
    methods: {
        async fetchData(endpoint, targetProperty) {
            try {
            const response = await authAxios.get(endpoint);
            if (response.data.success) {
                const data = response.data.data;
                this[targetProperty] = data;
            } else {
                throw new Error(response.data.message);
            }
            } catch (error) {
                console.error(`Error fetching data from ${endpoint}:`, error);
            }
        },
    },
    mounted() {
        this.fetchData('/api/admin/taxi-share', 'taxiShareList');
    },
};
</script>

<style scoped>
@import "../../assets/style/phone-main-view-common.css";
</style>