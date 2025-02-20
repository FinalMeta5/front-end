<template>
  <div class="phone-main-screen">
    <div class="view-context-contain">
      <h1 class="titleH1">크레딧 구매</h1>
      <div class="credit-container">
        <!-- 현재 크레딧 정보 영역 -->
        <div class="current-credit-box">
          <p>{{ nickname }}님의 보유 크레딧</p>
          <div class="credit-amount-wrapper">
            <span class="credit-amount">{{
              creditBalance.toLocaleString()
            }}</span>
            <img :src="creditIconUrl" alt="크레딧 아이콘" class="credit-icon" />
          </div>
        </div>

        <!-- 충전 옵션 영역 -->
        <div class="charge-options">
          <div class="charge-option" @click="goToChargePage(1, 500)">
            <img
              :src="stationIconUrl"
              alt="주유소 아이콘"
              class="option-icon"
            />
            <div class="option-text">
              <p>1크레딧 충전하기</p>
              <p class="big">500원</p>
            </div>
          </div>

          <div class="charge-option" @click="goToChargePage(10, 4500)">
            <img
              :src="stationIconUrl"
              alt="주유소 아이콘"
              class="option-icon"
            />
            <div class="option-text">
              <p>10크레딧 충전하기</p>
              <p class="big">4500원</p>
            </div>
          </div>
        </div>

        <!-- 안내 문구 -->
        <div class="notice-text-container">
          <div class="notice-text">
            <img :src="noticeIconUrl" alt="주의 아이콘" class="warning-icon" />
            <p class="notice">
              원하시는 금액을 선택하여 크레딧을 충전해 주세요
            </p>
          </div>
          <div class="notice-text">
            <img :src="noticeIconUrl" alt="주의 아이콘" class="warning-icon" />
            <p class="notice">충전이 완료된 포인트는 환불이 불가합니다</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { authAxios, useAuthState } from "../../store/auth/auth.js";

const router = useRouter();

const { nickname, memberId } = useAuthState();
const creditBalance = ref(0);

// 이미지 URL
const creditIconUrl = "https://ifh.cc/g/HGCDLH.png";
const stationIconUrl = "https://ifh.cc/g/4Tgfgw.png";
const noticeIconUrl = "https://ifh.cc/g/TFDJON.png";

const goToChargePage = (creditCount, creditAmount) => {
  router.push({
    path: "/payment",
    query: { creditcount: creditCount, price: creditAmount },
  });
};

const fetchCreditBalance = async () => {
  try {
    const response = await authAxios.get(
      `/api/mypage/credit/${memberId.value}`
    );
    creditBalance.value = response.data;
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchCreditBalance();
});
</script>

<style scoped>
@import "../../style.css";
@import "../../assets/style/phone-main-view-common.css";
.titleH1 {
  /* text-align: left; */
  width: 90%;
  font-size: 24px;
  /* margin-left: 300px; */
  margin-top: 180px;
  margin-bottom: 30px;
  font-weight: bold;
}

.credit-container {
  width: 90%;
  margin: 0 auto;
  padding: 16px;
  font-family: sans-serif;
}

.top-bar {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.icon-div {
  width: 95%;
}

.back-btn {
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  margin-bottom: 30px;
  margin-top: 120px;
}

.back-icon {
  width: 24px;
  height: 24px;
}

/* 현재 크레딧 정보 */
.current-credit-box {
  border: 1px solid #000000;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 50px;
}
.credit-amount-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
}
.credit-amount {
  font-size: 24px;
  font-weight: bold;
  margin-right: 8px;
  color: #fab005;
}
.credit-icon {
  width: 24px;
  height: 24px;
}

/* 충전 옵션 버튼들 */
.charge-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}
.charge-option {
  display: flex;
  align-items: center;
  background-color: #999;
  color: #fff;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  height: 130px;
}
.option-icon {
  width: 60px;
  height: 60px;
  margin-left: 30px;
}
.option-text {
  margin-left: 110px;
}
.option-text p {
  margin: 0;
  line-height: 1.4;
}
.big {
  font-size: 30px;
  font-weight: bold;
}

/* 안내 문구 */
.notice-text-container {
  display: flex;
  flex-direction: column;
}
.notice-text {
  font-size: 12px;
  color: #959090;
  text-align: center;
  display: flex;
  margin-bottom: 5px;
}
.warning-icon {
  margin-right: 5px;
}
</style>
