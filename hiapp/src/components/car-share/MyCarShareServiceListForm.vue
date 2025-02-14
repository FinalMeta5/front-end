<template>
    <div class="my-car-service">

        <div class="filter-container">
            <select v-model="selectedYear" @change="filterByYearMonth">
                <option v-for="year in uniqueYears" :key="year" :value="year">{{ year }}년</option>
            </select>
            <select v-model="selectedMonth" @change="filterByYearMonth">
                <option v-for="month in months" :key="month.value" :value="month.value">{{ month.label }}</option>
            </select>

        </div>

        <!-- ✅ 로딩 중일 때 -->
        <div v-if="isLoading" class="loading-container">
            <img src="../../assets/images/BURURUNG_BLUE.png" alt="로딩 중" class="loading-icon" />
            <p>🚗  조회 중...</p>
        </div>
        <!-- ✅ 데이터가 없을 때 -->
        <div v-if="!isLoading && sortedCarList.length == 0" class="no-car-srv">🚨 등록된 차량 공유 서비스가 없습니다.</div>

        <!-- ✅ 리스트 데이터가 있을 때 -->
        <div v-if="sortedCarList.length > 0">
            <div v-for="car in sortedCarList" :key="car.carShareRegiId" class="car-item">
                <div class="type-and-date">
                    <p class="start-datetime">{{ formatDate(car.pickupDate) }}</p>
                    <!-- ✅ 카테고리 배경색 동적 변경 -->
                    <p :class="getCategoryStyle(car.category)" class="share-cate">
                        {{ car.category }}
                    </p>
                </div>
                <div class="root-info-contain">
                    <div class="root-info">
                        <font-awesome-icon :icon="['fas', 'location-arrow']" class="icon" />
                        <p>{{ car.pickupLoc }}</p>
                    </div>
                    <div class="root-info">
                        <font-awesome-icon :icon="['fas', 'location-dot']" class="icon" />
                        <p>{{ car.destination }}</p>
                    </div>
                </div>
                
                
                <div class="check-btn-container">
                    <div class="pre-drive" v-if="!isPastService(car.pickupDate) && car.participantCount > 0 ">모집중</div>
                    <div class="done-drive" v-if="isPastService(car.pickupDate)">운행 완료</div>
                    <button v-if="!car.participantCount == 0" class="look-parti-btn" @click="fetchParticipants(car.carShareRegiId)">👥  [ {{ car.participantCount }} / {{ car.passengersNum }} ]</button>
                </div>
                <button v-if="!isPastService(car.pickupDate) && car.participantCount == 0" 
                    @click="cancelCarShare(car.carShareRegiId, car.hasParticipants)" class="cancel-btn">🚨 공유 취소</button>
            </div>
        </div>

        <!-- ✅ 참가자 리스트 모달 -->
        <div v-if="showParticipantsModal" class="modal">
            <div class="modal-content">
                <div class="close-btn" @click="showParticipantsModal = false">✖</div>
                <h3>🚗 참가자 목록</h3>
                
                <!-- 참가자 데이터가 없을 때 -->
                <p v-if="participants.length === 0">🚨 참가자가 없습니다.</p>

                <!-- 참가자 리스트 -->
                <ul v-else>
                    <li v-for="participant in participants" :key="participant.memberId" class="parti-who">
                        <div class="parti">
                            <div class="parti-left">
                                <div class="when-join">{{ formatDate(participant.joinDate) }}</div>
                                <div class="parti-info-zone">
                                    <img :src="participant.imageUrl || 'https://ifh.cc/g/qsAZyn.png'" class="profile-img" />
                                    <span>{{ participant.nickName }}</span>
                                </div>
                                <div class="parti-info-zone">
                                    <div class="star"><img class="star" :src="`/images/star${participant.rate}.png`"></div>
                                    <div v-if="!participant.comment === 'No Comment' ">{{ participant.comment }}</div>
                                </div>
                            </div>
                            <div v-if="participant.state === '탄다'" class="parti-rigth"><img class="parti-img" src="../../assets/images/탄다.png"/></div>
                            <div v-if="participant.state === '안탄다'" class="parti-rigth"><img class="parti-img" src="../../assets/images/안탄다.png"/></div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>


<script>
import axios from 'axios';

export default {
    name: 'MyCarShareServiceListForm',
    data() {
        return {
            carList: [], // 🚗 차량 공유 데이터 리스트
            currentTime : new Date(),
            selectedYear : new Date().getFullYear(),
            selectedMonth : new Date().getMonth() + 1,
            isLoading: true,
            participants : [], // 참가자 데이터 리스트
            showParticipantsModal : false
        };
    },
    methods: {
        // ✅ API 호출해서 리스트 불러오기
        async fetchMyCars() {
            this.isLoading = true;
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

                // 🚗 각 차량 데이터에 참가자 수 추가
                this.carList = await Promise.all(response.data.map(async (car) => {
                    try {
                        const participantsResponse = await axios.get(`http://localhost:8080/api/car-share/participants/${car.carShareRegiId}`, {
                            headers: { Authorization: `Bearer ${accessToken}` }
                        });
                        return { ...car, participantCount: participantsResponse.data.length };
                    } catch (error) {
                        console.error("🚨 참가자 수 조회 오류:", error);
                        return { ...car, participantCount: 0 };
                    }
                }));

                if (this.carList.length === 0) {
                    this.$router.push("/no-my-car-share-service");
                }
            } catch (error) {
                console.error("🚨 차량 목록 불러오기 오류:", error);
            }  finally {
                this.isLoading = false; // ✅ 조회 끝나면 로딩 상태 해제
            }
        },

        async fetchParticipants(carShareRegiId) {
            console.log("🔍 참가자 조회 요청 carShareRegiId:", carShareRegiId);
            const accessToken = localStorage.getItem("accessToken");
            try {
                const response = await axios.get(`http://localhost:8080/api/car-share/participants/${carShareRegiId}`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });

                this.participants = response.data;
                console.log(response.data);
                this.showParticipantsModal = true;
                console.log("🔍 모달 상태:", this.showParticipantsModal);

                // 🚗 참가자 수를 차량 리스트에서도 업데이트
                const carIndex = this.carList.findIndex(car => car.carShareRegiId === carShareRegiId);
                if (carIndex !== -1) {
                    this.carList[carIndex].participantCount = response.data.length;
                }

            } catch (error) {
                console.error("참가자 목록 불러오기 오류:", error);
                alert("참가자 정보 조회 실패");
            }
        }
        ,

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
        },
        
        async cancelCarShare(carShareRegiId) {
            console.log(`차량 공유 취소 : ${carShareRegiId}`);

            if (hasParticipants) {
                alert("🚨 참가자가 있는 차량 공유는 삭제할 수 없습니다.");
                return;
            }

            if(!confirm("해당 차량 공유 서비스를 삭제하시겠습니까?")) {
                return;
            }
            const accessToken = localStorage.getItem("accessToken");
            try {
                const response = await axios.post(`http://localhost:8080/api/car-share/delete/${carShareRegiId}`,{},{
                    headers : {
                        Authorization : `Bearer ${accessToken}`}
                    });
                    alert(response.data);
                    this.fetchMyCars(); 
                } catch(error) {
                    console.error("삭제 실패");
                    alert("삭제 중 오류 발생!")
                }
            },
    },

    computed : {
        isPastService() {
            return (pickupDate) => new Date(pickupDate) < this.currentTime;
        },
        sortedCarList() {
            return this.carList.slice().sort((a,b) => {
                return new Date(b.pickupDate) - new Date(a.pickupDate);
            });
        },
        uniqueYears() {
            const years = this.carList.map(car => new Date(car.pickupDate).getFullYear());
            return [...new Set(years)].sort((a, b) => b - a);
        },
        months() {
            return Array.from({ length: 12 }, (_, i) => ({
                value: i + 1,
                label: `${i + 1}월`,
            }));
        },
        filteredCarList() {
            return this.sortedCarList.filter(car => {
                const carDate = new Date(car.pickupDate);
                return carDate.getFullYear() === this.selectedYear && carDate.getMonth() + 1 === this.selectedMonth;
            });
        },
        filterByYearMonth() {
            console.log(`📆 필터링: ${this.selectedYear}년 ${this.selectedMonth}월`);
        },
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

    /* ✅ 모달 내부 스타일 */
.modal-content {
    background: white;
    padding: 15px;
    border-radius: 12px;
    width: 85%;
    max-width: 420px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
    text-align: center;
    position: relative;
    animation: slideUp 0.3s ease-in-out;
}

/* ✅ 닫기 버튼 */
.close-btn {
    font-size: 22px;
    color: #333;
    cursor: pointer;
    position: absolute;
    top: 12px;
    right: 12px;
    background: none;
    border: none;
    transition: color 0.2s ease-in-out;
}

.close-btn:hover {
    color: #e74c3c; /* 닫기 버튼 hover 효과 */
}

/* ✅ 참가자 목록 */
.modal-content ul {
    list-style: none;
    padding: 0;
    margin-top: 10px;
    max-height: 300px;
    overflow-y: auto;
}

/* ✅ 참가자 아이템 */
.modal-content li {
    display: flex;
    align-items: center;
    justify-content: space-between; /* 닉네임과 탄다/안탄다 이미지 정렬 */
    padding: 12px;
    border-bottom: 1px solid #ddd;
}

/* ✅ 마지막 아이템 테두리 없애기 */
.modal-content li:last-child {
    border-bottom: none;
}

/* ✅ 참가자 프로필 이미지 */
.profile-img {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #ddd;
}

/* ✅ 닉네임 & 참가 날짜 */
.parti-info-zone {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex-grow: 1; /* 닉네임 영역이 유동적으로 확장 */
    margin-left: 10px;
}

/* ✅ 참가자 닉네임 */
.parti-info-zone span {
    font-size: 16px;
    font-weight: bold;
}

/* ✅ 참가 날짜 */
.when-join {
    font-size: 13px;
    color: #828282;
}

/* ✅ 별점 */
.star {
    max-width: 90px;
    margin-top: 4px;
}

/* ✅ "탄다/안탄다" 이미지 정렬 */
.parti-rigth {
    display: flex;
    justify-content: center;
    align-items: center;
}

/* ✅ 탄다/안탄다 이미지 */
.parti-img {
    max-height: 4rem;
    max-width: 4rem;
    object-fit: contain; /* 이미지 비율 유지하면서 크기 맞추기 */
}


    .no-car-srv {
        font-weight: bold ;
        padding: 20px;
    }

    /* ✅ 로딩 컨테이너 */
    .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 50px 0;
    }

    /* ✅ 로딩 아이콘 */
    .loading-icon {
        width: 160px;
        height: 120px;
        margin: 100px;
    }


    .parti-img {
        max-height: 3rem;
        margin-left: 2px;
        padding-left: 10px ;
    }

    .look-parti-btn {
        min-width: 9rem;
        max-width: 9rem;
        border-radius: 6px;
        background-color: #f9f9f9;
        padding : 0 0;
        
    }

    .look-parti-btn:hover {
        background-color: rgb(126, 149, 255);
    }

/* ✅ 모달 전체 스타일 */
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5); /* 반투명 배경 */
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease-in-out; /* 부드러운 등장 효과 */
    }

    /* ✅ 닫기 버튼 */
/* 닫기 버튼 스타일 */
.modal-content close-btn {
    background: none;
    border: none;
    font-size: 24px;
    color: #333;
    cursor: pointer;
    position: absolute;
    top: 12px;
    right: 15px;
    transition: color 0.2s ease-in-out;
}

.modal-content button:hover {
    color: #e74c3c; /* 빨간색으로 변경 */
}


    /* ✅ 참가자 프로필 이미지 */
    .profile-img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid #ddd;
    }

    /* ✅ 참가자 닉네임 */
    .modal-content span {
        font-size: 16px;
        font-weight: bold;
    }

    /* ✅ 애니메이션 효과 */
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes slideUp {
        from {
            transform: translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }


    .check-btn-container {
        display: flex;
        justify-content: space-between;
        max-height: 4rem;
    }

    .done-drive {
        color: rgb(21, 140, 90);
        font-weight: bold;
        align-self: center;
        padding: 5px 10px;
        margin-left: 1rem;
        border-radius: 5px;
    }

    .pre-drive {
        color: rgb(83, 112, 230);
        font-weight: bold;
        align-self: center;
        padding-right: 2rem;
        padding-left: 2rem;
        border-radius: 5px;
    }

    .filter-container {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

    .filter-container select {
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
    }

    .root-info-contain {
        display: flex;
        flex-direction: column;
    }

    .root-info {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 2rem;
        margin-left: 1rem;    
    }

    .icon{
        width: 1.2rem;
        height: 1.2rem;
    }

    .type-and-date{
        display: flex;
        justify-content: space-between;
    }
    .share-cate {
        background-color: #f7c85a;
        width: 5rem;
        border-radius: 10px;
        padding: 1px 1px;
        font-weight: bold;
        color: white;
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
    max-width: 22rem;
    min-width: 22rem;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
    }

    .car-item p {
    margin: 5px 0;
    }

    .cancel-btn {
        background: rgb(255, 255, 255);
        color: rgb(222, 16, 16);
        border: 1px solid;
        max-height: 3rem;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
        max-width: 7rem;
    }

    .cancel-btn:hover {
    background: rgb(222, 16, 16);
    color: white;
    }
    .share-cate {
    width: 5rem;
    border-radius: 10px;
    padding: 3px;
    font-weight: bold;
    color: white;
    text-align: center;
    }

    .start-datetime {
        font-weight: bold;
        color: #828282;
    }

    .when-join {
        margin-bottom: 3px;
        color: #828282;
    }

    .star {
        max-width: 8rem;
        margin-top: 5px;
    }

/* ✅ 카테고리에 따른 배경색 적용 */
.commute {
    background-color: #3286e7; /* 출퇴근 → 파란색 */
}

.concert {
    background-color: #0aa438; /* 콘서트 → 초록색 */
}

.shopping {
    background-color: #a56806; /* 장보기 → 주황색 */
}

.sports {
    background-color: #a85aca; /* 스포츠 → 보라색 */
}

.other {
    background-color: #898989; /* 기타 → 빨간색 */
}

.parti {
    display: flex;
    justify-content: space-around;
    align-items: center;
}

.parti-img {
    max-height: 6rem;
    max-width: 5rem;
}

</style>