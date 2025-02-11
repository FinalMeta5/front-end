<template>
    <nav class="bottom-nav phone-fix">
        <ul>
            <li @click="changeImage('home')" class="left-space">
                <router-link to="/">
                    <img :src="activeImage.home" alt="Home" />
                </router-link>
            </li>
            <li @click="changeImage('about')">
                <router-link to="/about">
                    <img :src="activeImage.about" alt="About" />
                </router-link>
            </li>
            <li @click="changeImage('mypage')">
                <router-link to="/mypage">
                    <img :src="activeImage.mypage" alt="My Page" />
                </router-link>
            </li>
            <li @click="changeImage('noti')">
                <router-link class="position-relative" to="/notification">
                    <img :src="activeImage.noti" alt="Notification" />
                    <span v-if="notifications.length" class="position-absolute top-0 start-75 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
                </router-link>
            </li>
            <li @click="changeImage('signup')" class="right-space">
                <router-link to="/signup">
                    <img :src="activeImage.signup" alt="Sign Up" />
                </router-link>
            </li>
        </ul>
    </nav>
</template>

<script>
import { mapState } from 'vuex';
export default {
    name: "BottomNavComponent",
    data() {
        return {
            defaultImages: {
                home: "https://ifh.cc/g/VDLMLo.png",
                about: "https://ifh.cc/g/FA32vo.png",
                mypage: "https://ifh.cc/g/zMf5Tv.png",
                noti: "https://ifh.cc/g/1mDQnF.png",
                signup: "https://ifh.cc/g/f05JYD.png",
            },
            activeImage: {
                home: "https://ifh.cc/g/VDLMLo.pngg",
                about: "https://ifh.cc/g/FA32vo.png",
                mypage: "https://ifh.cc/g/zMf5Tv.png",
                noti: "https://ifh.cc/g/1mDQnF.png",
                signup: "https://ifh.cc/g/f05JYD.png",
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

            if (section === 'home') {
                this.activeImage[section] = "https://ifh.cc/g/0VJVvz.png";
            } else if (section === 'about') {
                this.activeImage[section] = "https://ifh.cc/g/jKyFNf.png";
            } else if (section === 'mypage') {
                this.activeImage[section] = "https://ifh.cc/g/KvrqV6.png";
            } else if (section === 'noti') {
                this.activeImage[section] = "https://ifh.cc/g/ChYpjd.png";
            } else if (section === 'signup') {
                this.activeImage[section] = "https://ifh.cc/g/xRYLly.png";
            }
        },
    },
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
    width: 100%;
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
    width: 50%;
}

.phone-fix {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #ffffff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.left-space {
    margin-left: 25px;
    /* 왼쪽에 10px 여백 */
}

.right-space {
    margin-right: 20px;
    /* 오른쪽에 10px 여백 */
}
</style>