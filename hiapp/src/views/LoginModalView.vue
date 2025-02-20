<template>
  <!-- 모달 배경 -->
  <div class="modal-backdrop" @click.self="closeModal">
    <!-- 모달 컨테이너 -->
    <div class="modal-container">
      <h2 class="title">로그인</h2>

      <!-- 이메일/비밀번호 폼 -->
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <!-- <label for="email">이메일</label> -->
          <input type="text" id="email" v-model="email" placeholder="이메일" />
        </div>

        <div class="input-group">
          <!-- <label for="password">비밀번호</label> -->
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="비밀번호"
          />
        </div>

        <button class="login-btn" type="submit">로그인</button>
      </form>

      <!-- 링크 섹션 -->
      <div class="links">
        <a @click="goToFindId">아이디 찾기</a>
        <span>|</span>
        <a @click="goToChangePassword">비밀번호 변경</a>
        <span>|</span>
        <a @click="goToSignup">회원가입</a>
      </div>


      <!-- SNS 로그인 버튼들 -->
       
      <!-- <button class="kakao-btn"><img src="https://ifh.cc/g/xhCAQ8.png" class="kakao-logo">&nbsp;&nbsp;kakao 계정으로 시작하기</button> -->
      <!-- <button class="google-btn"><img src="https://ifh.cc/g/1CpBWq.png" class="google-logo">&nbsp;&nbsp;Google 계정으로 시작하기</button> -->
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { defineEmits } from "vue";
import { login } from "../store/auth/auth.js";
import { useRouter, useRoute } from "vue-router";

// 부모 컴포넌트로부터 모달 열림/닫힘 여부를 prop으로 받을 수도 있지만,
// 여기서는 예시로 직접 showModal을 관리해도 되고,
// 혹은 emit으로 부모에 알리는 방식을 사용할 수도 있습니다.
// 이 컴포넌트를 간단히 "항상 보이는" 방식으로 두고,
// 실제로는 v-if 또는 v-show로 제어할 수 있습니다.

const email = ref("");
const password = ref("");
const emit = defineEmits(["close"]);
const router = useRouter();
const props = defineProps({
  redirectPath: String, // ✅ 로그인 후 이동할 경로 (선택 사항)
  pendingAction: Function, // ✅ 로그인 후 실행할 함수 (선택 사항)
});
// 모달을 닫는 메서드
function closeModal() {
  emit("close");
}

async function handleLogin() {
  try {
    await login(email.value, password.value);
    console.log("로그인 성공");
    closeModal();

    emit("login-success"); // ✅ 부모 컴포넌트에게 로그인 성공 알림

    // ✅ 새로고침 후 실행되도록 로직 저장
    setTimeout(() => {
      // ✅1. 로그인 후 이동할 페이지로 리디렉트
      if (props.redirectPath) {
        router.push(props.redirectPath);
        return;
      }

      // ✅2. 로그인 후 실행할 함수
      if (props.pendingAction) {
        props.pendingAction();
        return;
      }

      // ✅3. 기본으로 "/" 홈으로 이동
      router.push("/");
    }, 500); // 새로고침 후 0.5초 뒤 실행

    // ✅ 새로고침 실행
    // window.location.reload();
  } catch (err) {
    console.log("로그인 실패:", err);
  }
}

function goToChangePassword() {
  router.push("/change-password");
  closeModal();
}
function goToFindId() {
  router.push("/find-id");
  closeModal();
}
function goToSignup() {
  router.push("/signup");
  closeModal();
}
</script>

<style scoped>
/* 모달 전체 배경 (회색 반투명) */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);

  /* 화면 가운데 정렬 */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 모달 컨테이너 스타일 */
.modal-container {
  background-color: #fff;
  width: 320px;
  padding: 2rem;
  border-radius: 8px;
  position: relative;
}

.kakao-logo, .google-logo {
  width: 18px;
}

/* 제목 */
.title {
  margin: 0 0 1.5rem;
  text-align: center;
  font-size: 1.4rem;
  font-weight: bold;
}

/* 폼 요소 스타일 */
.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}
.input-group label {
  font-size: 0.8rem;
  margin-bottom: 0.3rem;
}
.input-group input {
  padding: 0.5rem;
  font-size: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* 로그인 버튼 */
.login-btn {
  width: 100%;
  padding: 0.6rem 0;
  margin-top: 0.5rem;
  background-color: #666;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

/* 링크 섹션 */
.links {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  font-size: 0.8rem;
}
.links a {
  color: #333;
  text-decoration: none;
  margin: 0 0.3rem;
}
.links span {
  margin: 0 0.3rem;
  color: #ccc;
}

/* 구분선 */
hr {
  margin: 1rem 0;
  border: none;
  border-top: 1px solid #eee;
}

/* SNS 로그인 버튼들 */
.kakao-btn {
  display: block;
  width: 100%;
  padding: 0.5rem 0;
  margin-bottom: 0.5rem;
  background-color: #ffeb00;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  font-size: 14px;
}

.google-btn {
  display: block;
  width: 100%;
  padding: 0.5rem 0;
  background-color: #fff;
  border: 1px solid #ccc;
  cursor: pointer;
  border-radius: 8px;
  font-size: 14px;
}

.links a {
  font-size: 12.8px;
  font-weight: normal;
}

@media (max-width: 600px) {
  .modal-container {
    width: 85vw;
  }
}
</style>
