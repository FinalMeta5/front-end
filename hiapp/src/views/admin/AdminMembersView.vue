<template>
    <div class="about phone-main-screen">
        <h1 class="titleH1 mb-2">회원 관리</h1>
        <div class="view-context-contain">
            <div class="accordion w-75" id="accordionExample">
                <div class="accordion-item" v-for="(member, index) in members" :key="index">
                    <h2 class="accordion-header" :id="'heading' + index">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse"
                            :data-bs-target="'#collapse' + index" aria-expanded="true"
                            :aria-controls="'collapse' + index">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="img-div">
                                    <img :src=member.imageUrl alt="profile">
                                </div>
                                <div class="fs-3 fw-bolder ms-5">
                                    {{ member.name }}
                                </div>
                            </div>
                        </button>
                    </h2>
                    <div :id="'collapse' + index" class="accordion-collapse collapse"
                        :aria-labelledby="'heading' + index" data-bs-parent="#accordionExample">
                        <div class="accordion-body text-start">
                            <div>
                                닉네임: {{ member.nickname }}
                            </div>
                            <div>
                                성별: <span v-if="member.gender === 'M'">남</span>
                                <span v-else>여</span>
                            </div>
                            <div>
                                등급: {{ member.roleName }}
                            </div>
                            <div>
                                이메일: {{ member.email }}
                            </div>
                            <div>
                                전화번호: {{ member.phone }}
                            </div>
                            <div>
                                크레딧 수: {{ member.creditCount }}
                            </div>
                            <div>
                                생성 날짜: {{ member.joinDate }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { authAxios } from '../../store/auth/auth';
export default {
    name: 'AdminMembersView',
    data() {
        return {
            members: [],
        }
    },
    methods: {
        async fetchData(endpoint, targetProperty) {
            try {
            const response = await authAxios.get(endpoint);
            if (response.data.status) {
                const data = response.data.data;
                this[targetProperty] = data;
            } else {
                throw new Error(response.data.mesaage);
            }
            } catch (error) {
                console.error(`Error fetching data from ${endpoint}:`, error);
            }
        },
    },
    mounted() {
        this.fetchData('/api/admin/members', 'members');
    },
};
</script>

<style scoped>
@import "../../assets/style/phone-main-view-common.css";
/* 📌 전체 컨테이너 스타일 */
.about {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background: linear-gradient(135deg, #eef2f3, #dce5e7);
    min-height: 100vh;
}

/* 📌 타이틀 스타일 */
.titleH1 {
    font-size: 26px;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 25px;
}

/* 📌 아코디언 스타일 */
.accordion {
    width: 80%;
    background-color: transparent;
}

/* 📌 아코디언 아이템 */
.accordion-item {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    margin-bottom: 15px;
    transition: all 0.3s ease-in-out;
}

/* 📌 아코디언 헤더 버튼 */
.accordion-button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: white;
    color: #2c3e50;
    font-weight: bold;
    padding: 15px;
    border: none;
    transition: background 0.3s ease-in-out, color 0.3s ease-in-out;
}

/* 📌 버튼 호버 효과 */
.accordion-button:hover {
    background-color: #007bff;
    color: white;
}

/* 📌 아코디언 바디 */
.accordion-body {
    padding: 15px;
    font-size: 16px;
    color: #555;
    background: #f9f9f9;
    border-radius: 0 0 12px 12px;
}

/* 📌 프로필 이미지 스타일 */
.img-div {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid #007bff;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 📌 프로필 이미지 */
.img-div img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* 📌 회원 정보 텍스트 스타일 */
.accordion-body div {
    padding: 5px 0;
    font-size: 14px;
}

/* 📌 애니메이션 효과 */
.accordion-collapse {
    transition: max-height 0.3s ease-in-out;
}

/* 📌 반응형 디자인 */
@media (max-width: 768px) {
    .accordion {
        width: 95%;
    }
    
    .accordion-button {
        font-size: 14px;
        padding: 12px;
    }

    .img-div {
        width: 40px;
        height: 40px;
    }
    
    .accordion-body {
        font-size: 14px;
    }
}
</style>