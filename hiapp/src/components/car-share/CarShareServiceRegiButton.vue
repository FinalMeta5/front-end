<template>
        <button @click="goToCarShareRegi" class="service-regi-btn">서비스 등록하기</button>

        <!-- ✅ 로그인 모달 -->
        <LoginModalView v-if="showLoginModal" 
            @close="showLoginModal = false"
            @login-success="handleLoginSuccess"
            :redirectPath="redirectPath" />

        <!-- ✅ 에러 모달 (`v-model` 적용) -->
        <ErrorModal v-model:show="showErrorModal" :message="errorMessage" />
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useAuthState } from "../../store/auth/auth";
import LoginModalView from "../../views/LoginModalView.vue";
import ErrorModal from "../../components/error-modal/ErrorModal.vue";
import { nextTick } from "vue";

export default {
    name: "CarShareServiceRegiButton",
    components: {
        LoginModalView,
        ErrorModal,
    },
    setup() {
        const router = useRouter();
        const showLoginModal = ref(false);
        const showErrorModal = ref(false); // ✅ 모달 표시 여부 추가
        const errorMessage = ref(""); // ✅ 에러 메시지 저장 변수 추가
        const pendingAction = ref(null);
        const { isAuthenticated } = useAuthState();
        

        const goToCarShareRegi = async () => {
    if (!isAuthenticated.value) {
        showLoginModal.value = true;
        pendingAction.value = goToCarShareRegi;
        return;
    }

    const memberId = localStorage.getItem("memberId");
    const token = localStorage.getItem("accessToken");

    if (!memberId) {
        errorMessage.value = "🚨 회원 정보를 확인할 수 없습니다. 다시 로그인해주세요.";
        await nextTick();
        showErrorModal.value = true;
        console.log("🚨 showErrorModal 값 (회원 정보 없음):", showErrorModal.value);
        return;
    }

    try {
        console.log(`📡 요청: GET /api/car-registration/verified/${memberId}`);
        const response = await axios.get(`http://localhost:8080/api/car-registration/verified/${memberId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        console.log("✅ 서버 응답 데이터:", response.data);

        if (response.data === true) {
            console.log("🚗 차량 인증 완료 → 서비스 등록 페이지로 이동");
            router.push("/car-share/service/registration/first");
        } else {
            errorMessage.value = "차량 인증이 필요합니다. 먼저 차량 인증을 완료해주세요.";
            await nextTick();
            showErrorModal.value = true;
            console.log("🚨 showErrorModal 값 (차량 미인증):", showErrorModal.value);
        }

    } catch (error) {
        console.error("🚨 API 요청 실패:", error);

        if (error.response) {
            const { status, data } = error.response;
            
            if (status === 404) {
                errorMessage.value = "🚗 등록된 차량 정보가 없습니다. 차량을 먼저 등록해주세요.";
                router.push("/no-car-info");
            } else if (status === 401) {
                errorMessage.value = "🔑 인증이 만료되었습니다. 다시 로그인해주세요.";
                showLoginModal.value = true; // 자동 로그아웃 처리
            } else if (status === 403) {
                errorMessage.value = "🚨 접근 권한이 없습니다.";
            } else {
                errorMessage.value = `🚨 오류 발생: ${data.message || "서버 오류"}`;
            }
        } else {
            errorMessage.value = "🚨 네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.";
        }

        await nextTick();
        showErrorModal.value = true;
        console.log("🚨 showErrorModal 값 (오류 발생):", showErrorModal.value);
    }
};




        // ✅ 로그인 성공 후 저장된 `pendingAction` 실행
        const handleLoginSuccess = () => {
            showLoginModal.value = false;
            if (pendingAction.value) {
                const action = pendingAction.value;
                pendingAction.value = null; // ✅ 실행 후 초기화
                action(); // ✅ 원래 버튼 클릭 동작 다시 실행
            }
        };

        return { goToCarShareRegi, handleLoginSuccess , showLoginModal, showErrorModal, errorMessage };
    },
};
</script>

<style scoped>
@import "../../style.css";
button {
    
}
.service-regi-btn {
    display: inline-block;
  width: 95%;
  height: 30px;
  color: white;
  background-color: #878787;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 8px;
  font-size: 13px;
}
</style>
