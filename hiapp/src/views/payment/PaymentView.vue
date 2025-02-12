<template>
  <div class="phone-main-screen">
    <div class="view-context-contain">
      <div class="wrapper">
        <div class="box-section">
          <h1>결제</h1>

          <!-- 결제수단 선택 영역 -->
          <div
            id="payment-method"
            style="display: flex; flex-wrap: wrap; justify-content: center"
          >
            <button
              id="CARD"
              class="select-button"
              :class="{ active: selectedPaymentMethod === 'CARD' }"
              @click="selectedPaymentMethod = 'CARD'"
            >
              <!-- 카드 아이콘 -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-credit-card button-icon"
                viewBox="0 0 16 16"
              >
                <path
                  d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"
                />
                <path
                  d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"
                />
              </svg>
              <span>카드</span>
            </button>

            <button
              id="TRANSFER"
              class="select-button"
              :class="{ active: selectedPaymentMethod === 'TRANSFER' }"
              @click="selectedPaymentMethod = 'TRANSFER'"
            >
              <!-- 계좌이체 아이콘 -->
              <img
                src="https://ifh.cc/g/5CWbH4.png"
                alt="계좌이체 아이콘"
                class="button-icon"
              />
              <span>계좌이체</span>
            </button>

            <button
              id="VIRTUAL_ACCOUNT"
              class="select-button"
              :class="{ active: selectedPaymentMethod === 'VIRTUAL_ACCOUNT' }"
              @click="selectedPaymentMethod = 'VIRTUAL_ACCOUNT'"
            >
              <!-- 가상계좌 아이콘 -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-window-stack button-icon"
                viewBox="0 0 16 16"
              >
                <path
                  d="M4.5 6a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1M6 6a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m2-.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"
                />
                <path
                  d="M12 1a2 2 0 0 1 2 2 2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2 2 2 0 0 1-2-2V3a2 2 0 0 1 2-2zM2 12V5a2 2 0 0 1 2-2h9a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1m1-4v5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8zm12-1V5a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v2z"
                />
              </svg>
              <span>가상계좌</span>
            </button>

            <button
              id="MOBILE_PHONE"
              class="select-button"
              :class="{ active: selectedPaymentMethod === 'MOBILE_PHONE' }"
              @click="selectedPaymentMethod = 'MOBILE_PHONE'"
            >
              <!-- 휴대폰 결제 아이콘 -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-phone button-icon"
                viewBox="0 0 16 16"
              >
                <path
                  d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"
                />
                <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
              </svg>
              <span>휴대폰</span>
            </button>

            <button
              id="CULTURE_GIFT_CERTIFICATE"
              class="select-button"
              :class="{
                active: selectedPaymentMethod === 'CULTURE_GIFT_CERTIFICATE',
              }"
              @click="selectedPaymentMethod = 'CULTURE_GIFT_CERTIFICATE'"
            >
              <!-- 문화상품권 아이콘 -->
              <img
                src="https://ifh.cc/g/C6DPKv.png"
                alt="문화상품권 아이콘"
                class="button-icon"
              />
              <span>문화상품권</span>
            </button>
          </div>

          <!-- 결제하기 버튼 -->
          <button class="button" @click="requestPayment">결제하기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { authAxios, useAuthState } from "../../store/auth/auth";

function generateRandomString() {
  return window.btoa(Math.random().toString()).slice(0, 20);
}

const clientKey = "test_ck_AQ92ymxN34LaO7BN94dj3ajRKXvd";
const customerKey = generateRandomString();
const amount = {
  currency: "KRW",
  value: 50000,
};

export default {
  data() {
    return {
      price: null,
      creditCount: null,
      memberId: null,
      payment: null,
      selectedPaymentMethod: null,
    };
  },
  async created() {
    this.creditCount = this.$route.query.creditcount;
    this.price = Number(this.$route.query.price);

    const authState = useAuthState();
    this.memberId = authState.memberId;
    amount.value = this.price;
  },
  async mounted() {
    const tossPayments = await loadTossPayments(clientKey);
    const payment = tossPayments.payment({ customerKey });
    this.payment = payment;
  },
  methods: {
    async requestPayment() {
      try {
        const orderId = generateRandomString();
        const paymentRequestPayload = {
          orderId: orderId,
          amount: this.price,
          creditCount: this.creditCount,
          memberId: this.memberId,
          method: this.selectedPaymentMethod,
        };

        await authAxios.post("/api/payment/request", paymentRequestPayload);

        switch (this.selectedPaymentMethod) {
          case "CARD":
            await this.payment.requestPayment({
              method: "CARD", // 카드 및 간편결제
              amount,
              orderId: orderId,
              orderName: `크래딧 ${this.creditCount}개`,
              successUrl: window.location.origin + "/success", // 결제 요청이 성공하면 리다이렉트되는 URL
              failUrl: window.location.origin + "/fail", // 결제 요청이 실패하면 리다이렉트되는 URL
              card: {
                useEscrow: false,
                flowMode: "DEFAULT",
                useCardPoint: false,
                useAppCardOnly: false,
              },
            });
            break;
          case "TRANSFER":
            await this.payment.requestPayment({
              method: "TRANSFER", // 계좌이체 결제
              amount,
              orderId: orderId,
              orderName: `크래딧 ${this.creditCount}개`,
              successUrl: window.location.origin + "/success",
              failUrl: window.location.origin + "/fail",
              transfer: {
                cashReceipt: {
                  type: "소득공제",
                },
                useEscrow: false,
              },
            });
            break;
          case "VIRTUAL_ACCOUNT":
            await this.payment.requestPayment({
              method: "VIRTUAL_ACCOUNT", // 가상계좌 결제
              amount,
              orderId: orderId,
              orderName: `크래딧 ${this.creditCount}개`,
              successUrl: window.location.origin + "/success",
              failUrl: window.location.origin + "/fail",
              virtualAccount: {
                cashReceipt: {
                  type: "소득공제",
                },
                useEscrow: false,
                validHours: 24,
              },
            });
            break;
          case "MOBILE_PHONE":
            await this.payment.requestPayment({
              method: "MOBILE_PHONE", // 휴대폰 결제
              amount,
              orderId: orderId,
              orderName: `크래딧 ${this.creditCount}개`,
              successUrl: window.location.origin + "/success",
              failUrl: window.location.origin + "/fail",
            });
            break;
          case "CULTURE_GIFT_CERTIFICATE":
            await this.payment.requestPayment({
              method: "CULTURE_GIFT_CERTIFICATE", // 문화상품권 결제
              amount,
              orderId: orderId,
              orderName: `크래딧 ${this.creditCount}개`,
              successUrl: window.location.origin + "/success",
              failUrl: window.location.origin + "/fail",
            });
            break;
        }
      } catch (error) {
        console.error("결제 요청 중 오류 발생:", error);
      }
    },
  },
};
</script>

<style scoped>
@import "../../assets/style/phone-main-view-common.css";
.wrapper {
  width: 80%;
  margin: 0 auto;
  margin-top: 100px;
}

.box-section {
  width: 100%;
  background-color: white;
  border-radius: 10px;
  margin-top: 30px;
  margin-right: auto;
  margin-left: auto;
  color: #333d4b;
  text-align: center;
  overflow-x: auto;
  white-space: nowrap;
}

.box-section h1 {
  margin-bottom: 20px;
  font-size: 30x;
  font-weight: 700;
}

/* 결제하기 버튼 */
.button {
  color: #f9fafb;
  background-color: #3182f6;
  margin: 30px 15px 0px 15px;
  font-size: 15px;
  font-weight: 600;
  line-height: 18px;
  white-space: nowrap;
  text-align: center;
  cursor: pointer;
  border: 0 solid transparent;
  transition: background 0.2s ease, color 0.1s ease;
  text-decoration: none;
  border-radius: 7px;
  padding: 11px 16px;
  width: 250px;
}

.button:hover {
  color: #fff;
  background-color: #1b64da;
}

button:disabled,
input:disabled {
  opacity: 80%;
  cursor: not-allowed;
}

#payment-method {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 10px;
}

/* 공통 버튼 스타일 */
.select-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 17px;
  border: 1px solid #000000;
  border-radius: 7px;
  background-color: #ffffff;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s ease, color 0.1s ease;
  padding: 11px 16px;

  flex: 0 0 calc(50% - 10px);

  box-sizing: border-box;
  white-space: nowrap;
  color: #000000;
  margin-top: 20px;
}

.select-button.active {
  background-color: rgb(229 239 255);
}

.select-button:last-child {
  flex: 0 0 calc(100% - 10px);
}

/* 아이콘 이미지 */
.button-icon {
  width: 30px;
  height: 30px;
  margin-right: 6px;
  vertical-align: middle;
}
</style>
