<template>
  <div class="result-container">
    <img id="showInformation" src="https://ifh.cc/g/daN7no.png" />
    <div class="result-show">
      <div v-if="car">
        <h3 id="driver-nickname">{{ car.nickname }}</h3>
        <span id="date">{{ car.pickupDate }}</span>

        <div v-if="addressPl">
          <p id="pl1">{{ addressPl.road_address.address_name }}</p>
          <p id="pl2">{{ addressPl.address.address_name }}</p>
        </div>

        <div v-if="addressDs">
          <p id="ds1">{{ addressDs.road_address.address_name }}</p>
          <p id="ds2">{{ addressDs.address.address_name }}</p>
        </div>

        <div v-else>
          <p>주소 정보를 불러오는 중..</p>
        </div>
      </div>
      <div v-else>
        <p>No car information available.</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CarShareInformationComponent',
  props: {
    car: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      addressPl: null, 
      addressDs: null,
    };
  },
  watch: {
    car: {
      immediate: true,
      handler(newCar) {
        if (newCar) {
          if (newCar.latitudePl && newCar.longitudePl) {
            this.getAddress(newCar.latitudePl, newCar.longitudePl, 'Pl');
          }
          if (newCar.latitudeDs && newCar.longitudeDs) {
            this.getAddress(newCar.latitudeDs, newCar.longitudeDs, 'Ds');
          }
        }
      },
    },
  },
  methods: {
    async getAddress(latitude, longitude, type) {
      const apiUrl = 'https://dapi.kakao.com/v2/local/geo/coord2address.json';
      const params = {
        x: longitude,  
        y: latitude,   
        input_coord: 'WGS84',
      };
      try {
        const response = await axios.get(apiUrl, {
          params,
          headers: {
            Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_MAP_API_KEY}`, 
          },
        });

        if (type === 'Pl') {
          this.addressPl = response.data.documents[0]; 
        } else if (type === 'Ds') {
          this.addressDs = response.data.documents[0]; 
        }
      } catch (error) {
        console.error('주소 정보를 가져오는 중 오류가 발생했습니다.', error);
      }
    },
  },
};
</script>

<style scoped>
.result-container {
  position: relative;
  color: #5D5D5D;
}

.result-show {
  position: absolute;
  z-index: 12;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

#showInformation {
  width: 95%;
  z-index: 5;
}

#driver-nickname {
  position: absolute;
  display: inline-block;
  white-space: nowrap;
  top: -105px;
  left: 48px;
  font-size: 23px;
  font-weight: bold;
}

#date {
  position: absolute;
  top: -102px;
  right: 82px;
  color: #ffffff;
  font-size: 14px;
}

#pl1, #pl2 {
  position: absolute;
  white-space: nowrap;
  top: -26px;
  left: 90px;
}

#ds1, #ds2 {
  position: absolute;
  white-space: nowrap;
  bottom: -94px;
  left: 90px;
}

#pl1, #ds1 {
  font-size: 18px; 
  color: #4E4B4B;
}

#pl2{
  margin-top: 31px;
  font-size: 14px;
}

#ds2 {
  margin-bottom: -9px;
  font-size: 14px;
}

</style>
