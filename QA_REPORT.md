# Portal refresh 검증 기록

기준일: 2026-09-02, Asia/Seoul. 대상: GimoXagros/project-portal.

## 범위와 기준 상태

- 시작 시 `main`, 기준 커밋 `34b8989131cfbd84de5afea893ebd392e396a8dc`, 미커밋 변경 없음. 원격 main과 일치.
- 작업 브랜치: `codex/portal-refresh-motion-20260902`.
- 기존 컴포넌트/스타일/JSON/README/검증기/배포 구성을 읽고 해당 구조 안에서 수정.
- 시작 시 `npm ci`, `npm run validate:data`, `npm run lint`, `npm run build` 모두 성공. 기존 검사 실패 없음.
- 작업 도중 CSS import를 추가한 직후 파일 생성 전 개발 서버에서 일시적 import 오류 발생. motion.css 생성 후 해소, 최종 빌드와 브라우저 오류 검사 통과.
- 실제 프로젝트 추가, Releases 변경, 파일 업로드, main 변경 또는 강제 push 없음. 기존 법적 고지와 실기 호환성 제한 유지.

## 실제 Release API 확인

최신 정식 릴리스(`/releases/latest`)를 다시 조회하고, 최종 원격 검사에서 각 고정 태그(`/releases/tags/{tag}`)를 재검증했습니다. 모두 `draft: false`, `prerelease: false`입니다. 날짜는 API `published_at`의 UTC 날짜 부분을 보존하며 화면에서 시간대 변환하지 않습니다.

| 프로젝트 | 최신 태그 | published_at | 자산 | bytes |
| --- | --- | --- | --- | ---: |
| GameYob Custom | v0.5.9-ko | 2026-09-01T11:27:12Z | gameyob.zip | 816695 |
| GBARunner3 Custom | custom-v0.1.1 | 2026-08-29T15:10:20Z | GBARunner3.zip | 163590 |
| NitroSwan Custom | v0.7.7-custom.r6 | 2026-08-31T11:01:07Z | NitroSwan-v0.7.7-custom.r6.zip | 638802 |
| NitroSwan Custom | v0.7.7-custom.r6 | 2026-08-31T11:01:07Z | NitroSwan-DS-0.7.7-custom.r6.nds | 566272 |
| NitroSwan Custom | v0.7.7-custom.r6 | 2026-08-31T11:01:07Z | NitroSwan-DSi-0.7.7-custom.r6.nds | 567296 |

GitHub asset digest의 SHA-256과 JSON을 비교한 결과:

```text
gameyob.zip
96b80ff85d90566a06b435c8ba89c88f09d05cd84efddec45436cfa0838da497

GBARunner3.zip
1407136bd311c931d7897a93c3c148ec19bef32a0c8d73c4fd8e8dff0effd006

NitroSwan-v0.7.7-custom.r6.zip
0ac83bbe77f3d35f956dcee700c8bc8862283e792735bbdd166766885d588a2c

NitroSwan-DS-0.7.7-custom.r6.nds
fc941b3b4fd5b7bcb67bc867c9e3d24005acc6c4afc4f9a8d8104962a38dfe64

NitroSwan-DSi-0.7.7-custom.r6.nds
33288eb78824ac4b54dca9e86d2bb3b52001a6c884f16f9ad4dabfb4e3945b70
```

Release Notes에서 기존 설명을 대조했습니다. GameYob 날짜·ZIP 크기·digest만 수정했고, 이미 일치하는 GBARunner3/NitroSwan 버전·다운로드·호환성 설명은 변경하지 않았습니다. 파일을 내려받아 재해싱한 결과가 아니라 **GitHub API digest 비교 결과**입니다.

## 명령 결과

| 검사 | 결과 |
| --- | --- |
| npm ci | 성공, 취약점 0 (기본 npm 139개 / Node 22 동봉 npm 71개 설치) |
| npm run validate:data | 프로젝트 3 / changelog 3 / featured 3, 성공 |
| npm run verify:releases | 공개 릴리스 3개, 사이트 등록 자산 5개 모두 일치 |
| npm run lint | 성공 |
| npm run build | 성공, dist 생성 |
| npm run check | 성공, build 1회 |
| npm test | 13개 모두 성공 |
| npm outdated | oxlint 1.80.0 → 1.81.0 가능, 기타 주요 도구의 최신 버전은 major 변경 |
| npm audit --omit=dev | 취약점 0 |
| git diff --check | 공백 오류 없음 |

의존성/lockfile 변경 없음. 모션 라이브러리 추가 없음. 이번 변경에 필수적이지 않은 lint 도구 업데이트와 major 업데이트는 수행하지 않았습니다.

기본 로컬 런타임은 Node 24.19.0입니다. Actions 대상과 맞추어 공식 배포 SHA-256을 확인한 Node 22.23.2에서도 `ci`, `check`와 테스트 13개를 재실행해 성공했습니다. 임시 런타임을 pnpm으로 준비하려던 첫 시도는 node-bin-setup 의존성 설치 오류로 실패하여 공식 Node 배포본을 사용했습니다. 마지막 재설치 중 Windows에서 preview가 esbuild.exe를 점유해 EPERM이 발생했고, 해당 preview를 종료한 뒤 `ci`부터 전부 재실행해 통과했습니다. 두 오류 모두 기존 소스의 빌드 오류가 아닙니다.

기준 번들: JS 247.98 kB (gzip 77.29), CSS 46.02 kB (gzip 9.48). 최종 번들: JS 253.66 kB (gzip 79.39), CSS 51.46 kB (gzip 10.71). 정밀 성능 점수 대신 번들 증가와 구현 비용을 확인했습니다.

`dist/`에 index.html, 404.html, .nojekyll, favicon.svg, robots.txt, sitemap.xml, 기존 OG 이미지, 로고 3개, CSS/JS 포함을 확인했습니다. 새 이미지/영상은 추가하지 않았습니다.

## 브라우저 검사

실제 Chrome과 인앱 브라우저를 사용했습니다. 최종 빌드는 `/project-portal/` 하위 경로로 preview했습니다. Chrome에서 아래 80개 조합의 DOM 크기와 이미지 로드, SHA 영역 넘침을 확인했습니다.

| viewport | 라이트/다크 홈 + 상세 3개 | 라이트/다크 업데이트 4개 |
| --- | --- | --- |
| 1440 × 900 | 8개 통과 | 8개 통과 |
| 1024 × 768 | 8개 통과 | 8개 통과 |
| 768 × 1024 | 8개 통과 | 8개 통과 |
| 390 × 844 | 8개 통과 | 8개 통과 |
| 360 × 800 | 8개 통과 | 8개 통과 |

- 전체 문서 가로 넘침, 깨진 로고, 해시 영역의 가로 넘침 없음.
- Chrome에서 데스크톱 라이트/다크 Hero, 모바일 Hero·메뉴·상세 로고·다운로드 SHA 영역을 캡처하여 시각 확인.
- `#top`, `#projects`, `#about`, `#faq`, 상세 3개, 업데이트 목록/개별 3개, 없는 프로젝트, 잘못 인코딩된 id 처리 확인.
- 검색 결과 0개 + aria-live, 카테고리(호환 계층 1개), 플랫폼(3DS/DSpico 2개), 초기화 후 검색창 포커스 확인.
- 모바일 메뉴 열림/닫힘, inert/aria-expanded, Escape 후 메뉴 버튼 포커스, 링크 선택 후 닫힘, 바깥 클릭 닫힘 확인.
- native FAQ Enter 열기/닫기, skip link 본문 포커스 및 hash 보존 확인.
- 상세↔업데이트 뒤로가기/앞으로가기, 새로고침, route별 제목 확인.
- 소개 섹션 이동 후 상단 약 72px 위치와 활성 메뉴, 헤더 스크롤 진행 변수 갱신 확인.
- 고정 Release 자산 링크와 target=_blank/rel=noreferrer 확인. 다운로드 자체는 실행하지 않음.
- 로컬 404.html의 홈 복귀 링크와 모바일 폭 확인. 실제 GitHub의 새 404 응답은 병합·배포 이후 확인 대상.
- 최종 화면 탐색 중 수집된 console error/warning 없음. React key 경고 없음.

## 검증 제한 / 병합 후 확인

- 도구가 OS 미디어 설정 에뮬레이션을 제공하지 않아 `prefers-reduced-motion: reduce`를 **실제 브라우저에서 강제 적용해 검사하지 못했습니다**. CSS/훅 분기와 정적 회귀 테스트만 통과했습니다. OS에서 동작 감소를 켜고 모든 반복/등장/메뉴/FAQ/테마/페이지 효과가 즉시 정지하는지 직접 확인해야 합니다.
- IntersectionObserver 미지원/실패와 JavaScript 완전 비활성 환경은 실제 브라우저 주입 테스트를 하지 않았습니다. 기본 CSS가 콘텐츠를 숨기지 않고, observer 오류 정리/비활성화 분기와 noscript 안내가 존재하는지 코드로 확인했습니다.
- 인앱 캡처는 시간 초과였고 Chrome 캡처도 간헐적 시간 초과가 있었습니다. 성공한 캡처와 DOM 검증만 근거로 보고했습니다.
- Lighthouse, 실제 모바일 하드웨어, Safari/Firefox, 스크린 리더 음성 출력, OS 테마 변경 이벤트, 클립보드 실제 내용은 검증하지 않았습니다. 해시 복사 버튼은 클릭했지만 성공 메시지/클립보드까지 확정하지 않았습니다.
- 원격 검증 스크립트의 토큰 헤더는 오프라인 테스트로 확인했고, 실제 원격 검증은 공개 API 무토큰으로 수행했습니다.
- 배포 워크플로는 main push/수동 실행 대상입니다. 이번 작업 브랜치/PR에서 공개 Pages 배포를 실행하거나 PR을 병합하지 않았습니다. 변경된 workflow의 GitHub-hosted 실행과 공개 사이트 반영은 병합 후 확인해야 합니다.

## 파일별 변경 이유

- `src/data/projects.json`, `src/data/changelogs/gameyob.json`: 실측 GameYob 배포 정보 일치.
- `src/utils/dates.js`, `src/data/changelogs/index.js`, `src/components/Hero.jsx`: 달력 날짜 검증, 배열 순서 독립 정렬, Hero 진입 단위 분리.
- `src/hooks/useReveal.js`, `src/styles/motion.css`, `src/App.css`: once reveal, 모션 토큰/상호작용, reduced-motion 최종 우선순위, 작은 글자 대비 보완.
- `src/App.jsx`: 단일 페이지 전환, 잘못 인코딩된 route 방어, 제목/본문 포커스/앵커 유지.
- `src/components/Header.jsx`: 진행률, scroll spy, 접근 가능한 모바일 메뉴, OS/저장 테마 구분.
- `src/components/ProjectFilters.jsx`: aria-live/aria-pressed 및 초기화 포커스.
- `src/components/SectionHeading.jsx`: 기존 aria-labelledby 대상 id 연결.
- `src/components/ScreenshotGallery.jsx`: 지연/비동기 이미지, 확대 보기 키보드 포커스 복귀.
- `index.html`, `public/404.html`: 초기 테마/비-JS 안내, 중첩 경로의 올바른 홈 복귀.
- `scripts/validate-data.mjs`, `scripts/release-utils.mjs`: 오프라인 날짜/URL/파일명/changelog 정합성.
- `scripts/verify-releases.mjs`: 읽기 전용 원격 Release/자산 비교와 오류 분류·제한된 재시도.
- `scripts/tests/releases.test.mjs`, `scripts/tests/ui.test.mjs`: 날짜/오류/빈 UI/모션 규칙 회귀 테스트.
- `package.json`, `.github/workflows/deploy.yml`: 검증 명령과 배포 전 필수 검사.
- `README.md`, `QA_REPORT.md`: 현재 공개 상태, 유지보수/모션 구조, 실제 검사 결과와 제한 기록.
