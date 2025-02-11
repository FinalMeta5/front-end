<template>
  <header class="header phone-fix ">
    <img class="icon-image " src="/src/assets/images/BURURUNG_BLUE.png">
  </header>
</template>
  
  <script>
  export default {
    name: "HeaderComponent",
  };
  </script>
  
  <style scoped>
  .header {
    height: 66px;
    background-color: #ffffff;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
  }

  .icon-image {
    width: 80px;
    height: 50px;
  }
  </style>