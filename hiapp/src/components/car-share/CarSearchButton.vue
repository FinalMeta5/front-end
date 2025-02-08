<template>
    <button @click="goToCarSearch" class="car-search-btn">차량 조회</button>

    <!-- ✅ 에러 모달 (`v-model` 적용) -->
    <ErrorModal v-model:show="showErrorModal" :message="errorMessage" />
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useAuthState } from "../../store/auth/auth";
import ErrorModal from "../../components/error-modal/ErrorModal.vue"; // ✅ 에러 모달 import

export default {
    name: "CarSearchButton",
    components: {
        ErrorModal,
    },
    setup() {
        const router = useRouter();
        const showErrorModal = ref(false); // ✅ 모달 표시 여부 추가
        const errorMessage = ref(""); // ✅ 에러 메시지 저장 변수 추가
        const { isAuthenticated } = useAuthState();

        const goToCarSearch = async () => {
            if (!isAuthenticated.value) {
                alert("로그인이 필요합니다.");
                return;
            }

            const memberId = localStorage.getItem("memberId");
            const token = localStorage.getItem("accessToken");

            if (!memberId) {
                alert("회원 정보를 확인할 수 없습니다. 다시 로그인해주세요.");
                return;
            }

            try {
                console.log(`📡 요청: GET /api/car-registration/member/${memberId}`);
                const response = await axios.get(`http://localhost:8080/api/car-registration/member/${memberId}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                console.log("✅ 서버 응답:", response);
                alert("🚗 차량 정보가 조회되었습니다.");
                // ✅ 차량이 등록된 경우 → 차량 조회 페이지로 이동
                router.push({ path: "/my-car-search", query: { mode: "edit" } });

            } catch (error) {
                console.error("🚨 서버 응답 오류:", error);

                if (error.response) {
                    const { status, data } = error.response;

                    if (status === 404) {
                        console.log("✅ 404 응답: 차량 미등록 → 차량 정보 없음 페이지로 이동");
                        router.push("/no-car-info"); // ✅ 차량이 없는 경우 새 페이지로 이동
                    } else {
                        errorMessage.value = `🚨 오류 발생: ${data.message} (코드: ${status})`;
                        showErrorModal.value = true;
                    }
                } else {
                    errorMessage.value = "네트워크 오류가 발생했습니다.";
                    showErrorModal.value = true;
                }
            }
        };

        return { goToCarSearch, showErrorModal, errorMessage };
    },
};
</script>

<style scoped>
.car-search-btn {
    background-color: #4192ff;
    color: white;
    font-weight: bold;
    font-family: fantasy;
    border-radius: 10px;
    cursor: pointer;
    width: 22rem;
    height: 50px;
    margin : 10px 0;
}
</style>