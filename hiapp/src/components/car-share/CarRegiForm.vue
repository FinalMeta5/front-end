<template>
    <div class="car-registration">

        <!-- 차량 이미지 업로드 -->
        <div class="image-upload">
            <label for="carImage" class="image-placeholder">
                <input type="file" id="carImage" @change="handleImageUpload" hidden />
                <img v-if="carImageUrl" :src="carImageUrl" alt="차량 이미지" />
                <div v-else class="icon-container">
                    <FontAwesomeIcon :icon="faCarSide" size="2x" />
                    <p>차량 이미지를 등록해 주세요</p>
                </div>
            </label>
        </div>

        <!-- 입력 필드 -->
        <div class="max-psg">
            <div class="form-group">
                <label for="model">차량 모델명</label>
                <input type="text" id="model" v-model="carModel" />
            </div>

            <div class="form-group">
                <label for="maxPassengers">최대 탑승인원</label>
                <select id="maxPassengers" v-model="maxPassengers">
                    <option v-for="n in 9" :key="n" :value="n">{{ n }}</option>
                </select>
            </div>
        </div>

        <div class="form-group">
            <label for="registration">차량 등록번호</label>
            <input type="text" id="registration" v-model="carNumber" />
        </div>

        <div class="form-group">
            <label for="color">차량 색상</label>
            <input type="text" id="color" v-model="carColor" />
        </div>

        <div class="form-group">
            <label for="description">차량 설명 (선택 사항)</label>
            <textarea id="description" v-model="carDescription"></textarea>
        </div>

        <!-- 범죄 기록 조회 동의서 (PDF) -->
        <div class="file-upload">
            <label for="agreementFile" class="agreement-file-placeholder">
                <input type="file" id="agreementFile" @change="handleFileUpload" accept="application/pdf" hidden />
                <p v-if="fileName">{{ fileName }}</p>
                <p v-else>📄 범죄 기록 조회 동의서 제출 (PDF)</p>
            </label>
        </div>

        <!-- 등록 버튼 -->
        <button class="register-button" @click="registerCar">등록하기</button>

        <!-- 🚨 미기입 요소 에러 모달 창 -->
        <AlertModal :isVisible="showModal" :missingFields="missingFields" @close="showModal = false" />
        <!-- 🚨 차량 번호 중복 시 모달 창-->
        <ErrorModal v-model:show="showErrorModal" :message="errorMessage"/>
    </div>
</template>

<script setup>
import { ref, watch} from 'vue';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCarSide } from '@fortawesome/free-solid-svg-icons';
import AlertModal from "../../components/check-modal/AlertModal.vue";
import ErrorModal from '../error-modal/ErrorModal.vue';

const carNumber = ref("");
watch(carNumber, (newVal) => {
    carNumber.value = newVal.replace(/\s+/g, '');
});

const carImageUrl = ref('');
const carImageFile = ref(null);
const agreementFile = ref(null);
const carModel = ref('');
const carColor = ref('');
const carDescription = ref('');
const maxPassengers = ref(4);
const fileName = ref('');

const showModal = ref(false); // ✅ 모달 표시 여부
const missingFields = ref([]); // ✅ 누락된 필드 저장


const showErrorModal = ref(false); // 🚨 모달 상태
const errorMessage = ref(""); // 🚨 에러 메시지 저장

// 🚗 이미지 업로드 핸들러
const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        carImageFile.value = file;
        carImageUrl.value = URL.createObjectURL(file);
    }
};

// 📄 파일 업로드 핸들러
const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        agreementFile.value = file;
        fileName.value = file.name;
    }
};

// ✅ 차량 등록 API 요청
const registerCar = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        alert("로그인이 필요합니다.");
        return;
    }
    // ✅ 필수 입력 값 체크
    missingFields.value = [];
    if (!carImageFile.value) missingFields.value.push("차량 이미지");
    if (!carModel.value) missingFields.value.push("차량 모델");
    if (!carNumber.value) missingFields.value.push("차량 등록번호");
    if (!carColor.value) missingFields.value.push("차량 색상");
    if (!agreementFile.value) missingFields.value.push("범죄 기록 조회 동의서");

    if (missingFields.value.length > 0) {
        showModal.value = true; // ✅ 모달 표시
        return;
    }

    const formData = new FormData();
    if (carImageFile.value) {
        formData.append("carImage", carImageFile.value);
    }
    formData.append("agreementFile", agreementFile.value);
    formData.append("carNumber", carNumber.value);
    formData.append("carModel", carModel.value);
    formData.append("maxPassengers", maxPassengers.value);
    formData.append("color", carColor.value);
    formData.append("carDescription", carDescription.value || ''); // 🚀 description은 선택 사항

    try {
        const response = await axios.post("http://localhost:8080/api/car-registration/register", formData, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        });

        console.log("✅ 차량 등록 성공:", response.data);
        alert("🚗 차량이 성공적으로 등록되었습니다!");
        resetForm();
        router.push("/mypage");

    } catch (error) {
        console.error("❌ 차량 등록 실패:", error);
        alert("⚠ 차량 등록에 실패했습니다.");

        if (error.response) {
            if (error.response.status === 409) {
                // 🚨 차량 번호 중복일 경우
                errorMessage.value = "이미 등록된 차량 번호입니다. 다른 번호를 입력해주세요.";
                showErrorModal.value = true;
            } else {
                // 🚨 기타 오류 메시지 처리
                errorMessage.value = error.response.data.message || "차량 등록 중 오류가 발생했습니다.";
            }
        } else {
            errorMessage.value = "서버와의 연결이 원활하지 않습니다.";
        }

        showErrorModal.value = true; // 🚀 모달 열기
    }
};

// 🚀 입력 필드 초기화 함수
const resetForm = () => {
    carImageUrl.value = '';
    carImageFile.value = null;
    agreementFile.value = null;
    carModel.value = '';
    carNumber.value = '';
    carColor.value = '';
    carDescription.value = '';
    maxPassengers.value = 4;
    fileName.value = '';
    errorMessage.value = '';
    showErrorModal.value = false;
};
</script>

<style scoped>
    @import "../../assets/style/top-bottom-nav-mobile.css";
    @import "../../style.css";
    @import "../../assets/style/CarRegistraion.css";
</style>