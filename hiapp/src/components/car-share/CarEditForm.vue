<template>
    <div class="car-registration">
        <!-- 🚗 차량 이미지 업로드 -->
        <div class="image-upload">
            <label for="carImage" class="image-placeholder">
                <input type="file" id="carImage" @change="handleImageUpload" hidden :disabled="!isEditing || isEditing"/>
                <img v-if="carImageUrl" :src="carImageUrl" alt="차량 이미지" />
                <div v-else class="icon-container">
                    <FontAwesomeIcon :icon="faCarSide" size="2x" />
                    <p>차량 이미지를 등록해 주세요</p>
                </div>
            </label>
        </div>

        <!-- 입력 필드 -->
        <div class="max-psg">
            <div class="first-info-car">
                <div class="car-model">
                    {{carModel}}
                </div>
            </div>
        </div>

        <div class="form-group">
            <label for="maxPassengers">최대 탑승인원</label>
            <select id="maxPassengers" v-model="maxPassengers" :disabled="!isEditing">
                <option v-for="n in 9" :key="n" :value="n">{{ n }}</option>
            </select>
        </div>

        <div class="form-group">
            <label for="registration">차량 등록번호</label>
            <input type="text" id="registration" v-model="carRegistration" :disabled="!isEditing || isEditing"/>
        </div>

        <div class="form-group">
            <label for="color">차량 색상</label>
            <input type="text" id="color" v-model="carColor" :disabled="!isEditing"/>
        </div>

        <div class="form-group">
            <label for="description">차량 설명</label>
            <textarea id="description" v-model="carDescription" :disabled="!isEditing"></textarea>
        </div>

        <!-- 🛑 인증되지 않은 사용자만 파일 업로드 가능 -->
        <div v-if="!isVerified && fileName" class="file-upload">
            <label for="agreementFile" class="agreement-file-placeholder">
                <input type="file" id="agreementFile" @change="handleFileUpload" accept="application/pdf" hidden :disabled="!isEditing"/>
                <p v-if="fileName" style="color: red;">🛑 인증 처리 중입니다.</p>
                <p v-else>📄 범죄 기록 조회 동의서 제출 (PDF)</p>
            </label>
        </div>

        <!-- 🔘 버튼 UI 변경 -->
        <button v-if="mode === 'register'" class="register-button" @click="registerCar">등록하기</button>
        <div class="two-button-group">
            <button v-if="mode === 'edit' && !isEditing" class="car-geri-edit-button" @click="enableEdit">수정</button>
            <button v-if="mode === 'edit' && !isEditing" class="car-geri-delete-button" @click="showConfirmModal = true">삭제</button>
        </div>

        <div class="two-button-group" v-if="mode === 'edit' && isEditing">
            <!-- 🛑 인증되지 않은 사용자만 재등록 버튼 보이게 -->
            <button class="car-reregister-button" @click="reRegisterCar" v-if="!isVerified && fileName">
                재등록
            </button>

            <!-- ✅ 인증된 사용자만 수정 완료 버튼 보이게 -->
            <button class="car-modify-button" @click="submitCarUpdate" v-else>
                수정 완료
            </button>

            <button class="regi-cancel-button" @click="cancelEdit">수정 취소</button>
        </div>

            <!-- 에러 모달 -->
            <ErrorModal v-if="showErrorModal" :message="errorMessage" @close="showErrorModal = false" />

            <!-- 성공 모달 -->
            <SuccessModal 
                v-if="showSuccessModal"
                :title="successTitle"
                :textLine1="successText"
                :textLine2="'마이페이지에서 차량 정보를 확인하세요.'"
                close="확인"
                @close="closeSuccessModal"
            />

            <!-- 삭제 확인 모달 -->
            <ConfirmModal 
                :isVisible="showConfirmModal" 
                :message="'정말 이 차량을 삭제하시겠습니까?'"
                @confirm="deleteCar"
                @cancel="showConfirmModal = false"
            />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { authAxios } from "../../store/auth/auth";
import axios from 'axios';
import router from '../../router';
import ErrorModal from '../error-modal/ErrorModal.vue';
import SuccessModal from '../modal/SuccessModal.vue';
import ConfirmModal from '../modal/ConfirmModal.vue';

const route = useRoute();
const mode = ref(route.query.mode || "register"); // 🚀 등록/수정 모드 확인
const isEditing = ref(mode.value === "register"); // 🚀 등록 모드면 기본적으로 활성화
const isVerified = ref(false);

const carImageUrl = ref('');
const carModel = ref('');
const carRegistration = ref('');
const carColor = ref('');
const carDescription = ref('');
const maxPassengers = ref(4);
const fileName = ref('');

const showErrorModal = ref(false);
const showConfirmModal = ref(false);
const errorMessage = ref("");
const showSuccessModal = ref(false);
const successTitle = ref("");
const successText = ref("");

const originalData = ref({}); // 🚀 수정 취소를 위해 원본 데이터 저장

// ✅ 차량 조회 및 인증 여부 확인
const fetchCarData = async () => {
    const memberId = localStorage.getItem("memberId");
    const token = localStorage.getItem("accessToken");

    if (!memberId || !token) {
        alert("로그인이 필요합니다.");
        return;
    }

    try {
        const response = await axios.get(`http://localhost:8080/api/car-registration/member/${memberId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = response.data;
        carModel.value = data.carModel;
        carRegistration.value = data.carNumber;
        carColor.value = data.color;
        carDescription.value = data.carDescription;
        maxPassengers.value = data.maxPassengers;
        carImageUrl.value = data.imageUrl;
        isVerified.value = data.isVerified;
        fileName.value = data.agreementFile || '';
        originalData.value.carId = data.carId;

        originalData.value = { // 🚀 원본 데이터 저장
            carId: data.carId,
            carModel: data.carModel,
            carRegistration: data.carNumber,
            carColor: data.color,
            carDescription: data.carDescription,
            maxPassengers: data.maxPassengers,
            carImageUrl: data.imageUrl,
            isVerified: data.isVerified,
            fileName: data.agreementFile || ''
        };

    } catch (error) {
        console.error("🚨 차량 정보 불러오기 실패:", error);
    }
};



// ✅ 🚗 이미지 업로드 핸들러
const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        carImageFile.value = file;
        carImageUrl.value = URL.createObjectURL(file); // 미리보기 기능 추가
    }
};

// ✅ 📄 파일 업로드 핸들러
const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        agreementFile.value = file;
        fileName.value = file.name;
    }
};


// ✅ 차량 수정 API 요청
const submitCarUpdate = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        errorMessage.value = "로그인이 필요합니다.";
        showErrorModal.value = true;
        return;
    }

    const updatedCarData = {};
    if (carRegistration.value !== originalData.value.carRegistration) {
        updatedCarData.carNumber = carRegistration.value;
    }
    if (carModel.value !== originalData.value.carModel) {
        updatedCarData.carModel = carModel.value;
    }
    if (maxPassengers.value !== originalData.value.maxPassengers) {
        updatedCarData.maxPassengers = maxPassengers.value;
    }
    if (carColor.value !== originalData.value.carColor) {
        updatedCarData.color = carColor.value;
    }
    if (carImageUrl.value !== originalData.value.carImageUrl) {
        updatedCarData.imageUrl = carImageUrl.value;
        updatedCarData.imageName = carImageUrl.value ? carImageUrl.value.split('/').pop() : '';
    }
    if (fileName.value !== originalData.value.fileName) {
        updatedCarData.verifiedFile = fileName.value;
    }
    if (carDescription.value !== originalData.value.carDescription) {
        updatedCarData.carDescription = carDescription.value;
    }

    // 변경된 값이 없으면 API 요청 안 함
    if (Object.keys(updatedCarData).length === 0) {
        errorMessage.value = "변경된 내용이 없습니다.";
        showErrorModal.value = true;
        return;
    }

    try {
        // const response = await authAxios.put(`/api/car-registration/update/${originalData.value.carId}`, 
        const response = await axios.put(`http://localhost:8080/api/car-registration/update/${originalData.value.carId}`, 
            updatedCarData, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        successTitle.value = "🚗 차량 정보 수정 완료!";
        successText.value = "차량 정보가 성공적으로 수정되었습니다.";
        showSuccessModal.value = true;
        isEditing.value = false;

    } catch (error) {
        errorMessage.value = "⚠ 차량 정보 수정에 실패했습니다.";
        showErrorModal.value = true;
    }
};

// ✅ 차량 재등록 API 요청
const reRegisterCar = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        errorMessage.value = "로그인이 필요합니다.";
        showErrorModal.value = true;
        return;
    }

    const reRegisterData = {
        maxPassengers: maxPassengers.value,
        color: carColor.value,
        imageUrl: carImageUrl.value,
        imageName: carImageUrl.value ? carImageUrl.value.split('/').pop() : '',
        verifiedFile: fileName.value,
        carDescription: carDescription.value
    };

    try {
        // 차량 수정 요청 (PUT)
        // const updateResponse = authAxios.put(`/api/car-registration/update/${originalData.value.carId}`, 
        const updateResponse = axios.put(`http://localhost:8080/api/car-registration/update/${originalData.value.carId}`, 
            reRegisterData, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        successTitle.value = "✅ 차량 재등록 성공!";
        successText.value = "차량이 성공적으로 수정되었습니다. 추가 검토 후 인증이 진행됩니다.";
        showSuccessModal.value = true;
        isEditing.value = false;

        // 🚀 차량 수정 성공 후, 차량 재등록 알림 요청 (POST)
        const reRegisterResponse = axios.post(
            // `/api/car-registration/re-registration/${originalData.value.memberId}`,
            `http://localhost:8080/api/car-registration/re-registration/${originalData.value.memberId}`,
            {},  // POST 요청이지만 데이터 없이 보낼 경우 빈 객체 `{}` 전달
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );
        successTitle.value = "📢 차량 재등록 알림 요청 성공";
        successText.value = "📩 차량 재등록 요청이 성공적으로 전달되었습니다";
        showSuccessModal.value = true;
        isEditing.value = false;

    } catch (error) {
        console.error("❌ 차량 수정 실패:", error);
        alert("⚠ 차량 정보 수정에 실패했습니다.");
    }
};



// ✅ 차량 삭제 API 요청
const deleteCar = async () => {
    showConfirmModal.value = false;
    const token = localStorage.getItem("accessToken");

    if (!token) {
        errorMessage.value = "로그인이 필요합니다.";
        showErrorModal.value = true;
        return;
    }

    try {
        await axios.delete(`http://localhost:8080/api/car-registration/delete/${originalData.value.carId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        successTitle.value = "🚗 차량 삭제 완료!";
        successText.value = "차량이 성공적으로 삭제되었습니다.";
        showSuccessModal.value = true;

    } catch (error) {
        errorMessage.value = "⚠ 차량 삭제에 실패했습니다.";
        showErrorModal.value = true;
    }
};

// ✅ 성공 모달 닫기 & 페이지 이동
const closeSuccessModal = () => {
    showSuccessModal.value = false;
    router.push("/mypage");
};


// ✅ 수정 취소 기능
const cancelEdit = () => {
    isEditing.value = false;
    
    // 🚀 원본 데이터로 복원
    carModel.value = originalData.value.carModel;
    carRegistration.value = originalData.value.carRegistration;
    carColor.value = originalData.value.carColor;
    carDescription.value = originalData.value.carDescription;
    maxPassengers.value = originalData.value.maxPassengers;
    carImageUrl.value = originalData.value.carImageUrl;
    isVerified.value = originalData.value.isVerified;
    fileName.value = originalData.value.fileName;
};

// ✅ 수정 버튼 클릭 시 편집 모드 활성화
const enableEdit = () => {
    isEditing.value = true;
};

// 🚀 컴포넌트가 로드될 때 차량 정보 조회
onMounted(() => {
    if (mode.value === "edit") {
        fetchCarData();
    }
});
</script>


<style scoped>
    @import "../../assets/style/top-bottom-nav-mobile.css";
    @import "../../style.css";
    @import "../../assets/style/CarRegistraion.css";
</style>