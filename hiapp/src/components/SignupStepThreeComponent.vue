<template>
  <div class="completion-container">
    <!-- 체크 아이콘 -->
    <div class="icon-wrap">
      <img src="https://ifh.cc/g/bN0WOW.png" alt="체크" />
    </div>

    <!-- 타이틀 -->
    <h2 class="title">가입완료</h2>

    <!-- 내용 부분 -->
    <p class="description">
      나와 너의 탑승 파트너
      <span class="highlight">부르릉</span>에 오신 걸 환영합니다
      <br />
      지금부터 {{ nickname }}님만의 여행 이야기를 만들어보세요
    </p>

    <!-- 버튼 -->
    <button class="use-brroong" @click="goToMain">부르릉 이용하기</button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
function goToMain() {
  router.push("/");
}
const props = defineProps({
  nickname: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.completion-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.icon-wrap {
  margin-bottom: 20px;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 0 12px;
}

.description {
  text-align: center;
  font-size: 1rem;
  line-height: 2;
  margin-bottom: 24px;
}

.highlight {
  color: #4caf50;
  font-weight: bold;
}

.use-brroong {
  width: 100%;
  margin: 0 auto;
  border-radius: 8px;
  background-color: #878787;
  color: #fff;
  border: none;
  height: 50px;
  font-size: 16px;
  cursor: pointer;
}

.use-brroong:hover,
.use-brroong:focus {
  background-color: #666;
}
</style>
