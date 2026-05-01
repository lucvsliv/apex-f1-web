import axios from "axios";

// 1. 기본 Instance 생성
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
});
console.log("Axios baseURL 최종 설정값:", api.defaults.baseURL);

// 2. Request Interceptor (요청을 보내기 직전에 가로챔)
api.interceptors.request.use(
    (config) => {
        // 브라우저 환경일 때만 localStorage 접근
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("apex_access_token");
            if (token) {
                // 토큰이 있으면 무조건 헤더에 Authorization 자동 주입!
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. Response Interceptor (응답을 받기 직전에 가로챔)
let isAlerting = false;

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // 백엔드에서 401(미인증) 또는 403(권한 없음) 에러가 내려오면
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            if (typeof window !== "undefined" && !isAlerting) {
                isAlerting = true;
                // 토큰이 만료되었거나 변조되었으므로 스토리지에서 삭제
                localStorage.removeItem("apex_access_token");

                // 경고창 띄우고 로그인 페이지로 강제 이동
                alert("인증이 만료되었습니다. 다시 로그인해 주세요.");
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;