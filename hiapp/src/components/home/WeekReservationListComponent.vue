<template>
  <div class="container">
    <div class="box">
      <div class="calendar">
        <div class="days">
          <span>월</span>
          <span>화</span>
          <span>수</span>
          <span>목</span>
          <span>금</span>
          <span>토</span>
          <span>일</span>
        </div>
        <div class="dates">
          <div v-for="(date, index) in weekDates" :key="index" class="date-column">
            <!-- 날짜가 있는 열 -->
            <span>{{ date }}</span>
            <!-- 화요일(2번째 열)일 때만 TaxiComponent 추가 -->
            <div v-if="index === 1" class="taxi-container">
              <TaxiComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// TaxiComponent 컴포넌트를 import
import TaxiComponent from './TaxiComponent.vue';

export default {
  components: {
    TaxiComponent,
  },
  data() {
    return { 
      weekDates: [],            // 이번 주 날짜 저장
    };
  },
  methods: {
    getWeekDates() {
      const today = new Date();
      const dayOfWeek = today.getDay(); 
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; 
      const startOfWeek = new Date(today.setDate(today.getDate() + diff));

      const weekDates = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i); 
        weekDates.push(date.getDate()); 
      }

      this.weekDates = weekDates;
    },
  },
  mounted() {
    this.getWeekDates(); 
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.box {
  width: 400px;
  height: 500px;
  border: 2px solid #878787;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.days,
.dates {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}

.days {
  background-color: #878787;
  color: #ffffff;
  border-radius: 8px 8px 0 0;
  display: flex;
  flex-grow: 1;
}

.days span {
  flex-grow: 1; /* 각 요일 열이 동일한 비율로 나누어지도록 설정 */
  text-align: center; /* 중앙 정렬 */
}

.dates {
  background-color: #f0f0f0;
  display: flex;
  justify-content: space-between;
}

.date-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1; 
  justify-content: flex-start; 
}

.date-column span {
  padding: 5px;
}

.taxi-container {
  margin-top: 10px; /* TaxiComponent와 날짜 간의 간격 */
  padding: 10px;
  width: 5px;
  height: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.taxi-text {
  color: white;
  font-size: 14px;
  font-weight: bold;
}
</style>
