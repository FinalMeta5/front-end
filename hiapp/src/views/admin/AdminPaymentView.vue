<template>
    <div class="about phone-main-screen">
        <h1 class="titleH1 mb-2">결제 관리</h1>
        <div class="view-context-contain">
            <div class="accordion w-75" id="accordionExample">
                <div class="accordion-item" v-for="(payment, index) in paymentList" :key="index">
                    <h2 class="accordion-header" :id="'heading' + index">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse"
                            :data-bs-target="'#collapse' + index" aria-expanded="true"
                            :aria-controls="'collapse' + index">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="fw-bolder">
                                    <div>
                                        주문 번호: {{ payment.orderId }}
                                    </div>
                                </div>
                            </div>
                        </button>
                    </h2>
                    <div :id="'collapse' + index" class="accordion-collapse collapse"
                        :aria-labelledby="'heading' + index" data-bs-parent="#accordionExample">
                        <div class="accordion-body text-start">
                            <div>
                                금액: {{ payment.price }}
                            </div>
                            <div>
                                회원 아이디: {{ payment.memberId }}
                            </div>
                            <div>
                                생성 날짜: {{ payment.createdDate }}
                            </div>
                            <div>
                                승인 날짜: {{ payment.approvedDate }}
                            </div>
                            <div>
                                결제 방법: {{ payment.method }}
                            </div>
                            <div>
                                결제한 상품: {{ payment.creditId }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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