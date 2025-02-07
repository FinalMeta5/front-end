<template>
  <nav class="top-nav phone-fix">
    <ul>
      <li>
        <router-link to="/"><i class="bi bi-house"></i></router-link>
      </li>
      <li>
        <router-link to="/about"><i class="bi bi-info-circle"></i></router-link>
      </li>
      <li>
        <router-link to="/mypage"><i class="bi bi-person"></i></router-link>
      </li>
      <li>
        <i v-if="isAuthenticated" @click="logout" class="bi bi-escape"></i>
        <i
          v-if="!isAuthenticated"
          class="bi bi-key"
          @click="showLoginModal = true"
        >
        </i>
        <LoginModalView v-if="showLoginModal" @close="showLoginModal = false" />
      </li>
      <li>
        <router-link to="/signup"
          ><i class="bi bi-person-plus"></i
        ></router-link>
      </li>
      <li>
        <router-link to="/memberlist"
          ><i class="bi bi-list">Member List</i></router-link
        >
      </li>
    </ul>
  </nav>
</template>

<script>
import { ref } from "vue";
import LoginModalView from "../../views/LoginModalView.vue";
import { logout, useAuthState } from "../../store/auth/auth";

export default {
  name: "TopNavComponent",
  components: {
    LoginModalView,
  },
  setup() {
    const showLoginModal = ref(false);
    const { isAuthenticated } = useAuthState();
    return {
      isAuthenticated,
      showLoginModal,
      logout,
    };
  },
};
</script>

<style scoped>
@import "../../assets/style/top-bottom-nav-mobile.css";
</style>
