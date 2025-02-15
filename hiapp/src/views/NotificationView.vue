<template>
    <div class="home phone-main-screen">
        <h1 class="titleH2">{{ $t('context.noti') }}</h1>
        <div class="view-context-contain5">
            <p v-if="!isConnected" class="alert alert-danger">웹소켓이 연결되지 않았습니다.</p>
            <p v-if="!notifications.length && !readNotifications.length && isConnected" class="alert alert-info">📭 알림이 없습니다.</p>

            <div class="notification-list">
                <!-- 📌 안 읽은 알림 -->
                <div v-for="(unreadNotification, index) in notifications" :key="'list1-' + index" 
                    class="notification-card unread"
                    @click="toggleDetail('list1', index)">
                    
                    <div class="notification-header">
                        <span class="toggle-icon">
                            <span v-if="isExpanded('list1', index)">▼</span>
                            <span v-else>▶</span>
                        </span>
                        <span class="category">{{ unreadNotification.category }}</span>
                        <span class="service">{{ unreadNotification.serviceCtg }}</span>
                    </div>

                    <transition name="fade">
                        <div v-if="isExpanded('list1', index)" class="notification-content">
                            <p>{{ unreadNotification.content }}</p>
                            <div class="button-group">
                                <button @click="readNotification(unreadNotification.notificationId)" class="btn btn-read">✅ 읽음</button>
                                <button @click="deleteNotification(unreadNotification.notificationId)" class="btn btn-delete">🗑 삭제</button>
                            </div>
                        </div>
                    </transition>
                </div>

                <!-- 📌 읽은 알림 -->
                <div v-for="(readNotification, index) in readNotifications" :key="'list2-' + index" 
                    class="notification-card read"
                    @click="toggleDetail('list2', index)">
                    
                    <div class="notification-header">
                        <span class="toggle-icon">
                            <span v-if="isExpanded('list2', index)">▼</span>
                            <span v-else>▶</span>
                        </span>
                        <span class="category">{{ readNotification.category }}</span>
                        <span class="service">{{ readNotification.serviceCtg }}</span>
                    </div>

                    <transition name="fade">
                        <div v-if="isExpanded('list2', index)" class="notification-content">
                            <p>{{ readNotification.content }}</p>
                            <div class="button-group">
                                <button @click="deleteNotification(readNotification.notificationId)" class="btn btn-delete">🗑 삭제</button>
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
                this[targetProperty] = response.data.data;
            } catch (error) {
                console.error(`Error fetching data from ${endpoint}:`, error);
            }
        },
        async readNotification(notificationId) {
            try {
                // 📌 알림을 즉시 "읽은 알림 리스트"로 이동
                const index = this.notifications.findIndex(noti => noti.notificationId === notificationId);
                if (index !== -1) {
                    const readItem = this.notifications.splice(index, 1)[0]; // 제거 후 반환
                    this.readNotifications.unshift(readItem); // 읽은 알림 리스트에 추가
                }

                // ✅ 백그라운드에서 읽음 처리 API 요청
                await authAxios.put(`/api/notifications/${notificationId}`);

            } catch (error) {
                console.error('Error: ', error);
            }
        },
        async deleteNotification(notificationId) {
            try {
                // 📌 해당 알림을 리스트에서 즉시 제거
                this.notifications = this.notifications.filter(noti => noti.notificationId !== notificationId);
                this.readNotifications = this.readNotifications.filter(noti => noti.notificationId !== notificationId);

                // ✅ 백그라운드에서 삭제 API 요청
                await authAxios.delete(`/api/notifications/${notificationId}`);

            } catch (error) {
                console.error('Error: ', error);
            }
        },
        toggleDetail(listName, index) {
            const list = this.expandedIndices[listName];
            const pos = list.indexOf(index);
            if (pos === -1) {
                list.push(index);
            } else {
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

/* 📌 알림 카드 스타일 */
.notification-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.notification-card {
    padding: 1rem;
    border-radius: 10px;
    box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: 0.3s;
    max-width: 320px;
    min-width: 320px;
}

/* ✅ 안 읽은 알림 */
.notification-card.unread {
    background-color: #fff6e5;
    border-left: 6px solid #ffa500;
    padding: 0.5rem;
}

/* ✅ 읽은 알림 */
.notification-card.read {
    background-color: #f3f3f3;
    border-left: 6px solid #bbb;
    padding: 0.5rem;
}

/* 📌 알림 헤더 */
.notification-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1rem;
    font-weight: bold;
}

.toggle-icon {
    font-size: 1.3rem;
    color: #333;
    margin-right: 10px;
}

/* 📌 서비스 카테고리 */
.service {
    font-size: 0.85rem;
    color: #777;
    max-width: 100px;
}

/* 📌 알림 내용 */
.notification-content {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid #ddd;
}

/* 📌 버튼 스타일 */
.button-group {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 10px;
}

.btn {
    padding: 8px 12px;
    border-radius: 5px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: 0.3s;
}

/* ✅ 읽음 버튼 */
.btn-read {
    background-color: #ffcc00;
    color: #fff;
    border: none;
}

.btn-read:hover {
    background-color: #e6b800;
}

/* 🗑 삭제 버튼 */
.btn-delete {
    background-color: #ff4d4d;
    color: #fff;
    border: none;
}

.btn-delete:hover {
    background-color: #cc0000;
}

/* 📌 애니메이션 */
.fade-enter-active {
    transition: opacity 0.2s ease-in-out, max-height 0.2s ease-in-out;
}

.fade-leave-active {
    transition: opacity 0.1s ease-in-out, max-height 0.1s ease-in-out; /* 🔥 빠르게 사라짐 */
}


.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    max-height: 0;
}

</style>
