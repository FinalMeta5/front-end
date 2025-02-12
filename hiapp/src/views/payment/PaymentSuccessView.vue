<template>
  <div class="phone-main-screen">
    <h1 class="titleH1">결제를 완료했어요</h1>
    <div class="view-context-contain">
      <div class="p-grid typography--p" style="margin-top: 50px">
        <div class="p-grid-col text--left">
          <b>결제금액</b>
        </div>
        <div class="p-grid-col text--right" id="amount">
          {{ Number(route.query.amount).toLocaleString() }}원
        </div>
      </div>

      <div class="p-grid typography--p" style="margin-top: 10px">
        <div class="p-grid-col text--left">
          <b>주문번호</b>
        </div>
        <div class="p-grid-col text--right" id="orderId">
          {{ route.query.orderId }}
        </div>
      </div>

      <div class="p-grid typography--p" style="margin-top: 10px">
        <div class="p-grid-col text--left">
          <b>paymentKey</b>
        </div>
        <div
          class="p-grid-col text--right"
          id="paymentKey"
          style="white-space: initial; width: 250px"
        >
          {{ route.query.paymentKey }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { authAxios } from "../../store/auth/auth";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

async function confirm() {
  const requestData = {
    orderId: route.query.orderId,
    price: route.query.amount,
    paymentKey: route.query.paymentKey,
  };

  const response = await authAxios.post("api/payment/confirm", requestData);

  if (!response.status === 200) {
    // 결제 실패
    router.replace(
      `/fail?code=${response.status}&message=${response.data.message}`
    );
  }
}

confirm();
</script>

<style scoped>
@import "../../style.css";
@import "../../assets/style/phone-main-view-common.css";
</style>
