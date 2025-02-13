<template>
    <div class="car-info">
      <div>
    <h1>전체 공유 차량 목록</h1>
    <table>
      <thead>
        <tr>
          <th>차량 ID</th>
          <th>차량 번호</th>
          <th>회원 ID</th>
          <th>출발 위치</th>
          <th>목적지 위치</th>
          <th>승객 수</th>
          <th>출발 날짜</th>
          <th>카테고리</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="car in carList" :key="car.car_share_regi_id">
          <td>{{ car.carId }}</td>
          <td>{{ car.carShareRegiId }}</td>
          <td>{{ car.memberId }}</td>
          <td>{{ car.latitudePl }}, {{ car.longitudePl }}</td>
          <td>{{ car.latitudeDs }}, {{ car.longitudeDs }}</td>
          <td>{{ car.passengersNum }}</td>
          <td>{{ car.pickupDate }}</td>
          <td>{{ car.category }}</td>
        </tr>
      </tbody>
    </table>
  </div>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    name: 'AllCarListComponent',
    data() {
    return {
      carList: []
    };
  },methods: {
    fetchCarList() {
      axios.get('https://api.hifive5.shop/api/carshare/registration/all-list')  // 백엔드 API 주소로 변경
        .then(response => {
          this.carList = response.data;
        })
        .catch(error => {
          console.error('차량 목록 조회 실패:', error);
        });
    }
  },
  mounted() {
    this.fetchCarList();
  }
};
</script>

<style scoped>
.car-info {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  margin-top: 100px;
}
table {
  width: 100%;
  border-collapse: collapse;
}

table, th, td {
  border: 1px solid black;
}

th, td {
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}
</style>