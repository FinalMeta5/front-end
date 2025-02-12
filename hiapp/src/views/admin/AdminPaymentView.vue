<template>
    <div class="about phone-main-screen">
        <h1 class="titleH1 mb-2">결제 관리</h1>
        <div class="view-context-contain">
            <ul class="list-group list-group-flush w-75">
                <li v-for="(payment, index) in paymentList" :key="index" class="list-group-item">
                    <div class="row">
                        <div class="col-1">
                            {{ payment.paymentId }}
                        </div>
                        <div class="col-1">
                            {{ payment.memberId }}
                        </div>
                        <div class="col-3">
                            {{ payment.method }}
                        </div>
                        <div class="col-4">
                            {{ payment.orderId }}
                        </div>
                        <div class="col-3">
                            {{ payment.createdDate }}
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
    name: 'AdminPaymentView',
    data() {
        return {
            paymentList: [],
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
        this.fetchData('/api/admin/payment', 'paymentList');
    },
};
</script>

<style scoped>
@import "../../assets/style/phone-main-view-common.css";
</style>