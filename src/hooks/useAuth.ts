import { useRouter } from "next/navigation";

export const useAuth = () => {
    const router = useRouter();

    const logout = () => {
        // 1. 브라우저에 저장된 자체 JWT 삭제
        localStorage.removeItem("apex_access_token");

        // (선택) 카카오 로그아웃 API 호출이 필요하다면 여기에 추가

        // 2. 로그인 페이지 또는 메인 페이지로 이동
        router.push("/login");
    };

    return { logout };
};