# 릴리스 최신화 및 저장 호환 도구 추가 검증 기록

- 요청 기준일: 2026-09-03 / 작업·재검증: 2026-09-04, Asia/Seoul
- 기준 main: `03179bb65054f47452962faa2e9067d0c228c148`
- 작업 브랜치: `codex/portal-release-refresh-20260903`
- 기존 작업 폴더의 staged 변경 3개는 수정하지 않고 별도 worktree에서 작업했습니다.
- 과거 `QA_REPORT.md`는 9월 2일 당시의 기록으로 그대로 보존했습니다.

## 변경 요약

NitroSwan의 현재 표시·다운로드·주의사항을 r7로 갱신하고 r6 변경 기록은 그대로 보존했습니다. 나리키리 던전 2 저장 호환 복구 도구 v0.5를 소스 전용 `tool`로 추가했습니다. 사용자 제공 JPEG를 바이트 동일 복사하여 식별 이미지로 연결했습니다. 이미지에는 새 라이선스를 부여하지 않았습니다.

네 프로젝트 모두 `releasePolicy: latest-stable`입니다. GameYob와 GBARunner3는 이 정책 필드 외에 데이터가 동일함을 이전 main과 JSON 비교로 확인했습니다. NitroSwan의 repository, upstream, credits, license, branding과 기존 로고는 변경하지 않았습니다.

화면 구조·CSS·모션 훅·라우터는 보존했습니다. Hero 배포 수는 추천 수가 아니라 실제 다운로드 가능한 프로젝트 수(4)를 사용하게 했고, 독립 도구를 Custom repository로 오인시키지 않도록 외부 링크 라벨만 구분했습니다. 사이트 소개·SEO에는 GBA 저장 호환 도구를 포함했습니다.

## GitHub API 재조회

아래 네 저장소의 `/releases/latest`를 직접 조회했습니다. 기존 세 프로젝트의 구성 태그 `/releases/tags/{tag}`도 조회했고, 새 NitroSwan r7 및 나리키리 v0.5 태그도 별도로 조회했습니다. 모두 `draft: false`, `prerelease: false`입니다. 태그·릴리스명·공개 시각·URL·자산명·크기·다운로드 URL·API digest·본문과 관련 검증 문서를 대조했습니다.

| 프로젝트 | 최신 태그 | API published_at (UTC) | 포털 날짜 |
| --- | --- | --- | --- |
| [GameYob](https://github.com/GimoXagros/GameYob/releases/tag/v0.5.9-ko) | v0.5.9-ko | 2026-09-01T11:27:12Z | 2026-09-01 |
| [GBARunner3](https://github.com/GimoXagros/GBARunner3/releases/tag/custom-v0.1.1) | custom-v0.1.1 | 2026-08-29T15:10:20Z | 2026-08-29 |
| [NitroSwan](https://github.com/GimoXagros/NitroSwan/releases/tag/v0.7.7-custom.r7) | v0.7.7-custom.r7 | 2026-09-02T11:28:14Z | 2026-09-02 |
| [나리키리 저장 호환 도구](https://github.com/GimoXagros/narikiri2-save-compat/releases/tag/v0.5) | v0.5 | 2026-09-03T15:03:10Z | 2026-09-03 |

릴리스명은 각각 `GameYob v0.5.9-ko`, `GBARunner3 Custom v0.1.1`, `NitroSwan v0.7.7-custom.r7`, `v0.5 — 실기 저장 호환 복구 도구 (소스 전용)`입니다.

기존 포털 정책대로 API의 UTC 날짜 부분을 보존합니다. 추가 요청된 나리키리 릴리스는 한국시간 9월 4일 00:03:10에 공개되었습니다. 기존 9월 3일 기준 요청에 대한 명시적 추가 자료로 포함했으며, 이 때문에 Hero 최근 업데이트는 9월 2일이 아닌 **2026-09-03**입니다. GBARunner3 날짜를 한국시간 8월 30일로 바꾸지 않았습니다.

## 다운로드 메타데이터

### NitroSwan r7 사용자용 자산

| 자산 | 바이트 |
| --- | ---: |
| NitroSwan-v0.7.7-custom.r7.zip | 691364 |
| NitroSwan-DS-0.7.7-custom.r7.nds | 567296 |
| NitroSwan-DSi-0.7.7-custom.r7.nds | 568320 |

각 URL은 `https://github.com/GimoXagros/NitroSwan/releases/download/v0.7.7-custom.r7/` 아래 해당 자산명입니다.

```text
NitroSwan-v0.7.7-custom.r7.zip
ec4b4ca244105a8ad58529e3b299f8f04945204ca0cbba7483ca85d3e00643bb

NitroSwan-DS-0.7.7-custom.r7.nds
6d663ec181509eeb99dbdf9aed47bf345e5b6d3ec822d136310333f2d2c35e9d

NitroSwan-DSi-0.7.7-custom.r7.nds
d356f54e1ad01eb323b915efc95d9186533ecd029d18b21266df6eece2c82606
```

문서 자산도 API에서 확인했지만 실행 파일 다운로드 카드에는 추가하지 않았습니다.

- `BUILD_INFO.txt`: 3424 bytes, SHA-256 `17642b1b7c45d62d67e0719c43ff18369493a49ce6fc95dc8312e9692df08f27`
- `SHA256SUMS.txt`: 377 bytes, SHA-256 `ce5674c2fcad4deae05d3ba6c93cfbc88206fbf75406d268463a25284942a971`

### 나머지 사용자용 자산

- GameYob `gameyob.zip`: 816695 bytes, SHA-256 `96b80ff85d90566a06b435c8ba89c88f09d05cd84efddec45436cfa0838da497`
- GBARunner3 `GBARunner3.zip`: 163590 bytes, SHA-256 `1407136bd311c931d7897a93c3c148ec19bef32a0c8d73c4fd8e8dff0effd006`
- 나리키리 `NARIKIRI2_SAVE_COMPAT_v0.5_SOURCE_ONLY.zip`: 40537 bytes, SHA-256 `aae4cd38b7b5ae99c51427933be1583549942956094e0eff19937bcc3a390eb6`

SHA-256 근거는 GitHub API digest입니다. 이번 포털 작업에서는 배포 바이너리를 다운로드해 다시 해시하거나 실행하지 않았습니다.

## 데이터·변경 기록 내용

- NitroSwan r7: WSC palette/backdrop을 게임명·checksum whitelist 대신 실제 컬러 하드웨어 쓰기 경로에 적용, BG 완료 프레임 VBlank 반영, 타일맵 3중 버퍼 실험 제거, 두 개의 16KB RAM 스냅샷에서 완료 세대만 OBJ VRAM 반영, 미변경 세대 복사·전환 생략을 요약했습니다.
- DS·DS Lite/일반 DS-mode용 DS 파일과 DSi/3DS DSpico·Pico Loader 권장 DSi 파일을 이름까지 명시했습니다.
- r7 changelog를 맨 앞에 추가했습니다. r6 항목은 이전 main의 JSON 객체와 전체 동일합니다. 남은 r6 문자열은 역사 기록과 이 검증 설명뿐이며 현재 다운로드에는 없습니다.
- 나리키리: 한글패치가 아닌 로컬 도구, Python 3.10+, 정확한 최초 K_FFR 및 일본어 입력, 79바이트 복원, 기존 Candidate A와 동일한 출력, 세이브 백업·32 KiB 주의사항과 소스 전용 배포를 기록했습니다.
- 원 게임·번역·글꼴·생성 ROM과 사용자 제공 게임 표지에 도구의 MIT를 적용하지 않았습니다. 표지는 500×500, 86569 bytes이며 원본과 SHA-256이 같습니다. 자세한 출처·권리 미확인 사항은 [ASSET_SOURCES.md](ASSET_SOURCES.md)에 있습니다.

근거: [NitroSwan r7 검증 범위](https://github.com/GimoXagros/NitroSwan/blob/v0.7.7-custom.r7/Docs/ReleaseValidation-r7.md), [나리키리 v0.5 README](https://github.com/GimoXagros/narikiri2-save-compat/blob/v0.5/README.md), [나리키리 검증 기록](https://github.com/GimoXagros/narikiri2-save-compat/blob/v0.5/VERIFICATION.md), [도구 라이선스](https://github.com/GimoXagros/narikiri2-save-compat/blob/v0.5/LICENSE).

## 최신 릴리스 누락 감지

- 기본/생략 정책은 `latest-stable`: 최신 API와 버전을 비교하고 차이가 있으면 `LATEST_RELEASE_DRIFT: configured="…" latest="…"`로 실패합니다. 최신 응답의 날짜·URL·자산도 계속 대조합니다.
- `pinned`만 지정 태그 API를 사용합니다. 공백이 아닌 문자열 `pinReason`이 필수입니다. 다른 정책·null·다른 정책에서의 pinReason은 정적 검증 실패입니다.
- draft/prerelease는 거부하며 latest 404를 지정 태그 조회로 우회하지 않습니다.
- 순차 요청, 최대 3회, 요청 및 본문 읽기 15초 제한, 500/1000ms 재시도 대기를 유지합니다.
- 404, rate limit, 5xx, timeout, 네트워크, 잘못된 응답, 접근 오류를 각각 구분합니다. 내부 전송 오류 원문·토큰은 출력하지 않습니다.
- 검증기는 JSON을 쓰거나 바이너리를 다운로드하지 않습니다. API digest가 없으면 비교 생략 notice를 냅니다.
- `check`와 Pages에 `npm test`를 넣었습니다. Node 22, Actions 버전, main push/workflow_dispatch, 토큰 전달, Pages 권한·동시성·dist·환경 설정은 보존했습니다.
- README에 정책 기본값·고정 사유·오류 구분·날짜 기준·갱신 절차·새 자료와 이미지 예외를 문서화했습니다.

## 실행한 검사

Windows, Node.js v24.19.0, npm 11.19.1 환경에서 실제 npm CLI를 실행했습니다. 시스템 npm이 없어 제공된 패키지 실행기로 npm CLI를 불렀으며, 프로젝트 의존성·lockfile은 변경하지 않았습니다. GitHub Actions의 Node 22 환경 실행은 이번 PR 병합 전 **미검증**입니다.

| 명령 | 변경 전 | 최종 결과 |
| --- | --- | --- |
| npm ci | 성공 | 성공: 71 packages, audit 72, 알려진 취약점 0 |
| npm run validate:data | 3 프로젝트 성공 | 4 프로젝트·4 changelog·3 featured 성공 |
| npm test | 13 통과 | 27 통과, 실패·생략 0 |
| npm run verify:releases | 지정 태그 3개 성공 | 최신 정식 릴리스 4개 성공 |
| npm run lint | 성공 | 성공 |
| npm run build | 성공 | 성공: 1609 modules |
| npm run check | — | 성공, test 포함·build 1회 |

최종 6종 검사 완료: 2026-09-04 00:39 KST. 최종 재설치 첫 시도는 실행 중인 미리보기의 esbuild.exe 파일 잠금(EPERM)으로 실패했습니다. 해당 작업의 미리보기 프로세스를 종료한 뒤 6종 전체를 다시 실행해 모두 성공했습니다. npm 11의 esbuild 설치 스크립트 allowScripts 안내 경고는 남았지만 테스트·빌드는 통과했고 정책 우회나 전역 설정 변경은 하지 않았습니다.

최종 산출물: HTML 2.37 kB, CSS 51.46 kB(gzip 10.71), JS 263.19 kB(gzip 82.73). CSS 크기는 기준선과 동일합니다. `dist`와 `node_modules`는 커밋 대상이 아닙니다.

추가 회귀 테스트 14개는 최신 일치·누락·자산 크기/digest, pinned·정적 정책 오류, latest 404/rate limit, draft/prerelease, timeout·본문 읽기·네트워크·5xx 재시도, 토큰 비노출·데이터 불변성·잘못된 응답, 실제 JSX의 새 Hero 날짜·배포 수·r7/r6 순서·소스 전용 도구 표시를 다룹니다. 모든 원격 응답은 mock이며 테스트에서 실제 GitHub 요청은 하지 않습니다.

## 브라우저 검사

프로덕션 빌드를 로컬 preview로 제공하고 내장 Chromium 브라우저에서 확인했습니다.

| Viewport | 라이트 | 다크 |
| --- | --- | --- |
| 1440×900 | 8 경로 통과 | 8 경로 통과 |
| 1024×768 | 8 경로 통과 | 8 경로 통과 |
| 768×1024 | 8 경로 통과 | 8 경로 통과 |
| 390×844 | 8 경로 통과 | 8 경로 통과 |
| 360×800 | 8 경로 통과 | 8 경로 통과 |

경로: `/`, `#/project/nitroswan`, `#/updates`, `#/updates/nitroswan`, `#/project/gameyob`, `#/project/gbarunner3`, `#/project/narikiri2-save-compat`, `#/updates/narikiri2-save-compat`.

- 80개 조합에서 h1·document.title·테마·문서 가로 넘침·이미지 실패/대체 표시·다운로드 URL·표시 SHA를 DOM으로 검사했습니다. 가로 넘침·실패 이미지·대체 로고 없음.
- 홈 스크롤 확인 시 lazy 이미지를 포함한 11개 이미지 모두 로딩 완료·naturalWidth 정상. 사용자 제공 표지 정상 표시.
- 콘솔 error/warn 0. React 경고 없음.
- NitroSwan 현재 버전·날짜와 세 다운로드는 r7, 업데이트 페이지는 r7 다음 r6 순서.
- 360px 모바일에서 SHA 줄바꿈과 레이아웃을 확인했습니다. 세 SHA 복사 버튼의 복사됨 상태와 최종 클립보드 값 일치. 첫 ZIP 복사의 즉시 읽기는 비어 있었지만 별도 재확인에서 정확한 값이 확인되었습니다.
- 모바일 메뉴 열기·Escape 닫기·버튼 포커스 복귀·메뉴 선택 후 닫기, 뒤로/앞으로 이동, 새로고침, 테마 유지·제목 갱신 확인.
- 기존 모션 CSS·useReveal·Header·라우터 파일은 변경하지 않았습니다. 일반 모션의 진입 화면과 스크롤 진행을 관찰했습니다. 모든 애니메이션의 프레임별 타이밍/성능 전수 검사는 **미검증**입니다.
- `prefers-reduced-motion` 정적 회귀 검사는 통과했습니다. 브라우저 도구에 미디어 설정 전환 API가 없어 reduce 강제 설정의 실제 동작은 **미검증**입니다. OS 설정을 임의로 바꾸지 않았습니다.
- 링크는 DOM과 GitHub API의 URL·digest로 검증했습니다. 실제 게임 실행 및 각 바이너리 다운로드 후 실행은 **미검증**입니다.

## 수정 파일

1. `src/data/projects.json`
2. `src/data/changelogs/nitroswan.json`
3. `src/data/changelogs/narikiri2-save-compat.json` (추가)
4. `public/assets/projects/narikiri2-save-compat/logo.jpg` (추가)
5. `src/data/site.json`
6. `index.html`
7. `src/components/Hero.jsx`
8. `src/components/DownloadSection.jsx`
9. `scripts/release-utils.mjs`
10. `scripts/validate-data.mjs`
11. `scripts/verify-releases.mjs`
12. `scripts/tests/releases.test.mjs`
13. `scripts/tests/ui.test.mjs`
14. `package.json`
15. `.github/workflows/deploy.yml`
16. `README.md`
17. `ASSET_SOURCES.md`
18. `QA_RELEASE_REFRESH_20260903.md` (이 기록)

## 배포 및 남은 제한

작업 범위는 별도 브랜치와 main 대상 PR 제출까지입니다. main 병합·수동 Pages 배포는 실행하지 않았으며, 이번 변경의 공개 사이트 반영은 **미배포·미검증**입니다. PR 병합 후 기존 Pages 워크플로가 검증과 배포를 수행합니다.

NitroSwan의 일부 캐릭터 모션 깨짐, GBARunner3의 일부 RTC 실기 재검증, GameYob의 희귀 카트리지·SGB 미완성 항목은 프로젝트 자체의 남은 작업입니다. 나리키리 도구는 모든 기기·전체 플레이의 무결함을 보장하지 않으며 32 KiB 세이브를 자동 변환하지 않습니다. 이 포털 작업에서 해당 에뮬레이터나 ROM을 새로 실기 검증했다고 주장하지 않습니다. 이미지의 별도 공개 사용 허락 증빙은 **미확인**입니다.

최종 커밋 SHA와 PR 주소는 작업 완료 응답 및 PR에 기록합니다. 자기 커밋 SHA를 이 파일에 사전 기입하지 않습니다.
