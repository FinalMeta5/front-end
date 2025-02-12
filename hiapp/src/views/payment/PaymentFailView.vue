<template>
  <div class="phone-main-screen">
    <h1 class="titleH1">결제를 실패했어요</h1>
    <div class="view-context-contain">
      <div class="p-grid typography--p" style="margin-top: 50px">
        <div class="p-grid-col text--left">
          <b>에러메시지</b>
        </div>
        <div class="p-grid-col text--right" id="message">
          {{ this.$route.query.message }}
        </div>
      </div>
      <div class="p-grid typography--p" style="margin-top: 10px">
        <div class="p-grid-col text--left">
          <b>에러코드</b>
        </div>
        <div class="p-grid-col text--right" id="code">
          {{ this.$route.query.code }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "../../style.css";
@import "../../assets/style/phone-main-view-common.css";
</style>
