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
                    <span v-if="notifications.length" class="position-absolute top-0 start-75 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
                </router-link>
            </li>
            <li v-if="role === 'OPERATOR'" @click="changeImage('mypage')" class="right-space">
                <router-link to="/admin/home">
                    <img :src="activeImage.mypage" alt="MyPage" />
                </router-link>
            </li>
            <li v-else @click="changeImage('mypage')" class="right-space">
                <router-link to="/mypage">
                    <img :src="activeImage.mypage" alt="MyPage" />
                </router-link>
            </li>
        </ul>
    </nav>
</template>

<script>
import { mapState } from 'vuex';
import { useAuthState } from "../../store/auth/auth";
export default {
    name: "BottomNavComponent",
    data() {
        return {
            defaultImages: {
                taxi: "https://ifh.cc/g/VDLMLo.png",
                car: "https://ifh.cc/g/FA32vo.png",
                home: "https://ifh.cc/g/zMf5Tv.png",
                noti: "https://ifh.cc/g/1mDQnF.png",
                mypage: "https://ifh.cc/g/f05JYD.png",
            },
            activeImage: {
                taxi: "https://ifh.cc/g/VDLMLo.pngg",
                car: "https://ifh.cc/g/FA32vo.png",
                home: "https://ifh.cc/g/zMf5Tv.png",
                noti: "https://ifh.cc/g/1mDQnF.png",
                mypage: "https://ifh.cc/g/f05JYD.png",
            },
        };
    },
    computed: {
        ...mapState('websocket', ['notifications']),
    },
    methods: {
        changeImage(section) {
            for (let key in this.activeImage) {
                this.activeImage[key] = this.defaultImages[key];
            }

            if (section === 'taxi') {
                this.activeImage[section] = "https://ifh.cc/g/0VJVvz.png";
            } else if (section === 'car') {
                this.activeImage[section] = "https://ifh.cc/g/jKyFNf.png";
            } else if (section === 'home') {
                this.activeImage[section] = "https://ifh.cc/g/KvrqV6.png";
            } else if (section === 'noti') {
                this.activeImage[section] = "https://ifh.cc/g/ChYpjd.png";
            } else if (section === 'mypage') {
                this.activeImage[section] = "https://ifh.cc/g/xRYLly.png";
            }
        },
    },
    setup() {
        const { role } = useAuthState();

        return {
            role,
        };
    }
};
</script>

<style scoped>
@import "../../assets/style/top-bottom-nav-mobile.css";

.bottom-nav ul {
    display: flex;
    justify-content: space-around;
    padding: 0;
    margin: 0;
    list-style: none;
    min-width: 80%;
    max-width: 80%;
}

.bottom-nav ul li {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 8px;
    margin-top: 3px;
}

.bottom-nav ul li img {
    width: 2.5rem;
}

.phone-fix {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #ffffff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.left-space {
    margin-left: 1rem;
}

.right-space {
    margin-right: 1rem;
}
</style>