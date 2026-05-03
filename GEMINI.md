# GEMINI.md (Frontend Context)

## Project Overview: Apex-F1 Web
Apex-F1의 사용자 인터페이스를 담당하며, F1 레이스 데이터 시각화, AI 에이전트 채팅, 멤버십 결제 및 스토어 기능을 제공하는 Next.js 기반 프로젝트입니다.

### Core Tech Stack
* Framework: Next.js (App Router)
* Language: TypeScript
* Styling: Tailwind CSS, Lucide React (Icons)
* State Management: Zustand (Store)
* Component Library: Shadcn UI (UI 폴더 내 공통 컴포넌트)
* Communication: Axios / Fetch (lib/api/client.ts)

---

## Project Structure and Architecture

### 1. Folder Structure Logic
* src/app: 라우팅 및 페이지 레이아웃 정의 (Next.js App Router).
* components: 재사용 가능한 비즈니스 컴포넌트.
    * ui/: 원자 단위의 공통 컴포넌트 (Shadcn UI).
* hooks: 커스텀 훅을 통한 로직 분리 (useAuth, useMobile 등).
* store: Zustand를 이용한 글로벌 상태 관리 (useUserStore, useProductStore).
* lib/api: 외부 백엔드 API와의 통신을 담당하는 클라이언트 로직.
* types: 전역 TypeScript 인터페이스 및 타입 정의.

### 2. Key Domains
* Dashboard & Data: 드라이버, 팀, 서킷, 레이스 결과 및 스케줄 시각화.
* Agent Chat: Apex-F1 AI 에이전트와의 실시간 인터페이스.
* Membership & Store: 서비스 구독 및 굿즈 판매, 토스페이먼츠 연동 결제 프로세스.

---

## Documentation & Task Conventions

### 1. Jira Ticket Convention
* Jira 티켓 생성 시 제목 앞에 반드시 **[FE]** 머리말을 붙입니다. (예: `[FE] 사용자 프로필 수정 UI 구현`)

## 📝 Summary (요약)
- [요약 내용 1]
- [요약 내용 2]

## 🛠 Tasks (할 일)
* Task A
* Task B

## 🏗 Technical Specs
- [프론트엔드 기술 구현 상세]

## ✅ Acceptance Criteria
- [기능 동작 확인 기준]

## 🔌 Related Issue
- Jira: APEX-XXXX

### 2. Git PR Description Convention
* PR 생성 시 반드시 다음 사항을 준수합니다.
    * **Assignee**: `lucvsliv` (본인)으로 설정
    * **Label**: 레포지토리에 존재하는 레이블 중 해당 작업에 적절한 것들을 모두 선택하여 설정 (예: `type/feat`, `area/ui` 등)

## 📌 Title
[type]: [APEX-XXXX] This is description

## 📝 Summary (요약)
* [요약 내용 1]

## 🛠 Key Changes (변경 사항)
* 변경 사항 A (예: 특정 컴포넌트 추가, API 연동 등)

## 🏗 Architecture & Design Decisions (설계 주안점)
* [상태 관리 방식, 컴포넌트 분리 기준 등]

## ✅ Test Plan (테스트 계획)
* [브라우저 테스트 시나리오]

## 🔌 Related Issue
* Jira: APEX-XXXX

---

## Development Guidelines for Gemini

### 1. Component Implementation Flow
1. UI Components: `components/ui`에 필요한 기본 컴포넌트가 있는지 확인.
2. Business Components: `components/`에 도메인 로직이 포함된 컴포넌트 작성.
3. Page Composition: `app/` 경로에 페이지를 구성하고 컴포넌트 조립.
4. State & API: 필요시 `store/`에 상태를 정의하고 `lib/api/`를 통해 백엔드와 연결.

### 2. Coding Standards
* Component Pattern: 가급적 클라이언트 컴포넌트('use client')와 서버 컴포넌트를 용도에 맞게 분리합니다.
* Consistency: 기존의 `data-table.tsx`나 `driver-grid.tsx`와 같은 명명 규칙 및 구조를 유지합니다.
* Responsive Design: `use-mobile.ts` 훅과 Tailwind의 반응형 클래스를 활용합니다.

### 3. Workflow Completion
작업이 끝나면 반드시 정의된 Jira/PR 양식에 맞춰 작업 보고서를 작성해야 합니다.