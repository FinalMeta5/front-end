<template>
  <div>
    <button @click="goToCarRegi" class="car-regi-btn">
      내 차량 공유 서비스 조회
    </button>

    <!-- ✅ 로그인 모달 -->
    <LoginModalView
      v-if="showLoginModal"
      @close="showLoginModal = false"
      @login-success="handleLoginSuccess"
      :redirectPath="redirectPath"
    />

    <!-- ✅ 에러 모달 -->
    <ErrorModal v-model:show="showErrorModal" :message="errorMessage" />
  </div>
</template>

<script>
import { ref, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useAuthState } from "../../store/auth/auth";
import LoginModalView from "../../views/LoginModalView.vue";
import ErrorModal from "../../components/error-modal/ErrorModal.vue";

export default {
  name: "MyCarShareSearchButton",
  components: {
    LoginModalView,
    ErrorModal,
  },
  setup() {
    const router = useRouter();
    const showLoginModal = ref(false);
    const showErrorModal = ref(false);
    const errorMessage = ref("");
    const redirectPath = ref(""); // ✅ 로그인 후 이동할 경로 저장
    const { isAuthenticated } = useAuthState();

    // ✅ 차량 공유 서비스 리스트 페이지로 이동 함수
    const goToCarRegi = async () => {
      if (!isAuthenticated.value) {
        console.log("🚨 로그인 필요! 로그인 모달 표시");
        showLoginModal.value = true;
        redirectPath.value = "/my-car-share-service/list"; // 🔥 로그인 후 이동할 경로 설정
        return;
      }

      console.log("✅ 로그인 상태 확인 완료. 페이지 이동...");
      router.push("/my-car-share-service/list"); // 🚀 페이지 이동
    };

    // ✅ 로그인 성공 후 저장된 `redirectPath`로 이동
    const handleLoginSuccess = async () => {
      showLoginModal.value = false;
      if (redirectPath.value) {
        await nextTick();
        router.push(redirectPath.value); // 로그인 후 해당 경로로 이동
        redirectPath.value = ""; // 경로 초기화
      }
    };

    return {
      goToCarRegi,
      showLoginModal,
      showErrorModal,
      errorMessage,
      handleLoginSuccess,
      redirectPath,
    };
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
