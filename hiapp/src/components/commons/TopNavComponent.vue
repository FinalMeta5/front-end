<template>
  <nav class="top-nav phone-fix">
    <!-- ✅ 왼쪽: 뒤로 가기 버튼 -->
    <div class="btn-grp1">
      <font-awesome-icon class="back-button icon-button" @click="goBack" :icon="['fas', 'circle-left']" />
    </div>

    <!-- ✅ 오른쪽: 아이콘 3개 -->
    <div class="btn-grp2 right-icons">
      <router-link to="/signup">
        <i v-if="!isAuthenticated" class="bi bi-person-plus icon-button"></i>
      </router-link>

      <i v-if="isAuthenticated" @click="logout" class="bi bi-escape icon-button"></i>
      <i v-if="!isAuthenticated" class="bi bi-key icon-button" @click="showLoginModal = true"></i>

      <LoginModalView v-if="showLoginModal" @close="showLoginModal = false" />

      <LanguageSwitcher/>
    </div>
  </nav>
</template>

<script>
import { ref } from "vue";
import LoginModalView from "../../views/LoginModalView.vue";
import { logout, useAuthState } from "../../store/auth/auth";
import { useRouter } from "vue-router";
import LanguageSwitcher from "../LanguageSwitcher.vue";

export default {
  name: "TopNavComponent",
  components: {
    LoginModalView,
    LanguageSwitcher,
  },
  setup() {
    const showLoginModal = ref(false);
    const { isAuthenticated } = useAuthState();
    const router = useRouter();

    const goBack = () => {
      if (router.currentRoute.value.path === "/no-my-car-share-service") {
        router.push("/mypage");
      } else {
        router.go(-1);
      }
    };

    return {
      isAuthenticated,
      showLoginModal,
      logout,
      goBack,
    };
  },
};
</script>

<style scoped>
@import "../../assets/style/top-bottom-nav-mobile.css";
.top-nav {
  display: flex;
  justify-content: space-between; /* 왼쪽-오른쪽 정렬 */
  align-items: center;
  padding: 1px 4rem;
  background-color: #ffffff; /* 네비게이션 배경색 */
  border-bottom: 1px solid #ddd;
}

.btn-grp1 {
  display: flex;
  align-items: center;
  flex: 1;
}

.btn-grp2 {
  display: flex;
  align-items: center;
  gap: 15px; /* 아이콘 간격 조절 */
}

/* ✅ 아이콘 스타일 */
.icon-button {
  font-size: 28px; /* ✅ 아이콘 크기 키우기 */
  color: #333; /* ✅ 아이콘 색상 */
  cursor: pointer;
  padding: 10px;
  transition: color 0.3s ease-in-out;
}

.icon-button:hover {
  color: #007bff; /* ✅ 마우스 호버 시 색상 변경 */
}

/* ✅ 뒤로 가기 버튼 (왼쪽 고정) */
.back-button {
  font-size: 30px; /* ✅ 크기 키우기 */
  color: #333;
  cursor: pointer;
  padding: 10px;
}

.back-button:hover {
  color: #007bff;
}

/* ✅ 오른쪽 아이콘 컨테이너 (flex-end로 오른쪽 정렬) */
.right-icons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 15px;
  flex: 1;
}
</style>
