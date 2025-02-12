<template>
    <div class="detail-container">
        <p>출발지: {{ pickupLoc }}</p>
    <p>목적지: {{ destination }}</p>
    <p>출발 시간: {{ pickupDate }}</p>
    <p>{{ expectedNum }}명 탑승 예정</p>
    </div>
</template>
<script>
export default {
  name: "DetailInfoComponent",
  props: {
    pickupLoc: String,
    destination: String,
    pickupDate: String,
    expectedNum: Number
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
</style>