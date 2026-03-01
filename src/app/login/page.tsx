"use client";

import Script from "next/script";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();

    const handleKakaoLogin = () => {
        // 1. 카카오 객체 및 Auth 모듈 유무 확인 (안전 장치 강화)
        if (!window.Kakao || !window.Kakao.Auth) {
            alert("카카오 SDK가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
            return;
        }

        // 2. 카카오 로그인 팝업 호출
        window.Kakao.Auth.login({
            success: async function (authObj: any) {
                console.log("카카오 로그인 성공! Token:", authObj.access_token);

                try {
                    // 3. 백엔드로 토큰 전송 (자체 JWT 교환)
                    const response = await fetch("http://localhost:8080/api/v1/auth/social/login", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            provider: "KAKAO",
                            accessToken: authObj.access_token,
                        }),
                    });

                    if (!response.ok) {
                        throw new Error("백엔드 인증 실패");
                    }

                    const data = await response.json();
                    console.log("백엔드 로그인 성공! 자체 JWT:", data.accessToken);

                    // 4. 발급받은 JWT 저장 및 이동
                    localStorage.setItem("apex_access_token", data.accessToken);
                    router.push("/dashboard/agent/chat"); // 대시보드로 이동

                } catch (error) {
                    console.error("로그인 연동 에러:", error);
                    alert("로그인 처리 중 문제가 발생했습니다.");
                }
            },
            fail: function (err: any) {
                console.error("카카오 로그인 실패:", err);
                alert("카카오 로그인에 실패했습니다.");
            },
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            {/* ✅ 수정 포인트: onLoad 이벤트를 사용하여 스크립트 로드 완료 직후 초기화 실행
        (useEffect 타이밍 문제 해결)
      */}
            <Script
                src="https://t1.kakaocdn.net/kakao_js_sdk/1.43.1/kakao.min.js"
                strategy="lazyOnload"
                onLoad={() => {
                    // 스크립트 로드가 끝나면 즉시 실행됨
                    if (window.Kakao && !window.Kakao.isInitialized()) {
                        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
                        console.log("Kakao SDK Initialized via onLoad");
                    }
                }}
            />

            <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Apex F1 Agent
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        소셜 계정으로 1초 만에 로그인하고 시작하세요.
                    </p>
                </div>

                <div className="mt-8">
                    <button
                        onClick={handleKakaoLogin}
                        className="flex items-center justify-center w-full px-4 py-3 text-sm font-semibold text-black transition-colors bg-[#FEE500] rounded-xl hover:bg-[#FDD800] focus:ring-4 focus:ring-[#FEE500]/50"
                    >
                        <MessageSquare className="w-5 h-5 mr-2" fill="currentColor" />
                        카카오로 시작하기
                    </button>
                </div>
            </div>
        </div>
    );
}