<template>
      <h2>🚘 나의 과거 차량 탑승 내역</h2>
  
      <div v-if="loading" class="loading">⏳ 불러오는 중...</div>
      <div v-if="error" class="error">{{ error }}</div>
  
      <ul v-if="pastList.length > 0">
        <li v-for="(ride, index) in pastList" :key="index" class="ride-item">
          <div>
            
              <span class="date">{{ ride.pickupDate }}</span>
              <div class="loca-area">
                <p class="loca">{{ ride.pickupLoc }}</p>
                <p class="loca">{{ ride.destination }}</p>
              </div>
            <div>
              <span>(리뷰) {{ ride.state }}</span>
              <span class="status" :class="{ completed: ride.completed }"> </span>
            </div>
          </div>
        </li>
      </ul>
  
      <div v-else-if="!loading && !error" class="no-data">📌 과거 탑승 내역이 없습니다</div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        userId: localStorage.getItem("memberId"),
        pastList: [],
        loading: false,
        error: null
      };
    },
    methods: {
      async fetchPastParticipationList() {
        this.loading = true;
        this.error = null;
  
        try {
        // const response = await  authAxios.get(
        //   `/api/carshare/registration/past-list?userId=${this.userId}`
        // );
        const response = await axios.get(
          `http://localhost:8080/api/carshare/registration/past-list?userId=${this.userId}`
        );
        console.log("data : ", response.data);
          if (response.status === 200) {
            this.pastList = response.data || [];
          } else {
            this.error = "(정보) 과거 탑승 내역이 없습니다.";
          }
        } catch (err) {
          this.error = "데이터를 불러오는 중 오류가 발생했습니다.";
        } finally {
          this.loading = false;
        }
      }
    },
    mounted() {
      this.fetchPastParticipationList();
    }
  };
  </script>
  
  <style scoped>
  .past-list-container {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    border-radius: 10px;
    background: #f9f9f9;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .loca-area {
    margin-bottom: 1rem;
    margin-top: 1rem;
  }

  .loca {
    padding: 0;
    margin-bottom: 0;
  }
  
  h2 {
    text-align: center;
    color: #333;
    font-size: 1.2rem;
  }
  
  .loading, .error, .no-data {
    text-align: center;
    font-size: 16px;
    margin-top: 10px;
  }
  
  .error {
    color: red;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  span.date {
    padding-right: 7rem;
  }

  .ride-item {
    justify-content: space-between;
    background: #fff;
    margin: 10px 0;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .date {
    font-weight: bold;
    color: #555;
  }
  
  .location {
    flex: 1;
    margin-left: 10px;
    font-size: 14px;
  }
  
  .status {
    font-weight: bold;
    color: gray;
  }
  
  .completed {
    color: green;
  }
  </style>
  