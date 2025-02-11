<template>
    <div class="today-taxi-container">
      <div class="message">오늘은 예약이 없습니다.</div>
      <img src="https://ifh.cc/g/KAROcS.png" alt="이미지" class="image" />
      <div class="title">택시 경로 등록</div>
      <div class="subtitle">여러 사람과 함께 택시를 이용해 보세요</div>
      <button class="button" @click="hostAction">호스트로 이용하기</button>
      <button class="button" @click="guestAction">게스트로 이용하기</button>
    </div>
  </template>
  
  <script>
  export default {
    name: "TodayTaxiListComponent",
    methods: {
      hostAction() {

        console.log("호스트로 이용하기");
      },
      guestAction() {
        console.log("게스트로 이용하기");
      },
    },
  };
  </script>
  
  <style scoped>
  .today-taxi-container {
    text-align: center;
  }
  
  .message {
    font-size: 18px;
    margin-bottom: 20px;
  }
  
  .image {
    width: 100px;
    height: auto;
    margin-bottom: 20px;
  }
  
  .title {
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .subtitle {
    font-size: 16px;
    margin-bottom: 30px;
    color: #555;
  }
  
  .button {
    display: inline-block;
    margin: 10px;
    padding: 15px 30px;
    color: white;
    background-color: #878787;
    border: none;
    border-radius: 10px;
    cursor: pointer;
  }
  
  .button:hover {
    background-color: #6b6b6b;
  }
  </style>
  