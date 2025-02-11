<template>
  <div class="mypage phone-main-screen">
        <h1 class="titleH2">차량 공유 서비스 등록</h1>
        <div class="view-context-contain2">
  <div class="car-share-registration">
    <div class="path-summary">
      <!-- <p>출발지: {{ latLngInfo.startLocation }}</p> -->
      <!-- <p>출발지 시도: {{ addressInfo.startSido }}</p>
      <p>출발지 시군구: {{ addressInfo.startSigungu }}</p>
      <p>출발지 도로명: {{ addressInfo.startRoadName }}</p> -->
      
      <!-- <p>도착지: {{ latLngInfo.endLocation }}</p> -->
      <!-- <p>도착지 시도: {{ addressInfo.endSido }}</p>
      <p>도착지 시군구: {{ addressInfo.endSigungu }}</p>
      <p>도착지 도로명: {{ addressInfo.endRoadName }}</p> -->
  </div>

    <!-- 📍 출발지 & 도착지 -->
    <div class = "section-title">경로 확인</div>
    <div class="location-info">
      <div class="final-loca-contain">
        <p class="departure final-addre">📍{{ latLngInfo.startLocation }}</p>
        <p class="final-addre-si">{{ addressInfo.startSido }}</p>
      </div>
      <div class="final-loca-contain">
        <p class="destination final-addre">📍{{ latLngInfo.endLocation }}</p>
        <p class="final-addre-si">{{ addressInfo.endSido }}</p>
      </div>
    </div>

    <!-- 🚗 차량 공유 유형 -->
    <div class="section">
      <div class="section-title">차량 공유 유형</div>
      
      <!-- ✅ 3개씩 묶어서 출력 -->
      <div v-for="(row, rowIndex) in groupedShareTypes" :key="rowIndex" class="button-row">
        <button
          v-for="type in row"
          :key="type"
          @click="selectShareType(type)"
          :class="{ active: selectedShareType === type }"
        >
          {{ type }}
        </button>
      </div>
    </div>

<!-- 📅 출발 일자 선택 -->
<div class="section">
<div class="section-title">출발 일자</div>

      <!-- ✅ 요일 / 날짜 선택 버튼 -->
      <div class="button-group">
        <button @click="selectDayType('요일')" :class="{ active: selectedDayType === '요일' }">
          요일로 선택
        </button>
        <button @click="selectDayType('날짜')" :class="{ active: selectedDayType === '날짜' }">
          날짜로 선택
        </button>
      </div>

      <!-- ✅ 요일 선택 UI -->
      <div v-if="selectedDayType === '요일'" class="days-container">
        
        <button
          v-for="day in weekDays"
          :key="day"
          @click="toggleDay(day)"
          :class="{ active: selectedDays.includes(day) }"
        >
          {{ day }}
        </button>
      </div>
      <div v-if="selectedDayType === '요일'" class="days-count-box">
        <select> 횟수 </select>
      </div>

      <!-- 📌 날짜 선택 input (모바일에서도 예쁘게 보이도록 개선) -->
      <div v-if="selectedDayType === '날짜'" class="date-picker-wrapper">
        <input type="date" class="date-picker-input" v-model="selectedDate" />
        <i class="fas fa-calendar-alt"></i> <!-- 📅 아이콘 추가 -->
      </div>
    </div>


    <!-- ⏰ 출발 시간 선택 -->
    <div class="section">
      <div class = "section-title">출발 시간</div>
      <input
        type="text"
        class="input-field"
        v-model="selectedTime"
        placeholder="출발 시간 선택"
        readonly
        @click="showTimePicker = true"
      />
      <p class="info-text">🚗 도착 시간은 경로 생성에 따라 변동될 수 있습니다.</p>
    </div>

    <!-- 👥 동승 인원 선택 -->
    <div class="section">
      <div class = "section-title">동승 인원</div>
      <select v-model="selectedPassengers" class="input-field">
        <option v-for="num in 9" :key="num" :value="num">{{ num }}명</option>
      </select>
      <p class="info-text">🚸 미성년자는 보호자 동반 시에만 탑승 가능합니다.</p>
    </div>


      <!-- 📌 팝업 형태의 Time Picker -->
      <div v-if="showTimePicker" class="time-picker-overlay">
        <div class="time-picker-container">
          <div class="picker-header">
            <h3>출발 시간 선택</h3>
            <button class="close-btn" @click="showTimePicker = false">✖</button>
          </div>

          <!-- ⏳ 시/분 선택 -->
          <div class="picker-content">
            <select v-model="hour" class="time-select" >
              <option v-for="h in 24" :key="h" :value="h < 10 ? '0' + h : h">
                {{ h < 10 ? '0' + h : h }}
              </option>
            </select>
            <span class="separator">:</span>
            <select v-model="minute" class="time-select" >
              <option v-for="m in minuteOptions" :key="m" :value="m < 10 ? '0' + m : m">
                {{ m < 10 ? '0' + m : m }}
              </option>
            </select>
          

          <!-- ✅ 확인 버튼 -->
          <div class="picker-footer">
            <button class="confirm-btn" @click="confirmTime">확인</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ 등록 버튼 -->
    <button @click="goToFinalCheck" class="register-button">등록하기</button>

    <div v-if="showFinalCheckPopup" class="popup-overlay">
        <div class="popup-container">
          <h2>🚗 차량 공유 서비스 🚗</h2>
          <p style="color: red;"> 입력 정보 최종 확인 </p>
          <div class="final-check"><div class="final-check-line"><strong class="final-check-title">출발지:</strong> <div class="final-check-content">{{ latLngInfo.startLocation }}</div></div></div>
          <div class="final-check"><div class="final-check-line"><strong class="final-check-title">도착지:</strong>  <div class="final-check-content">{{ latLngInfo.endLocation }}</div></div></div>
          <div class="final-check"><div class="final-check-line"><strong class="final-check-title">출발 일자:</strong>  <div class="final-check-content">{{ selectedDate || selectedDays.join(", ") }}</div></div></div>
          <div class="final-check"><div class="final-check-line"><strong class="final-check-title">출발 시간:</strong>  <div class="final-check-content">{{ selectedTime }}</div></div></div>
          <div class="final-check"><div class="final-check-line"><strong class="final-check-title">차량 공유 유형:</strong>  <div class="final-check-content">{{ selectedShareType }}</div></div></div>
          <div class="final-check"><div class="final-check-line"><strong class="final-check-title">동승 인원:</strong>  <div class="final-check-content">{{ selectedPassengers }}명</div></div></div>

          <div class="popup-buttons">
            <button class="cancel-btn" @click="showFinalCheckPopup = false">취소</button>
            <button class="confirm-btn" @click="goToCarServiceFinalRegi">확정 등록</button>
          </div>
        </div>
    </div>

  </div>
</div>
  </div>
</template>


<script>
import axios from 'axios';
export default {
  name: "CarShareServiceRegiSecondView",
  data() {
    return {
      latLngInfo: {
          startLocation: this.$route.query.startLocation || "",
          endLocation: this.$route.query.endLocation || "",
          startLat: this.$route.query.startLat || null,
          startLng: this.$route.query.startLng || null,
          endLat: this.$route.query.endLat || null,
          endLng: this.$route.query.endLng || null
      },
      addressInfo: {
          startSido: this.$route.query.startSido || "",
          startSigungu: this.$route.query.startSigungu || "",
          startRoadName: this.$route.query.startRoadName || "",
          endSido: this.$route.query.endSido || "",
          endSigungu: this.$route.query.endSigungu || "",
          endRoadName: this.$route.query.endRoadName || ""
      },
      showTimePicker: false, // 🕒 시간 선택기 표시 여부
      selectedTime: "", // ⏰ 선택한 시간
      selectedDate: "", // 📅 선택한 날짜
      selectedPassengers: 1, // 👥 기본 동승 인원
      selectedShareType: "", // 🚗 선택한 차량 공유 유형
      selectedDayType: "요일", // 📅 요일/날짜 선택
      selectedDays: [], // ✅ 사용자가 선택한 요일 저장 (ex. ["월", "수", "금"])
      weekDays: ["월", "화", "수", "목", "금", "토", "일"], // ✅ 요일 리스트
      shareTypes: ["출퇴근", "장보기", "예비군", "콘서트", "스포츠", "기타"], // 🚗 차량 공유 유형
      hour: "00",
      minute: "00",
      minuteOptions: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55], // ⏳ 5분 단위 선택
      pickupDate : "",

      showFinalCheckPopup : false
    }
  },
  computed: {
      // 🚗 shareTypes를 3개씩 나눠서 배열로 반환
      groupedShareTypes() {
        const chunkSize = 3;
        const groups = [];
        for (let i = 0; i < this.shareTypes.length; i += chunkSize) {
          groups.push(this.shareTypes.slice(i, i + chunkSize));
        }
        return groups;
      }
    },

  mounted() {
    console.log("🚀 [받은 출발지]:", this.$route.query.startLocation);
    console.log("🚀 [받은 도착지]:", this.$route.query.endLocation);
    console.log("📍 [출발지 위도]:", this.$route.query.startLat);
    console.log("📍 [출발지 경도]:", this.$route.query.startLng);
    console.log("📍 [도착지 위도]:", this.$route.query.endLat);
    console.log("📍 [도착지 경도]:", this.$route.query.endLng);
    console.log("🏢 [출발지 시도]:", this.$route.query.startSido);
    console.log("🏢 [출발지 시군구]:", this.$route.query.startSigungu);
    console.log("🛣 [출발지 도로명]:", this.$route.query.startRoadName);
  },
  
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    confirmTime() {
      this.selectedTime = `${this.hour}:${this.minute}`;
      this.showTimePicker = false;
    },
    selectShareType(type) {
      this.selectedShareType = type;
    },
    selectDayType(type) {
      this.selectedDayType = type;
    },
    selectDayType(type) {
      this.selectedDayType = type;
    },
    selectDayType(type) {
    this.selectedDayType = type;
    // ✅ "요일" 선택 시 날짜 초기화
    if (type === "요일") {
      this.selectedDate = "";
    } else {
      this.selectedDays = []; // "날짜" 선택 시 요일 초기화
    }},
    goToFinalCheck () {      
      if(!this.selectedShareType) {
        alert("유형 타입을 선택해주세요.");
        return;
      }
      if(!this.selectedDate && this.selectedDays.length === 0) {
        alert("출발 일자를 선택해주세요");
        return;
      }
      if(!this.selectedTime) {
        alert("출발 시간을 입력해주세요.");
        return;
      }
      this.pickupDate = `${this.selectedDate}T${this.selectedTime}`;
      const selectedDateTime = new Date(this.pickupDate).getTime(); // 선택한 시간 (밀리초)
      const currentTime = new Date().getTime(); // 현재 시간 (밀리초)
        // ✅ 과거 시간이면 다시 선택하도록
      if (selectedDateTime < currentTime) {
        alert("지난 시점입니다. 다시 선택해주세요.");
        return;
      }

      this.showFinalCheckPopup = true;
    }, 
    goToCarServiceFinalRegi() {
      
      this.pickupDate = `${this.selectedDate}T${this.selectedTime}`;

      const requestData = {
        //출발지
        pickupLoc : this.latLngInfo.startLocation,
        latitudePl : this.latLngInfo.startLat,
        longitudePl : this.latLngInfo.startLng,
        sidoPl: this.addressInfo.startSido,
        sigunguPl: this.addressInfo.startSigungu,
        roadnamePl: this.addressInfo.startRoadName,
        //도착지
        destination: this.latLngInfo.endLocation,
        latitudeDs: this.latLngInfo.endLat,
        longitudeDs: this.latLngInfo.endLng,
        sidoDs: this.addressInfo.endSido,
        sigunguDs: this.addressInfo.endSigungu,
        roadnameDs: this.addressInfo.endRoadName,
        // 그 외
        passengersNum : this.selectedPassengers,
        pickupDate : this.pickupDate,
        category : this.selectedShareType
      };
      
      console.log("🚀 [전송 데이터]:", requestData);

      axios.post("http://localhost:8080/api/car-share/register", requestData, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}` // JWT 토큰 추가
          }
      })
        .then(response => {
          alert("차량 공유 서비스가 등록되었습니다.");
          this.$router.push("/mypage");
        })
        .catch(error => {
          console.error(" 등록 실패 : ", error);
          alert("등록 실패. 다시 시도.")
        })
    },

  // ✅ 요일 선택 (토글 방식)
  toggleDay(day) {
    if (this.selectedDays.includes(day)) {
      // 이미 선택된 요일이면 제거
      this.selectedDays = this.selectedDays.filter(d => d !== day);
    } else {
      // 선택되지 않은 요일이면 추가
      this.selectedDays.push(day);
    }
  },
  selectDayType(type) {
  this.selectedDayType = type;
  
  // ✅ "요일" 선택 시 날짜 초기화
  if (type === "요일") {
    this.selectedDate = "";
  } else {
    this.selectedDays = []; // "날짜" 선택 시 요일 초기화
  }
},

    // ✅ 요일 선택 (토글 방식)
    toggleDay(day) {
      if (this.selectedDays.includes(day)) {
        // 이미 선택된 요일이면 제거
        this.selectedDays = this.selectedDays.filter(d => d !== day);
      } else {
        // 선택되지 않은 요일이면 추가
        this.selectedDays.push(day);
      }
    }
  },
};
</script>


<style>
@import "../../assets/style/phone-main-view-common.css";
/* 📅 날짜 선택 input 스타일 */

.days-count-box {
background-color: #ffffff;
margin-top: 7px;
display: flex;
}

.date-picker-input {
width: 100%;
padding: 12px;
border: 1px solid #ddd;
border-radius: 8px;
font-size: 16px;
background: white;
text-align: center;
cursor: pointer;
appearance: none; /* ✅ 기본 브라우저 스타일 제거 */
-webkit-appearance: none;
-moz-appearance: none;
}

/* 📅 아이콘 위치 */
.date-picker-wrapper i {
position: absolute;
right: px;
top: 50%;
transform: translateY(-0%);
color: #53647c;
font-size: 18px;
}

/* 📌 모바일 환경에서 날짜 선택 UI 개선 */
@media (max-width: 600px) {
.date-picker-input {
  font-size: 14px;
  padding: 10px;
}

.date-picker-wrapper i {
  right: 10px;
  font-size: 16px;
}
}

/* ✅ 시간 선택 입력 필드 */
    .time-input {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 16px;
      background: white;
      text-align: center;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .time-input i {
      font-size: 18px;
      color: #4192ff;
    }

    /* 📌 팝업 형태의 Time Picker */
    .time-picker-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* ⏳ Time Picker 컨테이너 */
    .time-picker-container {
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      text-align: center;
      min-width: 280px;
    }

    /* 헤더 스타일 */
    .picker-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .picker-header h3 {
      font-size: 18px;
      font-weight: bold;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      color: #777;
    }

    /* ⏳ 시/분 선택 */
    .picker-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .time-select {
      font-size: 16px;
      padding: 8px;
      border-radius: 8px;
      border: 1px solid #ddd;
    }

    /* 시/분 구분자 */
    .separator {
      font-size: 18px;
      font-weight: bold;
      color: #555;
    }

    /* ✅ 확인 버튼 */
    .picker-footer {
      margin-top: 15px;
    }

    .confirm-btn {
      background: #4192ff;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
    }
  /* 요일 선택 버튼 스타일 */
.days-container {
  display: flex;
  gap: 7px;
  margin-top: 1px;
  height: 2.9rem;
}

.days-container button {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}

/* ✅ 선택된 요일 강조 */
.days-container button.active {
  background: #9098ac;
  color: white;
  font-weight: bold;
}

.final-loca-contain {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  

}
.section-title{
  font-size: large;
  font-weight: bold;
  justify-self: start;
  margin-top: 2rem;
}
/* 전체 스타일 */
.car-share-registration {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background: #efefef;
}

/* 헤더 */
.header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.back-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

/* 지도 */
.map-container {
  width: 100%;
  height: 200px;
  border-radius: 10px;
  margin-bottom: 10px;
  background: #ddd;
  overflow: hidden;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 출발 & 도착 정보 */
.location-info {
  padding: 8px;
  background: white;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 15px;
}

/* 버튼 그룹 */
.button-group {
  display: flex;
  gap: 10px;
  margin: 5px 0px;
}

.button-group button {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}

.button-group button.active {
  background: #53647c; 
  color: white;
  font-weight: bold;
}

/* 입력 필드 */
.input-field {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  text-align: center;
  cursor: pointer;
}

/* 등록 버튼 */
.register-button {
  width: 100%;
  padding: 14px;
  background: #4192ff;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top : 10px; 
}

/* 🚗 차량 공유 유형 버튼 행 스타일 */
.button-row {
display: flex;
justify-content: space-between;
gap: 10px;
margin-bottom: 10px;
}

/* 🚗 버튼 스타일 */
.button-row button {
flex: 1;
padding: 12px;
border: 1px solid #ddd;
background: white;
border-radius: 8px;
cursor: pointer;
font-size: 14px;
text-align: center;
min-width: 90px; /* 버튼 최소 크기 설정 */
}

/* ✅ 선택된 버튼 스타일 */
.button-row button.active {
background: #53647c;
color: white;
font-weight: bold;
}

/* 📱 반응형 (작은 화면일 때 버튼 크기 조정) */
@media (max-width: 400px) {
.button-row {
  flex-wrap: wrap; /* 작은 화면에서는 줄바꿈 허용 */
}
.button-row button {
  flex-basis: calc(33.33% - 10px); /* 3개씩 정렬 유지 */
}
}


.final-addre {
  justify-self: start;
  margin-top: 1rem;
  font-weight: bold;
}

.final-addre-si{
  color: #ffffff;
  background-color: #fe9e4a;
  padding : 0.1rem  0.3rem;
  border-radius: 10px;
  margin-top: 1rem;

}

/* ✅ 팝업 배경 (어두운 오버레이 효과) */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

/* ✅ 팝업 컨테이너 */
.popup-container {
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 320px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* ✅ 버튼 스타일 */
.popup-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.cancel-btn {
  background: #ccc;
  color: black;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  flex: 1;
  margin-right: 10px;
}

.confirm-btn {
  background: #4192ff;
  color: white;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  flex: 1;
}

.final-check{
  justify-content: space-between;
}

.final-check-line {
  display: flex;
  width: 100%;
  justify-items: start;
  
}
.final-check-content {
  width: 60%;
}

.final-check-title{
  width: 40%;
}
</style>