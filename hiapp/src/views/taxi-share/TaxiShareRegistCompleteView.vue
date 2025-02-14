<template>
    <div class="success-container">
        <!-- 체크 아이콘 -->
        <font-awesome-icon :icon="['fas', 'check']" class="check-icon" />

        <!-- 알림 메시지 -->
        <div class="context2">
            택시 공유 게시글이 등록되었습니다!
        </div>
        <p class="context3">
            다른 호스트들의 공유 글도 확인해 보세요!
        </p>

        <!-- 리스트 이동 버튼 -->
        <div class="mg-t-60">
            <button class="move-button" @click="goToList">리스트로 이동하기</button>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons'
const router = useRouter();

// 🔥 라이브러리에 아이콘 추가
library.add(faCheck);

// 리스트 페이지로 이동하는 함수
const goToList = () => {
    router.push('/taxi-share/list'); // 원하는 경로로 수정!
};
</script>

<style scoped>
/* 전체 컨테이너 스타일 */
.success-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    /* 화면 전체 높이 사용 */
    text-align: center;
    background-color: #f8f9fa;
}

/* 체크 아이콘 스타일 */
.check-icon {
    font-size: 80px;
    color: #28a745;
    /* 초록색 */
    margin-bottom: 20px;
    animation: pop 0.5s ease-out;
    /* 팝업 애니메이션 */
}

/* 메인 메시지 스타일 */
.context2 {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
}

/* 서브 메시지 스타일 */
.context3 {
    font-size: 16px;
    color: #555;
}

/* 버튼 스타일 */
.move-button {
    margin-top: 40px;
    padding: 12px 20px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.move-button:hover {
    background-color: #0056b3;
}

/* 팝업 애니메이션 */
@keyframes pop {
    0% {
        transform: scale(0);
        opacity: 0;
    }

    80% {
        transform: scale(1.1);
        opacity: 1;
    }

    100% {
        transform: scale(1);
    }
}
</style>
