import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",

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