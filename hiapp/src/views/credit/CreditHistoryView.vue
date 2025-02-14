<template>
  <div class="home phone-main-screen">
    <div class="view-context-contain">
      <h1 class="titleH1">크레딧내역 조회</h1>
      <div class="credit-history-page">
        <section class="credit-info-section">
          <div class="credit-info">
            <p class="user-name">{{ nickname }}님의 보유 크레딧</p>
            <div class="credit-amount-area">
              <strong class="credit-amount">{{
                creditBalance.toLocaleString()
              }}</strong>
              <img
                src="https://ifh.cc/g/HGCDLH.png"
                alt="크레딧 아이콘"
                class="credit-icon"
              />
            </div>
          </div>
        </section>
        <div>
          <button class="charge-button" @click="goToCharge">
            <img
              src="https://ifh.cc/g/4Tgfgw.png"
              alt="주유소 아이콘"
              class="station-icon"
            /><span id="credittext">크레딧 충전하러 가기</span>
          </button>
        </div>

        <!-- 년/월 선택 영역 -->
        <section class="select-box-section">
          <div class="select-box">
            <label class="select-label" for="yearSelect">년</label>
            <select
              id="yearSelect"
              v-model="selectedYear"
              @change="fetchCreditHistory"
            >
              <option v-for="year in years" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
          <div class="select-box">
            <label class="select-label" for="monthSelect">월</label>
            <select
              id="monthSelect"
              v-model="selectedMonth"
              @change="fetchCreditHistory"
            >
              <option v-for="month in months" :key="month" :value="month">
                {{ month }}
              </option>
            </select>
          </div>
        </section>

        <!-- 크레딧 내역 -->
        <section class="credit-history-list">
          <h2 class="history-group-title">
            {{ selectedYear }}년 {{ selectedMonth }}월
          </h2>
          <ul>
            <li v-for="item in creditHistory" class="history-item">
              <div class="history-date">{{ item.date }}</div>
              <div class="history-amount">{{ item.creditCount }} 크레딧</div>
              <div class="history-type" :class="getTypeClass(item.state)">
                {{ item.state }}
              </div>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { authAxios, useAuthState } from "../../store/auth/auth.js";

const { nickname, memberId } = useAuthState();

const creditBalance = ref(0);

// 선택 가능 년/월
const years = [2021, 2022, 2023, 2024, 2025];
const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// 현재 선택된 년/월
const selectedYear = ref(2025);
const selectedMonth = ref(2);

// 크레딧 내역
const creditHistory = ref([]);

const router = useRouter();
const goToCharge = () => router.push("/purchase-credit");

// 크레딧 내역 조회
const fetchCreditHistory = async () => {
  try {
    const response = await authAxios.get("api/mypage/credit-history", {
      params: {
        year: selectedYear.value,
        month: selectedMonth.value,
        memberId: memberId.value,
      },
    });

    creditHistory.value = response.data;
  } catch (error) {
    console.error(error);
  }
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

// 타입별 태그 색상 지정
const getTypeClass = (type) => {
  switch (type) {
    case "택시이용":
      return "tag-taxi";
    case "차량이용":
      return "tag-car";
    case "충전":
      return "tag-charge";
    default:
      return "tag-default";
  }
};

onMounted(() => {
  fetchCreditBalance();
  fetchCreditHistory();
});
</script>

<style scoped>
@import "../../style.css";
@import "../../assets/style/phone-main-view-common.css";

.titleH1 {
  text-align: left;
  width: 90%;
  font-size: 1.5rem;
  padding-left: 15px;
  margin-left: 0px;
  margin-top: 0px;
  margin-bottom: 20px;
  margin-top: 150px;
}

.credit-history-page {
  width: 90%;
  margin: 0 auto;
  font-family: sans-serif;
  background-color: #fff;
  color: #000;
  padding: 16px;
}

.page-title {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

#credittext {
  margin: auto 0;
}

/* 보유 크레딧 섹션 */
.credit-info-section {
  border: 1px solid #000000;
  padding: 16px;
  margin-bottom: 10px;
  border-radius: 8px;
}
.credit-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.user-name {
  font-size: 14px;
  color: #666;
  margin: 0;
}
.credit-amount-area {
  display: flex;
  align-items: center;
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
.station-icon {
  width: 25px;
  height: 25px;
  margin-right: 10px;
}
.charge-button {
  display: flex;
  width: 100%;
  background-color: #878787;
  color: #ffffff;
  padding: 8px;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 14px;
  border-radius: 8px;
  margin-bottom: 10px;
}
.charge-button:hover {
  background-color: #bbb;
}

/* 년/월 선택 섹션 */
.select-box-section {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.select-box {
  display: flex;
  flex-direction: column;
}
.select-label {
  font-size: 12px;
  margin-bottom: 4px;
  color: #555;
}
.select-box select {
  padding: 4px 8px;
  font-size: 14px;
}

.credit-history-list {
  margin-bottom: 32px;
}
.history-group-title {
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 8px 0;
  border-bottom: 1px solid #ddd;
  padding-bottom: 4px;
}

.history-item {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 8px 0;
  border-bottom: 2px dotted #eee;
}

.history-date {
  width: 130px;
  font-size: 14px;
  color: #666;
}

.history-amount {
  width: 100px;
  font-size: 14px;
  text-align: right;
  margin-right: 8px;
  font-weight: bold;
}

.history-type {
  width: 80px;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  text-align: center;
}

/* 사용 타입별 태그 색상 */
.tag-taxi {
  background-color: #f36a6a;
  color: #fff;
}
.tag-car {
  background-color: #fca366;
  color: #fff;
}
.tag-charge {
  background-color: #ffe299;
  color: #333;
}
.tag-default {
  background-color: #eee;
  color: #333;
}
</style>
