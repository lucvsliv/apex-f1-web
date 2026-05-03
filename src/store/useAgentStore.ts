import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type MessageRole = 'user' | 'agent' | 'system';
export type ActionType = 'none' | 'post_action' | 'store_action' | 'toss_payment';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  actionType: ActionType;
  actionPayload?: any;
  timestamp: number;
}

interface AgentState {
  isOpen: boolean;
  messages: ChatMessage[];
  isTyping: boolean;
  _hasHydrated: boolean; // Hydration 상태 추가
  setHasHydrated: (state: boolean) => void;
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => string;
  updateMessageContent: (id: string, content: string) => void;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  setTyping: (typing: boolean) => void;
  clearMessages: () => void;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome-msg',
  role: 'agent',
  content: "반가워요! 전 여러분의 요청을 즉시 해결해드리는 **FoFo**예요! \n\n무엇이든 시켜만 주세요! 다음은 제가 처리할 수 있는 일들이에요 :)\n\n- 📝 게시판에 멋진 게시글 작성하기\n- 🛒 스토어 상품 구매 도와드리기\n- 💳 멤버십 구독 상태 확인 및 변경\n\n지금 바로 시작해볼까요? 어떤 걸 도와드릴까요?",
  actionType: 'none',
  timestamp: Date.now(),
};

export const useAgentStore = create<AgentState>()(
  persist(
    (set) => ({
      isOpen: false,
      messages: [WELCOME_MESSAGE],
      isTyping: false,
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
      setOpen: (open) => set({ isOpen: open }),
      addMessage: (msg) => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({
          messages: [
            ...state.messages,
            {
              ...msg,
              id,
              timestamp: Date.now(),
            }
          ]
        }));
        return id;
      },
      updateMessageContent: (id, content) => set((state) => ({
        messages: state.messages.map((m) =>
          m.id === id ? { ...m, content: m.content + content } : m
        ),
      })),
      updateMessage: (id, updates) => set((state) => ({
        messages: state.messages.map((m) =>
          m.id === id ? { ...m, ...updates } : m
        ),
      })),
      setTyping: (typing) => set({ isTyping: typing }),
      clearMessages: () => set({ messages: [WELCOME_MESSAGE] }),
    }),
    {
      name: 'apex-agent-chat',
      partialize: (state) => ({
        messages: state.messages,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
