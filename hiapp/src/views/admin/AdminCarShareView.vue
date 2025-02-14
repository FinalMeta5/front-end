<template>
    <div class="about phone-main-screen">
        <h1 class="titleH1 mb-2">차량 공유 서비스</h1>
        <div class="view-context-contain">
            <div class="accordion w-75" id="accordionExample">
                <div class="accordion-item" v-for="(carShare, index) in carShareList" :key="index">
                    <h2 class="accordion-header" :id="'heading' + index">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse"
                            :data-bs-target="'#collapse' + index" aria-expanded="true"
                            :aria-controls="'collapse' + index">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="fw-bolder">
                                    <div>
                                        {{ carShare.pickupLoc }}
                                    </div>
                                    <div class="my-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"
                                            fill="currentColor" class="bi bi-arrow-down" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd"
                                                d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1" />
                                        </svg>
                                    </div>
                                    <div>
                                        {{ carShare.destination }}
                                    </div>
                                </div>
                            </div>
                        </button>
                    </h2>
                    <div :id="'collapse' + index" class="accordion-collapse collapse"
                        :aria-labelledby="'heading' + index" data-bs-parent="#accordionExample">
                        <div class="accordion-body text-start">
                            <div>
                                출발 시각:  {{ carShare.pickupDate }}
                            </div>
                            <div>
                                탑승 인원:  {{ carShare.joinCount }} / {{ carShare.passengersNum }}
                            </div>
                            <div>
                                회원 아이디: {{ carShare.memberId }}
                            </div>
                            <div>
                                유형: {{ carShare.category }}
                            </div>
                            <div>
                                생성 날짜:  {{ carShare.createdDate }}
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
    name: 'AdminCarShareView',
    data() {
        return {
            carShareList: [],
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
        this.fetchData('/api/admin/car-share', 'carShareList');
    },
};
</script>

<style scoped>
@import "../../assets/style/phone-main-view-common.css";
</style>