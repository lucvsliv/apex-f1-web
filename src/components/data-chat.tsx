"use client";

import * as React from "react";
import { Send, Sparkles, Car, Trophy, MapPin } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import api from "@/lib/api/client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
};

interface UserData {
    nickname: string;
    profileImageUrl?: string;
}

export default function DataChat() {
    const [messages, setMessages] = React.useState<Message[]>([]);
    const [input, setInput] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [chatId, setChatId] = React.useState<string | null>(null);


    const [user, setUser] = React.useState<UserData | null>(null);

    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    React.useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await api.get("/users/me");
                if (response.data) {
                    setUser(response.data);
                }
            } catch (error) {
                console.error("사용자 정보를 불러오는데 실패했습니다.", error);
            }
        };
        fetchUserInfo();
    }, []);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input;

        const newMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: userMessage,
        };

        setMessages((prev) => [...prev, newMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await api.post("/agent/chat", {
                message: userMessage,
                chatId: chatId
            });

            if (response.data && response.data.chatId) {
                setChatId(response.data.chatId);
            }

            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: response.data.response || "응답을 받았습니다.",
                }
            ]);
        } catch (error) {
            console.error("채팅 전송 실패:", error);
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: "서버와 연결할 수 없거나 요청 처리 중 오류가 발생했습니다.",
                }
            ]);
        } finally {
            setIsLoading(false);
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

    const displayNickname = user?.nickname || "Guest";
    const fallbackInitials = displayNickname.substring(0, 2).toUpperCase();

    return (
        <div className="flex flex-col h-full">
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
                        <Select>
                            <SelectTrigger className="w-fit text-sm">
                                <SelectValue placeholder="Apex Assistant" />
                            </SelectTrigger>
                            <SelectContent className="border-gray-200">
                                <SelectItem value="Apex Assistant">Apex Assistant</SelectItem>
                            </SelectContent>
                        </Select>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex flex-col flex-1 w-full max-w-5xl mx-auto p-4 md:p-6 md:pt-2">
                {messages.length === 0 ? (
                    <div className="flex flex-1 flex-col justify-center w-full max-w-3xl mx-auto gap-8 px-4 pb-20">
                        <div className="text-left w-full space-y-4">
                            <h1 className="text-4xl md:text-4xl font-semibold bg-gradient-to-r from-gray-600 to-red-600 bg-clip-text text-transparent dark:from-gray-100 dark:to-gray-400">
                                안녕하세요, {displayNickname}님
                            </h1>
                            <p className="text-xl md:text-xl text-muted-foreground font-medium">
                                오늘 어떤 F1 데이터가 궁금하신가요?
                            </p>
                        </div>

                        <div className="w-full relative group">
                            {/* Textarea 영역 */}
                            <div className="relative flex flex-col w-full rounded-3xl border border-stone-200 bg-white focus-within:ring-1 focus-within:ring-stone-300 focus-within:shadow-md transition-all overflow-hidden p-2 dark:bg-gray-950 dark:border-gray-800">
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
                                    <Button size="icon" className="rounded-full w-10 h-10 bg-stone-700" onClick={handleSend} disabled={!input.trim() || isLoading}>
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* 추천 버튼 영역 */}
                        <div className="flex flex-wrap justify-start gap-2">
                            <Button variant="outline" className="rounded-full bg-stone-100 border-stone-100 text-sm text-muted-foreground" onClick={() => handleSuggestionClick("최근 그랑프리 우승자는 누구야?")}>
                                <Trophy className="w-4 h-4 mr-2" /> 최근 우승자
                            </Button>
                            <Button variant="outline" className="rounded-full bg-stone-100 border-stone-100 text-sm text-muted-foreground" onClick={() => handleSuggestionClick("막스 베르스타펜의 시즌 기록을 보여줘")}>
                                <Car className="w-4 h-4 mr-2" /> 드라이버 기록
                            </Button>
                            <Button variant="outline" className="rounded-full bg-stone-100 border-stone-100 text-sm text-muted-foreground" onClick={() => handleSuggestionClick("다음 서킷 일정과 특징은 뭐야?")}>
                                <MapPin className="w-4 h-4 mr-2" /> 다음 서킷 정보
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col flex-1 w-full max-w-3xl mx-auto overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex items-start gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                                    <Avatar className="w-10 h-10 mt-1 border-gray-0 shrink-0">
                                        {msg.role === "assistant" ? (
                                            <AvatarFallback className="bg-primary/10 text-primary"><Sparkles size={16} /></AvatarFallback>
                                        ) : (
                                            <>
                                                <AvatarImage src={user?.profileImageUrl || "https://bundui-images.netlify.app/avatars/08.png"} />
                                                <AvatarFallback className="bg-secondary text-secondary-foreground">
                                                    {fallbackInitials}
                                                </AvatarFallback>
                                            </>
                                        )}
                                    </Avatar>
                                    <div className={`flex-1 space-y-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                                        <p className="text-sm font-semibold">{msg.role === "assistant" ? "Apex Assistant" : displayNickname}</p>
                                        <div className={`text-base leading-relaxed text-foreground/90 ${msg.role === "assistant" ? "markdown-body" : "whitespace-pre-wrap"}`}>
                                            {msg.role === "assistant" ? (
                                                <div className="space-y-4">
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkGfm]}
                                                        rehypePlugins={[rehypeRaw]}
                                                        components={{
                                                            h1: ({ ...props }) => <h1 className="text-2xl font-bold mb-4 mt-6" {...props} />,
                                                            h2: ({ ...props }) => <h2 className="text-xl font-bold mb-3 mt-5" {...props} />,
                                                            h3: ({ ...props }) => <h3 className="text-lg font-bold mb-2 mt-4" {...props} />,
                                                            p: ({ ...props }) => <p className="mb-4 last:mb-0" {...props} />,
                                                            ul: ({ ...props }) => <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />,
                                                            ol: ({ ...props }) => <ol className="list-decimal pl-6 mb-4 space-y-1" {...props} />,
                                                            li: ({ ...props }) => <li className="mb-1" {...props} />,
                                                            code: ({ ...props }) => (
                                                                <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
                                                            ),
                                                            pre: ({ ...props }) => (
                                                                <pre className="bg-muted p-4 rounded-xl overflow-x-auto my-4 border border-stone-200" {...props} />
                                                            ),
                                                            blockquote: ({ ...props }) => (
                                                                <blockquote className="border-l-4 border-primary/30 pl-4 italic my-4 text-muted-foreground" {...props} />
                                                            ),
                                                            table: ({ ...props }) => (
                                                                <div className="overflow-x-auto my-6 border border-stone-200 rounded-xl">
                                                                    <table className="w-full text-sm border-collapse" {...props} />
                                                                </div>
                                                            ),
                                                            thead: ({ ...props }) => <thead className="bg-stone-50" {...props} />,
                                                            th: ({ ...props }) => <th className="px-4 py-2 border-b border-stone-200 font-semibold text-left" {...props} />,
                                                            td: ({ ...props }) => <td className="px-4 py-2 border-b border-stone-100" {...props} />,
                                                        }}
                                                    >
                                                        {msg.content}
                                                    </ReactMarkdown>
                                                </div>
                                            ) : (
                                                msg.content
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex items-start gap-4">
                                    <Avatar className="w-10 h-10 mt-1 border-gray-0 shrink-0">
                                        <AvatarFallback className="bg-primary/10 text-primary"><Sparkles size={16} /></AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-2 text-left">
                                        <p className="text-sm font-semibold">Apex Assistant</p>
                                        <div className="flex w-full max-w-xs flex-col gap-4 [--radius:1rem]">
                                            <Item variant="muted">
                                                <ItemMedia>
                                                    <Spinner />
                                                </ItemMedia>
                                                <ItemContent>
                                                    <ItemTitle className="line-clamp-1">F1 데이터를 분석하고 있습니다...</ItemTitle>
                                                </ItemContent>
                                            </Item>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-background mt-auto">
                            <div className="relative flex flex-col w-full rounded-2xl border border-gray-200 bg-white shadow-sm focus-within:ring-1 focus-within:ring-gray-300 transition-all overflow-hidden p-1 dark:bg-gray-950 dark:border-gray-800">
                                <Textarea
                                    ref={textareaRef}
                                    placeholder="어시스턴트에게 질문하기..."
                                    className="min-h-[50px] max-h-[150px] w-full resize-none border-0 focus-visible:ring-0 px-4 py-2 text-base shadow-none bg-transparent"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={isLoading}
                                />
                                <div className="flex justify-end p-1">
                                    <Button size="icon" className="rounded-full w-8 h-8" onClick={handleSend} disabled={!input.trim() || isLoading}>
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