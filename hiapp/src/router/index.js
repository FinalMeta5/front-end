import { createRouter, createWebHistory } from 'vue-router';
import AboutView from "../views/AboutView.vue";
import HomeView from "../views/HomeView.vue";
import MypageView from "../views/MypageView.vue";
import LoginView from '../views/LoginView.vue';
import SignupView from '../views/SignupView.vue';
import MemberListView from '../views/MemberListView.vue';
import AvailableMapView from '../views/car-share/participant/AvailableMapView.vue';
import CarRegistrationView from '../views/car-share/CarRegistrationView.vue';
import PathView from '../views/taxi-share/PathView.vue';
import TaxiShareRegist from '../components/taxi-share/TaxiShareRegist.vue';
import TaxiShareList from '../components/taxi-share/TaxiShareList.vue';
import MyCarSearchView from '../views/car-share/MyCarSearchView.vue';
import NoCarInfoView from '../views/car-share/NoCarInfoView.vue';
import CarShareServiceRegiFirstView from '../views/car-share/CarShareServiceRegiFirstView.vue';
import CarShareServiceRegiSecondView from '../views/car-share/CarShareServiceRegiSecondView.vue';
import TaxiShareRegistCompleteView from '../views/taxi-share/TaxiShareRegistCompleteView.vue';
import CarshareDetailInformationView from '../views/CarshareDetailInformationView.vue';
import NotificationView from '../views/NotificationView.vue';
import NoCarShareServiceView from '../views/car-share/NoCarShareServiceView.vue';
import MyCarShareServiceView from '../views/car-share/MyCarShareServiceView.vue'; 
import CarshareDetailInformationView from '../views/car-share/participant/CarshareDetailInformationView.vue';
import AllCarShareListView from '../views/car-share/participant/AllCarShareListView.vue'

const routes = [
    { path: '/', component: HomeView },
    { path: '/about', component: AboutView },
    { path: '/mypage', component: MypageView },
    { path: '/login', component: LoginView },
    { path: '/signup', component: SignupView },
    { path: '/memberlist', component: MemberListView },
    { path: '/carshare/map', component: AvailableMapView },
    { path: '/car-registration', component: CarRegistrationView },
    { path: '/taxi-share', component: PathView },
    { path: '/taxi-share/regist', component: TaxiShareRegist },
    { path: '/taxi-share/list', component: TaxiShareList },
    { path: '/my-car-search', component: MyCarSearchView },
    { path: '/no-car-info', component: NoCarInfoView },
    { path: '/car-share/service/registration/first', component: CarShareServiceRegiFirstView },
    { path: '/car-share/service/registration/second', component: CarShareServiceRegiSecondView },
    {path : '/no-car-info', component : NoCarInfoView},
    {path : '/no-my-car-share-service', component : NoCarShareServiceView},
    {path : '/car-share/service/registration/first', component : CarShareServiceRegiFirstView},
    {path : '/car-share/service/registration/second', component : CarShareServiceRegiSecondView},
    {path: '/carshare/detail', component: CarshareDetailInformationView},
    { path: '/taxi-share/regist-complete', component: TaxiShareRegistCompleteView },
    {path : '/notification', component:NotificationView},
    {path : '/my-car-share-service/list', component : MyCarShareServiceView},
    {path: '/carshare/list', component: AllCarShareListView},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;