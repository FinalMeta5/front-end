<template>
    <!-- <div class="loading-screen">
        <img src="https://ifh.cc/g/gBFptm.png">
    </div> -->
    <div class="loading-screen">
        <img src="https://ifh.cc/g/qsd3Yv.png">
    </div>
</template>
<script>
export default {
  name: "LoadingView",
  mounted() {
    setTimeout(() => {
      this.$router.push("/loading2");
    }, 1500);
  }
};
</script>
<style scoped>
.loading-screen{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
  }

.loading-screen {
    width: 100%;
    height: 100vh;
    /* background-color: #4192FF; */
    background-color: #ffffff;
    z-index: 100000;
}

img {
  width: 50%;
}
</style>
