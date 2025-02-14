<template>
    <div :class="['detail-container', stateClass]">
    <p class="pickup-date">{{ pickupDate }}</p><br>
    <p class="pickup-loc">(출발) &nbsp;{{ pickupLoc }}</p>
    <p class="pickup-loc">(도착) &nbsp;{{ destination }}</p>
    <p class="expectedNum">현재 탑승 예정인원은 {{ expectedNum }}명입니다</p>
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
  padding: 1px;
  border-radius: 8px;
  margin: 0 auto;
  margin-bottom: 15px;
  text-align: left;
  width: 95%;
}

.pickup-date {
  display: inline-block; 
  margin-left: 10px;
  margin-bottom: 6px;
  font-size: 17px;
}

.pickup-date {
  display: inline-block; 
  margin-left: 15px;
  margin-bottom: 5px;
  margin-top: 12px;
  font-size: 15px;
}

.pickup-loc {
  display: inline-block; 
  margin-left: 15px;
  margin-bottom: 1px;
  font-size: 15px;
}

.expectedNum {
  margin-left: 62px;
  margin-top: 2px;
  font-size: 13px;
}

.green-border {
  border: 2px solid #4192FF;
}

.red-border {
  border: 2px solid #878787;
}

</style>