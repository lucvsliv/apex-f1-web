export interface Post {
    id: number;
    authorId: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    // 프론트엔드에서 표시를 위해 필요한 가상 필드들 (나중에 백엔드 연동 시 보완 필요)
    authorNickname?: string;
    authorProfileImageUrl?: string;
    views?: number;
    category?: string;
}

export interface CreatePostRequest {
    title: string;
    content: string;
}
