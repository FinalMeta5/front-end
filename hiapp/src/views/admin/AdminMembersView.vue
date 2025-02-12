<template>
    <div class="about phone-main-screen">
        <h1 class="titleH1 mb-2">회원 관리</h1>
        <div class="view-context-contain">
            <ul class="list-group list-group-flush w-75">
                <li v-for="(member, index) in members" :key="index" class="list-group-item">
                    <div class="row">
                        <div class="col-4">
                            {{ member.memberId }}
                        </div>
                        <div class="col-4">
                            {{ member.name }}
                        </div>
                        <div class="col-4">
                            {{ member.gender }}
                        </div>
                        <div class="col-3">
                            {{ member.roleName }}
                        </div>
                        <div class="col-4">
                            {{ member.joinDate }}
                        </div>
                        <div class="col-5">
                            {{ member.nickname }}
                        </div>
                    </div>
                </li>
            </ul>
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
</style>