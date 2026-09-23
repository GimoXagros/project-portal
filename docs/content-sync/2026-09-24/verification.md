# 포털 갱신 검증 기록

- 기준: 2026-09-24 KST, 브랜치 `codex/portal-devnotes-20260924`, 포털 6개 프로젝트. 원본 게임·에뮬레이터·스킬 저장소는 읽기 전용 조사.
- 작업자 요청 설정: Sol `gpt-6-sol` / `medium`; 실행 모델·추론 수준은 런타임 정보가 제공되지 않아 `unknown`.
- 정적 데이터: `node scripts/validate-data.mjs` 통과(프로젝트 6, changelog 6, featured 3).
- 단위·렌더 테스트: `node --test scripts/tests/*.test.mjs` 61/61 통과. 신규 BPS 2개 포함 등록된 공개 BPS의 선언 입력·출력 크기 파싱, 합성 BPS 정상/오원본 거부, 선택기 렌더와 기록 보존 확인.
- 원격 릴리스: 인증된 GitHub API를 사용한 `node scripts/verify-releases.mjs` 6/6 통과. 처음 무인증 실행은 API rate limit으로 실패해 공개 자료 부재로 판단하지 않았다. token은 로그와 문서에 저장하지 않았다.
- lint: `node node_modules/oxlint/bin/oxlint` 통과.
- production build: `node node_modules/vite/bin/vite.js build` 통과. 기존 vendor RomPatcher.js 비모듈 스크립트에 대한 Vite 번들링 경고 4개는 기존 로드 방식에 따른 것으로 빌드는 성공.
- 신규 BPS: GitHub asset digest와 다운로드 바이트 SHA-256 직접 대조, 두 파일 모두 일치. 원본 ROM을 제공받지 않아 이번 실행에서 패치 후 생성 ROM 해시/게임 플레이를 직접 검증하지 않았다. 공개 원 저장소의 검증 기록과 별도다.
- 로컬 Chrome 렌더링: `http://127.0.0.1:4173/` Vite production preview. 홈 6개·최근 날짜 2026-09-23 확인, 프로젝트 검색 ‘나리키리’ 2개 표시, 상세 패처 N2 v1.0 기본→v0.9c→v1.0 전환 시 입력 설명 변화 및 출력 링크 비활성 확인, N3 v1.2/v1.1a 확인, 이전 `narikiri2-save-compat` 주소가 정식 URL로 이동, GBARunner3 custom-v0.1.3 기본→rc3 파일 URL 전환, NitroSwan r8 기본/r9 선택지 확인. 360px NitroSwan 및 390px N3에서 `scrollWidth === clientWidth`, 이미지 누락 없음.
- UI 검사 환경: Browser 개발 플러그인은 설치/목록에 없어 기존 Chrome의 Computer Use 브라우저 인터페이스로 확인했다. 처음 홈의 앱 콘솔 warning/error는 없었다. 이후 탭 이동 시 Chrome 확장 메시지 채널 종료 오류 4건이 기록되었으나 앱 소스 URL이 없는 확장 메시지였고 페이지 렌더/상호작용 실패는 없었다. 별도 Playwright 패키지는 저장소에 설치되어 있지 않아 새 의존성을 넣지 않았다.
- `git diff --check` 통과. Git의 LF→CRLF 변환 경고는 Windows 작업본 줄바꿈 안내이며 whitespace 오류는 없었다.
- 블로그 원고 최종 교차검사: `docs/blog/`의 고유 외부 URL 44개를 HTTP HEAD로 확인해 모두 200. 잘못된 나리키리3 v1.2 검증 JSON 경로는 공개 릴리스 노트 링크로 교체한 후 재검사했다. Markdown/HTML 8쌍의 버전 표기 집합이 일치한다. HTML 8개에서 script/iframe/event-handler와 BPS/ZIP/ROM 직접 다운로드 행동 링크가 검출되지 않았다. 정식·프리릴리즈 분리, AN9J/B3TJ 입력, 미검증 기기·전편 진행 범위가 공통 사실표와 충돌하지 않는다.
- Git 원격 커밋·push·Pages 배포와 Tistory 저장·발행은 사전 감사 전 아직 수행하지 않았다. 브라우저 조사 시 기존 글을 수정하지 않았다.
