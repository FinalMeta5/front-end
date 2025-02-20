<template>
  <div class="phone-main-screen">
    <div class="view-context-contain">
      <div class="find-email-container">
        <h2 class="title">이메일 찾기</h2>
        <br />
        <p class="description" v-if="!displayEmail && !errorMessage">
          회원가입 시 등록한 정보를 입력하세요.<br />
        </p>

        <!-- 정상적으로 이메일을 찾았을 때 -->
        <p class="result" v-if="displayEmail">
          해당 번호로 가입된 이메일은 <strong>{{ maskedEmail }}</strong> 입니다.
        </p>

        <!-- 에러 발생 시 출력 -->
        <p class="result error-message" v-if="errorMessage">
          {{ errorMessage }}
        </p>

        <div class="input-group">
          <input
            id="input-name"
            type="text"
            ref="nameInput"
            v-model="name"
            placeholder="이름을 입력하세요"
          />
          <input
            id="input-number"
            type="text"
            ref="phoneInput"
            v-model="phone"
            placeholder="휴대폰 번호를 입력하세요"
          />
          <button id="email-btn" class="btn-find" @click="onFindEmailClick">
            이메일 찾기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";

const name = ref("");
const phone = ref("");
const displayEmail = ref(false);
const maskedEmail = ref("");
const errorMessage = ref(""); // 에러 메시지 저장

const nameInput = ref(null);
const phoneInput = ref(null);

async function onFindEmailClick() {
  errorMessage.value = ""; // 이전 에러 초기화
  displayEmail.value = false; // 이전 결과 초기화

  if (!name.value.trim()) {
    nameInput.value.focus();
    return;
  }
  if (!phone.value.trim()) {
    phoneInput.value.focus();
    return;
  }

  try {
    const response = await axios.post(
      "http://api.hifive5.shop/api/member/find-email",
      {
        name: name.value,
        phone: phone.value,
      }
    );

    if (response.data) {
      maskedEmail.value = maskEmail(response.data);
      displayEmail.value = true;
    } else {
      errorMessage.value = "해당 정보로 가입된 계정이 없습니다.";
    }
  } catch (error) {
    errorMessage.value = "해당 정보로 가입된 계정이 없습니다.";
  }
}

function maskEmail(emailString) {
  const [localPart, domainPart] = emailString.split("@");
  let maskedLocal =
    localPart.slice(0, 2) + "*".repeat(Math.max(0, localPart.length - 2));
  const domainSegments = domainPart.split(".");
  const domainFirst = domainSegments[0];
  const domainLast = domainSegments.slice(1).join(".");

  let maskedDomainFirst =
    domainFirst[0] + "*".repeat(Math.max(0, domainFirst.length - 1));

  return `${maskedLocal}@${maskedDomainFirst}.${domainLast}`;
}
</script>

<style scoped>
@import "../style.css";
@import "../assets/style/phone-main-view-common.css";

#input-name, #input-number {
  border-radius: 8px;
}

.view-context-contain {
  width: 100%;
}

strong {
  color: #0066cc;
}

.find-email-container {
  margin-top: 150px;
  width: 70%;
  padding: 1rem;
  box-sizing: border-box;
  text-align: center;
}

.title {
  font-size: 1.2rem;
  margin: 0.5rem 0;
  font-weight: bold;
}

.description {
  font-size: 0.8rem;
  color: #666;
  line-height: 1.4;
  margin-bottom: 1rem;
}

.result {
  font-size: 0.8rem;
  margin-bottom: 1rem;
  color: #333;
}

.error-message {
  color: red;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group input {
  padding: 0.6rem;
  border: 1px solid #ccc;
  font-size: 14px;
}

.btn-find {
  padding: 0.6rem;
  font-size: 0.9rem;
  background-color: #878787;
  color: #fff;
  border: none;
  cursor: pointer;
}

#email-btn {
  border-radius: 8px;
}
</style>
