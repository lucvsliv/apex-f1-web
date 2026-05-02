import { create } from 'zustand';
import api from '@/lib/api/client'; // APEX-35에서 만든 Axios 인스턴스

// 1. 유저 정보 타입 정의 (백엔드 응답 구조에 맞게 수정 가능)
export interface User {
    id: number;
    provider: string;
    email: string;
    nickname: string;
    profileImageUrl?: string;
    role: string;
    tier: string
}

// 2. 스토어 상태 및 액션(함수) 정의
interface UserStore {
    user: User | null;
    isLoading: boolean;
    fetchUser: () => Promise<void>;
    setUser: (user: User) => void;
    clearUser: () => void;
}

// 3. Zustand 스토어 생성
export const useUserStore = create<UserStore>((set) => ({
    user: null, // 초기에는 로그인되지 않은 상태
    isLoading: true, // 초기 로딩 상태

    // 백엔드에서 내 정보를 가져오는 함수
    fetchUser: async () => {
        try {
            // 💡 실제 백엔드의 "내 정보 조회 API" 경로로 맞춰주세요. (예: /users/me)
            const response = await api.get('/users/me');
            set({ user: response.data, isLoading: false });
        } catch (error) {
            console.error("유저 정보 조회 실패:", error);
            // 토큰이 없거나 만료된 경우 (Interceptor가 처리하겠지만 방어 코드 작성)
            set({ user: null, isLoading: false });
        }
    },

    // 유저 정보를 수동으로 업데이트하는 함수
    setUser: (user: User) => set({ user }),

    // 로그아웃 시 유저 정보 초기화
    clearUser: () => set({ user: null, isLoading: false }),
}));