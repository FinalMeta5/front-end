<template>
    <div class="about phone-main-screen">
        <h1 class="titleH1 mb-2">인증 신청 내역</h1>
        <div class="view-context-contain">
            <ul class="list-group list-group-flush w-75">
                <li v-for="(registration, index) in registrations" :key="index" class="list-group-item">
                    <div class="d-flex justify-content-between">
                        <div class="align-self-center">
                            <img class="border border-secondary-subtle border-2 rounded" :src=registration.imageUrl alt="car">
                        </div>
                        <div class="text-start">
                            <div class="fs-3 fw-bolder mb-2">
                                {{ registration.name }}
                            </div>
                            <div class="">
                                {{ registration.createdDate }}
                            </div>
                            <div class="">
                                {{ registration.carModel }}
                            </div>
                            <div class="">
                                {{ registration.carNumber }}
                            </div>
                            <div>
                                <a :href=registration.verifiedFile class="link-dark link-underline-opacity-0 d-flex my-1" target="_blank" rel="noopener noreferrer">
                                    <i class="bi bi-download align-self-center"></i>
                                    <p class="mb-0">범죄 조회 동의<br>신청서</p>
                                </a>
                            </div>
                            <div class="d-flex justify-content-around">
                                <button @click="approveRegistraion(registration.carId, registration.memberId)" type="button" class="btn btn-success btn-sm px-3 mx-1">
                                    승인
                                </button>
                                <button @click="requestUpdateRegistration(registration.carId, registration.memberId)" type="button" class="btn btn-danger btn-sm px-3 mx-1">
                                    반려
                                </button>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <SuccessModal 
        v-if="showSuccessModal" 
        @close="handleModalClose"
        :title="modalTitleS" 
        :textLine1="modalTextLine1S" 
        :textLine2="modalTextLine2S"
        :close="closeS" />
    </div>
</template>

<script>
import SuccessModal from '../../components/modal/SuccessModal.vue';
import { authAxios } from '../../store/auth/auth';
export default {
    name: 'AdminRegistrationView',
    data() {
        return {
            registrations: [],
            showSuccessModal: false,
            modalTitleS: '',            
            modalTextLine1S: '',       
            modalTextLine2S: '',        
            closeS: '',
        }
    },
    components: {
        SuccessModal
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
        async approveRegistraion(carId, memberId) {
            await authAxios.put('/api/admin/approve', {
                carId: carId,
                memberId: memberId
            });
            this.fetchData('/api/admin/registrations', 'registrations');
            this.modalTitleS = '성공';
            this.modalTextLine1S = '승인 완료';
            this.modalTextLine2S = '성공적으로 처리되었습니다.';
            this.closeS = '확인';
            this.showSuccessModal = true;
        },
        async requestUpdateRegistration(carId, memberId) {
            await authAxios.post('/api/admin/reqUpdateRegi', {
                carId: carId,
                memberId: memberId
            });
            this.modalTitleS = '성공';
            this.modalTextLine1S = '승인 취소';
            this.modalTextLine2S = '성공적으로 취소되었습니다.';
            this.closeS = '확인';
            this.showSuccessModal = true;
        },
        handleModalClose() {
            this.showSuccessModal = false;
            this.showFailModal = false;
        },
    },
    mounted() {
        this.fetchData('/api/admin/registrations', 'registrations');
    },
};
</script>

<style scoped>
@import "../../assets/style/phone-main-view-common.css";
img {
    width: 130px;
}
</style>