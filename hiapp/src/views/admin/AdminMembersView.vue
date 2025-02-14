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
.img-div {
    width: 50px;
    height: 50px;
    overflow: hidden;
}
img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>