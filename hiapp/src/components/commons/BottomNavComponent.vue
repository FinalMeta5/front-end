<template>
    <nav class="bottom-nav phone-fix">
        <ul>
            <li @click="changeImage('taxi')" class="left-space">
                <router-link to="/taxi-share/list">
                    <img :src="activeImage.taxi" alt="Taxi" />
                </router-link>
            </li>
            <li @click="changeImage('car')">
                <router-link to="/carshare/home">
                    <img :src="activeImage.car" alt="Car" />
                </router-link>
            </li>
            <li @click="changeImage('home')">
                <router-link to="/">
                    <img :src="activeImage.home" alt="Home" />
                </router-link>
            </li>
            <li @click="changeImage('noti')">
                <router-link class="position-relative" to="/notification">
                    <img :src="activeImage.noti" alt="Notification" />
                    <span v-if="notifications.length" class="notification-dot"></span>
                </router-link>
            </li>
            <li @click="handleMyPageClick" class="right-space">
                <img :src="activeImage.mypage" alt="MyPage" v-if="activeImage.mypage" />
            </li>
        </ul>
    </nav>

    <!-- 로그인 모달 -->
    <LoginModalView v-if="showLoginModal" @close="showLoginModal = false" />
</template>

<script>
import { mapState } from 'vuex';
import { useAuthState } from "../../store/auth/auth";
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import LoginModalView from '../../views/LoginModalView.vue';

export default {
    name: "BottomNavComponent",
    components: { LoginModalView },
    setup() {
        const { role } = useAuthState();
        const router = useRouter();
        const showLoginModal = ref(false);

        // ✅ 로컬 스토리지에서 초기 값 가져오기 (없으면 "USER" 기본값)
        const storedRole = localStorage.getItem("userRole") || "USER";
        const currentRole = ref(storedRole);

        // ✅ 로그인 여부 체크
        const isAuthenticated = computed(() => !!localStorage.getItem("accessToken"));

        // ✅ 기본 이미지 및 활성화 이미지 설정
        const defaultImages = {
            taxi: "https://ifh.cc/g/VDLMLo.png",
            car: "https://ifh.cc/g/FA32vo.png",
            home: "https://ifh.cc/g/zMf5Tv.png",
            noti: "https://ifh.cc/g/1mDQnF.png",
            mypage_operator: "https://ifh.cc/g/v5XGMz.png",
            mypage_user: "https://ifh.cc/g/f05JYD.png",
        };

        const activeIcons = {
            taxi: "https://ifh.cc/g/0VJVvz.png",
            car: "https://ifh.cc/g/jKyFNf.png",
            home: "https://ifh.cc/g/KvrqV6.png",
            noti: "https://ifh.cc/g/ChYpjd.png",
            mypage_operator: "https://ifh.cc/g/v5XGMz.png",
            mypage_user: "https://ifh.cc/g/xRYLly.png",
        };

        // ✅ 활성화된 이미지 상태
        const activeImage = ref({ ...defaultImages });

        // ✅ `role`이 변경될 때만 업데이트 (watch 사용)
        watch(
            () => role.value,
            (newRole) => {
                if (newRole) {
                    currentRole.value = newRole;
                    localStorage.setItem("userRole", newRole);
                }

                // ✅ role 변경 시 마이페이지 아이콘 변경
                activeImage.value.mypage = currentRole.value === "OPERATOR"
                    ? activeIcons.mypage_operator
                    : activeIcons.mypage_user;
            },
            { immediate: true } // ✅ 처음 로드될 때도 실행
        );

        // ✅ 이미지 변경 함수 (마이페이지 아이콘도 동적 변경)
        const changeImage = (section) => {
            activeImage.value = { ...defaultImages };

            if (section === "mypage") {
                activeImage.value.mypage = currentRole.value === "OPERATOR"
                    ? activeIcons.mypage_operator
                    : activeIcons.mypage_user;
            } else {
                activeImage.value[section] = activeIcons[section] || activeImage.value[section];
            }
        };

        // ✅ 마이페이지 버튼 클릭 시 이동 처리
        const handleMyPageClick = () => {
            const latestRole = role.value || localStorage.getItem("userRole") || "USER";

            if (!isAuthenticated.value) {
                // 로그인 안 되어 있으면 로그인 모달 표시
                showLoginModal.value = true;
            } else {
                // 로그인 상태면 role 값 확인 후 이동
                if (latestRole === "OPERATOR") {
                    router.push("/admin/home"); // 관리자 페이지로 이동
                } else {
                    router.push("/mypage"); // 일반 마이페이지로 이동
                }
            }
            changeImage("mypage"); // ✅ 마이페이지 클릭 후 아이콘 변경
        };

        return {
            role,
            currentRole,
            activeImage,
            changeImage,
            handleMyPageClick,
            isAuthenticated,
            showLoginModal
        };
    },
    computed: {
        ...mapState('websocket', ['notifications']),
    }
};
</script>

<style scoped>
@import "../../assets/style/top-bottom-nav-mobile.css";

/* 📌 네비게이션 스타일 */
.bottom-nav {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #ffffff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 10px 0;
}

/* 📌 네비게이션 리스트 */
.bottom-nav ul {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0;
    margin: 0;
    list-style: none;
    width: 100%;
}

/* 📌 네비게이션 아이템 */
.bottom-nav ul li {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 5px;
}

/* 📌 네비게이션 아이콘 */
.bottom-nav ul li img {
    width: 2.5rem;
    transition: transform 0.2s ease-in-out;
}

/* 📌 아이콘 호버 효과 */
.bottom-nav ul li:hover img {
    transform: scale(1.1);
}

/* 📌 알림 표시 (빨간 점) */
.notification-dot {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 10px;
    height: 10px;
    background: red;
    border-radius: 50%;
    border: 2px solid white;
}

/* 📌 좌우 간격 */
.left-space {
    margin-left: 1rem;
}

.right-space {
    margin-right: 1rem;
}

/* 📌 반응형 디자인 */
@media (max-width: 768px) {
    .bottom-nav ul li img {
        width: 2rem;
    }

    .notification-dot {
        width: 8px;
        height: 8px;
    }
}
</style>
