# 2026-09-05 릴리스 최신화 검증 기록

- 검토일: 2026-09-05, Asia/Seoul
- 작업 브랜치: `codex/portal-release-refresh-20260905`
- 대상: GameYob, GBARunner3, NitroSwan, narikiri2-save-compat
- 원칙: GitHub 최신 정식 Release와 고정 자산 메타데이터만 반영하며, ROM·BIOS·세이브와 게임 데이터는 추가하지 않습니다.

## 검토 결과

GitHub Releases API의 `/releases/latest`와 각 태그 Release를 다시 대조했습니다. GameYob, GBARunner3와 NitroSwan에서 2026-09-05 공개된 새 정식 릴리스를 확인해 포털 데이터와 최신 changelog를 갱신했습니다. narikiri2-save-compat는 `v0.5`가 계속 최신이며 데이터와 자산 정보가 일치해 변경하지 않았습니다.

| 프로젝트 | 최신 정식 태그 | published_at (UTC) | 사용자용 자산 | 크기 | SHA-256 |
| --- | --- | --- | --- | ---: | --- |
| GameYob | `v0.5.10` | `2026-09-05T04:29:59Z` | `gameyob.zip` | 814552 bytes | `18c8eff2f7c7b5d38f302e996c68dad5a63935f70782dd13d45343847e4d846c` |
| GBARunner3 | `custom-v0.1.2` | `2026-09-05T02:25:52Z` | `GBARunner3.zip` | 163671 bytes | `13ae1e2252ecf2245ad2236ff13ebea3ba558c7b4e6ea7fb4f021cb25834ce77` |
| NitroSwan | `v0.7.7-custom.r8` | `2026-09-05T04:30:33Z` | `NitroSwan-v0.7.7-custom.r8.zip` | 655362 bytes | `84ff24066c434ba47b4e9ebc6e1c47ece9e48c32b28f4a1302770f6a82f07fb5` |
| NitroSwan | `v0.7.7-custom.r8` | `2026-09-05T04:30:33Z` | `NitroSwan-DS-0.7.7-custom.r8.nds` | 568320 bytes | `ce0ae0b08a2c9ca15fd734529e2008ca6c376fde2f4d2e65ce13627d54e13ee6` |
| NitroSwan | `v0.7.7-custom.r8` | `2026-09-05T04:30:33Z` | `NitroSwan-DSi-0.7.7-custom.r8.nds` | 569344 bytes | `4ea4b1af798371b48dab4b73d1c88d324fdfe65eb0d64aed0ba69b588bdd11ce` |
| narikiri2-save-compat | `v0.5` | `2026-09-03T15:03:10Z` | `NARIKIRI2_SAVE_COMPAT_v0.5_SOURCE_ONLY.zip` | 40537 bytes | `aae4cd38b7b5ae99c51427933be1583549942956094e0eff19937bcc3a390eb6` |

SHA-256은 GitHub API가 제공한 `digest`와 대조했습니다. 포털은 고정 태그의 `browser_download_url`만 저장하며 브라우저 실행 중 API를 호출하지 않습니다. checksum·build-info 보조 자산은 검증했지만 일반 다운로드 카드에는 실행·통합 패키지만 표시합니다.

## 릴리스 노트 반영 범위

### GameYob v0.5.10

- 상태 형식 8을 유지하면서 버전 1~8의 크기·mapper·SGB tail을 큰 메모리 변경 전에 검사하는 범위를 기록했습니다.
- 실험적 65C816 명령 디스패치 256/256과 DS NiFi fragmentation 방어를 기록했습니다.
- 256/256은 완전하거나 cycle-accurate한 SNES CPU를 뜻하지 않으며 SPC700·DSP·host OBJ와 실물 무선 검증이 남았음을 함께 명시했습니다.

### GBARunner3 custom-v0.1.2

- mapped high-ROM Thumb 상태·halfword 선택과 SD-cache/JIT·MPU 캐시 일관성 수정을 기록했습니다.
- Nintendo 3DS+DSpico에서 Kingdom Hearts: Chain of Memories `[B8CJ][K]`의 Main Menu → New Game → Save Slot 경로가 확인됐다는 정확한 범위만 반영했습니다.
- Save Slot 이후 진행과 더 넓은 게임·기기 범위는 검증되지 않았으므로 일반적인 호환성 향상으로 확대해 표현하지 않았습니다.
- ZIP 내부 `GBARunner3.nds` SHA-256은 릴리스 문서의 `cc09916848c6fb92092db15d5d8ebda21f4543a63589804f44268d2d810601ce`로 갱신했습니다.

### NitroSwan v0.7.7-custom.r8

- assembly→C 콜백의 AAPCS stack/register 보존, 완료 세대 publication, 동일 descriptor의 프레임 상태와 dirty OBJ 복사 범위를 기록했습니다.
- Python 회귀 검사 76개, host C 검사, DS·DSi 빌드와 ABI·NDS 구조 검증 범위를 기록했습니다.
- r8은 renderer-safety 릴리스이며 완전한 캐릭터 모션 수정이 아닙니다. fresh r8 melonDS scene matrix, DSpico 게임플레이·오디오·입력·저장·pacing과 optional ABI sentinel 실기 시험이 수행되지 않았음을 함께 표시했습니다.

## 보존 사항

- 기존 changelog 항목은 역사 기록으로 그대로 뒤에 유지했습니다.
- 프로젝트 개수, 디자인, 라우터, 테마, 다운로드·SHA UI와 GitHub Pages 구조는 변경하지 않았습니다.
- narikiri2-save-compat의 데이터와 사용자가 제공한 559×559 PNG는 변경하지 않았습니다.
- 실제 바이너리, ROM, BIOS, 세이브와 게임 스크린샷은 저장소에 추가하지 않았습니다.

## 검증 결과

Node.js v22.23.2 / npm 10.9.8에서 의존성을 다시 설치한 뒤 정적 데이터 검사, 27개 회귀 테스트, GitHub 원격 최신 Release 검사, lint와 production build를 실행했습니다.

| 검사 | 결과 |
| --- | --- |
| `npm ci` | 성공: 71 packages, audit 72, 알려진 취약점 0 |
| `npm run validate:data` | 성공: 프로젝트 4개, changelog 4개, featured 3개 |
| `npm test` | 성공: 27개 통과, 실패·생략 0 |
| `npm run verify:releases` | 성공: 네 프로젝트의 최신 정식 태그·날짜·URL·자산·digest 일치 |
| `npm run lint` | 성공 |
| `npm run build` | 성공: 1609 modules |
| `npm audit --omit=dev` | 알려진 취약점 0 |

빌드 산출물은 HTML 2.38 kB(gzip 1.03), CSS 51.46 kB(gzip 10.71), JavaScript 268.16 kB(gzip 84.44)입니다. `dist/`에 index.html, 404.html, .nojekyll, favicon, robots.txt, sitemap.xml, 프로젝트 로고 4개와 빌드 CSS·JavaScript가 포함된 것을 확인했습니다.

격리된 Chromium에서 1440×900, 1024×768, 768×1024, 390×844, 360×800의 라이트·다크 및 일반·`prefers-reduced-motion: reduce` 조합을 검사했습니다. 홈 섹션 hash, 네 프로젝트 상세·업데이트, 전체 업데이트와 없는 프로젝트 경로를 합한 15개 경로, 총 300개 조합이 통과했습니다. 가로 넘침·깨진 이미지·콘솔 error/warning이 없었고 reduced-motion 환경의 실행 중 애니메이션은 0개였습니다. 새 릴리스 버전·날짜·자산명·크기·SHA·고정 다운로드 URL, NitroSwan r8→r7→r6 순서와 모바일 메뉴 Escape·포커스 복귀를 추가 확인했습니다.

브라우저 화면에서 메타데이터와 링크를 검증했으며 실제 배포 바이너리를 내려받아 실행하거나 실물 기기에서 시험하지 않았습니다. 검증하지 않은 실기 동작은 완료로 표시하지 않습니다. 의존성에는 변경을 가하지 않았습니다. 확인된 patch 업데이트 후보는 현재 기능 수정에 필요하지 않아 lockfile과 기존 호환 범위를 그대로 유지했고, Vite·Lucide의 major 업데이트도 수행하지 않았습니다.
