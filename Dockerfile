# 1. 의존성 설치 환경
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# [최적화] 변경이 적은 패키지 정의 파일만 먼저 복사
COPY package.json package-lock.json ./
RUN npm ci

# ---------------------------------------------------

# 2. 빌드 환경
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# ---------------------------------------------------

# 3. 실행 환경 (최종 결과물 용량 약 100MB 미만)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# [최적화] 빌드 결과물 중 실행에 꼭 필요한 파일만 추출 (standalone)
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]