<template>
  <div class="phone-main-screen">
    <div class="view-context-contain">
      <h1 class="titleH1">회원가입</h1>
      <div class="step-indicator">
        <!-- 1단계 -->
        <div class="step-item" :class="{ active: currentStep >= 1 }">
          <div class="circle">1</div>
          <div class="label">약관동의</div>
        </div>
        <div class="line" :class="{ active: currentStep > 1 }"></div>
        <!-- 2단계 -->
        <div class="step-item" :class="{ active: currentStep >= 2 }">
          <div class="circle">2</div>
          <div class="label">정보입력</div>
        </div>
        <div class="line" :class="{ active: currentStep > 2 }"></div>
        <!-- 3단계 -->
        <div class="step-item" :class="{ active: currentStep >= 3 }">
          <div class="circle">3</div>
          <div class="label">가입완료</div>
        </div>
      </div>
      <div class="component-contain">
        <component
          :is="currentComponent"
          @next-step="onNextStep"
          v-bind="stepProps"
          class="step-container"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import SignupStepOneComponent from "../components/SignupStepOneComponent.vue";
import SignupStepTwoComponent from "../components/SignupStepTwoComponent.vue";
import SignupStepThreeComponent from "../components/SignupStepThreeComponent.vue";

// 현재 단계
const currentStep = ref(1);

// 단계별로 보여줄 컴포넌트 배열
const steps = [
  SignupStepOneComponent,
  SignupStepTwoComponent,
  SignupStepThreeComponent,
];

// 현재 표시할 컴포넌트를 계산
const currentComponent = computed(() => steps[currentStep.value - 1]);

const nickname = ref("");
const stepProps = computed(() => {
  return currentStep.value === 3 ? { nickname: nickname.value } : {};
});

// 다음 단계로 이동
function onNextStep(payload) {
  if (currentStep.value === 2 && payload && payload.nickname) {
    nickname.value = payload.nickname;
  }
  if (currentStep.value < 3) {
    currentStep.value++;
  }
}
</script>

<style scoped>
@import "../style.css";
@import "../assets/style/phone-main-view-common.css";
.titleH1 {
  text-align: left;
  width: 90%;
  font-size: 1.3rem;
  padding-left: 15px;
  margin-left: 100px;
  margin-top: 150px;
  margin-bottom: 30px;
}

.step-container {
  margin: 0 auto;
}

.arrow-left {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-top: 2px solid #000;
  border-left: 2px solid #000;
  transform: rotate(-45deg);
  margin-right: 4px;
}

.component-contain {
  width: 70%;
}

.header h1 {
  text-align: center;
  flex: 1;
  font-size: 17px;
  margin: 0;
}

.step-indicator {
  display: flex;
  align-items: baseline;
  justify-content: center;
  margin-bottom: 24px;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #ccc;
}

.circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.label {
  font-size: 11px;
  white-space: nowrap;
}

.line {
  width: 40px;
  height: 2px;
  background-color: #ccc;
  margin: 0 8px;
}

.step-item.active {
  color: #ff4d4f;
}

.step-item.active .circle {
  border-color: #ff4d4f;
}

.line.active {
  background-color: #ff4d4f;
}
</style>
