<template>
  <div class="phone-main-screen">
    <div class="view-context-contain">
      <div class="change-password-container">
        <h2 class="title">비밀번호 변경</h2><br>
        <p class="subtitle">
          가입한 이메일을 입력해 주세요.<br />
          이메일을 통해 인증 코드가 발송됩니다.
        </p>
        <p :class="message.type === 'success' ? 'success-message' : 'error-message'" v-if="message.text">{{ message.text }}</p>

        <!-- 이메일 입력 + 인증코드 발송 -->
        <div class="input-group">
          <input
            type="text"
            v-model="email"
            placeholder="이메일을 입력하세요."
            :disabled="isVerified"
            id="input-email"
          />
          <button id="code-btn" class="btn-send" @click="onSendCode" :disabled="isVerified">
            인증코드 발송
          </button>
        </div>

        <!-- 인증번호 입력 + 인증하기 -->
        <div v-if="isCodeSent && !isVerified"  class="input-group code-verification-group">
          <input
            id="input-content"
            type="text"
            v-model="codeInput"
            placeholder="인증번호 입력"
            :disabled="isVerified"
          />

          <div class="verification-actions">
            <button
              class="btn-verify"
              @click="onVerifyCode"
              :disabled="isVerified || timeRemaining === 0"
            >
              인증하기
            </button>
            <!-- 타이머 표시 -->
            <span class="timer" v-if="timeRemaining > 0">
              유효 시간 {{ formattedTime }}
            </span>
            <span class="timer expired" v-else>
              인증 코드가 만료되었습니다.
            </span>
          </div>
        </div>

        <!-- 인증 결과 메시지 -->
        <p class="verification-result" v-if="isCodeSent">
          <span v-if="isVerified" id="success-span">인증이 완료되었습니다.</span>
          <span v-else-if="!isVerified && timeRemaining > 0 && codeTried"
            >인증에 실패했습니다.</span
          >
        </p>

        <!-- 비밀번호 변경 영역 (인증 완료 후에만 노출) -->
        <div v-if="isVerified" class="input-group">
          <input
            id="input-content"
            type="password"
            v-model="newPassword"
            placeholder="비밀번호 입력"
          />
          <input
            id="input-content"
            type="password"
            v-model="confirmPassword"
            placeholder="비밀번호 확인"
          />
          <button id="change-btn" class="btn-change" @click="onChangePassword">변경하기</button>
        </div>
      </div>
    </div>
  </div>

  <SuccessModal
    v-if="isSuccessModalVisible"
    :title="'💡'"
    :textLine1="'비밀번호가 성공적으로 변경되었습니다'"
    :textLine2="'로그인 화면으로 이동합니다'"
    :close="'확인'"
    @close="closeSuccessModal"
/>
</template>

<script setup>
import { ref, computed, onUnmounted } from "vue";
import axios from "axios";
import SuccessModal from '../components/modal/SuccessModal.vue';
import {useRouter} from "vue-router";

const email = ref("");
const codeInput = ref("");
const isCodeSent = ref(false);
const isVerified = ref(false);
const newPassword = ref("");
const confirmPassword = ref("");
const codeTried = ref(false);
const message = ref("");
const isSuccessModalVisible = ref(false);
const router = useRouter(); 

const timeRemaining = ref(0);
let timerId = null;

async function onSendCode() {
  if (!email.value.trim()) {
    message.value = "이메일을 입력해주세요.";
    return;
  }

  try {
    console.log("email: ",email.value);
    await axios.post("http://localhost:8080/api/email/change-password", {
      email: email.value,
    });
    
    isCodeSent.value = true;
    isVerified.value = false;
    codeInput.value = "";
    codeTried.value = false;
    message.value = { text: "인증 코드가 발송되었습니다.", type: "success" };

    startTimer(300);
  } catch (error) {
    message.value = "인증 코드 발송에 실패했습니다.";
  }
}

function startTimer(duration) {
  // 기존 타이머 정리
  if (timerId) {
    clearInterval(timerId);
  }
  timeRemaining.value = duration;

  timerId = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--;
    } else {
      clearInterval(timerId);
      timerId = null;
      message.value = "인증 코드가 만료되었습니다. 다시 발송해 주세요.";
    }
  }, 1000);
}

// 인증하기
async function onVerifyCode() {
  codeTried.value = true;

  if (timeRemaining.value === 0) {
    message.value = "인증 코드가 만료되었습니다. 다시 발송해 주세요.";
    return;
  }
  if (!codeInput.value.trim()) {
    message.value = "인증번호를 입력해주세요.";
    return;
  }

  try {
    const response = await axios.post("http://localhost:8080/api/email/check", {
      email: email.value,
      code: codeInput.value,
    });

    if (response.status === 200) {
      isVerified.value = true;
      message.value = "인증이 완료되었습니다.";
    } else {
      isVerified.value = false;
      message.value = "인증에 실패했습니다.";
    }
  } catch (error) {
    message.value = "인증 과정에서 오류가 발생했습니다.";
  }
}

// 비밀번호 변경
async function onChangePassword() {
  if (!newPassword.value.trim()) {
    message.value = "비밀번호를 입력해주세요.";
    return;
  }
  if (newPassword.value.trim() !== confirmPassword.value.trim()) {
    message.value = "비밀번호가 일치하지 않습니다.";
    return;
  }

  try {
    console.log("email: ",email.value);
    console.log("password: ",newPassword.value);
    await axios.post("http://localhost:8080/api/member/change-password", {
      email: email.value,
      password: newPassword.value,
    });
    isSuccessModalVisible.value = true;
    message.value = "비밀번호가 성공적으로 변경되었습니다.";
  } catch (error) {
    message.value = "비밀번호 변경에 실패했습니다.";
  }
}

function closeSuccessModal() {
  isSuccessModalVisible.value = false;
  router.push('/'); 
}

const formattedTime = computed(() => {
  const mm = Math.floor(timeRemaining.value / 60)
    .toString()
    .padStart(1, "0");
  const ss = (timeRemaining.value % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
});

onUnmounted(() => {
  if (timerId) {
    clearInterval(timerId);
  }
});
</script>

<style scoped>
#success-span {
  color: green;
}

#input-email, #input-content {
  border-radius: 8px;
}

.success-message {
  color: green;
  font-size: 0.8rem;
  margin-top: 0.5rem;
}

.change-password-container {
  margin-top: 150px;
  padding: 1.5rem;
  box-sizing: border-box;
  text-align: center;
  width: 75%;
}

.title {
  font-size: 1.2rem;
  margin: 0.5rem 0;
  font-weight: bold;
}

.subtitle {
  font-size: 0.8rem;
  margin-bottom: 1rem;
  color: #666;
  line-height: 1.4;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0.8rem 0;
  width: 100%;
}

.input-group input {
  padding: 0.6rem;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}

.btn-send,
.btn-verify,
.btn-change {
  padding: 0.6rem;
  font-size: 1rem;
  border: 1px solid #333;
  cursor: pointer;
  background: #fff;
}

.btn-verify, #change-btn{
  border-radius: 8px;
  background-color: #878787;
  border: none;
  color: #ffffff;
  width: 100%;
}

.btn-send {
  background-color: #878787;
  border: none;
  color: #ffffff;
}

#code-btn {
  border-radius: 8px;
}

.code-verification-group {
  gap: 0.5rem;
}

.verification-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.timer {
  font-size: 0.8rem;
  color: red;
}

.timer.expired {
  color: #999;
}

.verification-result {
  margin-top: 0.3rem;
  font-size: 0.9rem;
  color: #333;
}

.error-message {
  color: red;
  font-size: 0.8rem;
  margin-top: 0.5rem;
}

</style>
