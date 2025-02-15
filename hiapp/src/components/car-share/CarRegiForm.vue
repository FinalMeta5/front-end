<template>
    <div class="car-registration">

        <!-- 🚗 차량 이미지 업로드 -->
        <div class="image-upload">
            <label for="carImage" class="image-placeholder">
                <input type="file" id="carImage" ref="carImageInput" @change="handleImageSelection" accept="image/*" :disabled="carImageUploaded" hidden />
                
                <!-- ✅ 이미지 미리보기 추가 -->
                <img v-if="carImagePreview" :src="carImagePreview" alt="선택한 이미지 미리보기" />
                
                <div v-else class="icon-container">
                    <FontAwesomeIcon :icon="faCarSide" size="2x" />
                    <p>차량 이미지를 등록해 주세요</p>
                </div>
            </label>
            <button class="carimg-send-btn" @click="uploadCarImage" :disabled="!carImageFile || carImageUploaded">
                {{ carImageUploaded ? "전송 완료" : "전송" }}
            </button>
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

        <!-- 📄 범죄 기록 조회 동의서 (PDF) -->
        <div class="file-upload">
            <label for="agreementFile" class="agreement-file-placeholder">
                <input type="file" id="agreementFile" ref="agreementFileInput" @change="handleFileSelection" accept="application/pdf" :disabled="agreementFileUploaded" hidden />
                
                <!-- ✅ 파일명 표시 추가 -->
                <div v-if="fileName">
                    <FontAwesomeIcon :icon="faFilePdf" size="lg" style="color: red;" />
                    <p>{{ fileName }}</p>
                </div>
                <p v-else>📄 범죄 기록 조회 동의서 제출 (PDF)</p>
            </label>
            <button class="carimg-send-btn2" @click="uploadAgreementFile" :disabled="!agreementFile || agreementFileUploaded">
                {{ agreementFileUploaded ? "전송 완료" : "파일 전송" }}
            </button>
        </div>

        <!-- 등록 버튼 -->
        <button class="register-button" @click="registerCar">등록하기</button>

        <!-- 🚨 미기입 요소 에러 모달 창 -->
        <AlertModal :isVisible="showModal" :missingFields="missingFields" @close="showModal = false" />
        <!-- 🚨 차량 번호 중복 시 모달 창-->
        <ErrorModal v-model:show="showErrorModal" :message="errorMessage"/>
        <!-- 차량 등록 성공 모달 -->
        <SuccessModal
            v-if="showSuccessModal"
            title="✅ 차량 등록 성공!"
            textLine1="차량이 성공적으로 등록되었습니다."
            textLine2="마이페이지에서 차량 정보를 확인하세요."
            close="확인"
            @close="closeSuccessModal"
        />
    </div>
</template>

<script setup>
import { nextTick, ref, watch} from 'vue';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCarSide } from '@fortawesome/free-solid-svg-icons';
import AlertModal from "../../components/check-modal/AlertModal.vue";
import ErrorModal from '../error-modal/ErrorModal.vue';
import SuccessModal from '../modal/SuccessModal.vue';
import { useRouter } from "vue-router"; // ✅ router 추가
const router = useRouter();
const carNumber = ref("");
watch(carNumber, (newVal) => {
    carNumber.value = newVal.replace(/\s+/g, '');
});

const carImageFile = ref(null);
const carImagePreview = ref(null);
const carImageUrl = ref(null);
const carImageUploaded = ref(false);

const agreementFile = ref(null);
const agreementFileUrl = ref(null);
const agreementFileUploaded = ref(false);

const carModel = ref('');
const carColor = ref('');
const carDescription = ref('');
const maxPassengers = ref(4);
const fileName = ref('');

const showModal = ref(false);
const showSuccessModal = ref(false);
const missingFields = ref([]); // ✅ 누락된 필드 저장


const showErrorModal = ref(false); // 🚨 모달 상태
const errorMessage = ref(""); // 🚨 에러 메시지 저장

// 🚗 이미지 선택 시 미리보기 표시 (URL은 아직 전송 안 함)
const handleImageSelection = (event) => {
    const file = event.target.files[0];
    if (file) {
        carImageFile.value = file;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            carImagePreview.value = reader.result; // ✅ 선택한 이미지 미리보기
        };
    }
};

// 📄 PDF 선택 시 파일명만 표시
const handleFileSelection = (event) => {
    agreementFile.value = event.target.files[0];
    fileName.value = agreementFile.value?.name || "";
};

// 🚗 차량 이미지 업로드 (URL 저장)
const uploadCarImage = async () => {
    if (!carImageFile.value) {
        alert("🚨 이미지를 선택하세요.");
        return;
    }

    const token = localStorage.getItem("accessToken");
    const formData = new FormData();
    formData.append("carImage", carImageFile.value);

    try {
        const response = await authAxios.post("/api/car-registration/upload-car-image", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`,
            },
        });

        carImageUrl.value = response.data; // ✅ 서버에서 받은 URL 저장
        carImageUploaded.value = true;
    } catch (error) {
        console.error("🚨 차량 이미지 업로드 실패:", error.response);
        alert("🚗 차량 이미지 업로드에 실패했습니다.");
    }
};

// 📄 계약서 파일 업로드 (URL 저장)
const uploadAgreementFile = async () => {
    if (!agreementFile.value) {
        alert("🚨 계약서 파일을 선택하세요.");
        return;
    }

    const token = localStorage.getItem("accessToken");
    const formData = new FormData();
    formData.append("agreementFile", agreementFile.value);

    try {
        const response = await authAxios.post("/api/car-registration/upload-verified-file", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`,
            },
        });

        agreementFileUrl.value = response.data; // ✅ 서버에서 받은 URL 저장
        agreementFileUploaded.value = true;
    } catch (error) {
        console.error("🚨 계약서 파일 업로드 실패:", error.response);
        alert("📄 계약서 파일 업로드에 실패했습니다.");
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
    if (!carImageUrl.value) missingFields.value.push("차량 이미지");
    if (!carModel.value) missingFields.value.push("차량 모델");
    if (!carNumber.value) missingFields.value.push("차량 등록번호");
    if (!carColor.value) missingFields.value.push("차량 색상");
    if (!agreementFileUrl.value) missingFields.value.push("범죄 기록 조회 동의서");

    if (missingFields.value.length > 0) {
        showModal.value = true; // ✅ 모달 표시
        return;
    }

    const formData = new FormData();
    formData.append("carImageUrl", carImageUrl.value);
    formData.append("agreementFile", agreementFileUrl.value);
    formData.append("carNumber", carNumber.value);
    formData.append("carModel", carModel.value);
    formData.append("maxPassengers", maxPassengers.value);
    formData.append("color", carColor.value);
    formData.append("carDescription", carDescription.value || ''); // 🚀 description은 선택 사항

    try {
        const response = await authAxios.post("/api/car-registration/register", formData, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        });

        console.log("✅ 차량 등록 성공!");
        showSuccessModal.value = true; // ✅ 성공 모달 표시
        await nextTick();
        resetForm();
        setTimeout(() => {
            router.push("/mypage");
        }, 1500); // 1.5초 후 페이지 이동

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