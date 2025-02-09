<template>
    <div class="taxi-share-regist">
        <div class="header">
            <router-link to="/taxi-share" class="back-button">←</router-link>
            <h1>택시 공유 등록</h1>
        </div>

        <label for="departure-time">예상 출발시간</label>
        <input type="text" id="departure-time" v-model="formattedPickupTime" @click="showDateTimeModal = true"
            readonly />
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
            memberId: 2,
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
            axios.post('http://localhost:8080/api/taxi/insert', taxiShare)
                .then(response => {
                    console.log('TaxiShare 객체가 성공적으로 전송되었습니다.');
                    this.$router.push('/taxi-share/list');
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
.taxi-share-regist {
    padding: 20px;
    margin-top: 120px;
}

.header {
    display: flex;
    align-items: center;
}

.back-button {
    margin-right: 10px;
    text-decoration: none;
    font-size: 24px;
}

h1 {
    font-size: 24px;
    margin-bottom: 20px;
}

label {
    display: block;
    margin: 10px 0 5px;
}

input[type="text"],
input[type="number"],
select {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.checkbox {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.note {
    font-size: 12px;
    color: #777;
}

button {
    padding: 10px 20px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    margin-top: 15px;
}

button:hover {
    background-color: #0056b3;
}

.time-list {
    max-height: 300px;
    overflow-y: auto;
}

.time-option {
    padding: 10px;
    cursor: pointer;
}

.time-option:hover {
    background-color: #f0f0f0;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 300px;
}

.modal-content input {
    margin-bottom: 10px;
}

.modal-content button {
    width: 100%;
}
</style>