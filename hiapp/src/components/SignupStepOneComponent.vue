<template>
  <div class="step-one">
    <!-- 모두 동의 체크 -->
    <div class="agree-all-wrapper">
      <label class="agree-all">
        <input type="checkbox" v-model="agreeAll" @change="toggleAll" />
        <span>아래 약관에 모두 동의합니다.</span>
      </label>
    </div>

    <!-- 약관 목록 -->
    <ul class="terms-list">
      <!-- 필수 -->
      <li v-for="(val, key) in termsRequired" :key="key" class="terms-item">
        <label class="terms-label">
          <input type="checkbox" v-model="termsRequired[key]" />
          <span class="required">(필수)</span>
          <span class="terms-text">
            <!-- key 에 따라 문구 변경이 필요하다면 분기 처리 or 그냥 예시로 작성 -->
            {{
              key === "hiFive"
                ? "부르릉 이용 약관 동의"
                : key === "privacy"
                ? "개인정보 수집 및 이용 동의"
                : key === "location"
                ? "위치정보 이용 약관 동의"
                : key === "infoEntrust"
                ? "개인정보 취급 위탁 동의"
                : ""
            }}
          </span>
        </label>
        <span class="arrow">&gt;</span>
      </li>
      <div class="line"></div>

      <!-- 선택 -->
      <li v-for="(val, key) in termsOptional" :key="key" class="terms-item">
        <label class="terms-label">
          <input type="checkbox" v-model="termsOptional[key]" />
          <span class="optional">(선택)</span>
          <span class="terms-text">
            {{
              key === "ads"
                ? "광고성 정보 수신 동의"
                : key === "freeService"
                ? "무료 서비스 전체 동의"
                : ""
            }}
          </span>
        </label>
        <span class="arrow">&gt;</span>
      </li>
    </ul>
    <div class="line"></div>

    <!-- 안내 문구 -->
    <div class="notice">
      <p>부르릉 멤버십에 오신 것을 환영합니다.</p>
      <p>약관 동의 및 회원가입이 필요합니다.</p><br>
      <p>고객님께서는 동의를 거부할 수 있습니다.</p>
      <p>단, 필수항목 거부 시에는 회원가입이 제한됩니다.</p>
    </div>

    <!-- 다음 버튼 -->
    <button class="next-button" @click="handleNextClick">다음</button>
  </div>
</template>

<script setup>
import { ref, watch, defineEmits } from "vue";

const emit = defineEmits(["next-step"]);

// 필수항목
const termsRequired = ref({
  hiFive: false,
  privacy: false,
  location: false,
  infoEntrust: false,
});

// 선택항목
const termsOptional = ref({
  ads: false,
  freeService: false,
});

// 전체 동의 체크
const agreeAll = ref(false);

// 모두 동의 toggle
function toggleAll() {
  if (agreeAll.value) {
    for (const key in termsRequired.value) {
      termsRequired.value[key] = true;
    }
    for (const key in termsOptional.value) {
      termsOptional.value[key] = true;
    }
  } else {
    // 전체 해제
    for (const key in termsRequired.value) {
      termsRequired.value[key] = false;
    }
    for (const key in termsOptional.value) {
      termsOptional.value[key] = false;
    }
  }
}

// 필수항목 체크 여부 확인 후 다음 단계
function handleNextClick() {
  const allRequiredChecked = Object.values(termsRequired.value).every(
    (val) => val
  );
  if (!allRequiredChecked) {
    alert("필수 항목에 모두 동의해 주세요.");
    return;
  }
  emit("next-step");
}

// 항목 변경 시 agreeAll 상태 갱신
watch(
  [termsRequired, termsOptional],
  () => {
    const allRequired = Object.values(termsRequired.value).every(Boolean);
    const allOptional = Object.values(termsOptional.value).every(Boolean);
    agreeAll.value = allRequired && allOptional;
  },
  { deep: true }
);
</script>

<style scoped>
.step-one {
  /* width: 100%; */
  font-family: sans-serif;
}

.agree-all-wrapper {
  border-bottom: 2px solid #878787;
  margin-bottom: 8px;
  padding-bottom: 8px;
  margin: 0 auto;
}

.line {
  border-bottom: 2px solid #878787;
}

.agree-all {
  display: flex;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 10px;
}

.agree-all input {
  margin-right: 8px;
  width: 18px;
  height: 18px;
}

.terms-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.terms-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding: 10px 0;
}

.terms-label {
  display: flex;
  align-items: center;
  font-size: 13px;
  cursor: pointer;
}

.required {
  color: #ff4d4f;
  margin-right: 4px;
}
.optional {
  color: #333;
  margin-right: 4px;
}

.terms-text {
  color: #333;
}

.terms-label input {
  margin-right: 8px;
  width: 16px;
  height: 16px;
}

.arrow {
  font-size: 18px;
  color: #707070;
}

.notice {
  text-align: left;
  margin-top: 30px;
  font-size: 13px;
  color: #666;
  line-height: 0.7;
  margin-bottom: 30px;
}

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

@media (max-width: 400px) {
  .step-one {
    width: 80vw;
  }
}
</style>
