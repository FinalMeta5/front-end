<template>
  <div class="phone-main-screen">
    <div class="view-context-contain">
      <div class="find-email-container">
        <h2 class="title">아이디(이메일)</h2>
        <p class="description">
          계정에 등록된 이름과 휴대폰 번호를 입력하시면<br />
          사용중인 계정의 이메일 주소를 알려드립니다.
        </p>

        <p class="result" v-if="displayEmail">
          해당 번호로 가입된 이메일은 <strong>{{ maskedEmail }}</strong> 입니다.
        </p>

        <div class="input-group">
          <input
            type="text"
            ref="nameInput"
            v-model="name"
            placeholder="이름 입력"
          />
          <input
            type="text"
            ref="phoneInput"
            v-model="phone"
            placeholder="휴대폰 번호 입력"
          />
          <button class="btn-find" @click="onFindEmailClick">
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

// 이메일 표시 여부
const displayEmail = ref(false);

const maskedEmail = ref("");

const nameInput = ref(null);
const phoneInput = ref(null);

async function onFindEmailClick() {
  if (!name.value.trim()) {
    nameInput.value.focus();
    return;
  }
  if (!phone.value.trim()) {
    phoneInput.value.focus();
    return;
  }

  const response = await axios.post(
    "http://localhost:8080/api/member/find-email",
    {
      name: name.value,
      phone: phone.value,
    }
  );
  const realEmail = response.data;

  maskedEmail.value = maskEmail(realEmail);

  displayEmail.value = true;
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
strong {
  color: #0066cc;
}
.find-email-container {
  margin-top: 150px;
  /* width: 90%; */
  padding: 1rem;
  box-sizing: border-box;
  text-align: center;
}

.title {
  font-size: 1.2rem;
  margin: 0.5rem 0;
}

.description {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
  margin-bottom: 1rem;
}

.result {
  font-size: 0.95rem;
  margin-bottom: 1rem;
  color: #333;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group input {
  padding: 0.6rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn-find {
  padding: 0.6rem;
  font-size: 1rem;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
