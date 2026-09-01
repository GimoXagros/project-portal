# GimoXagros Project Archive

Nintendo DS·DSi 에뮬레이터와 커스텀 빌드의 배포 정보, 설치 방법, 호환성 주의사항과 SHA-256을 한곳에서 확인하는 정적 프로젝트 자료실입니다.

- 예정 사이트: <https://gimoxagros.github.io/project-portal/>
- 예정 저장소: <https://github.com/GimoXagros/project-portal>
- 제작자: [GimoXagros](https://github.com/GimoXagros)

현재 등록 프로젝트는 GameYob `v0.5.9-ko`, GBARunner3 Custom `custom-v0.1.1`, NitroSwan `v0.7.7-custom.r6` 세 개입니다. 기본 정보는 정적 JSON이 기준이며 사이트 실행이 GitHub API에 의존하지 않습니다.

## 기술 스택

- Vite 7 + React 19 + JSX
- JSON 기반 콘텐츠
- 반응형 CSS와 OS 설정 기반 라이트/다크 테마
- hash route 프로젝트 상세 주소 (`#/project/gameyob` 형식)
- GitHub Pages 및 공식 GitHub Actions 배포 구성

`vite.config.js`의 `base: './'` 설정으로 저장소 하위 경로에서 정적 자산을 상대 경로로 읽습니다.

## 로컬 실행과 검증

Node.js 20.19 이상 또는 22.12 이상을 사용합니다.

```bash
npm ci
npm run dev
npm run lint
npm run validate:data
npm run build
npm run preview
```

빌드 결과는 `dist/`에 생성됩니다. `validate:data`는 id, 다운로드 URL, SHA-256, featured 항목, 임시 문구, 로컬 경로와 이미지 참조를 검사합니다.

## 폴더 구조

```text
project-portal/
├─ .github/workflows/deploy.yml
├─ public/                       # 404, favicon, OG, robots, sitemap
├─ scripts/validate-data.mjs
├─ src/
│  ├─ components/
│  ├─ data/
│  │  ├─ site.json
│  │  ├─ projects.json
│  │  ├─ changelog.json
│  │  └─ faq.json
│  ├─ styles/
│  └─ utils/projectMeta.js
├─ index.html
├─ package.json
└─ vite.config.js
```

## 콘텐츠 수정

- 사이트명, 부제, 제작자, GitHub와 예정 URL: `src/data/site.json`
- 프로젝트: `src/data/projects.json`
- 릴리스 타임라인: `src/data/changelog.json`
- FAQ: `src/data/faq.json`
- 정적 SEO: `index.html`, `public/robots.txt`, `public/sitemap.xml`

사이트 URL을 바꿀 때 `site.json`과 정적 SEO 세 파일의 URL을 함께 변경한 뒤 `npm run validate:data`와 `npm run build`를 실행하세요. SEO 값은 JavaScript 실행 전 크롤러가 읽어야 하므로 정적 HTML에도 명시합니다.

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

## 릴리스 갱신 절차

1. GitHub의 고정 태그 릴리스 노트와 Assets를 확인합니다.
2. `version`, `releaseDate`, `lastUpdated`, `releaseUrl`을 갱신합니다.
3. 각 자산의 `filename`, 바이트 단위 `size`, 고정 태그 `url`, `sha256`을 갱신합니다.
4. 릴리스 노트에서 확인되는 변경만 프로젝트 설명과 `changelog.json`에 반영합니다.
5. Upstream과 커스텀 저장소 Credits 링크가 여전히 구분되는지 확인합니다.
6. `npm run validate:data`, `npm run lint`, `npm run build`를 실행합니다.

여러 파일은 `downloads` 배열에 각각 추가합니다. 분할 파일은 다운로드 항목 아래 `parts` 배열로 표현할 수 있습니다. `downloadEnabled: false`이거나 URL이 없으면 배포 준비 상태로 표시합니다. URL을 추측해 만들지 않습니다.

Windows에서 SHA-256은 다음 명령으로 확인할 수 있습니다.

```powershell
Get-FileHash .\release.zip -Algorithm SHA256
```

## 이미지 추가

사용 권리를 확인한 이미지를 `public/images/projects/<id>/` 아래에 두고 `coverImage` 또는 `screenshots[].src`에 `images/projects/<id>/파일명.webp`처럼 기록합니다. 실제 파일이 없으면 검증이 실패합니다. 게임 캐릭터, 로고, 패키지 이미지나 무단 스크린샷은 사용하지 않습니다.

## Upstream Credits 원칙

커스텀 포크는 원본 프로젝트처럼 표현하지 않습니다. 상세 화면의 Credits와 다운로드 아래 외부 링크에서 “원본 / Upstream”과 “커스텀 저장소 및 추가 작업”을 분리합니다. 라이선스는 저장소와 개별 구성요소의 조건을 확인하며, 확인되지 않은 단일 라이선스를 새로 선언하지 않습니다.

## Open Graph 제한

프로젝트 상세는 `#/project/<id>` hash route를 사용합니다. URL fragment는 HTTP 요청과 소셜 크롤러에 전달되지 않으므로 현재 Open Graph는 사이트 전체에 공통인 미리보기 한 장만 제공합니다. 프로젝트별 미리보기를 지원한다고 간주하면 안 됩니다. 프로젝트별 OG가 필요하면 향후 정적 상세 HTML 또는 프리렌더링 구조로 전환해야 합니다.

## GitHub Pages 배포

배포 워크플로는 준비되어 있지만 이 단계에서는 저장소 생성, push와 공개 배포를 수행하지 않습니다. 다음 단계에서 저장소를 만든 뒤:

1. 기본 브랜치를 `main`으로 push합니다.
2. **Settings → Pages → Build and deployment → Source**에서 **GitHub Actions**를 선택합니다.
3. 이후 `main` push 시 `.github/workflows/deploy.yml`이 `npm ci`와 `npm run build`를 실행하고 `dist/`를 배포합니다.

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
