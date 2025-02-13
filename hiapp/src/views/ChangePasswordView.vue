<template>
  <div class="phone-main-screen">
    <div class="view-context-contain">
      <div class="change-password-container">
        <h2 class="title">비밀번호 변경</h2>
        <p class="subtitle">
          가입한 이메일을 입력해 주세요.<br />
          이메일을 통해 인증 코드가 발송됩니다.
        </p>

        <!-- 이메일 입력 + 인증코드 발송 -->
        <div class="input-group">
          <input
            type="text"
            v-model="email"
            placeholder="이메일 입력"
            :disabled="isVerified"
          />
          <button class="btn-send" @click="onSendCode" :disabled="isVerified">
            인증코드 발송
          </button>
        </div>

        <!-- 인증번호 입력 + 인증하기 -->
        <div v-if="isCodeSent" class="input-group code-verification-group">
          <input
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
          <span v-if="isVerified">인증이 완료되었습니다.</span>
          <span v-else-if="!isVerified && timeRemaining > 0 && codeTried"
            >인증에 실패했습니다.</span
          >
        </p>

        <!-- 비밀번호 변경 영역 (인증 완료 후에만 노출) -->
        <div v-if="isVerified" class="input-group">
          <input
            type="password"
            v-model="newPassword"
            placeholder="비밀번호 입력"
          />
          <input
            type="password"
            v-model="confirmPassword"
            placeholder="비밀번호 확인"
          />
          <button class="btn-change" @click="onChangePassword">변경하기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from "vue";

const email = ref("");
const codeInput = ref("");
const isCodeSent = ref(false);
const isVerified = ref(false);
const newPassword = ref("");
const confirmPassword = ref("");
const codeTried = ref(false);

const timeRemaining = ref(0);
let timerId = null;

async function onSendCode() {
  if (!email.value.trim()) {
    alert("이메일을 입력해주세요.");
    return;
  }

  const response = await axios.post(
    "httpz://localhost:8080/api/email/change-password",
    {
      email: email.value,
    }
  );

  isCodeSent.value = true;
  isVerified.value = false;
  codeInput.value = "";
  codeTried.value = false;

  startTimer(300);
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
    }
  }, 1000);
}

// 인증하기
async function onVerifyCode() {
  codeTried.value = true;

  if (timeRemaining.value === 0) {
    alert("인증 코드가 만료되었습니다. 다시 발송해 주세요.");
    return;
  }
  if (!codeInput.value.trim()) {
    alert("인증번호를 입력해주세요.");
    return;
  }

  const response = await axios.post("http://localhost:8080/api/email/check", {
    email: email.value,
    code: codeInput.value,
  });

  if (response.status === 200) {
    isVerified.value = true;
    alert("인증이 완료되었습니다.");
  } else {
    isVerified.value = false;
  }
}

// 비밀번호 변경
async function onChangePassword() {
  if (!newPassword.value.trim()) {
    alert("비밀번호를 입력해주세요.");
    return;
  }
  if (newPassword.value.trim() !== confirmPassword.value.trim()) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }

  const response = await axios.post(
    "http://localhost:8080/api/member/change-password",
    {
      email: email.value,
      password: newPassword.value,
    }
  );

  alert("비밀번호가 성공적으로 변경되었습니다.");
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
.change-password-container {
  margin-top: 150px;
  padding: 1.5rem;
  box-sizing: border-box;
  text-align: center;
}

.title {
  font-size: 1.2rem;
  margin: 0.5rem 0;
}

.subtitle {
  font-size: 0.9rem;
  margin-bottom: 1rem;
  color: #666;
  line-height: 1.4;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0.8rem 0;
}

.input-group input {
  padding: 0.6rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn-send,
.btn-verify,
.btn-change {
  padding: 0.6rem;
  font-size: 1rem;
  border: 1px solid #333;
  border-radius: 4px;
  cursor: pointer;
  background: #fff;
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
  font-size: 0.9rem;
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
</style>
