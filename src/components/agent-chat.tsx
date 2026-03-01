"use client";

import * as React from "react";
import { Send, Sparkles, Car, Trophy, MapPin } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import api from "@/lib/api/client";

type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
};

export default function AgentChat() {
    const [messages, setMessages] = React.useState<Message[]>([]);
    const [input, setInput] = React.useState("");
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    // Axios 사용
    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input;

        // 1. 유저 메시지를 화면에 먼저 렌더링 (낙관적 업데이트)
        const newMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: userMessage,
        };

        setMessages((prev) => [...prev, newMessage]);
        setInput(""); // 전송 후 입력창 비우기

        try {
            // 2. Axios 인스턴스로 API 통신 (토큰은 Interceptor가 알아서 헤더에 주입)
            const response = await api.post("/agent/chat", { message: userMessage });

            // 3. 백엔드 응답을 화면에 추가
            // (주의: 백엔드의 실제 응답 필드명에 따라 response.data.response 부분을 수정해야 할 수 있습니다)
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: response.data.response || "응답을 받았습니다. (백엔드 구조에 맞게 매핑 필요)",
                }
            ]);
        } catch (error) {
            console.error("채팅 전송 실패:", error);
            // 401/403은 Interceptor가 처리하므로, 여기서는 500 에러나 네트워크 연결 에러 등을 처리합니다.
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: "서버와 연결할 수 없거나 요청 처리 중 오류가 발생했습니다.",
                }
            ]);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (e.nativeEvent.isComposing) { return; }
            handleSend();
        }
    };

    const handleSuggestionClick = (text: string) => {
        setInput(text);
        textareaRef.current?.focus();
    };

    return (
        <div className="flex flex-col h-full">
            {/* Breadcrumb: 중앙 컨테이너 밖으로 분리하여 다른 페이지와 위치 통일 */}
            <Breadcrumb className="mx-7 mt-6 mb-2">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard" className="text-sm">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard/agent/chat" className="text-sm">AI Agent</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <span className="text-sm text-muted-foreground">Apex Assistant</span>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* 메인 콘텐츠 영역 */}
            <div className="flex flex-col flex-1 w-full max-w-5xl mx-auto p-4 md:p-6 md:pt-2">
                {messages.length === 0 ? (
                    // 1. 초기 상태: 인사말 좌측 정렬 및 중앙 입력창
                    <div className="flex flex-1 flex-col justify-center w-full max-w-3xl mx-auto gap-8 px-4 pb-20">
                        {/* 인사말 좌측 정렬 적용 */}
                        <div className="text-left w-full space-y-4">
                            <h1 className="text-4xl md:text-4xl font-semibold bg-gradient-to-r from-gray-600 to-red-600 bg-clip-text text-transparent dark:from-gray-100 dark:to-gray-400">
                                안녕하세요, Charles Lucvs님
                            </h1>
                            <p className="text-xl md:text-xl text-muted-foreground font-medium">
                                오늘 어떤 F1 데이터가 궁금하신가요?
                            </p>
                        </div>

                        {/* 중앙 프롬프트 입력창 */}
                        <div className="w-full relative group">
                            <div className="relative flex flex-col w-full rounded-3xl border border-gray-200 bg-white shadow-sm focus-within:ring-1 focus-within:ring-gray-300 focus-within:shadow-md transition-all overflow-hidden p-2 dark:bg-gray-950 dark:border-gray-800">
                                <Textarea
                                    ref={textareaRef}
                                    placeholder="예: 2024년 페라리 팀의 레이스 결과를 분석해줘"
                                    className="min-h-[80px] w-full resize-none border-0 focus-visible:ring-0 px-4 py-3 text-base shadow-none bg-transparent"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                                <div className="flex justify-between items-center px-2 pb-1 mt-2">
                                    <div className="text-xs text-muted-foreground px-2 flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" /> Apex Assistant
                                    </div>
                                    <Button size="icon" className="rounded-full w-10 h-10" onClick={handleSend} disabled={!input.trim()}>
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* 추천 질문 칩 */}
                        <div className="flex flex-wrap justify-start gap-2">
                            <Button variant="outline" className="rounded-full bg-gray-100 border-gray-100 text-sm text-muted-foreground" onClick={() => handleSuggestionClick("최근 그랑프리 우승자는 누구야?")}>
                                <Trophy className="w-4 h-4 mr-2" /> 최근 우승자
                            </Button>
                            <Button variant="outline" className="rounded-full bg-gray-100 border-gray-100 text-sm text-muted-foreground" onClick={() => handleSuggestionClick("막스 베르스타펜의 시즌 기록을 보여줘")}>
                                <Car className="w-4 h-4 mr-2" /> 드라이버 기록
                            </Button>
                            <Button variant="outline" className="rounded-full bg-gray-100 border-gray-100 text-sm text-muted-foreground" onClick={() => handleSuggestionClick("다음 서킷 일정과 특징은 뭐야?")}>
                                <MapPin className="w-4 h-4 mr-2" /> 다음 서킷 정보
                            </Button>
                        </div>
                    </div>
                ) : (
                    // 2. 대화 진행 상태: 일반적인 채팅 뷰
                    <div className="flex flex-col flex-1 w-full max-w-3xl mx-auto overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex items-start gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                                    <Avatar className="w-10 h-10 mt-1 border-gray-0 shrink-0">
                                        {msg.role === "assistant" ? (
                                            <AvatarFallback className="bg-primary/10 text-primary"><Sparkles size={16} /></AvatarFallback>
                                        ) : (
                                            <>
                                                <AvatarImage src="/avatars/quokka.jpg" />
                                                <AvatarFallback className="bg-secondary text-secondary-foreground">CL</AvatarFallback>
                                            </>
                                        )}
                                    </Avatar>
                                    <div className={`flex-1 space-y-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                                        <p className="text-sm font-semibold">{msg.role === "assistant" ? "Apex Assistant" : "Charles Lucvs"}</p>
                                        <div className="text-base leading-relaxed whitespace-pre-wrap text-foreground/90">
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 하단 고정 입력창 */}
                        <div className="p-4 bg-background mt-auto">
                            <div className="relative flex flex-col w-full rounded-2xl border border-gray-200 bg-white shadow-sm focus-within:ring-1 focus-within:ring-gray-300 transition-all overflow-hidden p-1 dark:bg-gray-950 dark:border-gray-800">
                                <Textarea
                                    ref={textareaRef}
                                    placeholder="어시스턴트에게 질문하기..."
                                    className="min-h-[50px] max-h-[150px] w-full resize-none border-0 focus-visible:ring-0 px-4 py-2 text-base shadow-none bg-transparent"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                                <div className="flex justify-end p-1">
                                    <Button size="icon" className="rounded-full w-8 h-8" onClick={handleSend} disabled={!input.trim()}>
                                        <Send className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}