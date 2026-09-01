# Project Cabinet

한국어 패치, 에뮬레이터, 포팅, 번역, 패치 제작 도구와 ROM 분석·변환 도구 등을 한곳에서 소개하고 배포하기 위한 개인 프로젝트 포털입니다.

현재 저장된 `SAMPLE_PROJECT_01`~`03`은 UI와 데이터 모델을 확인하기 위한 **DEMO 데이터**입니다. 실제 게임, 패치, 저장소 또는 다운로드를 뜻하지 않으며 실제 게시 대상을 선정할 때 모두 제거할 수 있습니다.

## 기술 스택

- Vite + React + JSX
- JSON 기반 정적 콘텐츠
- CSS 반응형 레이아웃과 라이트/다크 테마
- hash route 기반 공유 가능한 프로젝트 상세 주소
- GitHub Pages + 공식 GitHub Actions 배포 방식
- 서버 및 런타임 GitHub API 호출 없음

Vite의 `base: './'` 설정과 상대 경로 자산을 사용하므로 저장소 이름과 무관하게 GitHub Pages 하위 경로에서 동작합니다.

## 로컬 실행

Node.js 20.19 이상 또는 22.12 이상을 사용하세요.

```bash
npm install
npm run dev
```

개발 서버가 출력한 주소(기본값 `http://localhost:5173`)를 브라우저에서 엽니다.

## 빌드와 미리보기

```bash
npm run build
npm run preview
```

정적 결과물은 `dist/`에 생성됩니다. 코드 기본 검사는 다음과 같이 실행합니다.

```bash
npm run lint
```

## 폴더 구조

```text
project-portal/
├─ .github/workflows/deploy.yml    # GitHub Pages 자동 배포
├─ public/
│  ├─ .nojekyll
│  ├─ 404.html
│  ├─ favicon.svg
│  ├─ og.png                       # 임시 소셜 미리보기
│  └─ robots.txt
├─ src/
│  ├─ components/                  # 화면별 React 컴포넌트
│  ├─ data/
│  │  ├─ site.json                 # 사이트명, 소개, 공지, 링크, 배포 원칙
│  │  ├─ projects.json             # 프로젝트 목록: 콘텐츠의 기준 원본
│  │  ├─ changelog.json            # 사이트 전체 업데이트 타임라인
│  │  └─ faq.json                  # FAQ
│  ├─ styles/                      # 레이아웃, 컴포넌트, 상세, 반응형 CSS
│  ├─ utils/projectMeta.js         # 종류·상태 라벨과 검색 도우미
│  ├─ App.jsx
│  ├─ App.css
│  └─ main.jsx
├─ index.html                      # SEO / Open Graph 기본 메타데이터
├─ package.json
└─ vite.config.js                  # base: './'
```

## 콘텐츠 수정 방법

사이트명, 부제, 설명, 공지와 GitHub 주소는 `src/data/site.json`에서 바꿉니다. FAQ는 `src/data/faq.json`, 전체 업데이트는 `src/data/changelog.json`에서 관리합니다.

프로젝트 카드는 `src/data/projects.json`만 읽습니다. React 컴포넌트를 수정할 필요가 없습니다. 배열을 `[]`로 비우면 오류 없이 “아직 공개된 프로젝트가 없습니다”에 해당하는 빈 상태가 표시되고, `featured: true`인 항목이 하나도 없으면 주요 프로젝트 섹션 자체가 렌더링되지 않습니다.

## 새 프로젝트 추가

`src/data/projects.json` 배열에 다음 형태의 객체를 추가합니다. 빈 문자열과 빈 배열은 해당 UI를 숨기거나 비활성 상태로 만듭니다.

```json
{
  "id": "UNIQUE_PROJECT_ID",
  "demo": false,
  "title": "프로젝트 표시명",
  "titleOriginal": "Original title",
  "subtitle": "한 줄 부제",
  "description": "카드와 상세 화면에 표시할 소개",
  "type": "korean-patch",
  "platform": ["Nintendo DS"],
  "status": "released",
  "version": "v1.0.0",
  "releaseDate": "2026-09-01",
  "lastUpdated": "2026-09-01",
  "repository": "https://github.com/OWNER/REPOSITORY",
  "releaseUrl": "https://github.com/OWNER/REPOSITORY/releases",
  "issuesUrl": "https://github.com/OWNER/REPOSITORY/issues",
  "downloadUrl": "",
  "homepage": "",
  "coverImage": "images/projects/example/cover.webp",
  "coverTone": "ember",
  "screenshots": [
    {
      "src": "images/projects/example/screen-01.webp",
      "alt": "화면에 표시되는 장면 설명",
      "label": "SCREEN 01",
      "tone": "ember"
    }
  ],
  "features": ["주요 특징"],
  "scope": ["한글화 또는 수정 범위"],
  "requirements": ["필수 요구 사항"],
  "compatibility": ["지원 환경 또는 버전"],
  "installGuide": ["첫 번째 설치 단계", "두 번째 설치 단계"],
  "notes": ["주의사항"],
  "credits": ["기여자 또는 사용한 오픈소스"],
  "license": "MIT",
  "originalHash": "원본 SHA-256",
  "patchHash": "패치 SHA-256",
  "patchedHash": "적용 결과 SHA-256",
  "fileSize": "12.3 MB",
  "tags": ["한국어", "패치"],
  "featured": false,
  "downloadEnabled": false,
  "downloads": []
}
```

지원 값:

- `type`: `korean-patch`, `emulator`, `port`, `tool`, `translation`, `utility`, `other`
- `status`: `released`, `beta`, `work-in-progress`, `archived`, `planned`
- `coverTone`: 이미지가 없을 때 쓰는 `ember`, `olive`, `slate`
- `platform`: 문자열 하나가 아니라 배열이므로 멀티 플랫폼 프로젝트도 표현 가능

`id`는 상세 URL `#/project/UNIQUE_PROJECT_ID`에 사용되므로 공개 후에는 가능하면 바꾸지 않습니다.

## 이미지 추가 방법

1. `public/images/projects/프로젝트-id/` 폴더를 만듭니다.
2. WebP, AVIF 또는 최적화된 PNG/JPEG 파일을 넣습니다.
3. `coverImage`, `screenshots[].src`에 `images/...` 형식으로 기록합니다. 코드가 Vite의 `BASE_URL`을 붙이므로 GitHub Pages 하위 경로에서도 안전합니다.
4. 모든 스크린샷에 장면을 설명하는 `alt`를 작성합니다.

`src`가 비어 있으면 저작권 이미지 대신 DEMO 그래디언트 플레이스홀더가 표시됩니다. 실제 게임 스크린샷은 권리와 배포 범위를 확인한 뒤 추가하세요.

## GitHub Releases 연결 방법

사이트는 GitHub API를 호출하지 않습니다. `projects.json`에 직접 적은 Releases 링크가 기준 원본입니다. 임의 URL을 만들지 말고 GitHub Release 화면에서 실제 자산 링크를 복사해 사용하세요.

### 단일 파일

```json
{
  "downloadEnabled": true,
  "downloadUrl": "https://github.com/OWNER/REPOSITORY/releases/download/TAG/FILENAME.zip",
  "downloads": []
}
```

### 여러 운영체제·여러 파일

```json
{
  "downloadEnabled": true,
  "downloadUrl": "",
  "downloads": [
    {
      "label": "Windows x64",
      "filename": "example-windows-x64.zip",
      "size": "24 MB",
      "url": "https://github.com/OWNER/REPOSITORY/releases/download/TAG/example-windows-x64.zip"
    },
    {
      "label": "Linux x64",
      "filename": "example-linux-x64.tar.gz",
      "size": "22 MB",
      "url": "https://github.com/OWNER/REPOSITORY/releases/download/TAG/example-linux-x64.tar.gz"
    }
  ]
}
```

### 2GB 초과 분할 파일

```json
{
  "label": "분할 패키지",
  "filename": "example.zip",
  "size": "2.6 GB / 2 parts",
  "url": "",
  "parts": [
    { "label": "Part 1", "size": "1.9 GB", "url": "실제 Part 1 자산 URL" },
    { "label": "Part 2", "size": "700 MB", "url": "실제 Part 2 자산 URL" }
  ]
}
```

`downloadEnabled`가 `false`이거나 URL이 비어 있으면 다운로드 요소는 링크로 동작하지 않고 “배포 준비 중”으로 표시됩니다.

## 변경 이력 추가

사이트 전체 타임라인은 `src/data/changelog.json` 배열 순서대로 표시됩니다. 첫 번째 항목이 최신으로 강조됩니다.

```json
{
  "id": "PROJECT_ID-v1.0.1",
  "date": "2026-09-01",
  "projectId": "PROJECT_ID",
  "projectTitle": "프로젝트명",
  "version": "v1.0.1",
  "changes": ["변경 내용 1", "변경 내용 2"],
  "demo": false
}
```

프로젝트 자체의 긴 변경 이력이 필요하면 후속 단계에서 프로젝트별 `changelog` 배열을 추가하고 상세 화면에 연결할 수 있습니다.

## GitHub Pages 배포

1. 이 폴더의 내용을 새 GitHub 저장소에 올리고 기본 브랜치를 `main`으로 둡니다.
2. GitHub 저장소에서 **Settings → Pages**로 이동합니다.
3. **Build and deployment → Source**를 **GitHub Actions**로 선택합니다.
4. `main` 브랜치에 push하면 `.github/workflows/deploy.yml`이 `npm ci`, `npm run build`를 실행합니다.
5. 빌드된 `dist/`가 공식 `configure-pages`, `upload-pages-artifact`, `deploy-pages` Actions를 통해 배포됩니다.

사이트 이름과 실제 Pages 주소가 정해지면 `index.html`의 title, description, Open Graph 값과 `robots.txt`의 Sitemap 주석도 함께 갱신하세요. `og:image`를 소셜 서비스에서 확실히 인식시키려면 최종 배포 주소에 맞는 절대 URL로 바꾸는 것을 권장합니다.

## 실제 프로젝트 등록 전 체크리스트

- [ ] 프로젝트명과 원제
- [ ] 저장소 URL
- [ ] 프로젝트 종류
- [ ] 플랫폼
- [ ] 상태
- [ ] 최신 버전과 배포일
- [ ] Releases URL
- [ ] 다운로드 파일과 실제 자산 URL
- [ ] 파일 크기
- [ ] 지원 버전과 환경
- [ ] Original / Patch / Patched SHA-256
- [ ] 프로젝트별 설치법
- [ ] 사용 권리를 확인한 Screenshots와 alt
- [ ] Credits와 라이선스
- [ ] 원본 게임 데이터, BIOS, 펌웨어, 키 등이 포함되지 않았는지 확인
- [ ] `demo: false`로 전환하고 SAMPLE 항목 제거

## 데이터가 비어 있을 때

- `projects.json`이 `[]`이면 프로젝트 영역에 빈 상태가 표시됩니다.
- featured 항목이 없으면 주요 프로젝트 섹션을 렌더링하지 않습니다.
- screenshot, hash, installGuide, credits 등의 배열이나 문자열이 비어 있으면 해당 블록을 숨깁니다.
- changelog가 비어 있으면 업데이트 섹션을 렌더링하지 않습니다.
- 외부 링크나 다운로드 URL이 없으면 링크를 추측하지 않고 비활성 안내만 표시합니다.

## 배포 원칙

이 포털은 원본 ROM, ISO, 게임 데이터, BIOS, 펌웨어 또는 암호화 키를 배포하지 않습니다. 한국어 패치가 등록되더라도 원본 게임 데이터를 포함하지 않는 배포를 전제로 하며, 각 게임과 상표의 권리는 해당 권리자에게 있습니다.
