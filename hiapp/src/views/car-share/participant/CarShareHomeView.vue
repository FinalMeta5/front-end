<template>
    <div class="home phone-main-screen">
      <h1 class="title">{{ $t('context.shareCar') }}</h1>
      <span class="text">{{ $t('context.getTogether') }}</span>
      <div class="button-container">
        <button class="image-button" @click="sendRequest('출퇴근')">
          <img src="https://ifh.cc/g/xX2n1K.png" alt="출퇴근 이미지"/>
        </button>
        <button class="image-button" @click="sendRequest('장보기')">
          <img src="https://ifh.cc/g/HqXY1G.png" alt="장보기 이미지"/>
        </button>
        <button class="image-button" @click="sendRequest('예비군')">
          <img src="https://ifh.cc/g/PRDM0A.png" alt="예비군 이미지"/>
        </button>
        <button class="image-button" @click="sendRequest('콘서트')">
          <img src="https://ifh.cc/g/roVBvK.png" alt="콘서트 이미지"/>
        </button>
        <button class="image-button" @click="sendRequest('스포츠')">
          <img src="https://ifh.cc/g/zFn2L5.png" alt="스포츠 이미지"/>
        </button>
        <button class="image-button" @click="sendRequest('기타')">
          <img src="https://ifh.cc/g/x0o8sx.png" alt="기타 이미지"/>
        </button>
      </div>
  
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <span class="close-btn" @click="closeModal">&times;</span>
          <h2 class="list-title">이용 가능한 차량 목록</h2><br>
          <ul>
            <!-- selectedCarList에 값이 없을 경우 "없음" 출력 -->
            <li v-if="selectedCarList.length === 0" class="no">이용 가능한 차량 목록이 없습니다</li>
            <li v-for="car in selectedCarList" :key="car.id" @click="goToDetail(car)">
              <div class="car-info">
                <div><strong>🕒</strong> {{ car.pickupDate }}</div>
                <div><strong>📍출발지 : </strong> {{ car.pickupLoc }}</div>
                <div><strong>📍도착지 : </strong> {{ car.destination }}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
  
      <div class="button-container2">
        <div class="around-car">
          <img class="moving-image" src="https://ifh.cc/g/ch51wM.png" alt="움직이는 이미지">
          <router-link to="/carshare/map">
            <button id="map-btn">{{ $t('context.checkSharedCarsAroundMe') }}</button>
          </router-link>
        </div><br><br>
      </div>
    </div><br><br>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'CarShareHomeView',
    data() {
      return {
        selectedCarList: [],
        showModal: false,
        addressPl: null, 
        addressDs: null,
      };
    },
    methods: {
      async sendRequest(category) {
        try {
          const response = await authAxios.get(`/api/carshare/registration/list/category?category=${category}`);
          if (response.status === 200 && response.data) {
            this.selectedCarList = response.data; 
            console.log(`${category} data: `, this.selectedCarList);
            this.showModal = true; 
          }
        } catch (error) {
          console.error(`(${category}) 탑승 가능한 차량 목록을 가져오는 중 오류가 발생했습니다.`, error);
        }
      },
      closeModal() {
        this.showModal = false;
      },
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
      goToDetail(car) {
        this.$router.push({
          path: '/carshare/detail',
          query: {
            driverId: car.memberId,
            carShareRegiId: car.carShareRegiId,
            startRoadAddress: this.addressPl?.road_address?.address_name || '',
            startAddress: this.addressPl?.address?.address_name || '',
            endRoadAddress: this.addressDs?.road_address?.address_name || '',
            endAddress: this.addressDs?.address?.address_name || '',
            latitudePl: car.latitudePl,
            longitudePl: car.longitudePl,
            latitudeDs: car.latitudeDs,
            longitudeDs: car.longitudeDs
          }
        });
      }
    }
  };
  </script>
  
  <style scoped>
  @import "../../../style.css";
  @import "../../../assets/style/phone-main-view-common.css";
  
  .list-title {
    font-weight: bold;
  }

  .title {
    margin-top: 175px;
    font-weight: bold;
    font-size: 22px;
    margin-bottom: 6px;
  }

  .text {
    font-size: 0.8rem;
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    width: 90%;
    max-width: 500px;
    text-align: center;
    position: relative;
  }
  
  .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 30px;
    cursor: pointer;
  }
  
  .car-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 10px;
    font-size: 15px;
    white-space: nowrap; 
    overflow: hidden; 
    text-overflow: ellipsis; 
  }

  .no {
    font-size: 15px;
  }
  
  .button-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    width: 90%;
    margin: 0 auto;
    padding: 20px;    position: relative;
    overflow: hidden;
  }
  
  .button-container2 {
    width: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
  }
  
  .around-car {
    width: 85%;
    height: 120px;
    background-color: #878787;
    border-radius: 10px;
  }
  
  button {
    padding: 10px;
    border: 2px solid #d9d9d9;
    color: white;
    font-size: 16px;
    border-radius: 10px;
    cursor: pointer;
    text-align: center;
  }
  
  .image-button {
    width: 100%;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
  }
  
  .image-button img {
    width: 85%;
    border-radius: 10px;
  }

ul {
  max-height: 350px;  
  overflow-y: auto;  
}

  #map-btn {
    width: 100%;
    padding: 0px;
    color: white;
    font-size: 14px;
    border-radius: 10px;
    cursor: pointer;
    text-align: center;
    text-transform: uppercase;
    background-color: #878787;
    border: none;
    margin-top: 75px;
    z-index: 2;
    position: relative;
  }
  
  .moving-image {
    position: absolute;
    top: calc(100% - 110px);
    left: -90%;
    transform: translateY(10%);
    animation: moveImage 2s linear infinite;
    width: 15%;
    z-index: 1;
  }

.modal-content li {
    background-color: white;
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 8px;
    border: 1px solid #ddd;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.2s ease-in-out;
}

.modal-content li:hover {
    transform: translateY(-2px);
    background-color: #f9f9f9;
}

.modal-content li .car-info {
    margin-bottom: 8px;
    font-size: 14px;
    color: #333;
}

.modal-content li .car-info div {
    margin: 5px 0;
}


.modal-content li.no {
    background-color: #f1f1f1;
    color: #888;
    text-align: center;
    padding: 20px;
    font-size: 16px;
    font-weight: bold;
    border-radius: 8px;
}
  @keyframes moveImage {
    0% {
      left: -90%;
    }
    50% {
      left: 45%;
    }
    100% {
      left: 45%;
    }
  }
  
  @media (max-width: 768px) {
    .button-container {
      width: 100vw;
    }
  
    .button-container2 {
      width: 100vw;
    }
  
    .around-car {
      width: 90vw;
    }
  }

  </style>
  