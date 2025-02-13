<template>
  <button @click="goToCarSearch" class="car-search-btn">차량 조회</button>

  <!-- ✅ 로그인 모달 -->
  <LoginModalView
    v-if="showLoginModal"
    @close="showLoginModal = false"
    @login-success="handleLoginSuccess"
    :redirectPath="redirectPath"
  />
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

export default {
  name: "CarSearchButton",
  components: {
    LoginModalView,
    ErrorModal,
  },
  setup() {
    const router = useRouter();
    const showLoginModal = ref(false);
    const showErrorModal = ref(false); // ✅ 모달 표시 여부 추가
    const errorMessage = ref(""); // ✅ 에러 메시지 저장 변수 추가
    const pendingAction = ref(null); // ✅ 로그인 후 실행할 함수 저장
    const { isAuthenticated } = useAuthState();

    const goToCarSearch = async () => {
      if (!isAuthenticated.value) {
        showLoginModal.value = true;
        pendingAction.value = goToCarSearch;
        return;
      }

      const memberId = localStorage.getItem("memberId");
      const token = localStorage.getItem("accessToken");

      if (!memberId) {
        errorMessage.value =
          "회원 정보를 확인할 수 없습니다. 다시 로그인해주세요.";
        showErrorModal.value = true;
        return;
      }

      try {
        console.log(`📡 요청: GET /api/car-registration/member/${memberId}`);
        const response = await axios.get(
          `http://localhost:8080/api/car-registration/member/${memberId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

            console.log("✅ 서버 응답:", response);
            // ✅ 차량이 등록된 경우 → 차량 조회 페이지로 이동
            router.push({ path: "/my-car-search", query: { mode: "edit" } });

        if (error.response) {
          const { status, data } = error.response;

          if (status === 404) {
            console.log(
              "✅ 404 응답: 차량 미등록 → 차량 정보 없음 페이지로 이동"
            );
            router.push("/no-car-info"); // ✅ 차량이 없는 경우 새 페이지로 이동
          } else {
            errorMessage.value = `🚨 오류 발생: ${data.message} (코드: ${status})`;
            showErrorModal.value = true;
          }
        } else {
          errorMessage.value = "네트워크 오류가 발생했습니다.";
          showErrorModal.value = true;
        }
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

    return {
      goToCarSearch,
      showErrorModal,
      errorMessage,
      handleLoginSuccess,
      showLoginModal,
    };
  },
};
</script>

<style scoped>
.car-search-btn {
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
