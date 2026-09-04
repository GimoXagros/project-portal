# GimoXagros Project Archive

Nintendo DS·DSi 에뮬레이터·커스텀 빌드와 GBA 저장 호환 복구 도구의 배포 정보, 설치 방법, 호환성 주의사항과 SHA-256을 한곳에서 확인하는 정적 프로젝트 자료실입니다.

- 공개 사이트: <https://gimoxagros.github.io/project-portal/>
- 저장소: <https://github.com/GimoXagros/project-portal>
- 제작자: [GimoXagros](https://github.com/GimoXagros)

현재 등록 프로젝트는 GameYob Custom `v0.5.9-ko`, GBARunner3 Custom `custom-v0.1.1`, NitroSwan Custom `v0.7.7-custom.r7`, 나리키리 던전 2 저장 호환 복구 도구 `v0.5` 네 개입니다. 기본 정보는 정적 JSON이 기준이며 사이트 실행이 GitHub API에 의존하지 않습니다.

NitroSwan r7은 WSC 팔레트·배경 및 BG·OBJ 완료 세대 처리를 개선했지만 일부 캐릭터 모션 깨짐이 남아 있습니다. 나리키리 도구는 한글패치가 아닌 **소스 전용 로컬 저장 호환 복구 도구**이며, 정확한 두 입력 ROM은 사용자가 준비해야 합니다. 기존 번역·글꼴·ROM·세이브·BPS/IPS는 배포하지 않습니다. 상세한 근거와 검증 범위는 [2026-09-04 갱신 기록](QA_RELEASE_REFRESH_20260903.md)을 확인하세요.

디자인은 따뜻한 종이색과 차콜을 바탕으로 둥근 수집 카드, 인덱스 탭, 메모 라벨과 점선 기록장을 조합한 “작은 레트로 게임 작업실 + 수집 노트” 콘셉트입니다.

## 기술 스택

- Vite 7 + React 19 + JSX
- JSON 기반 콘텐츠
- 반응형 CSS와 OS 설정 기반 라이트/다크 테마
- hash route 프로젝트 상세 주소 (`#/project/gameyob` 형식)
- GitHub Pages 및 공식 GitHub Actions 배포 구성

`vite.config.js`의 `base: './'` 설정으로 저장소 하위 경로에서 정적 자산을 상대 경로로 읽습니다.

## 로컬 실행과 검증

GitHub Actions와 동일한 Node.js 22.12 이상(22 LTS)을 권장합니다.

```bash
npm ci
npm run dev
npm run lint
npm run validate:data
npm run verify:releases
npm test
npm run build
npm run preview
```

빌드 결과는 `dist/`에 생성됩니다. 설치 이후 `validate:data`, `test`, `lint`, `build`는 오프라인으로 실행할 수 있습니다.

- `npm run validate:data`: id, 실제 달력 날짜, 프로젝트/최신 changelog의 버전·URL·날짜 일치, 릴리스 정책과 고정 사유, 고정 태그 다운로드 URL, 중복 파일명, 바이트 크기 형식, SHA-256, 이미지 참조를 정적으로 검사합니다.
- `npm run verify:releases`: **네트워크가 필요**합니다. 기본적으로 GitHub `/releases/latest`를 조회해 **최신 정식 버전 누락**과 날짜·URL·자산명·크기·digest를 비교합니다. 파일을 다운로드하거나 JSON을 자동 수정하지 않습니다.
- `npm run check`: 정적 검증 → test → 원격 검증 → lint → build 순서로 전체 검사합니다. 각 단계와 build는 한 번만 수행합니다.
- `npm test`: 날짜, 최신 릴리스 누락·고정 정책·정적 검증·원격 오류 처리, 실제 JSX의 빈 데이터 렌더링, reduced-motion 정적 규칙을 외부 API 호출 없이 테스트합니다.

원격 검증은 선택적으로 `GITHUB_TOKEN`을 사용합니다. 토큰과 내부 전송 오류 원문은 로그에 출력하지 않습니다. 요청은 한 번에 하나씩, 요청·응답 본문 읽기를 포함해 15초 제한이며 네트워크/서버 오류는 최대 세 번 시도합니다. `RELEASE_NOT_FOUND`(404), `RATE_LIMIT`(호출 제한), `API_SERVER`(5xx), `TIMEOUT`, `NETWORK`, `INVALID_RESPONSE`, `API_ACCESS`를 데이터 불일치와 구분하고 실패 시 종료 코드 1을 반환합니다. GitHub가 digest를 제공하지 않으면 SHA 원격 비교 생략을 명시하며 로컬 형식은 계속 검사합니다. 장애나 호출 제한도 배포를 중단하므로 원인을 확인한 뒤 재실행하세요.

`releasePolicy`는 `latest-stable`(생략 시 기본값) 또는 `pinned`만 허용합니다. 현재 네 프로젝트는 모두 `latest-stable`이며 최신 응답의 태그가 다르면 `LATEST_RELEASE_DRIFT: configured="…" latest="…"`로 실패합니다. draft/prerelease 응답도 실패하며, 최신 API 실패 시 예전 태그로 우회하지 않습니다. 의도적으로 이전 버전을 유지하려면 `"releasePolicy": "pinned"`와 비어 있지 않은 문자열 `pinReason`을 함께 기록하세요. 이 경우에만 `/releases/tags/{tag}`를 검증해 최신 태그 차이를 허용합니다. `pinReason`은 `pinned`에서만 허용됩니다. 검증기는 버전을 자동 선택하거나 데이터를 수정하지 않습니다.

날짜는 API `published_at`의 YYYY-MM-DD 부분(UTC 기준)을 보존합니다. 화면에서 다시 시간대 변환하지 않습니다. Hero는 유효한 `lastUpdated`의 최댓값을 계산하고, 타임라인도 날짜로 정렬하므로 프로젝트 배열 순서에 의존하지 않습니다. 이번 추가 요청의 나리키리 v0.5는 UTC 2026-09-03 15:03:10(한국시간 9월 4일 00:03:10) 공개이므로, 기존 세 프로젝트의 최신 날짜 9월 2일보다 뒤인 **2026-09-03**이 홈에 표시됩니다.

## 폴더 구조

```text
project-portal/
├─ .github/workflows/deploy.yml
├─ assets-source/projects/       # 출처 보존용 원본 로고 PNG
├─ public/
│  ├─ assets/projects/           # 공개 로고 WebP / 사용자 제공 원본 JPG
│  └─ ...                        # 404, favicon, OG, robots, sitemap
├─ scripts/
│  ├─ validate-data.mjs         # 오프라인 정합성 검사
│  ├─ verify-releases.mjs       # 빌드 전 GitHub API 비교
│  ├─ release-utils.mjs         # 저장소/태그/자산 URL 검사
│  └─ tests/                   # 릴리스·빈 UI·날짜 회귀 테스트
├─ src/
│  ├─ components/
│  ├─ data/
│  │  ├─ site.json
│  │  ├─ projects.json
│  │  ├─ changelogs/
│  │  │  ├─ PROJECT_ID.json      # 프로젝트별 독립 업데이트 기록
│  │  │  └─ index.js             # Vite 정적 자동 로딩과 조회 함수
│  │  └─ faq.json
│  ├─ hooks/useReveal.js        # once IntersectionObserver
│  ├─ styles/motion.css        # 모션 토큰과 reduced-motion
│  └─ utils/                   # projectMeta.js, dates.js
├─ index.html
├─ package.json
└─ vite.config.js
```

## 콘텐츠 수정

- 사이트명, 부제, 제작자, GitHub와 공개 URL: `src/data/site.json`
- 프로젝트: `src/data/projects.json`
- 릴리스 타임라인: `src/data/changelogs/PROJECT_ID.json`
- FAQ: `src/data/faq.json`
- 정적 SEO: `index.html`, `public/robots.txt`, `public/sitemap.xml`

사이트 URL을 바꿀 때 `site.json`, 정적 SEO 세 파일, `public/404.html`의 홈 링크를 함께 변경한 뒤 `npm run validate:data`와 `npm run build`를 실행하세요. 404의 홈 링크는 잘못된 중첩 경로에서도 복귀할 수 있도록 공개 URL을 사용합니다. SEO 값은 JavaScript 실행 전 크롤러가 읽어야 하므로 정적 HTML에도 명시합니다.

## 새 프로젝트 추가

`src/data/projects.json` 배열에 객체 하나를 추가합니다. 필수 구조의 예시는 다음과 같습니다.

```json
{
  "id": "lowercase-safe-id",
  "demo": false,
  "title": "프로젝트명",
  "titleOriginal": "원제 또는 태그명",
  "subtitle": "한 줄 설명",
  "description": "검증된 프로젝트 소개",
  "type": "emulator",
  "platform": ["Nintendo DS"],
  "status": "work-in-progress",
  "version": "v1.0.0",
  "releasePolicy": "latest-stable",
  "releaseDate": "2026-09-01",
  "lastUpdated": "2026-09-01",
  "repository": "https://github.com/OWNER/REPOSITORY",
  "releaseUrl": "https://github.com/OWNER/REPOSITORY/releases/tag/v1.0.0",
  "issuesUrl": "https://github.com/OWNER/REPOSITORY/issues",
  "upstream": {
    "name": "UPSTREAM_OWNER/REPOSITORY",
    "url": "https://github.com/UPSTREAM_OWNER/REPOSITORY"
  },
  "coverImage": "",
  "coverTone": "ember",
  "branding": {
    "logo": "assets/projects/lowercase-safe-id/logo.webp",
    "logoAlt": "프로젝트명 로고",
    "width": 960,
    "height": 960,
    "accent": "#177a72",
    "accentSoft": "#d9efe6",
    "accentDark": "#76d2c7"
  },
  "screenshots": [],
  "features": ["확인된 특징"],
  "scope": ["작업 범위"],
  "requirements": ["필수 환경"],
  "compatibility": ["검증된 범위와 제한"],
  "installGuide": ["첫 번째 단계", "두 번째 단계"],
  "notes": ["주의사항"],
  "credits": [
    { "role": "원본 / Upstream", "name": "UPSTREAM_OWNER/REPOSITORY", "url": "https://github.com/UPSTREAM_OWNER/REPOSITORY" },
    { "role": "커스텀 저장소 및 추가 작업", "name": "OWNER/REPOSITORY", "url": "https://github.com/OWNER/REPOSITORY" }
  ],
  "license": "저장소 조건 확인",
  "tags": ["태그"],
  "featured": false,
  "downloadEnabled": true,
  "downloads": [
    {
      "label": "배포 파일",
      "filename": "release.zip",
      "size": "123456 bytes",
      "url": "https://github.com/OWNER/REPOSITORY/releases/download/v1.0.0/release.zip",
      "sha256": "0000000000000000000000000000000000000000000000000000000000000000"
    }
  ]
}
```

지원 `type`은 `korean-patch`, `emulator`, `port`, `tool`, `translation`, `utility`, `other`이며 이 사이트에서 `utility`는 “호환 계층”으로 표시합니다. 지원 `status`는 `released`, `beta`, `work-in-progress`, `archived`, `planned`입니다.

프로젝트 배열을 비우면 정상적인 빈 상태가 표시되고, featured 항목이 없으면 주요 프로젝트 섹션이 숨겨집니다. 스크린샷, 해시, 설치 안내가 없으면 대응 블록도 렌더링하지 않습니다.

새 프로젝트는 다음 세 가지를 추가하면 됩니다.

1. `src/data/projects.json` 프로젝트 항목
2. `src/data/changelogs/PROJECT_ID.json`
3. `public/assets/projects/PROJECT_ID/` 로고 자산

## 릴리스 갱신 절차

1. GitHub `/releases/latest`와 현재 기록된 `/releases/tags/{tag}`를 모두 조회합니다. 최신 정식 릴리스의 노트와 Assets, 검증 범위·알려진 문제를 확인합니다.
2. `version`, `releaseDate`, `lastUpdated`, `releaseUrl`을 갱신합니다.
3. 각 자산의 `filename`, 바이트 단위 `size`, 고정 태그 `url`, `sha256`을 갱신합니다.
4. 릴리스 노트에서 확인되는 변경만 프로젝트 설명과 `src/data/changelogs/PROJECT_ID.json`에 반영합니다.
5. Upstream과 커스텀 저장소 Credits 링크가 여전히 구분되는지 확인합니다.
6. `npm run check`를 실행합니다(테스트 포함). `pinned` 정책은 실제 고정 사유가 있을 때만 사용합니다.

여러 파일은 `downloads` 배열에 각각 추가합니다. 분할 파일은 다운로드 항목 아래 `parts` 배열로 표현할 수 있습니다. `downloadEnabled: false`이거나 URL이 없으면 배포 준비 상태로 표시합니다. URL을 추측해 만들지 않습니다.

Windows에서 SHA-256은 다음 명령으로 확인할 수 있습니다.

```powershell
Get-FileHash .\release.zip -Algorithm SHA256
```

## 로고와 이미지 추가

사용 권리를 확인한 이미지를 `public/images/projects/<id>/` 아래에 두고 `coverImage` 또는 `screenshots[].src`에 `images/projects/<id>/파일명.webp`처럼 기록합니다. 실제 파일이 없으면 검증이 실패합니다. 게임 이미지와 스크린샷을 임의로 수집하거나 프로젝트 자체 저작물로 표시하지 않습니다.

이번 나리키리 항목은 사용자가 직접 제출하고 사용을 요청한 게임 표지 JPG를 예외적으로 식별 이미지로 연결했습니다. 원본을 재인코딩·자르기·생성형 편집하지 않았습니다. 이는 공식 프로젝트 로고나 권리자의 승인을 뜻하지 않으며, 별도 이용 허락·라이선스는 제출되지 않았습니다. 게임 표지는 도구의 MIT 라이선스 적용 대상이 아닙니다. 공개 이용에 관한 권리 확인 책임과 출처는 [ASSET_SOURCES.md](ASSET_SOURCES.md)에 분리해 기록합니다.

프로젝트 로고는 `public/assets/projects/<id>/logo.webp`에 두고 `branding.logo`로 연결합니다. 비율과 투명도를 유지하고 `logoAlt`, `width`, `height`를 반드시 기록합니다. 원본 출처와 최적화 결과는 [ASSET_SOURCES.md](ASSET_SOURCES.md)에 남깁니다. 외부 서버 장애·추적·GitHub 호출 제한과 Pages 하위 경로 문제를 피하기 위해 이미지 hotlink는 사용하지 않습니다. 모든 로컬 자산은 `assetUrl()`이 `import.meta.env.BASE_URL`을 붙여 해석합니다.

## 프로젝트별 업데이트 기록

지원 주소:

- `#/updates` — 프로젝트별 업데이트 기록 선택
- `#/updates/gameyob`
- `#/updates/gbarunner3`
- `#/updates/nitroswan`
- `#/updates/narikiri2-save-compat`

각 JSON은 `projectId`, `displayName`, `entries`를 가지며 `entries`는 최신순입니다. `src/data/changelogs/index.js`가 `import.meta.glob`으로 정적 자동 로딩하고 `getProjectChangelog`, `getLatestProjectUpdate`, `getAllLatestUpdates`를 제공합니다. 브라우저에서 GitHub API를 호출하지 않습니다.

새 GameYob Custom 릴리스를 기록할 때는 `src/data/changelogs/gameyob.json`의 `entries` 맨 앞에 다음 형식으로 추가합니다.

```json
{
  "id": "gameyob-v0-6-0-ko",
  "version": "v0.6.0-ko",
  "date": "2026-09-15",
  "title": "GameYob Custom v0.6.0-ko",
  "summary": "릴리스 노트에서 확인한 한 줄 요약",
  "changes": ["확인된 변경 사항"],
  "releaseUrl": "https://github.com/OWNER/REPOSITORY/releases/tag/TAG",
  "status": "release"
}
```

추가 후 `npm run validate:data`와 `npm run build`를 실행합니다. 과거 버전이나 확인하지 않은 성능·호환성 변경을 추측해서 넣지 않습니다.

## Upstream Credits 원칙

커스텀 포크는 원본 프로젝트처럼 표현하지 않습니다. 상세 화면의 Credits와 다운로드 아래 외부 링크에서 “원본 / Upstream”과 “커스텀 저장소 및 추가 작업”을 분리합니다. 라이선스는 저장소와 개별 구성요소의 조건을 확인하며, 확인되지 않은 단일 라이선스를 새로 선언하지 않습니다.

## Open Graph 제한

프로젝트 상세는 `#/project/<id>` hash route를 사용합니다. URL fragment는 HTTP 요청과 소셜 크롤러에 전달되지 않으므로 현재 Open Graph는 사이트 전체에 공통인 미리보기 한 장만 제공합니다. 프로젝트별 미리보기를 지원한다고 간주하면 안 됩니다. 프로젝트별 OG가 필요하면 향후 정적 상세 HTML 또는 프리렌더링 구조로 전환해야 합니다.

## GitHub Pages 배포

저장소 생성과 GitHub Pages 공개 배포가 완료된 사이트입니다. `.github/workflows/deploy.yml`은 `main` push 또는 수동 `workflow_dispatch` 시 실행됩니다.

1. **Settings → Pages → Build and deployment → Source**가 **GitHub Actions**인지 확인합니다.
2. 작업 브랜치에서 변경을 검토하고 PR을 `main`에 병합합니다.
3. 워크플로가 `npm ci` → `validate:data` → `npm test` → `verify:releases` → `lint` → `build`를 수행합니다. 원격 검증에만 `${{ github.token }}`을 `GITHUB_TOKEN`으로 전달합니다.
4. 공식 Pages Actions로 `dist/`를 업로드하고 `github-pages` 환경에 배포합니다. `pages: write`, `id-token: write`, concurrency와 이전 실행 취소 설정을 유지합니다.

작업 브랜치 push만으로 공개 사이트가 바뀌지는 않습니다. 원격 검증에 실패한 경우 로그에서 데이터 불일치와 네트워크 오류를 구분하여 해결해야 합니다. 검사를 무조건 성공시키는 우회는 하지 않습니다. GitHub API는 이 **빌드 전 검증**에만 사용되며, 브라우저 런타임의 기준은 항상 번들에 포함된 정적 JSON입니다.

## 접근성과 가벼운 모션

`src/styles/motion.css`는 반응형 스타일 뒤에 불러옵니다. `--motion-fast`(160ms), `--motion-base`(420ms), `--motion-slow`(680ms)와 easing 토큰을 사용하며 새 애니메이션 라이브러리는 없습니다.

- `useReveal`은 IntersectionObserver 초기화 후에만 `motion-ready`를 부여합니다. 기본 콘텐츠는 보이며, **화면에 진입한 요소에만** 유한 애니메이션을 붙입니다. 한 번 등장한 DOM 노드는 다시 숨기지 않습니다. 카드 지연은 70ms씩 최대 350ms입니다. 필터로 새로 추가된 카드만 관찰하고 기존 페이지는 재실행하지 않습니다.
- Hero 텍스트·카드·통계는 60~70ms 간격으로 등장합니다. 데스크톱 포인터 환경에서만 ARCHIVE 카드가 10초 주기로 5px 움직이고 배경이 미세하게 이동합니다. 모바일 장식은 줄였습니다.
- 카드의 hover/focus-within, 테마 아이콘, 240ms hash 페이지 전환, native FAQ 답변에 짧은 효과를 적용합니다. FAQ 높이를 고정하지 않습니다.
- 헤더의 스크롤 진행은 passive listener와 requestAnimationFrame으로 CSS 변수만 갱신합니다. 스크롤마다 앱 상태를 갱신하지 않으며 이벤트·observer는 정리합니다.
- 모바일 메뉴는 닫힘 효과 중에도 `inert`로 포커스 진입을 막습니다. Escape, 바깥 클릭, 메뉴 선택, route 변경으로 닫히며 Escape는 메뉴 버튼으로 포커스를 돌려줍니다. 홈 scroll spy와 업데이트 route의 `aria-current`를 구분합니다.
- 검색 개수는 단일 `aria-live="polite"` 상태이고, 필터는 `aria-pressed`를 제공합니다. 초기화 후 검색창 포커스를 유지합니다. skip link는 hash route를 바꾸지 않고 본문으로 이동합니다.
- OS 테마를 따르되 명시적으로 고른 테마만 저장합니다. HTML의 초기 테마 스크립트로 첫 화면 번쩍임을 줄입니다.

`prefers-reduced-motion: reduce`에서는 등장·반복·페이지 전환·메뉴·FAQ·테마 회전과 smooth scroll을 모두 제거합니다. observer가 없거나 오류가 나도 콘텐츠는 숨겨지지 않습니다. JavaScript 자체를 끈 경우 React 검색/상세 화면 대신 `noscript` 안내와 저장소 링크가 표시됩니다(서버 렌더링 사이트는 아닙니다).

상시 `will-change`, 높이/위치의 프레임 애니메이션, 큰 blur 애니메이션, 패럴랙스, WebGL, 자동 재생 영상은 사용하지 않습니다. 로고의 크기 예약과 비동기 디코딩·지연 로딩도 유지합니다.

## 공개 전 체크리스트

- [ ] 프로젝트명, 종류, 플랫폼, 상태, 최신 버전과 날짜
- [ ] 커스텀 저장소, Upstream, 고정 태그 Releases URL
- [ ] 다운로드 자산명, 실제 바이트 크기, HTTPS URL
- [ ] 각 배포 파일의 64자리 SHA-256
- [ ] 지원 기기, 런처, 실기 검증 범위와 제한
- [ ] 설치 방법과 필요한 합법적 사용자 준비물
- [ ] Upstream Credits와 라이선스 조건
- [ ] 사용 권리를 확인한 스크린샷과 alt
- [ ] ROM, BIOS, 저작권 게임 데이터, 펌웨어와 키가 배포에 포함되지 않았는지 확인

## 배포 원칙

이 포털은 원본 ROM, 게임 데이터, BIOS, 펌웨어, 암호화 키를 배포하지 않습니다. 사용자는 필요한 데이터를 합법적으로 직접 준비해야 하며, 각 게임·플랫폼·상표의 권리는 해당 권리자에게 있습니다.
