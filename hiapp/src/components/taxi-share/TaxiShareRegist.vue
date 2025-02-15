<template>
    <div class="taxi-share-regist">
        <div class="header">
            <h1>택시 공유 등록</h1>
        </div>

        <label for="departure-time">예상 출발시간</label>
        <input type="text" id="departure-time" v-model="formattedPickupTime" @click="showDateTimeModal = true" readonly
            required />
        <p class="note">⚠️도착시간은 교통 상황에 따라 변경될 수 있습니다.</p>

        <div class="checkbox">
            <input type="checkbox" id="time-collaboration" v-model="timeNego" />
            <label for="time-collaboration">시간 협의 가능</label>
        </div>

        <label for="estimated-amount">예상 소요금액</label>
        <input type="number" id="estimated-amount" v-model="estimatedAmount" placeholder="₩" />

        <p class="note">💡예상 소요금액은 차량용에 필요한 총 금액입니다. (1/N 가격 아님)</p>

        <label for="max-passengers">최대 승차 인원</label>
        <select id="max-passengers" v-model="passengersNum">
            <option v-for="number in [1, 2, 3, 4]" :key="number" :value="number">{{ number }}</option>
        </select>
        <p class="note">⚠️중형택시 기준 최대 승차인원은 운전자 제외 4명입니다. (3명 권장)</p>

        <label for="open-kakao-link">오픈 카톡 링크</label>
        <input type="text" id="open-kakao-link" v-model="openchatLink" placeholder="오픈 카톡 링크를 입력하세요." />

        <label for="open-kakao-code">오픈 카톡 입장코드</label>
        <input type="text" id="open-kakao-code" v-model="openchatCode" placeholder="오픈 카톡 입장코드를 입력하세요." />

        <button @click="submit">등록하기</button>

        <!-- 새로운 날짜/시간 선택 모달 -->
        <div v-if="showDateTimeModal" class="modal-overlay" @click="showDateTimeModal = false">
            <div class="modal-content" @click.stop>
                <h3>출발 시간 선택</h3>
                <input type="date" v-model="selectedDate">
                <input type="time" v-model="selectedTime">
                <button @click="confirmDateTime">확인</button>
            </div>
        </div>

    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'TaxiShareRegist.vue',
    components: {

    },
    created() {
        console.log(history.state);
        if (history.state.latLngInfo != undefined) {
            this.startLat = history.state.latLngInfo.startLat;
            this.startLng = history.state.latLngInfo.startLng;
            this.endLat = history.state.latLngInfo.endLat;
            this.endLng = history.state.latLngInfo.endLng;
            this.startLocation = history.state.latLngInfo.startLocation;
            this.endLocation = history.state.latLngInfo.endLocation;
        }
    },
    data() {
        return {
            memberId: this.getMemberIdFromLocalStorage(),
            pickupTime: '',
            timeNego: false,
            estimatedAmount: '',
            passengersNum: null,
            openchatLink: '',
            openchatCode: '',
            showModal: false,
            startLat: '',
            startLng: '',
            endLat: '',
            endLng: '',
            startLocation: '',
            endLocation: '',
            showDateTimeModal: false,
            showLoginModal: false, // 로그인 모달 표시 여부
        };
    },
    computed: {
        formattedPickupTime() {
            if (this.pickupTime) {
                return this.pickupTime.toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                });
            }
            return '';
        }
    },
    mounted() {

    },
    methods: {
        // localStorage에서 memberId를 가져오는 메소드
        getMemberIdFromLocalStorage() {
            const memberId = localStorage.getItem('memberId');
            return memberId ? parseInt(memberId) : null;  // memberId가 없으면 null을 반환
        },
        selectTime(time) {
            this.pickupTime = time;
            this.showModal = false;
        },
        confirmDateTime() {
            if (this.selectedDate && this.selectedTime) {
                this.pickupTime = new Date(`${this.selectedDate}T${this.selectedTime}`);
                this.showDateTimeModal = false;
            }
        },
        submit() {
            const taxiShare = {
                memberId: this.memberId,
                passengersNum: this.passengersNum,
                pickupLocation: this.startLocation,
                latitudePL: this.startLat,
                longitudePL: this.startLng,
                pickupTime: this.pickupTime ? this.pickupTime.toISOString() : null,
                destination: this.endLocation,
                latitudeDS: this.endLat,
                longitudeDS: this.endLng,
                openchatLink: this.openchatLink,
                openchatCode: this.openchatCode,
                estimatedAmount: this.estimatedAmount,
                timeNego: this.timeNego,
            };
            authAxios.post('/api/taxi/insert', taxiShare)
                .then(response => {
                    console.log('TaxiShare 객체가 성공적으로 전송되었습니다.');
                    this.$router.push('/taxi-share/regist-complete');
                })
                .catch(error => {
                    console.error('에러 발생:', error);
                    // 에러 처리 로직
                });
            console.log(taxiShare);
        }
    }
};
</script>

<style scoped>
/* 전체 페이지 스타일 */
.taxi-share-regist {
    padding: 32px;
    /* 전체 패딩 증가 */
    margin: 120px auto 60px;
    /* 위, 아래 마진 증가 */
    max-width: 620px;
    background: #f9f9f9;
    border-radius: 14px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* 헤더 스타일 */
.header {
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
    /* 간격 증가 */
}

h1 {
    font-size: 24px;
    font-weight: bold;
    color: #333;
}

/* 라벨 스타일 */
label {
    display: block;
    font-size: 15px;
    font-weight: 600;
    color: #444;
    margin-bottom: 8px;
    /* 입력 필드와 간격 증가 */
}

/* 입력 필드 공통 스타일 */
input[type="text"],
input[type="number"],
select {
    width: 100%;
    padding: 14px;
    /* 패딩 증가 */
    border: 1px solid #ddd;
    border-radius: 28px;
    /* 더 둥근 디자인 */
    font-size: 17px;
    margin-bottom: 18px;
    /* 입력 필드 간 간격 증가 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: border 0.2s, box-shadow 0.2s;
}

/* 입력 필드 포커스 효과 */
input:focus,
select:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 3px 10px rgba(0, 123, 255, 0.2);
}

/* 출발 시간 입력 필드 */
#departure-time {
    background: #fff url('https://cdn-icons-png.flaticon.com/512/2838/2838779.png') no-repeat right 16px center;
    background-size: 22px;
    cursor: pointer;
}

/* 체크박스 스타일 */
.checkbox {
    display: flex;
    align-items: center;
    margin-top: 12px;
    /* 체크박스 간격 증가 */
}

.checkbox input {
    width: 20px;
    height: 20px;
    margin-right: 10px;
    accent-color: #007bff;
}

/* 안내 문구 스타일 */
.note {
    font-size: 14px;
    color: #777;
    margin-bottom: 16px;
    /* 문구 간격 증가 */
}

/* 등록 버튼 스타일 */
button {
    width: 100%;
    padding: 16px;
    /* 버튼 크기 증가 */
    font-size: 19px;
    font-weight: bold;
    color: white;
    background: #007bff;
    border: none;
    border-radius: 32px;
    /* 버튼 더 둥글게 */
    cursor: pointer;
    transition: 0.3s;
    margin-top: 20px;
    /* 버튼과 위 요소 간격 증가 */
}

button:hover {
    background: linear-gradient(to right, #0056b3, #003d7a);
}

/* 모달 스타일 */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

/* 모달 내부 스타일 */
.modal-content {
    background: white;
    padding: 24px;
    /* 내부 여백 증가 */
    border-radius: 14px;
    width: 320px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    text-align: center;
}

/* 모달 제목 */
.modal-content h3 {
    margin-bottom: 20px;
    /* 제목과 입력 필드 간격 증가 */
    font-size: 19px;
    color: #333;
}

/* 모달 내부 입력 필드 */
.modal-content input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 10px;
    margin-bottom: 14px;
    /* 입력 필드 간 간격 증가 */
}

/* 모달 버튼 */
.modal-content button {
    width: 100%;
    padding: 14px;
    background: #007bff;
    color: white;
    font-size: 17px;
    font-weight: bold;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: 0.3s;
}

.modal-content button:hover {
    background: #0056b3;
}

@media (max-width: 600px) {
    .taxi-share-regist {
        width: 100vw;
    }
}
</style>
