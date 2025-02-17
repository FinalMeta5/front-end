<template>
  <div class="info-input-container">
    <!-- 이메일 -->
    <div class="form-group">
      <label class="form-label" for="email">이메일 *</label>
      <div class="input-with-button">
        <input
          type="email"
          id="email"
          v-model="email"
          placeholder="예) abc@google.com"
          class="form-input"
          required
        />
        <button
          type="button"
          class="check-button"
          @click="onSendCode"
          :disabled="isVerified"
        >
          인증하기
        </button>
      </div>
      <div v-if="isCodeSent && !isVerified" class="input-group code-verification-group">
        <input
          id="input"
          type="text"
          v-model="codeInput"
          placeholder="인증번호 입력"
          class="form-input"
          :disabled="isVerified"
        />

        <div class="verification-actions">
          <button
            class="check-button"
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

        <p class="verification-result" v-if="isCodeSent">
          <span v-if="isVerified" id="success">인증이 완료되었습니다.</span>
          <span v-else-if="!isVerified && timeRemaining > 0 && codeTried" id="fail"
            >인증에 실패했습니다.</span
          >
        </p>
      </div>
    </div>

    <!-- 비밀번호 -->
    <div class="form-group">
      <label class="form-label" for="password">비밀번호 *</label>
      <div class="password-field">
        <input
          :type="showPassword ? 'text' : 'password'"
          id="password"
          v-model="password"
          placeholder="영문, 숫자 조합 8~16 자리"
          class="form-input"
          required
        />
        <button type="button" class="eye-button" @click="toggleShowPassword">
          <span>{{ showPassword ? "👁‍ 숨기기" : "👁 보기" }}</span>
        </button>
      </div>
    </div>

    <!-- 비밀번호 확인 -->
    <div class="form-group">
      <label class="form-label" for="passwordConfirm">비밀번호 확인 *</label>
      <input
        :type="showPassword ? 'text' : 'password'"
        id="passwordConfirm"
        v-model="passwordConfirm"
        placeholder="비밀번호를 한 번 더 입력해주세요."
        class="form-input"
        required
      />
    </div>

    <!-- 이름 -->
    <div class="form-group">
      <label class="form-label" for="name">이름 *</label>
      <input
        type="text"
        id="name"
        v-model="name"
        placeholder="예) 홍길동"
        class="form-input"
        required
      />
    </div>

    <!-- 닉네임 -->
    <div class="form-group">
      <label class="form-label" for="nickname">닉네임 *</label>
      <div class="input-with-button">
        <input
          type="text"
          id="nickname"
          v-model="nickname"
          placeholder="닉네임을 입력해주세요."
          class="form-input"
          required
        />
        <button
          type="button"
          class="check-button"
          @click="checkNicknameDuplicate"
        >
          중복확인
        </button>
      </div>
      <!-- <div v-if="nicknameVerified !== null" class="nickname-result">
        <span v-if="nicknameVerified" style="color: green;">사용할 수 있는 닉네임입니다.</span>
        <span v-else style="color: red;">사용할 수 없는 닉네임입니다.</span>
      </div> -->
    </div>

    <!-- 생년월일 -->
    <div class="form-group birthdate-group">
      <label class="form-label">생년월일 *</label>
      <div class="birthdate-inputs">
        <!-- 년(4자리) -->
        <input
          type="text"
          v-model="birthYear"
          placeholder="년(YYYY)"
          class="form-input"
          required
          maxlength="4"
          pattern="\\d{4}"
          inputmode="numeric"
        />
        <!-- 월(2자리) -->
        <input
          type="text"
          v-model="birthMonth"
          placeholder="월(MM)"
          class="form-input"
          required
          maxlength="2"
          pattern="\\d{2}"
          inputmode="numeric"
        />
        <!-- 일(2자리) -->
        <input
          type="text"
          v-model="birthDay"
          placeholder="일(DD)"
          class="form-input"
          required
          maxlength="2"
          pattern="\\d{2}"
          inputmode="numeric"
        />
      </div>
    </div>

    <!-- 휴대전화 -->
    <div class="form-group">
      <label class="form-label" for="phone">휴대전화 *</label>
      <input
        type="tel"
        id="phone"
        v-model="phone"
        placeholder="예) 010-1234-5678"
        class="form-input"
        required
      />
    </div>

    <!-- 성별 (라디오 대신, 탭처럼 선택) -->
    <div class="form-group gender-group">
      <label class="form-label">성별 *</label>
      <div class="gender-options">
        <div
          class="gender-option"
          :class="{ selected: gender === 'M' }"
          @click="gender = 'M'"
        >
          남자
        </div>
        <div
          class="gender-option"
          :class="{ selected: gender === 'F' }"
          @click="gender = 'F'"
        >
          여자
        </div>
      </div>
    </div>
    <button class="next-button" @click="handleNextClick">다음</button>
  </div>

  <!-- 하단 고정 '다음' 버튼 -->
  <SuccessModal
    v-if="isSuccessModalVisible"
    :title="'💡'"
    :textLine1="'부르릉에 오신 걸 환영합니다.'"
    :textLine2="'로그인 화면으로 이동합니다'"
    :close="'확인'"
    @close="closeSuccessModal"
/>
</template>

<script setup>
import axios from "axios";
import { ref, defineEmits, computed, onUnmounted } from "vue";
import SuccessModal from './modal/SuccessModal.vue';

// 폼 상태
const email = ref("");
const password = ref("");
const passwordConfirm = ref("");
const name = ref("");
const nickname = ref("");
const birthYear = ref("");
const birthMonth = ref("");
const birthDay = ref("");
const phone = ref("");
const gender = ref("");

// 닉네임 중복확인
const nicknameVerified = ref(false);
const showSuccessModal = ref(false);

// 이메일 인증
const codeInput = ref("");
const isCodeSent = ref(false);
const isVerified = ref(false);
const codeTried = ref(false);
const timeRemaining = ref(0);
let timerId = null;

async function onSendCode() {
  if (!email.value.trim()) {
    alert("이메일을 입력해주세요.");
    return;
  }

  await axios.post("https://api.hifive5.shop/api/email/signup", {
    email: email.value,
  });

  isCodeSent.value = true;
  isVerified.value = false;
  codeInput.value = "";
  codeTried.value = false;

  // 5분 타이머 시작
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

  const response = await axios.post("https://api.hifive5.shop/api/email/check", {
    email: email.value,
    code: codeInput.value,
  });

  if (response.data === true) {
    isVerified.value = true;
  } else {
    isVerified.value = false;
  }
}

const formattedTime = computed(() => {
  const mm = Math.floor(timeRemaining.value / 60)
    .toString()
    .padStart(1, "0");
  const ss = (timeRemaining.value % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
});

// 비밀번호 표시/숨김
const showPassword = ref(false);
function toggleShowPassword() {
  showPassword.value = !showPassword.value;
}

const emit = defineEmits(["next-step"]);

// 닉네임 중복확인
async function checkNicknameDuplicate() {
  const response = await axios.post(
    "https://api.hifive5.shop/api/member/check-nickname",
    {
      nickname: nickname.value,
    }
  );

  if (response.data === false) {
    nicknameVerified.value = true;
    alert("사용할 수 있는 닉네임입니다.");
  } else {
    alert("사용할 수 없는 닉네임입니다.");
    nicknameVerified.value = false;
  }
}

// '다음' 버튼 클릭 시 유효성 검증 & 이동
function handleNextClick() {
  // 비밀번호 일치 여부
  if (password.value !== passwordConfirm.value) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }

  // 생년월일 형식 검증
  const year = parseInt(birthYear.value, 10);
  const month = parseInt(birthMonth.value, 10);
  const day = parseInt(birthDay.value, 10);

  // 숫자로 변환되지 않거나 범위를 벗어나면 오류
  if (!year || year < 1900 || year > 2100) {
    alert("년도(YYYY)를 올바르게 입력해주세요.");
    return;
  }
  if (!month || month < 1 || month > 12) {
    alert("월(MM)을 올바르게 입력해주세요.");
    return;
  }
  if (!day || day < 1 || day > 31) {
    alert("일(DD)을 올바르게 입력해주세요.");
    return;
  }

  // 성별 선택 여부
  if (!gender.value) {
    alert("성별을 선택해주세요.");
    return;
  }

  // 전화번호 형식 검증
  const phonePattern = /^01[016789]-\d{3,4}-\d{4}$/;
  const isValidPhone = phonePattern.test(phone.value);
  if (!isValidPhone) {
    alert("전화번호를 올바르게 입력해주세요.");
    return;
  }

  // 닉네임 중복 검증
  if (!nicknameVerified.value) {
    alert("닉네임 중복을 확인해주세요.");
    return;
  }

  signupRequest();
}

async function signupRequest() {
  axios.post("https://api.hifive5.shop/api/member/signup", {
    email: email.value,
    name: name.value,
    password: password.value,
    phone: phone.value,
    gender: gender.value,
    birth: `${birthYear.value}-${birthMonth.value}-${birthDay.value}`,
    nickname: nickname.value,
  });

  if (response.data) {
    showSuccessModal.value = true;
  } else {
    alert("회원가입에 실패했습니다.");
  }
}

onUnmounted(() => {
  if (timerId) {
    clearInterval(timerId);
  }
});
</script>

<style scoped>
#success {
  color: green;
}

#fail {
  color: red;
}

.verification-result {
  font-size: 14px;
}

.timer {
  color: red;
  font-size: 13px;
}

#input {
  border-radius: 8px;
}

/* 전체 컨테이너 */
.info-input-container {
  /* width: 100%; */
  box-sizing: border-box;
  margin: 0 auto;
}

/* 공통 폼 그룹 간격 */
.form-group {
  margin-bottom: 20px;
}

/* 라벨 스타일 */
.form-label {
  text-align: left;
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
  color: #000;
  font-weight: 500;
}

/* 기본 인풋 스타일 */
.form-input {
  width: 100%;
  height: 40px;
  padding: 0 12px;
  font-size: 13px;
  color: #333;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
}

.input-group {
  display: flex;
  gap: 0.5rem;
  margin: 0.8rem 0;
}

.form-input::placeholder {
  color: #999;
}

#email {
  width: 200px;
}

/* 이메일/닉네임의 '중복확인' 버튼을 옆에 두기 위한 래퍼 */
.input-with-button {
  display: flex;
  gap: 10px;
}

/* '중복확인' 버튼 스타일 */
.check-button {
  width: 100%;
  height: 40px;
  font-size: 13px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  color: #333;
  cursor: pointer;
  box-sizing: border-box;
}

.code-verification-group {
  gap: 0.5rem;
}

.verification-actions {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 1rem;
}

/* 비밀번호 input + 눈 아이콘 배치 */
.password-field {
  position: relative;
}
.eye-button {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  border: none;
  background: none;
  cursor: pointer;
  color: #666;
}

/* 생년월일 3개 input을 가로로 배치 */
.birthdate-group .birthdate-inputs {
  display: flex;
  gap: 8px;
}
.birthdate-inputs input {
  text-align: center;
}

/* 성별 선택 박스 */
.gender-group .gender-options {
  display: flex;
  gap: 12px;
}
.gender-option {
  flex: 1;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px 0;
  cursor: pointer;
  font-size: 13px;
  color: #666;
  margin-bottom: 15px;
}
.gender-option.selected {
  border-color: #555;
  color: #000;
  font-weight: 600;
}

/* 하단 고정 '다음' 버튼 */
.next-button {
  width: 100%;
  margin: 0 auto;
  border-radius: 8px;
  background-color: #878787;
  color: #fff;
  border: none;
  height: 35px;
  font-size: 14px;
  cursor: pointer;
}
.next-button:hover {
  background-color: #333;
}

@media (max-width: 400px) {
  .info-input-container {
    width: 80vw;
  }
}
</style>
