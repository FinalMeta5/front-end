<template>
  <div id="appo">
    <div class="container">
      <!-- 좌측 화면 -->
      <LeftScreenComponent class="side-content" />

      <!-- 메인 화면 -->
      <div class="main-wrapper phone-fix">
        <!-- 상단 헤더 -->
        <HeaderComponent />

        <!-- 상단 네비게이션 (페이지 이동) -->
        <TopNavComponent/>

        <!-- 메인 컨텐츠 -->
        <div class="router-view">
          <router-view />
        </div>

        <!-- 하단 네비게이션 (페이지 이동) -->
        <BottomNavComponent/>
      </div>

      <!-- 우측 화면 -->
      <RightScreenComponent class="side-content" />
    </div>
  </div>
</template>

<script>
import HeaderComponent from "./components/commons/HeaderComponent.vue";
import LeftScreenComponent from "./components/layout/LeftScreenComponent.vue";
import RightScreenComponent from "./components/layout/RightScreenComponent.vue";
import TopNavComponent from "./components/commons/TopNavComponent.vue"
import BottomNavComponent from "./components/commons/BottomNavComponent.vue"
export default {
  name: "App",
  components: {
    LeftScreenComponent,
    RightScreenComponent,
    HeaderComponent,
    TopNavComponent,
    BottomNavComponent,
  },
};
</script>

<style>
@import "style.css";
@import "/src/assets/style/app-vue-common.css"
</style>