<template>
  <div class="detail-info-wrapper">
    <div :class="['detail-container', stateClass]">
    <p class="pickup-date">{{ pickupDate }}</p>
    <p class="pickup-loc">(출발) &nbsp;{{ pickupLoc }}</p>
    <p class="pickup-loc">(도착) &nbsp;{{ destination }}</p>
    <p class="expectedNum">현재 탑승 예정인원은 {{ expectedNum }}명입니다</p>
  </div>
  </div>
</template>

<script>
export default {
  name: "DetailInfoComponent",
  props: {
    pickupLoc: String,
    destination: String,
    pickupDate: String,
    expectedNum: Number,
    state: String,
    carShareJoinId: Number,
  },
  computed: {
    stateClass() {
      return this.state === "탄다" ? "green-border" : "red-border";
    }
  }
};
</script>

<style scoped>

.detail-container {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
  text-align: left;
}

.pickup-date,
.pickup-loc {
  display: inline-block; 
  margin-right: 10px;
  margin-bottom: 6px;
  font-size: 17px;
}

.expectedNum {
  margin-left: 55px;
  font-size: 13px;
}

.green-border {
  border: 2px solid #4192FF;
}

.red-border {
  border: 2px solid #878787;
}
</style>