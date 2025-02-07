<template>
    <div class="car-registration">

        <!-- 🚀 로그인 버튼 -->
        <button class="login-button" @click="login">로그인</button>

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
                <input type="text" id="model" v-model="carModel" placeholder="모델명을 입력하세요" />
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
            <input type="text" id="registration" v-model="carRegistration" placeholder="차량 등록번호를 입력하세요" />
        </div>

        <div class="form-group">
            <label for="color">차량 색상</label>
            <input type="text" id="color" v-model="carColor" placeholder="차량 색상을 입력하세요" />
        </div>

        <div class="form-group">
            <label for="description">차량 설명</label>
            <textarea id="description" v-model="carDescription" placeholder="차량에 대한 설명이나 소개글을 입력하세요"></textarea>
        </div>

        <!-- 범죄 기록 조회 동의서 업로드 -->
        <div class="file-upload">
            <label for="agreementFile" class="agreement-file-placeholder">
                <input type="file" id="agreementFile" @change="handleFileUpload" accept="application/pdf" hidden />
                <p v-if="fileName">{{ fileName }}</p>
                <p v-else>📄 범죄 기록 조회 동의서 제출 (PDF)</p>
            </label>
        </div>

        <!-- 등록 버튼 -->
        <button class="register-button" :disabled="!isFormValid" @click="registerCar">등록하기</button>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCarSide } from '@fortawesome/free-solid-svg-icons';

const carImage = ref<File | null>(null);
const carImageUrl = ref<string | null>(null); // 이미지 미리보기 URL
const carModel = ref('');
const carRegistration = ref('');
const carColor = ref('');
const carDescription = ref('');
const maxPassengers = ref(4); // 기본값 설정
const agreementFile = ref<File | null>(null);
const fileName = ref(''); // 업로드한 파일 이름 표시

const isLoggedIn = ref<boolean>(false);

const login = async () => {
    const loginData = {
        email: "email@email2.com",
        password: "gusals1234"
    };

    try {
        const response = await axios.post("http://localhost:8080/api/member/login", loginData);
        console.log("🚀 로그인 성공! 전체 응답:", response.data); 

        if (!response.data) {
            console.error("❌ 로그인 응답에 accessToken이 없습니다.");
            return;
        }

        // ✅ JWT 토큰 저장 (localStorage)
        localStorage.setItem("jwtToken", response.data); // response.data 자체가 토큰이면 저장
        console.log("🔑 저장된 토큰:", localStorage.getItem("jwtToken"));

        isLoggedIn.value = true;
        alert("로그인 성공!");
    } catch (error) {
        console.error("❌ 로그인 실패:", error);
        alert("로그인 실패!");
    }
};


// JWT 토큰 가져오기
const getToken = () => localStorage.getItem("jwtToken") || '';

// ✅ 버튼 활성화 조건 추가
const isFormValid = computed(() => {
    return (
        carImage.value &&
        agreementFile.value &&
        carModel.value.trim() !== '' &&
        carRegistration.value.trim() !== '' &&
        carColor.value.trim() !== ''
    );
});

// ✅ 차량 이미지 업로드 핸들러
const handleImageUpload = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
        carImage.value = file;
        carImageUrl.value = URL.createObjectURL(file); // 이미지 미리보기
    }
};

// ✅ 범죄기록조회동의서 업로드 핸들러
const handleFileUpload = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
        if (file.type !== 'application/pdf') {
            alert('PDF 파일만 업로드 가능합니다.');
            return;
        }
        agreementFile.value = file;
        fileName.value = file.name; // 파일 이름 저장
    }
};

// ✅ 차량 등록 API 요청
const registerCar = async () => {
    const token = getToken();
    if (!token) {
        alert("로그인이 필요합니다.");
        return;
    }

    if (!isFormValid.value) {
        alert("모든 필수 입력값을 입력하세요.");
        return;
    }

    const formData = new FormData();
    formData.append("carImage", carImage.value!);
    formData.append("agreementFile", agreementFile.value!);
    formData.append("carNumber", carRegistration.value);
    formData.append("carModel", carModel.value);
    formData.append("maxPassengers", maxPassengers.value.toString());
    formData.append("color", carColor.value);
    formData.append("carDescription", carDescription.value);

    try {
        const response = await axios.post("http://localhost:8080/api/car-registration/register", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            }
        });

        console.log("🚀 차량 등록 성공:", response.data);
        alert("🚗 차량이 성공적으로 등록되었습니다!");
    } catch (error) {
        console.error("❌ 차량 등록 실패:", error);
        alert("⚠ 차량 등록에 실패했습니다.");
    }
};
</script>

<style scoped>
    @import "../../assets/style/top-bottom-nav-mobile.css";
    @import "../../style.css";
    @import "../../assets/style/CarRegistraion.css";
</style>
