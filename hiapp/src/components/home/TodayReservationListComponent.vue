<template>
  <div class="today-reservation-container">
    <div class="box">
      <div class="tabs">
        <button @click="changeContent('left')" :class="{ active: activeTab === 'left' }">택시 예약 내역</button>
        <button @click="changeContent('right')" :class="{ active: activeTab === 'right' }">차량 예약 내역</button>
      </div>
      <div class="content">
        <TodayTaxiListComponent v-if="activeTab === 'left'" />
        <TodayCarListComponent v-if="activeTab === 'right'"/>
      </div>
    </div>
  </div>
</template>

<script>
import TodayTaxiListComponent from './TodayTaxiListComponent.vue';
import TodayCarListComponent from './TodayCarListComponent.vue';

export default {
  name: 'TodayReservationListComponent',
  components: {
    TodayTaxiListComponent,
    TodayCarListComponent 
  },
  data() {
    return {
      activeTab: 'left', 
    };
  },
  methods: {
    changeContent(tab) {
      this.activeTab = tab;
    },
  },
};
</script>

<style scoped>
.today-reservation-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.box {
  width: 400px;
  height: 360px;
  border: 2px solid #878787;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  position: relative;
}

.tabs {
  position: absolute;
  top: -50px; 
  left: 0;
  right: 0;
  display: flex;
  padding: 0;
  box-sizing: border-box;
}

button {
  flex: 1;
  padding: 10px;
  border: 2px solid #878787; 
  cursor: pointer;
  font-size: 15px;
  background-color: #f0f0f0;
  color: #5d5d5d;
}

button:first-child {
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
}

button:last-child {
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
}

button.active {
  background-color: #878787;
  color: white;
}

.content {
  text-align: center;
  font-size: 18px;
  margin-top: 27px;
}

.calendar {
  margin-top: 20px;
}

.days {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
}

.dates {
  display: flex;
  justify-content: space-between;
}

@media (max-width: 500px) {
  .today-reservation-container {
    width: 88vw;
  }
}
</style>
