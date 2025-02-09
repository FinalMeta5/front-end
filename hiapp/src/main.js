import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css'; // 부트스트랩 CSS
import 'bootstrap'; // 부트스트랩 JavaScript
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCarSide, faLocationDot, faLocationArrow, faRoute, faCircleLeft} from '@fortawesome/free-solid-svg-icons';
import "bootstrap-icons/font/bootstrap-icons.css";  

// 🔹 FontAwesome 아이콘 추가
library.add(faCarSide, faLocationDot, faLocationArrow, faRoute, faCircleLeft);

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon); // ✅ mount() 전에 등록해야 함
app.use(router);
app.mount('#app');
