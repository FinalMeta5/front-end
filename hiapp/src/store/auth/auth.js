import axios from "axios";
import { ref } from "vue";

// 전역 상태
const isAuthenticated = ref(false);
const accessToken = ref(null);
const memberId = ref(0);
const nickname = ref(null);

const storedToken = localStorage.getItem("accessToken");
if (storedToken) {
  accessToken.value = storedToken;
  isAuthenticated.value = true;
}
const storedMemberId = localStorage.getItem("memberId");
if (storedMemberId) {
  memberId.value = storedMemberId;
}
const storedNickname = localStorage.getItem("nickname");
if (storedNickname) {
  nickname.value = storedNickname;
}

let isRefreshing = false; // 현재 토큰 재발급 중인지 여부
let refreshQueue = []; // 재발급 동안 대기 중인 요청들을 모아두는 배열

const authAxios = axios.create({
  baseURL: "http://localhost:8080", // 실제 백엔드 주소로 교체해야함.
  withCredentials: true,
});

authAxios.interceptors.request.use(
  (config) => {
    if (accessToken.value) {
      config.headers.Authorization = `Bearer ${accessToken.value}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

authAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const {
      config,
      response: { status },
    } = error;

    if (status === 401) {
      // 이미 재발급 요청 중이라면, 새 토큰 나올 때까지 대기
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        })
          .then((token) => {
            // 새 토큰 받으면 헤더 갱신 후 재시도
            config.headers.Authorization = `Bearer ${token}`;
            return authAxios(config);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // 재발급 시도
      isRefreshing = true;

      try {
        // 새 토큰 발급
        const newToken = await refreshAccessToken();
        // 대기 중이던 요청들 처리
        refreshQueue.forEach((p) => p.resolve(newToken));
        refreshQueue = [];

        // 재발급 끝
        isRefreshing = false;

        // 헤더 갱신 후 원래 요청 재발행
        config.headers.Authorization = `Bearer ${newToken}`;
        return authAxios(config);
      } catch (refreshError) {
        // 재발급 실패 → 로그인 상태 해제
        refreshQueue.forEach((p) => p.reject(refreshError));
        refreshQueue = [];
        isRefreshing = false;

        await logout(); // 로그아웃 처리
        return Promise.reject(refreshError);
      }
    }

    // 그 외 에러는 그대로 반환
    return Promise.reject(error);
  }
);

async function login(email, password) {
  try {
    // 서버 로그인 요청
    const response = await axios.post(
      "http://localhost:8080/api/member/login",
      {
        email: email,
        password: password,
      }
    );

    const tokenFromHeader = response.headers["accesstoken"];
    if (tokenFromHeader) {
      accessToken.value = tokenFromHeader;
      isAuthenticated.value = true;

      localStorage.setItem("accessToken", tokenFromHeader);

      if (response.data) {
        memberId.value = response.data.memberId;
        localStorage.setItem("memberId", response.data.memberId);
        localStorage.setItem("nickname", response.data.nickname);
      } else {
        throw new Error("로그인 응답에 memberId가 없습니다.");
      }
    } else {
      throw new Error("토큰이 응답 헤더에 없습니다.");
    }

    // Refresh Token은 httpOnly 쿠키로 자동 저장 (withCredentials: true)
    // 브라우저 개발자도구에서 쿠키 확인 가능
  } catch (error) {
    console.error("로그인 실패:", error);
    isAuthenticated.value = false;
    accessToken.value = null;
    memberId.value = null;
    nickname.value = null;
    throw error;
  }
}

async function logout() {
  try {
    await authAxios.post("/api/member/logout");
  } catch (error) {
    console.error("로그아웃 API 호출 실패:", error);
  } finally {
    // 토큰/상태 초기화
    accessToken.value = null;
    isAuthenticated.value = false;
    memberId.value = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("memberId");
    localStorage.removeItem("nickname");
  }
}

async function refreshAccessToken() {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/member/reissue"
    );
    const newToken = response.headers["accesstoken"];
    if (newToken) {
      accessToken.value = newToken;
      isAuthenticated.value = true;
      localStorage.setItem("accessToken", newToken);
      return newToken;
    } else {
      throw new Error("재발급 실패: Access Token이 응답 헤더에 없습니다.");
    }
  } catch (error) {
    console.error("토큰 재발급 실패:", error);
    isAuthenticated.value = false;
    accessToken.value = null;
    localStorage.removeItem("accessToken");
    throw error;
  }
}

function useAuthState() {
  return {
    isAuthenticated,
    accessToken,
    memberId,
    nickname,
  };
}

export { authAxios, login, logout, refreshAccessToken, useAuthState };
