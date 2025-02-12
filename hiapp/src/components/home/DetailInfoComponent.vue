<template>
  <div class="detail-container">
    <p class="pickup-date">{{ pickupDate }}</p>
    <p class="pickup-loc">(출발) {{ pickupLoc }}</p>
    <p class="expectedNum">현재 탑승 예정인원은 {{ expectedNum }}명입니다</p>
    <p>여부 : {{ state }}</p>
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
  display: inline-block; /* 두 <p> 태그를 같은 줄에 배치 */
  margin-right: 10px; /* 오른쪽에 간격을 추가 */
}

.expectedNum {
  display: inline-block;
  margin-left: 55px;
  margin-top: 0px;
}
</style>
