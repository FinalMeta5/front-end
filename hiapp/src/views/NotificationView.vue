<template>
    <div class="home phone-main-screen">
        <h1 class="titleH1">알림</h1>
        <div class="view-context-contain">
            <p v-if="!isConnected">웹소켓이 연결되지 않았습니다.</p>
            <p v-if="!notifications.length && !readNotifications.length && isConnected">알림이 없습니다.</p>

            <div class="list-group mt-5 w-75">
                <div v-for="(unreadNotification, index) in notifications" :key="'list1-' + index" class="list-group-item border border-dark"
                    style="cursor: pointer;" @click="toggleDetail('list1', index)">
                    <div class="row align-items-center">
                        <div class="col-3">
                            <span style="font-size: 1.2rem;">
                                <span v-if="isExpanded('list1', index)">&#9660;</span>
                                <span v-else>&#9654;</span>
                            </span>
                        </div>
                        <div class="col-6 text-center">
                            {{ unreadNotification.category }}
                        </div>
                        <div class="col-3 text-end text-muted">
                            {{ unreadNotification.serviceCtg }}
                        </div>
                    </div>

                    <transition name="fade">
                        <div v-if="isExpanded('list1', index)" class="my-2 w-100 justify-content-between">
                            <div>
                                {{ unreadNotification.content }}
                            </div>
                            <div class="text-end">
                                <button @click="readNotification(unreadNotification.notificationId)" type="button"
                                    class="btn btn-warning">읽음</button>
                                <button @click="deleteNotification(unreadNotification.notificationId)" type="button"
                                    class="btn btn-danger">삭제</button>
                            </div>
                        </div>
                    </transition>
                </div>
                <div v-for="(readNotification, index) in readNotifications" :key="'list2-' + index" class="list-group-item border border-dark bg-secondary-subtle"
                    style="cursor: pointer;" @click="toggleDetail('list2', index)">
                    <div class="row align-items-center">
                        <div class="col-3">
                            <span style="font-size: 1.2rem;">
                                <span v-if="isExpanded('list2', index)">&#9660;</span>
                                <span v-else>&#9654;</span>
                            </span>
                        </div>
                        <div class="col-6 text-center">
                            {{ readNotification.category }}
                        </div>
                        <div class="col-3 text-end text-muted">
                            {{ readNotification.serviceCtg }}
                        </div>
                    </div>

                    <transition name="fade">
                        <div v-if="isExpanded('list2', index)" class="my-2 w-100 justify-content-between">
                            <div>
                                {{ readNotification.content }}
                            </div>
                            <div class="text-end">
                                <button @click="readNotification(readNotification.notificationId)" type="button"
                                    class="btn btn-warning">읽음</button>
                                <button @click="deleteNotification(readNotification.notificationId)" type="button"
                                    class="btn btn-danger">삭제</button>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { authAxios } from '../store/auth/auth';

export default {
    name: 'NotificationView',
    data() {
        return {
            readNotifications: [],
            expandedIndices: {
                list1: [],
                list2: [],
            },
        }
    },
    computed: {
        ...mapState('websocket', ['notifications', 'isConnected']),
    },
    methods: {
        async fetchData(endpoint, targetProperty) {
            try {
                const response = await authAxios.get(endpoint);
                const data = response.data.data;
                this[targetProperty] = data;
            } catch (error) {
                console.error(`Error fetching data from ${endpoint}:`, error);
            }
        },
        async readNotification(notificationId) {
            try {
                const data = await authAxios.put(`/api/notifications/${notificationId}`);
                const list = data.data.data;
                this.readNotifications = list;
            } catch (error) {
                console.error('Error: ', error);
            }
        },
        async deleteNotification(notificationId) {
            try {
                this.readNotification(notificationId);
                await authAxios.delete(`/api/notifications/${notificationId}`);
                const index = this.readNotifications.findIndex(noti => noti.notificationId === notificationId);
                if (index !== -1) {
                    this.readNotifications.splice(index, 1);
                }
            } catch (error) {
                console.error('Error: ', error);
            }
        },
        toggleDetail(listName, index) {
            const list = this.expandedIndices[listName];
            const pos = list.indexOf(index);
            if (pos === -1) {
                // 아직 펼쳐지지 않은 항목이면 추가
                list.push(index);
            } else {
                // 이미 펼쳐진 항목이면 제거
                list.splice(pos, 1);
            }
        },
        isExpanded(listName, index) {
            return this.expandedIndices[listName].includes(index);
        },
    },
    mounted() {
        this.fetchData('/api/notifications/read', 'readNotifications');
    },
};
</script>

<style scoped>
@import "../style.css";
@import "../assets/style/phone-main-view-common.css";

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>