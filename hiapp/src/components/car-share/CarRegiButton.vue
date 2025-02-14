<template>
    <div>
        <button @click="goToCarRegi" class="car-regi-btn">차량 등록하기</button>

        <!-- ✅ 로그인 모달 -->
        <LoginModalView v-if="showLoginModal" 
            @close="showLoginModal = false"
            @login-success="handleLoginSuccess"
            :redirectPath="redirectPath" />
        
        <!-- ✅ 에러 모달 -->
        <ErrorModal v-model:show="showErrorModal" :message="errorMessage" />
    </div>
</template>

<script>
import { ref, nextTick } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useAuthState } from "../../store/auth/auth";
import LoginModalView from "../../views/LoginModalView.vue";
import ErrorModal from "../../components/error-modal/ErrorModal.vue";

export default {
    name: "CarRegiButton",
    components: {
        LoginModalView,
        ErrorModal,
    },
    setup() {
        const router = useRouter();
        const showLoginModal = ref(false);
        const showErrorModal = ref(false);
        const errorMessage = ref("");
        const pendingAction = ref(null);
        const { isAuthenticated } = useAuthState();

        // ✅ 차량 등록 요청 함수
        const goToCarRegi = async () => {
            if (!isAuthenticated.value) {
                showLoginModal.value = true;
                pendingAction.value = goToCarRegi;
                return;
            }

            const memberId = localStorage.getItem("memberId");
            const token = localStorage.getItem("accessToken");

            if (!memberId) {
                errorMessage.value = "🚨 회원 정보를 확인할 수 없습니다. 다시 로그인해주세요.";
                await nextTick();
                showErrorModal.value = true;
                console.log("🚨 모달 상태:", showErrorModal.value, "메시지:", errorMessage.value);
                return;
            }

            try {
                console.log(`📡 요청: GET /api/car-registration/member/${memberId}`);
                const response = await axios.get(`http://localhost:8080/api/car-registration/member/${memberId}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                console.log("✅ 서버 응답 데이터:", response.data);

                // **🚗 이미 등록된 차량이 있는 경우**
                errorMessage.value = "🚗 이미 등록된 차량이 있습니다.";
                await nextTick();
                showErrorModal.value = true;
                console.log("🚨 모달 상태:", showErrorModal.value, "메시지:", errorMessage.value);

            } catch (error) {
                console.error("🚨 서버 응답 오류:", error);

                if (error.response) {
                    const { status, data } = error.response;

                    if (status === 404) {
                        errorMessage.value = "🚗 등록된 차량이 없습니다. 차량을 등록해주세요.";
                        await nextTick();
                        showErrorModal.value = true;
                        console.log("✅ 404 응답: 차량 미등록 → 차량 등록 페이지 이동");
                        router.push("/car-registration");

                    } else if (status === 409) {
                        errorMessage.value = `🚨 이미 등록된 차량이 있습니다. (${data?.message || "충돌 오류"})`;
                        await nextTick();
                        showErrorModal.value = true;

                    } else {
                        errorMessage.value = `🚨 오류 발생: ${data?.message || "서버 오류"} (코드: ${status})`;
                        await nextTick();
                        showErrorModal.value = true;
                    }
                } else {
                    errorMessage.value = "🚨 네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.";
                    await nextTick();
                    showErrorModal.value = true;
                }

                console.log("🚨 모달 상태:", showErrorModal.value, "메시지:", errorMessage.value);
            }
        };

        // ✅ 로그인 성공 후 저장된 `pendingAction` 실행
        const handleLoginSuccess = async () => {
            showLoginModal.value = false;
            if (pendingAction.value) {
                const action = pendingAction.value;
                pendingAction.value = null;

                await nextTick();
                await action();
            }
        };

        return { goToCarRegi, showLoginModal, showErrorModal, errorMessage, handleLoginSuccess };
    },
};
</script>

<style scoped>
.car-regi-btn {
    width: 100%;
    display: block;
    text-align: left;
    padding: 12px;
    background-color: #fff;
    border: 1px solid #eee;
    margin-bottom: 8px;
    cursor: pointer;
    border-radius: 8px;
    font-size: 14px;
}
</style>
