# 공개 배포 공통 사실표 — 2026-09-24 KST

조회 시각: 2026-09-24 01:05 KST 전후. 기준은 공개 GitHub Releases, 해당 태그의 공개 검증 자료, 배포 자산 SHA-256이다. `published_at` 원문은 UTC이고 포털 표시 날짜는 그 문자열의 날짜 부분이다. `draft: false`인 항목만 기록했다. 개별 저장소는 읽기 전용으로 조사했다. 이 문서의 실행 환경 검증은 이번 포털 점검과 원 저장소가 기록한 검증을 구분한다.

| projectId | 저장소 | 최신 정식판·공개 시각(UTC)·Release ID | 공개 시험판 | 포털 날짜 | 확인 상태 |
| --- | --- | --- | --- | --- | --- |
| gameyob | [GameYob](https://github.com/GimoXagros/GameYob) | [v0.5.10](https://github.com/GimoXagros/GameYob/releases/tag/v0.5.10), 2026-09-05T04:29:59Z, 383133462 | 없음 | 2026-09-05 | API·자산 메타데이터 확인 |
| gbarunner3 | [GBARunner3](https://github.com/GimoXagros/GBARunner3) | [custom-v0.1.3](https://github.com/GimoXagros/GBARunner3/releases/tag/custom-v0.1.3), 2026-09-12T16:11:09Z, 387626222 | [custom-v0.1.3-rc3](https://github.com/GimoXagros/GBARunner3/releases/tag/custom-v0.1.3-rc3), 2026-09-19T17:14:18Z, 392154457 | 정식 2026-09-12 / 시험 2026-09-19 | 양 채널 API·자산 메타데이터 확인 |
| nitroswan | [NitroSwan](https://github.com/GimoXagros/NitroSwan) | [v0.7.7-custom.r8](https://github.com/GimoXagros/NitroSwan/releases/tag/v0.7.7-custom.r8), 2026-09-05T04:30:33Z, 383133567 | [v0.7.7-custom.r9](https://github.com/GimoXagros/NitroSwan/releases/tag/v0.7.7-custom.r9), 2026-09-19T13:48:07Z, 392087323 | 정식 2026-09-05 / 시험 2026-09-19 | 양 채널 API·자산 메타데이터 확인 |
| gba-narikiri2-kor | [gba-narikiri2-kor](https://github.com/GimoXagros/gba-narikiri2-kor) | [v1.0](https://github.com/GimoXagros/gba-narikiri2-kor/releases/tag/v1.0), 2026-09-23T15:40:36Z, 394809911 | 없음 | 2026-09-23 | API·manifest·BPS 실파일 해시 확인 |
| gba-narikiri3-kor | [gba-narikiri3-kor](https://github.com/GimoXagros/gba-narikiri3-kor) | [v1.2](https://github.com/GimoXagros/gba-narikiri3-kor/releases/tag/v1.2), 2026-09-23T15:05:52Z, 394779947 | 없음 | 2026-09-23 | API·ZIP manifest·BPS 실파일 해시 확인 |
| ai-work-skills | [ai-work-skills](https://github.com/GimoXagros/ai-work-skills) | [v2026.09.19.2](https://github.com/GimoXagros/ai-work-skills/releases/tag/v2026.09.19.2), 2026-09-18T15:52:52Z, 391599483 | 없음 | 2026-09-18 | API·태그 확인, 배포 자산 없음 |

모든 위 릴리스는 `draft: false`이다. GBARunner3 rc3와 NitroSwan r9만 `prerelease: true`이며 정식판의 대체 검증으로 취급하지 않는다. 포털의 기본 선택은 각각 custom-v0.1.3, r8이다. Release 검증 스크립트는 인증된 GitHub API에서 6개 프로젝트 모두 통과했다. 무인증 API는 rate limit으로 실패했으므로 실패를 릴리스 부재로 해석하지 않았다.

## 배포 자산 — 고정 URL, ID, 크기, SHA-256

| 버전 | 자산 ID / 파일 | 바이트 | SHA-256 | 배포 고정 URL |
| --- | --- | ---: | --- | --- |
| GameYob v0.5.10 | 545356081 / gameyob.zip | 814552 | `18c8eff2f7c7b5d38f302e996c68dad5a63935f70782dd13d45343847e4d846c` | [ZIP](https://github.com/GimoXagros/GameYob/releases/download/v0.5.10/gameyob.zip) |
| GBARunner3 custom-v0.1.3 | 559550214 / GBARunner3.zip | 174420 | `aebf23f662106cae207138be1eb98967857ed9a37477996b5a45eecbed313c36` | [ZIP](https://github.com/GimoXagros/GBARunner3/releases/download/custom-v0.1.3/GBARunner3.zip) |
| GBARunner3 custom-v0.1.3-rc3 | 575164153 / GBARunner3.zip | 159820 | `e9c8e49c34729856b2d0389c26def1176155934ac414393859675db29d780b53` | [ZIP](https://github.com/GimoXagros/GBARunner3/releases/download/custom-v0.1.3-rc3/GBARunner3.zip) |
| NitroSwan v0.7.7-custom.r8 | 545356700 / NitroSwan-v0.7.7-custom.r8.zip | 655362 | `84ff24066c434ba47b4e9ebc6e1c47ece9e48c32b28f4a1302770f6a82f07fb5` | [ZIP](https://github.com/GimoXagros/NitroSwan/releases/download/v0.7.7-custom.r8/NitroSwan-v0.7.7-custom.r8.zip) |
| NitroSwan r8 DS | 545356699 / NitroSwan-DS-0.7.7-custom.r8.nds | 568320 | `ce0ae0b08a2c9ca15fd734529e2008ca6c376fde2f4d2e65ce13627d54e13ee6` | [NDS](https://github.com/GimoXagros/NitroSwan/releases/download/v0.7.7-custom.r8/NitroSwan-DS-0.7.7-custom.r8.nds) |
| NitroSwan r8 DSi | 545356705 / NitroSwan-DSi-0.7.7-custom.r8.nds | 569344 | `4ea4b1af798371b48dab4b73d1c88d324fdfe65eb0d64aed0ba69b588bdd11ce` | [NDS](https://github.com/GimoXagros/NitroSwan/releases/download/v0.7.7-custom.r8/NitroSwan-DSi-0.7.7-custom.r8.nds) |
| NitroSwan v0.7.7-custom.r9 | 574848507 / NitroSwan-0.7.7-custom.r9.zip | 658141 | `657fc9cf3b9f546c171f560ff24fcbdf67ffabeaadcb14e3c4c1eecd3f3d51f4` | [ZIP](https://github.com/GimoXagros/NitroSwan/releases/download/v0.7.7-custom.r9/NitroSwan-0.7.7-custom.r9.zip) |
| NitroSwan r9 DS | 574848504 / NitroSwan-DS-0.7.7-custom.r9.nds | 569344 | `e0f6531d36b6a0d8f83e2268b0e1d929b2a9f2459e852080e08e143b668f01f4` | [NDS](https://github.com/GimoXagros/NitroSwan/releases/download/v0.7.7-custom.r9/NitroSwan-DS-0.7.7-custom.r9.nds) |
| NitroSwan r9 DSi | 574848509 / NitroSwan-DSi-0.7.7-custom.r9.nds | 569344 | `09a8bc138b3594010b0e596afbca740ff1543fb74b48ba2f634f083be90cc334` | [NDS](https://github.com/GimoXagros/NitroSwan/releases/download/v0.7.7-custom.r9/NitroSwan-DSi-0.7.7-custom.r9.nds) |
| 나리키리2 v1.0 | 584068645 / Xagros_Narikiri2_KOR_v1.0.bps | 5045193 | `8d4a102714dccca1228215d97ae38b55eaca7ed9b74552150d3ab6aee2fa16e6` | [BPS](https://github.com/GimoXagros/gba-narikiri2-kor/releases/download/v1.0/Xagros_Narikiri2_KOR_v1.0.bps) |
| 나리키리3 v1.2 | 584004162 / ND3_B3TJ_K_v1.2_FROM_J.bps | 17235368 | `e1ca88f6e12b1629b160166d33baeba035b8e738e184c98ee24f2370b2a767c2` | [BPS](https://github.com/GimoXagros/gba-narikiri3-kor/releases/download/v1.2/ND3_B3TJ_K_v1.2_FROM_J.bps) |
| 나리키리3 v1.2 검증 ZIP | 584004164 / ND3_Korean_v1.2.zip | 321546 | `698fe1725d45961cfd9306d922463be6271f517068d499b66208c6942a7ac75b` | [ZIP](https://github.com/GimoXagros/gba-narikiri3-kor/releases/download/v1.2/ND3_Korean_v1.2.zip) |

나리키리2의 별도 공개 검증 manifest 자산 ID는 584068642이며 [검증 문서](https://github.com/GimoXagros/gba-narikiri2-kor/blob/v1.0/verification/v1.0.json)를 사용했다. BPS 자산은 공개 사이트에 웹 패처 내부 리소스로만 넣으며 사용자에게 직접 다운로드 버튼을 제공하지 않는다. 위 URL은 감사용 배포 출처이다.

## 입력·출력 및 검증 범위

| 프로젝트 | 변경·설치 또는 적용 조건 | 근거에 기록된 검증 | 남은 미검증·알려진 문제 |
| --- | --- | --- | --- |
| GameYob | ZIP에서 DS/DSi용 NDS 선택. 상태 파일 사전 검사, NiFi 조각 전송 방어, 실험적 SGB 65C816 256/256 명령 디스패치. | 릴리스의 구조·소프트웨어 회귀 검사. | 65C816 명령 디스패치는 SNES CPU 전체 구현/실기 호환의 뜻이 아님. SPC700 21/256, DSP envelope·echo, host OBJ와 cycle/IRQ 참조 검증 잔여. 실기 NiFi 및 전체 호환 미검증. |
| GBARunner3 | 정식 custom-v0.1.3을 기본 제공, rc3는 저장 감지·오류 fail-closed·4KiB 경계 저장 서명 탐색을 시험. 기기에 맞는 빌드와 런처 조건 확인. | rc3 자동 검사 기록. | 실제 SD/하드웨어 검증은 릴리스에서 미완료. rc3는 시험판이므로 세이브 백업 후 사용. |
| NitroSwan | 정식 r8 기본, r9 시험판은 OAM 주소 DMA, VBlank OBJ 팔레트, BG 팔레트·메뉴 수정. DS/DSi 빌드 선택. | r9 Python 80개, linked ARM 합성 검사, melonDS 부팅·파일 브라우저 smoke. | 3DS DSpico, 실제 기기, 장면·오디오·세이브 왕복 및 잔상 완전 해결 미검증. |
| 나리키리2 | AN9J 일본어 GBA 원본 8388608바이트 SHA `a92c0f6dbb5c013b47b7178e23d81663e3952a10df7b1f68967ebf7bb3b98eb7`에 v1.0 BPS 직접 적용. 결과 13270790바이트 SHA `7505ef506e4fc11e1e0f36672956627e7522d2441cedfb06a5f359e7f5bd2b50`. 기존 번역은 FFR 팀의 기여를 계승. | 공개 기록의 실데이터 166/166, CI 43/43, 패치 적용 7/7. PC mGBA에서 혼합 이름 신규 게임 세이브·냉시작 재개 2회, 기존 세이브/중단 재개. | 기본 이름 신규 게임 경로 일부 미완료. 최종 ROM 해시의 실기 신규 시작·자연 전체 분기·두 기기 링크 미검증. 과거 사용자 2DS 사례는 v1.0 해시를 특정하지 않아 현 버전 실기 검증으로 승격 불가. |
| 나리키리3 | B3TJ 일본어 GBA 원본 16777216바이트 SHA `d083d66b818b1353a449af7f1dd4232b490c254a4107951a3749973d03a0a394`에 v1.2 BPS 직접 적용. 결과 33554432바이트 SHA `8953b6a98a9b39e340aecdc74739598ee47c4d59088f688e471a81c289a67793`. 짜알님의 1.1을 허가받아 계승. | 공개 기록의 v1.1a→v1.2 대사 972곳(신규 960·재수정 12), 누적 교정 그룹 1363/위치 1385. PC mGBA·VBA-Next 제한적 저장/재개·메뉴·첫 전투, mGBA 타이틀/스태프 롤 화면. | 자연 진행 전편/실기 v1.2 전체 검증 아님. 이전 2DS 스태프 롤 보고는 버전 미확인. 19개 용어 기록은 972곳의 부분집합. |
| AI Work Skills | 저장소 안내의 main 설치 절차 사용. 28개 스킬(번들 25, 고정 upstream 3), 전문 에뮬레이터 스킬 13, log-analyzer v3.0.0. 릴리스 파일 자산 없음. | 릴리스의 49개 검사 기록. | 각 사용자의 Codex 환경·모든 스킬 실행 결과를 보증하지 않음. |

원작자·후속 작업자·라이선스: GameYob 원본 [Stewmath](https://github.com/Stewmath/GameYob), GBARunner3 원본 [Gericom](https://github.com/Gericom/GBARunner3), NitroSwan 원본 [FluBBaOfWard](https://github.com/FluBBaOfWard/NitroSwan)이며 GimoXagros가 커스텀 저장소를 관리한다. 각 저장소 및 구성요소 라이선스를 따른다. 나리키리2 기존 FFR 팀 번역, 나리키리3 기존 짜알 번역, Xagros 후속 작업이다. 달무리 글꼴은 RanolP 및 기여자(Apache-2.0), 후속 도구는 해당 저장소의 MIT 범위를 따른다. 원 게임·기존 번역·이미지 권리는 별도다. AI Work Skills의 외부 구성은 [skills-lock.json](https://github.com/GimoXagros/ai-work-skills/blob/v2026.09.19.2/skills-lock.json)의 개별 upstream 고지를 따른다.

공개 근거 태그/커밋: GBARunner3 rc3 `5cb2111be1d3893ad2a31a11a22860dc613645e9`, NitroSwan r9 `dffa5d6ac20c99bb27502a0a3d565c1189705ecc`, 나리키리2 v1.0 검증 기록 `8792b76d625787b8b774b3bca6aaf8659611db40`, 나리키리3 v1.2 ZIP manifest `fd59e655e01335ad0788eb5f09891ec6bc01559f`, AI Work Skills `71a26c048ae9f7f8c6138d3874678a629492fc4e`. 원본 태그와 커밋의 정합성은 공개 자료의 범위이며 이번 실행은 전체 게임/하드웨어 재시험을 수행하지 않았다.

이번 포털 검사: 신규 BPS 2개의 다운로드 바이트 SHA-256을 GitHub asset digest와 각각 대조했고 일치했다. 등록된 BPS는 선언된 입력/출력 크기로 파싱되며 기존 패처 테스트가 이를 확인한다. 합법적 원본 ROM이 제공되지 않아 이번 실행에서 실제 ROM→결과 ROM을 생성·재해시하지 않았다. 공개 원 저장소의 적용 검증 기록과 혼동하지 않는다.
