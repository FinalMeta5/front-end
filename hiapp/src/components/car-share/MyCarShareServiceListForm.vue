<template>
    <div class="my-car-service">
        <h1>🚗 내 차량 공유 서비스 내역</h1>

        <!-- ✅ 리스트 데이터가 있을 때 -->
        <div v-if="carList.length > 0">
            <div v-for="car in carList" :key="car.carShareRegiId" class="car-item">
                <!-- ✅ 카테고리 배경색 동적 변경 -->
                <p :class="getCategoryStyle(car.category)" class="share-cate">
                    {{ car.category }}
                </p>

                <div class="root-info">
                    <p>{{ car.pickupLoc }}</p>
                    <p> ~ </p>
                    <p>{{ car.destination }}</p>
                </div>

                <p><strong>출발 일자:</strong> {{ formatDate(car.pickupDate) }}</p>
                <p><strong>탑승 인원:</strong> {{ car.passengersNum }}명</p>
                
                <button @click="cancelCarShare(car.carShareRegiId)">🚨 공유 취소</button>
            </div>
        </div>

        <!-- ✅ 데이터가 없을 때 -->
        <p v-else>🚨 등록된 차량 공유 서비스가 없습니다.</p>
    </div>
</template>


<script>
import axios from 'axios';

export default {
    name: 'MyCarShareServiceListForm',
    data() {
        return {
            carList: [], // 🚗 차량 공유 데이터 리스트
        };
    },
    methods: {
        // ✅ API 호출해서 리스트 불러오기
        async fetchMyCars() {
            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
                alert("🚨 로그인이 필요합니다.");
                this.$router.push("/login");
                return;
            }

            try {
                const response = await axios.get("http://localhost:8080/api/car-share/my-list", {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });

                this.carList = response.data; // 🚗 데이터 저장

                if (this.carList.length === 0) {
                    this.$router.push("/no-my-car-share-service");
                }
            } catch (error) {
                console.error("🚨 차량 목록 불러오기 오류:", error);
                alert("데이터를 불러오는데 실패했습니다.");
            }
        },

        // ✅ 날짜 포맷 변환 (2025-02-14T06:00 → 2025년 02월 14일 06:00)
        formatDate(isoDate) {
            const date = new Date(isoDate);
            return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, "0")}월 ${String(date.getDate()).padStart(2, "0")}일 ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
        },

        // ✅ 카테고리에 따라 클래스 변경 (스타일 적용)
        getCategoryStyle(category) {
            return {
                "commute": category === "출퇴근",
                "concert": category === "콘서트",
                "shopping": category === "장보기",
                "sports": category === "스포츠",
                "other": category === "기타"
            };
        }
    },

    mounted() {
        this.fetchMyCars();
    }
};
</script>



<style scoped>
    @import "../../assets/style/top-bottom-nav-mobile.css";
    @import "../../style.css";
    @import "../../assets/style/CarRegistraion.css";

    .share-cate {
        background-color: #f7c85a;
        width: 5rem;
        border-radius: 10px;
        padding: 1px 1px;
        font-weight: bold;
        color: white;
    }

    .root-info {
        display: flex;
    }
    .mypage {
    padding: 20px;
    }

    .car-item {
    border: 1px solid #ddd;
    padding: 15px;
    margin: 10px 0;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
    }

    .car-item p {
    margin: 5px 0;
    }

    button {
    background: red;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
    }

    button:hover {
    background: darkred;
    }
    .share-cate {
    width: 5rem;
    border-radius: 10px;
    padding: 3px;
    font-weight: bold;
    color: white;
    text-align: center;
}

/* ✅ 카테고리에 따른 배경색 적용 */
.commute {
    background-color: #4a90e2; /* 출퇴근 → 파란색 */
}

.concert {
    background-color: #27ae60; /* 콘서트 → 초록색 */
}

.shopping {
    background-color: #f39c12; /* 장보기 → 주황색 */
}

.sports {
    background-color: #8e44ad; /* 스포츠 → 보라색 */
}

.other {
    background-color: #e74c3c; /* 기타 → 빨간색 */
}

</style>