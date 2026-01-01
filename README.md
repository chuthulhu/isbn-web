# ISBN 검색 웹 프로젝트 (ISBN Web)

이 프로젝트는 ISBN을 검색하여 네이버 도서 API를 통해 도서 정보를 조회하고, 독서감상문을 작성할 수 있는 웹 애플리케이션입니다.

## 🚀 프로젝트 개요

- **Frontend**: Cloudflare Pages (정적 웹 호스팅)
- **Backend**: Next.js API Routes (Docker 컨테이너, `book.physichu.kr`)
- **API**: Front -> Back (`https://book.physichu.kr/api/search`)

이 아키텍처는 프론트엔드와 백엔드가 분리되어 있으며, 프론트엔드는 Cloudflare에서, 백엔드는 자체 서버(Docker)에서 실행됩니다.

## 🛠️ 개발 환경 설정 (Local)

이 프로젝트는 기본적으로 **8080 포트**를 사용합니다.

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:8080)
npm run dev
```

## 🐳 Docker 배포 (Backend)

백엔드 서버는 Docker를 통해 배포되며, 시스템 재부팅 시에도 자동으로 실행됩니다.

**실행 명령어:**

```bash
# 최신 코드 빌드 및 백그라운드 실행
docker-compose up -d --build
```

**주요 설정:**

- `Dockerfile`: Node.js 20 Alpine 기반 이미지
- `docker-compose.yml`:
  - 포트: `8080`
  - 재시작 정책: `always` (자동 재시작)
  - 환경변수: `.env.local` 파일 로드

## ☁️ Cloudflare Pages 배포 (Frontend)

프론트엔드는 GitHub 저장소와 연동되어 자동 배포됩니다.

### 필수 빌드 설정

- **Framework Preset**: `Next.js`
- **Build Command**: `npx @cloudflare/next-on-pages@1`
- **Output Directory**: `.vercel/output/static`
- **Environment Variables**: `nodejs_compat` 호환성 플래그 설정 필수

### API 연결 설정

프론트엔드(`page.js`)는 `https://book.physichu.kr` (백엔드)로 API 요청을 보냅니다. 백엔드 서버에는 이를 허용하기 위한 **CORS 설정**이 적용되어 있습니다.

## ⚠️ 문제 해결 (Troubleshooting)

- **CORS 오류**: 백엔드 서버가 켜져 있는지 확인하세요. (`docker-compose ps`)
- **Error 525 (SSL Handshake Failed)**: Nginx Proxy Manager와 Cloudflare 간의 SSL 인증서 설정(Full Strict, Custom SSL 등)을 확인하세요.
