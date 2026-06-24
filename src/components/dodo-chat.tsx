"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { useLanguage } from "@/contexts/language-context";

type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
    isLimitMessage?: boolean;
};

interface UserData {
    id: number;
    nickname: string;
    profileImageUrl?: string;
}

export default function DoDoChat() {
    const { t, language } = useLanguage();
    const [messages, setMessages] = React.useState<Message[]>([]);
    const [input, setInput] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [chatId, setChatId] = React.useState<string>("");
    const [isLimitReached, setIsLimitReached] = React.useState(false);
    const [remainingSeconds, setRemainingSeconds] = React.useState(0);

    const [user, setUser] = React.useState<UserData | null>(null);

    React.useEffect(() => {
        if (isLimitReached && remainingSeconds > 0) {
            const timer = setInterval(() => {
                setRemainingSeconds((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setIsLimitReached(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isLimitReached, remainingSeconds]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}분 ${s}초`;
    };

    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    React.useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    React.useEffect(() => {
        setChatId(`chat-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
        const fetchUserInfo = async () => {
            try {
                const response = await api.get("/users/me");
                if (response.data) {
                    setUser(response.data);
                    // 유저 정보가 있으면 유저별 고유 chatId 설정 (맥락 유지)
                    setChatId(`data-chat-user-${response.data.id}`);
                }
            } catch (error) {
                console.error("사용자 정보를 불러오는데 실패했습니다.", error);
            }
        };
        fetchUserInfo();
    }, []);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        const newMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: userMessage,
        };

        setMessages((prev) => [...prev, newMessage]);
        setInput("");
        setIsLoading(true);

        const assistantMsgId = (Date.now() + 1).toString();

        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("apex_access_token") : null;
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
            const response = await fetch(`${baseUrl}/agent/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    message: userMessage,
                    chatId: chatId
                }),
            });

            if (!response.ok) {
                if (response.status === 429) {
                    const errorData = await response.json().catch(() => ({}));
                    const err = new Error("TOO_MANY_REQUESTS") as any;
                    err.remainingSeconds = errorData.remainingSeconds ? parseInt(errorData.remainingSeconds, 10) : 0;
                    throw err;
                }
                throw new Error("Network response was not ok");
            }
            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullText = "";
            let leftover = "";
            let isFirstChunk = true;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const currentData = leftover + chunk;
                const lines = currentData.split("\n");

                leftover = lines.pop() || "";

                for (const line of lines) {
                    if (!line.startsWith("data:")) continue;

                    // "data:" 접두사(5글자)만 제거하고 이후의 모든 공백/텍스트를 보존
                    const content = line.substring(5);

                    // 만약 내용이 완전히 비어있다면 줄바꿈으로 처리
                    const finalChunk = content === "" ? "\n" : content;

                    if (isFirstChunk && finalChunk.trim() !== "") {
                        setIsLoading(false);
                        isFirstChunk = false;
                        setMessages((prev) => [
                            ...prev,
                            {
                                id: assistantMsgId,
                                role: "assistant",
                                content: finalChunk,
                            }
                        ]);
                        fullText += finalChunk;
                    } else if (!isFirstChunk) {
                        fullText += finalChunk;
                        setMessages((prev) =>
                            prev.map((msg) =>
                                msg.id === assistantMsgId ? { ...msg, content: fullText } : msg
                            )
                        );
                    }
                }
            }

            if (leftover && leftover.startsWith("data:")) {
                const contentToAdd = leftover.substring(5) === "" ? "\n" : leftover.substring(5);

                if (contentToAdd) {
                    if (isFirstChunk) {
                        setIsLoading(false);
                        isFirstChunk = false;
                        setMessages((prev) => [
                            ...prev,
                            {
                                id: assistantMsgId,
                                role: "assistant",
                                content: contentToAdd,
                            }
                        ]);
                        fullText += contentToAdd;
                    } else {
                        fullText += contentToAdd;
                        setMessages((prev) =>
                            prev.map((msg) =>
                                msg.id === assistantMsgId ? { ...msg, content: fullText } : msg
                            )
                        );
                    }
                }
            }

        } catch (error: any) {
            console.error("채팅 전송 실패:", error);
            if (error.message === "TOO_MANY_REQUESTS") {
                setIsLimitReached(true);
                setRemainingSeconds(error.remainingSeconds || 0);
                setMessages((prev) => {
                    const exists = prev.some(msg => msg.id === assistantMsgId);
                    const errorContent = t("chat.limit.reached");
                    if (exists) {
                        return prev.map((msg) =>
                            msg.id === assistantMsgId
                                ? { ...msg, content: errorContent, isLimitMessage: true }
                                : msg
                        );
                    } else {
                        return [
                            ...prev,
                            { id: assistantMsgId, role: "assistant", content: errorContent, isLimitMessage: true }
                        ];
                    }
                });
            } else {
                setMessages((prev) => {
                    const exists = prev.some(msg => msg.id === assistantMsgId);
                    const errorContent = t("chat.error.server");
                    if (exists) {
                        return prev.map((msg) =>
                            msg.id === assistantMsgId
                                ? { ...msg, content: errorContent }
                                : msg
                        );
                    } else {
                        return [
                            ...prev,
                            { id: assistantMsgId, role: "assistant", content: errorContent }
                        ];
                    }
                });
            }
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
        <div className="flex flex-col h-full bg-stone-50/50 dark:bg-gray-950">
            <Breadcrumb className="px-6 py-4 border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-10 dark:bg-gray-900/80 dark:border-gray-800">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard" className="text-sm font-medium">{language === 'ko' ? '홈' : 'Home'}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard/agent/chat" className="text-sm font-medium">DoDo Agent</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <div className="flex items-center gap-2 px-2 py-1 bg-stone-100 rounded-lg dark:bg-gray-800">
                            <Sparkles className="w-3.5 h-3.5 text-red-600" />
                            <span className="text-sm font-semibold text-stone-900 dark:text-stone-100">DoDo Analytics</span>
                        </div>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex flex-col flex-1 w-full max-w-6xl mx-auto p-4 md:p-8">
                {messages.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="flex flex-1 flex-col justify-center items-center w-full max-w-4xl mx-auto gap-12 pb-20 text-center"
                    >
                        <div className="space-y-6">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-stone-600 text-xs font-bold tracking-wider uppercase dark:bg-stone-900 dark:border-stone-800"
                            >
                                <div className="relative size-3.5 flex items-center justify-center">
                                    <svg width="0" height="0" className="absolute">
                                        <defs>
                                            <linearGradient id="dodo-welcome-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="10%" stopColor="#78716c" />
                                                <stop offset="70%" stopColor="#ef4444" />
                                                <stop offset="100%" stopColor="#dc2626" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <Sparkles className="size-3.5" style={{ stroke: "url(#dodo-welcome-gradient)" }} />
                                </div> F1 DATA SPECIALTY AI
                            </motion.div>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
                                {t("chat.welcome.subtitle")}<span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">{displayNickname}</span>?
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                                {t("chat.welcome.desc")}<span className="font-semibold text-stone-800 dark:text-stone-200">DoDo</span>입니다.<br />
                            </p>
                        </div>

                        <div className="w-full max-w-2xl relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 to-stone-400/20 rounded-[32px] blur-xl opacity-50 group-focus-within:opacity-100 transition-opacity" />
                            <div className="relative flex flex-col w-full rounded-[28px] border border-stone-200 bg-white/90 backdrop-blur-xl shadow-2xl shadow-stone-200/50 focus-within:ring-2 focus-within:ring-red-500/20 transition-all p-3 dark:bg-gray-900/90 dark:border-gray-800 dark:shadow-none">
                                <Textarea
                                    ref={textareaRef}
                                    placeholder={isLimitReached ? t("chat.input.placeholder.limit").replace("{time}", formatTime(remainingSeconds)) : t("chat.input.placeholder.normal")}
                                    className="min-h-[100px] w-full resize-none border-0 focus-visible:ring-0 px-5 py-4 text-lg shadow-none bg-transparent placeholder:text-stone-400 dark:placeholder:text-gray-500 disabled:opacity-50"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={isLoading || isLimitReached}
                                />
                                <div className="flex justify-between items-center px-3 pb-2 mt-2">
                                    <div className="flex items-center gap-2 text-xs font-medium text-stone-400 px-2">
                                        <div className={`size-2 rounded-full ${isLimitReached ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`} />
                                        {isLimitReached ? t("chat.status.limit") : t("chat.status.ready")}
                                    </div>
                                    <Button
                                        size="lg"
                                        className="rounded-2xl px-6 bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-50"
                                        onClick={handleSend}
                                        disabled={!input.trim() || isLoading || isLimitReached}
                                    >
                                        <Send className="w-4 h-4 mr-2" /> {t("chat.button.send")}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center gap-3 w-full max-w-3xl">
                            {[
                                { title: "최근 우승자", icon: Trophy, query: "최근 그랑프리 우승자는 누구야?" },
                                { title: "드라이버 분석", icon: Car, query: "막스 베르스타펜의 시즌 기록을 보여줘" },
                                { title: "서킷 정보", icon: MapPin, query: "다음 서킷 일정과 특징은 뭐야?" }
                            ].map((item, i) => (
                                <motion.button
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + (i * 0.1) }}
                                    onClick={() => !isLimitReached && handleSuggestionClick(item.query)}
                                    className={`group flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-stone-200 shadow-sm transition-all text-left dark:bg-gray-900 dark:border-gray-800 ${isLimitReached ? 'opacity-50 cursor-not-allowed' : 'hover:border-red-400 hover:bg-red-50/30 dark:hover:border-red-900'}`}
                                >
                                    <item.icon className="w-4 h-4 text-stone-500 group-hover:text-red-600 transition-colors" />
                                    <span className="text-sm font-medium text-stone-600 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-white transition-colors">{item.title}</span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <div className="flex flex-col flex-1 w-full max-w-3xl mx-auto overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex items-start gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                                    <Avatar className="w-10 h-10 mt-1 border-0 bg-transparent shrink-0 overflow-visible relative">
                                        {msg.role === "assistant" ? (
                                            <>
                                                <svg width="0" height="0" className="absolute">
                                                    <defs>
                                                        <linearGradient id="dodo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                            <stop offset="10%" stopColor="#78716c" />
                                                            <stop offset="70%" stopColor="#ef4444" />
                                                            <stop offset="100%" stopColor="#dc2626" />
                                                        </linearGradient>
                                                    </defs>
                                                </svg>
                                                <AvatarFallback className="bg-transparent">
                                                    <Sparkles 
                                                        size={22} 
                                                        style={{ stroke: "url(#dodo-gradient)" }} 
                                                    />
                                                </AvatarFallback>
                                            </>
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
                                        <p className="text-sm font-semibold">{msg.role === "assistant" ? "DoDo" : displayNickname}</p>
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
                                                            a: ({ ...props }) => <a className="text-primary underline underline-offset-4" target="_blank" rel="noopener noreferrer" {...props} />,
                                                            code: ({ ...props }) => (
                                                                <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
                                                            ),
                                                            pre: ({ ...props }) => (
                                                                <pre className="bg-muted p-4 rounded-xl overflow-x-auto my-4 border border-stone-200" {...props} />
                                                            ),
                                                            table: ({ ...props }) => (
                                                                <div className="overflow-x-auto my-6 border border-stone-200 rounded-xl">
                                                                    <table className="w-full text-sm border-collapse" {...props} />
                                                                </div>
                                                            ),
                                                            thead: ({ ...props }) => <thead className="bg-stone-50" {...props} />,
                                                            th: ({ ...props }) => <th className="px-4 py-2 border-b border-stone-200 font-semibold text-left" {...props} />,
                                                            td: ({ ...props }) => <td className="px-4 py-2 border-b border-stone-100" {...props} />,
                                                            blockquote: ({ ...props }) => (
                                                                <blockquote className="border-l-4 border-primary/30 pl-4 italic my-4 text-muted-foreground" {...props} />
                                                            ),
                                                        }}
                                                    >
                                                        {msg.content}
                                                    </ReactMarkdown>
                                                    {msg.isLimitMessage && (
                                                        <div className="pt-2">
                                                            <Button 
                                                                className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 shadow-md shadow-red-200 dark:shadow-none"
                                                                onClick={() => window.location.href = '/membership'}
                                                            >
                                                                멤버십 가입하기
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="whitespace-pre-wrap">{msg.content}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* 로딩 인디케이터: 마지막 메시지가 어시스턴트가 아닐 때만 표시 */}
                            {isLoading && (messages.length === 0 || messages[messages.length - 1].role !== "assistant") && (
                                <div className="flex items-start gap-4">
                                    <Avatar className="w-8 h-8 border-0 bg-transparent shrink-0 overflow-visible relative">
                                        <svg width="0" height="0" className="absolute">
                                            <defs>
                                                <linearGradient id="dodo-loading-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="10%" stopColor="#78716c" />
                                                    <stop offset="70%" stopColor="#ef4444" />
                                                    <stop offset="100%" stopColor="#dc2626" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <AvatarFallback className="bg-transparent">
                                            <Sparkles 
                                                size={16} 
                                                style={{ stroke: "url(#dodo-loading-gradient)" }} 
                                            />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-2 text-left">
                                        <p className="text-sm font-semibold">DoDo</p>
                                        <div className="inline-block bg-muted rounded-2xl px-4 py-2.5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex gap-1">
                                                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                                                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                                                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                                                </div>
                                                <ItemTitle className="line-clamp-1">{t("chat.loading")}</ItemTitle>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 bg-background mt-auto">
                            <div className="relative flex flex-col w-full rounded-2xl border border-gray-200 bg-white shadow-sm focus-within:ring-1 focus-within:ring-gray-300 transition-all overflow-hidden p-1 dark:bg-gray-950 dark:border-gray-800">
                                <Textarea
                                    ref={textareaRef}
                                    placeholder={isLimitReached ? t("chat.input.placeholder.limit").replace("{time}", formatTime(remainingSeconds)) : t("chat.input.placeholder.normal")}
                                    className="min-h-[50px] max-h-[150px] w-full resize-none border-0 focus-visible:ring-0 px-4 py-2 text-base shadow-none bg-transparent disabled:opacity-50"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={isLoading || isLimitReached}
                                />
                                <div className="flex justify-end p-1">
                                    <Button size="icon" className="rounded-full w-8 h-8" onClick={handleSend} disabled={!input.trim() || isLoading || isLimitReached}>
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