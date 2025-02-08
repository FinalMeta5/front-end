<template>
    <div>
      <button @click="handleClick" class="car-regi-btn">
        차량 등록하기
      </button>

      <!-- ✅ 로그인 모달 -->
      <LoginModalView v-if="showLoginModal" @close="showLoginModal = false" />

      <!-- ✅ 에러 모달 (`v-model` 적용) -->
      <ErrorModal v-model:show="showErrorModal" :message="errorMessage" />
    </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import LoginModalView from "../../views/LoginModalView.vue";
import { useAuthState } from "../../store/auth/auth";
import ErrorModal from "../../components/error-modal/ErrorModal.vue"; // ✅ 에러 모달 import

export default {
    name: "CarRegiButton",
    components: {
        LoginModalView, // ✅ 로그인 모달 등록
        ErrorModal,
    },
    setup() {
        const router = useRouter();
        const showLoginModal = ref(false);
        const showErrorModal = ref(false); // ✅ 모달 표시 여부 추가
        const errorMessage = ref(""); // ✅ 에러 메시지 저장 변수 추가
        const { isAuthenticated } = useAuthState();

        const handleClick = async () => {
            if (!isAuthenticated.value) {
                showLoginModal.value = true;
                return;
            }

            const memberId = localStorage.getItem("memberId");
            const token = localStorage.getItem("accessToken");

            if (!memberId) {
                errorMessage.value = "회원 정보를 확인할 수 없습니다. 다시 로그인해주세요.";
                showErrorModal.value = true;
                return;
            }

            try {
                console.log(`📡 요청: GET /api/car-registration/member/${memberId}`);
                const response = await axios.get(`http://localhost:8080/api/car-registration/member/${memberId}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                console.log("✅ 서버 응답:", response);
                alert("🚗 이미 등록된 차량이 있습니다.");
            
            } catch (error) {
                console.error("🚨 서버 응답 오류:", error);

                if (error.response) {
                    const { status, data } = error.response;

                    if (status === 404) {
                        console.log("✅ 404 응답: 차량 미등록 → 차량 등록 페이지 이동");
                        router.push("/car-registration");
                    } else if (status === 409) { 
                        errorMessage.value = `🚨 이미 등록된 차량이 있습니다. (메시지: ${data.message})`;
                        showErrorModal.value = true;
                    } else {
                        errorMessage.value = `🚨 오류 발생: ${data.message} (코드: ${data.code})`;
                        showErrorModal.value = true;
                    }
                } else {
                    errorMessage.value = "네트워크 오류가 발생했습니다.";
                    showErrorModal.value = true;
                }
            }
        };

        return { handleClick, showLoginModal, showErrorModal, errorMessage };
    },
};
</script>

<style scoped>
.car-regi-btn {
    background-color: #4192ff;
    color: white;
    font-weight: bold;
    font-family: fantasy;
    border-radius: 10px;
    cursor: pointer;
    width: 22rem;
    height: 50px;
}
</style>
