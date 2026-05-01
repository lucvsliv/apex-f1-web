import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    devIndicators: false,

    // F1 공식 이미지 서버 도메인 허용 추가
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "media.formula1.com",
                port: "",
                pathname: "/**",
            },
        ],
    },

    async redirects() {
        return [
            {
                source: "/",
                destination: "/dashboard/agent/chat",
                permanent: true,
            },
        ];
    },
};

export default nextConfig;