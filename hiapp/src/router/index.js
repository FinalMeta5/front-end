import { createRouter, createWebHistory } from 'vue-router';
import AboutView from "../views/AboutView.vue";
import HomeView from "../views/HomeView.vue";
import MypageView from "../views/MypageView.vue";
import LoginView from '../views/LoginView.vue';
import SignupView from '../views/SignupView.vue';
import MemberListView from '../views/MemberListView.vue';
import AvailableMapView from '../views/AvailableMapView.vue';
import CarRegistrationView from '../views/car-share/CarRegistrationView.vue';
const routes = [
    {path: '/', component: HomeView},
    {path: '/about', component: AboutView},
    {path: '/mypage', component: MypageView},
    {path: '/login', component:LoginView},
    {path: '/signup', component:SignupView},
    {path: '/memberlist', component:MemberListView},
    {path: '/carshare/list', component: AvailableMapView},
    {path: '/car-registration', component:CarRegistrationView},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;