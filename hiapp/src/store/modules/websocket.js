import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { authAxios } from '../auth/auth';
const state = {
    stompClient: null,
    notifications: [],
    isConnected: false,
};

const mutations = {
    SET_SOCKET(state, client) {
        state.stompClient = client;
    },
    SET_CONNECTED(state, status) {
        state.isConnected = status;
    },
    SET_NOTIFICATIONS(state, notifications) {
        state.notifications = notifications;
    },
};

const actions = {
    async fetchNotifications({ commit }) {
        try {
            const response = await authAxios.get('/api/notifications/unread');
            const data = response.data.data;
            commit('SET_NOTIFICATIONS', data);
        } catch (error) {
            console.error('기존 알림 불러오기 실패:', error);
        }
    },

    connectWebSocket({ commit, state, dispatch }) {
        if (state.stompClient) return; // 이미 연결되어 있는 경우 중복 연결 방지

        const stompClient = new Client({
            webSocketFactory: () => new SockJS('https://localhost:8443/wss'),
            reconnectDelay: 5000,
            debug: (msg) => console.log(msg),
        });

        stompClient.onConnect = () => {
            console.log('WebSocket 연결 성공 (onConnect)');
            commit('SET_CONNECTED', true);
            stompClient.subscribe('/topic/notifications', (message) => {
                try {
                    console.log(message);
                    const notifications = JSON.parse(message.body);
                    console.log(notifications);
                    commit('SET_NOTIFICATIONS', notifications);
                } catch (error) {
                    console.error('JSON 파싱 오류:', error);
                }
            });
        };

        stompClient.onStompError = (frame) => {
            console.error('WebSocket 에러 발생 (onStompError):', frame);
        };

        stompClient.onWebSocketClose = () => {
            console.log('WebSocket 연결 종료 (onWebSocketClose)');
            commit('SET_CONNECTED', false);
        };

        stompClient.activate();
        commit('SET_SOCKET', stompClient);

        // 웹소켓 연결 후 기존 알림 데이터를 불러옵니다.
        dispatch('fetchNotifications');
    },

    disconnectWebSocket({ commit, state }) {
        if (state.stompClient) {
            state.stompClient.deactivate();
            commit('SET_SOCKET', null);
            commit('SET_CONNECTED', false);
        }
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};