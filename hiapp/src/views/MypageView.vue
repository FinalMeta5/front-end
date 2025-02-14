<template>
  <div class="phone-main-screen">
      <h1 class="titleH1">{{ $t('mypage.title') }}</h1>
      <div class="my-page-container">
        <section class="profile-section">
          <div class="profile-icon" @click="onProfileClick">
            <img :src="userData.profileUrl" alt="프로필" />
          </div>
          

          <div class="profile-info">
            <p class="user-name">{{ nickname }}</p>
          </div>
        </section>

        <input
          type="file"
          ref="fileInput"
          accept="image/*"
          style="display: none"
          @change="onFileChange"
        />
        
        <!-- 차량 공유/이용/택시 이용 정보 영역 -->
        <section class="usage-section">
          <div class="usage-card" @click="goToSharedCars">
            <p class="count">{{ userData.carRegistrationCount }}{{ $t('mypage.useCount') }}</p>
            <p class="label">{{ $t('mypage.carShareCount') }}</p>
          </div>
          <div class="usage-card" @click="goToUsedCars">
            <p class="count">{{ userData.carJoinCount }}{{ $t('mypage.useCount') }}</p>
            <p class="label">{{ $t('mypage.carUsageCount') }}</p>
          </div>
          <div class="usage-card" @click="goToTaxi">
            <p class="count">{{ userData.taxiJoinCount }}{{ $t('mypage.useCount') }}</p>
            <p class="label">{{ $t('mypage.taxiUsageCount') }}</p>
          </div>
        </section>

        <!-- 메뉴 버튼 영역 -->
        <section class="menu-section">
          <button class="menu-btn" @click="goToMemberInfo">
            {{ $t('mypage.updateMemberInfo') }}
          </button>
          <button class="menu-btn" @click="goToPWChange">{{ $t('mypage.updatePassword') }}</button>
          <button class="menu-btn" @click="goToCreditHistory">
            {{ $t('mypage.selectCreditList') }}
          </button>
          <CarSearchButton />
          <MyCarShareSearchButton />
        </section>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { authAxios, useAuthState } from "../store/auth/auth.js";
import CarSearchButton from "../components/car-share/CarSearchButton.vue";
import MyCarShareSearchButton from "../components/car-share/MyCarShareSearchButton.vue";
import PastCarListComponent from '../components/car-share/participant/PastCarListComponent.vue';

const { nickname } = useAuthState();
const userData = ref({
  nickname: nickname.value ? nickname.value : "",
  profileUrl: "https://ifh.cc/g/qsAZyn.png",
  carRegistrationCount: 0,
  carJoinCount: 0,
  taxiJoinCount: 0,
});

const fileInput = ref(null);
const DEFAULT_PROFILE_IMAGE = "https://ifh.cc/g/qsAZyn.png";
const onProfileClick = () => {
  fileInput.value.click();
};

const onFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const formData = new FormData();
    formData.append("profileImage", file);
    const response = await authAxios.post(
      "/api/mypage/upload-profile",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    userData.value.profileUrl = response.data;
  } catch (error) {
    console.error("프로필 이미지 업로드 실패: ", error);
  }
};

const router = useRouter();

onMounted(async () => {
  const response = await authAxios.get("/api/mypage");
  userData.value.carJoinCount = response.data.carJoinCount;
  userData.value.carRegistrationCount = response.data.carRegistrationCount;
  userData.value.taxiJoinCount = response.data.taxiJoinCount;
  userData.value.profileUrl = response.data.imageUrl
    ? response.data.imageUrl
    : DEFAULT_PROFILE_IMAGE;
});

// 각 버튼 클릭 시 이동할 라우터 지정
// function goToMemberInfo() {
//   router.push('/member-info')
// }
// function goToPWChange() {
//   router.push('/pw-change')
// }
function goToCreditHistory() {
  router.push("/credit-history");
}
// function goToSharedCars() {
//   router.push('/shared-cars')
// }
// function goToUsedCars() {
//   router.push('/used-cars')
// }
// function goToTaxi() {
//   router.push('/taxi-usage')
// }
</script>

<style scoped>
@import "../style.css";
@import "../assets/style/phone-main-view-common.css";
.phone-main-screen {
  padding: 20px;
}

.titleH1 {
  text-align: left;
  font-size: 1.5rem;
  margin-left: 35px;
  margin-top: 150px;
  margin-bottom: 10px;
}

.my-page-container {
  width: 90%;
  margin: 0 auto;
  padding: 16px;
  box-sizing: border-box;
}

.icon-div {
  width: 95%;
}

/* 프로필 영역 */
.profile-section {
  display: flex;
  align-items: center;
  margin-top: 20px;
}
.profile-icon img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  cursor: pointer;
}
.profile-info {
  margin-left: 30px;
}
.user-name {
  font-size: 18px;
  font-weight: bold;
}

/* 차량 공유/이용/택시 이용 영역 */
.usage-section {
  display: flex;
  margin-top: 20px;
}
.usage-card {
  flex: 1;
  text-align: center;
  padding: 12px;
  background-color: #f3f3f3;
  margin-right: 8px;
  border-radius: 8px;
  cursor: pointer;
}
.usage-card:last-child {
  margin-right: 0;
}
.count {
  font-size: 16px;
  font-weight: bold;
}
.label {
  font-size: 14px;
  margin-top: 4px;
}

/* 메뉴 버튼 영역 */
.menu-section {
  margin-top: 20px;
}
.menu-btn {
  width: 100%;
  display: block;
  text-align: left;
  padding: 12px;
  background-color: #fff;
  border: 1px solid #eee;
  margin-bottom: 8px;
  cursor: pointer;
  border-radius: 8px;
  font-size: 14px;
}
.menu-btn:last-child {
  margin-bottom: 0;
}

@media (max-width: 600px) {
  .view-context-contain {
    width: 100vw;
  }
}
</style>
