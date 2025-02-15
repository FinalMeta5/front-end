<template>
    <div class="home phone-main-screen">
        <h1 class="titleH2 mb-3">관리자 페이지</h1>
        <div class="view-context-contain">
            <div class="d-flex justify-content-evenly w-100 mb-3">
                <router-link to="/admin/members">
                    <div class="">
                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor"
                            class="bi bi-people" viewBox="0 0 16 16">
                            <path
                                d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
                        </svg>
                        <h5 class="fs-4">회원 관리</h5>
                    </div>
                </router-link>
                <router-link to="/admin/registrations">
                    <div class="">
                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor"
                        class="bi bi-file-earmark-text mx-auto" viewBox="0 0 16 16">
                        <path
                        d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5" />
                        <path
                        d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
                        </svg>
                        <h5 class="card-title fs-4">인증 신청<br>내역</h5>
                    </div>
                </router-link>
                <router-link to="/admin/statistics">
                    <div class="">
                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor"
                            class="bi bi-bar-chart" viewBox="0 0 16 16">
                            <path
                                d="M4 11H2v3h2zm5-4H7v7h2zm5-5v12h-2V2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1z" />
                        </svg>
                        <h5 class="card-title fs-4">통계 보기</h5>
                        <p class="card-text"></p>
                    </div>
                </router-link>
            </div>
            <div class="d-flex justify-content-evenly w-100 mb-3">
                <router-link to="/admin/services/taxi">
                    <div class="">
                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor"
                            class="bi bi-taxi-front" viewBox="0 0 16 16">
                            <path
                                d="M4.862 5.276 3.906 7.19a.51.51 0 0 0 .497.731c.91-.073 2.35-.17 3.597-.17s2.688.097 3.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 10.691 5H5.309a.5.5 0 0 0-.447.276M4 10a1 1 0 1 1-2 0 1 1 0 0 1 2 0m10 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-9 0a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1" />
                            <path
                                d="M6 1a1 1 0 0 0-1 1v1h-.181A2.5 2.5 0 0 0 2.52 4.515l-.792 1.848a.8.8 0 0 1-.38.404c-.5.25-.855.715-.965 1.262L.05 9.708a2.5 2.5 0 0 0-.049.49v.413c0 .814.39 1.543 1 1.997V14.5a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-1.338c1.292.048 2.745.088 4 .088s2.708-.04 4-.088V14.5a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-1.892c.61-.454 1-1.183 1-1.997v-.413q0-.248-.049-.49l-.335-1.68a1.8 1.8 0 0 0-.964-1.261.8.8 0 0 1-.381-.404l-.792-1.848A2.5 2.5 0 0 0 11.181 3H11V2a1 1 0 0 0-1-1zM4.819 4h6.362a1.5 1.5 0 0 1 1.379.91l.792 1.847a1.8 1.8 0 0 0 .853.904c.222.112.381.32.43.564l.336 1.679q.03.146.029.294v.413a1.48 1.48 0 0 1-1.408 1.484c-1.555.07-3.786.155-5.592.155s-4.037-.084-5.592-.155A1.48 1.48 0 0 1 1 10.611v-.413q0-.148.03-.294l.335-1.68a.8.8 0 0 1 .43-.563c.383-.19.685-.511.853-.904l.792-1.848A1.5 1.5 0 0 1 4.82 4Z" />
                        </svg>
                        <h5 class="fs-5">택시 공유<br>서비스 관리</h5>
                    </div>
                </router-link>
                <router-link to="/admin/services/car">
                    <div class="">
                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor"
                            class="bi bi-car-front mx-auto" viewBox="0 0 16 16">
                            <path
                                d="M4 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0m10 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2zM4.862 4.276 3.906 6.19a.51.51 0 0 0 .497.731c.91-.073 2.35-.17 3.597-.17s2.688.097 3.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 10.691 4H5.309a.5.5 0 0 0-.447.276" />
                            <path
                                d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679q.05.242.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.8.8 0 0 0 .381-.404l.792-1.848ZM4.82 3a1.5 1.5 0 0 0-1.379.91l-.792 1.847a1.8 1.8 0 0 1-.853.904.8.8 0 0 0-.43.564L1.03 8.904a1.5 1.5 0 0 0-.03.294v.413c0 .796.62 1.448 1.408 1.484 1.555.07 3.786.155 5.592.155s4.037-.084 5.592-.155A1.48 1.48 0 0 0 15 9.611v-.413q0-.148-.03-.294l-.335-1.68a.8.8 0 0 0-.43-.563 1.8 1.8 0 0 1-.853-.904l-.792-1.848A1.5 1.5 0 0 0 11.18 3z" />
                        </svg>
                        <h5 class="card-title fs-5">차량 공유<br>서비스 관리</h5>
                        <p class="card-text"></p>
                    </div>
                </router-link>
                <router-link to="/admin/payment">
                    <div class="">
                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor"
                            class="bi bi-credit-card" viewBox="0 0 16 16">
                            <path
                                d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z" />
                            <path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
                        </svg>
                        <h5 class="card-title fs-4">결제 관리</h5>
                        <p class="card-text"></p>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'AdminHomeView',
        components: {
            
        }
    };
</script>

<style scoped>
@import "../../style.css";
@import "../../assets/style/phone-main-view-common.css";

/* 📌 전체 컨테이너 */
.home {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #f8f9fa; /* 부드러운 배경색 */
    min-height: 100vh;
}

/* 📌 타이틀 스타일 */
.titleH2 {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
}

/* 📌 메뉴 버튼 컨테이너 */
.view-context-contain {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

/* 📌 각 메뉴 버튼 그룹 */
.d-flex {
    display: flex;
    justify-content: center;
    gap: 20px; /* 간격 조절 */
    width: 100%;
    flex-wrap: wrap;
}

/* 📌 개별 메뉴 아이템 */
.router-link {
    text-decoration: none;
    color: inherit;
}

.router-link div {
    width: 140px;
    height: 140px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 15px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* 📌 아이콘 스타일 */
.router-link svg {
    width: 60px;
    height: 60px;
    color: #007bff; /* 파란색 아이콘 */
}

/* 📌 텍스트 스타일 */
.router-link h5 {
    font-size: 16px;
    font-weight: 600;
    margin-top: 10px;
    text-align: center;
    color: #333;
}

/* 📌 호버 효과 */
.router-link div:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

</style>