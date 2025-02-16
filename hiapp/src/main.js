import { createApp } from 'vue';
import { createI18n } from 'vue-i18n'
import App from './App.vue';
import router from './router';
import store from './store';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCarSide, faLocationDot, faLocationArrow, faRoute, faCircleLeft} from '@fortawesome/free-solid-svg-icons';
import 'bootstrap'; // 부트스트랩 JavaScript
import 'bootstrap/dist/css/bootstrap.min.css'; // 부트스트랩 CSS
import "bootstrap-icons/font/bootstrap-icons.css";  
import koMessages from './locales/ko.json';

// 🔹 FontAwesome 아이콘 추가
library.add(faCarSide, faLocationDot, faLocationArrow, faRoute, faCircleLeft);

const i18n = createI18n({
    legacy: true,
    locale: 'ko', // 기본 언어 설정
    fallbackLocale: 'ko',
    messages: {
        ko: koMessages, // 기본 언어 메시지
    },
});

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon); // ✅ mount() 전에 등록해야 함
app.use(i18n);
app.use(router);
app.use(store);
app.mount('#app');
//router.push('/loading1');
