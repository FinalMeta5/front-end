<template>
    <div class="home phone-main-screen">
        <div class="button-container">
            <button class="image-button">
                <img src="https://ifh.cc/g/xX2n1K.png" alt="출퇴근 이미지"/>
            </button>
            <button class="image-button">
                <img src="https://ifh.cc/g/HqXY1G.png" alt="장보기 이미지"/>
            </button>
            <button class="image-button">
                <img src="https://ifh.cc/g/PRDM0A.png" alt="예비군 이미지"/>
            </button>
            <button class="image-button">
                <img src="https://ifh.cc/g/roVBvK.png" alt="콘서트 이미지"/>
            </button>
            <button class="image-button">
                <img src="https://ifh.cc/g/zFn2L5.png" alt="스포츠 이미지"/>
            </button>
            <button class="image-button">
                <img src="https://ifh.cc/g/x0o8sx.png" alt="기타 이미지"/>
            </button>
        </div>
        <div class="button-container2">
            <div class="around-car">
                <img class="moving-image" src="https://ifh.cc/g/ch51wM.png" alt="움직이는 이미지">
                <router-link to="/carshare/map">
                    <button id="map-btn">
                        내 주변 공유 차량 확인하기
                    </button>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CarShareHomeView'
}
</script>

<style scoped>
@import "../../../style.css";
@import "../../../assets/style/phone-main-view-common.css";

.button-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* 3열 레이아웃 */
    gap: 15px; /* 버튼 간격 */
    width: 90%;
    margin: 0 auto;
    padding: 20px;
    margin-top: 200px;
    position: relative; /* 이미지가 이 범위 내에서만 움직이도록 설정 */
    overflow: hidden; /* 이미지를 범위 밖으로 나가지 않게 처리 */
}

.button-container2 {
    width: 100%;
    position: relative;
    display: flex; 
    justify-content: center; 
    align-items: center; 
}

.around-car {
    width: 80%;
    height: 200px;
    background-color: #878787;
    border-radius: 10px;
}

button {
    padding: 10px;
    border: 2px solid #d9d9d9;
    color: white;
    font-size: 16px;
    border-radius: 10px;
    cursor: pointer;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.image-button {
    width: 100%; /* 이미지 크기 */
    padding: 0; /* 버튼 패딩 제거 */
    display: flex;
    align-items: center;
    justify-content: center;
}

.image-button img {
    width: 100%; 
    height: 100%; 
    border-radius: 10px;
}

#map-btn {
    width: 100%;
    padding: 15px;
    color: white;
    font-size: 18px;
    border-radius: 10px;
    cursor: pointer;
    text-align: center;
    text-transform: uppercase;
    background-color: #878787;
    border: none;
    margin-top: 50px;
    z-index: 2; /* 버튼이 이미지 위에 오도록 설정 */
    position: relative; /* 버튼 위치 설정 */
}

.moving-image {
    position: absolute;
    top: calc(100% - 80px); /* #map-btn 기준으로 10px 위로 위치 */
    left: -90%; /* 화면 밖에서 시작하도록 설정 */
    transform: translateY(-50%);
    animation: moveImage 4s linear infinite; /* 애니메이션 설정 */
    width: 20%; /* 이미지 크기 */
    z-index: 1; /* 이미지가 버튼 아래에 위치하도록 설정 */
}

@keyframes moveImage {
    0% {
        left: -90%; 
    }
    50% {
        left: 40%; 
    }
    100% {
        left: 40%; 
    }
}
</style>
