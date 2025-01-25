import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // 부트스트랩 CSS
import 'bootstrap'; // 부트스트랩 JavaScript (Popper.js 포함)

createApp(App).use(router).mount('#app');
