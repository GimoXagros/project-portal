# 블로그 원고 공개 근거 대조표

확인 시각: 2026-09-24 KST. 아래 내용은 링크된 공개 GitHub 릴리스·PR·커밋·기술 문서와 공개 블로그 글만을 근거로 작성했습니다. “릴리스가 기록” 또는 “PR이 기록”한 검사 결과는 기존 공개 자료의 보고이며, 이번 원고 작성자가 다시 실행한 검사로 표현하지 않습니다.

| claimId | 프로젝트 / 원고 | 공개 근거와 확인 범위 | 글에 반영한 한계 |
| --- | --- | --- | --- |
| gameyob-state-v010 | GameYob v0.5.10 | [릴리스](https://github.com/GimoXagros/GameYob/releases/tag/v0.5.10), [태그 커밋](https://github.com/GimoXagros/GameYob/commit/4d0f29f7e07c26dbaea1006aec310fea7b50828e): 형식 8 유지, 버전별 prefix/tail 선검사, 65C816 dispatch 51/256→256/256, NiFi 경계 사례와 자동 검사 | 256/256은 dispatch 범위이지 cycle accuracy/완전 SNES CPU가 아님. 실제 SGB 프로그램 및 물리 DS 무선 검증 미완료. 상태 로딩은 완전 transaction이 아님. |
| gbarunner3-storage-rc3 | GBARunner3 rc3 | [프리릴리스](https://github.com/GimoXagros/GBARunner3/releases/tag/custom-v0.1.3-rc3), [PR #15](https://github.com/GimoXagros/GBARunner3/pull/15), [PR #19](https://github.com/GimoXagros/GBARunner3/pull/19), [PR #17](https://github.com/GimoXagros/GBARunner3/pull/17): ARM7 저장 결과 전달, 4 KiB 경계 탐색, 해당 공개 자동 검사 수치 | 실기 검증 미완료. 물리 SD 오류·제거·전원 차단과 실패 후 저장 복구는 확인 안 됨. 정식 권장판은 custom-v0.1.3. |
| nitroswan-renderer-r9 | NitroSwan r9 | [프리릴리스](https://github.com/GimoXagros/NitroSwan/releases/tag/v0.7.7-custom.r9), [Draft PR #11](https://github.com/GimoXagros/NitroSwan/pull/11), [검증 문서](https://github.com/GimoXagros/NitroSwan/blob/v0.7.7-custom.r9/Docs/ReleaseValidation-r9.md): OAM/DMA·팔레트·초기 메뉴 보완, 자동 검사와 melonDS boot/file-browser 관찰 | 완전한 잔상 해결·전체 게임 매트릭스 아님. DSpico, 동일 전투 장면, 오디오/저장 왕복은 미검증. 안정판은 r8. |
| narikiri2-v10 | 나리키리 던전2 v1.0 | [정식 릴리스](https://github.com/GimoXagros/gba-narikiri2-kor/releases/tag/v1.0), [검증 JSON](https://github.com/GimoXagros/gba-narikiri2-kor/blob/v1.0/verification/v1.0.json): AN9J 입력 조건, 대사·표기 수정 범위, 빌드·자동검사와 PC mGBA 저장 확인 | 기본 이름 새 게임 경로 등 일부 PC 절차 미완료; 최종 ROM hash에 연결된 실기·전체 자연 진행·분기·통신 미검증. |
| narikiri3-v12 | 나리키리 던전3 v1.2 | [정식 릴리스](https://github.com/GimoXagros/gba-narikiri3-kor/releases/tag/v1.2), [공개 v1.2 릴리스 노트](https://github.com/GimoXagros/gba-narikiri3-kor/blob/v1.2/docs/RELEASE_NOTES_V1_2.md): v1.1a 대비 수정 위치, PC 코어 저장·화면 확인 범위 | 모든 수정 장면·분기·전편 자연 완주·하드웨어 조합 미검증. 저장 호환 전면 보증 아님. 기존 번역 짜알님 허가 계승, 후속 Xagros. |
| ai-skills-v09192 | AI Work Skills | [정식 릴리스](https://github.com/GimoXagros/ai-work-skills/releases/tag/v2026.09.19.2), [관리 목록](https://github.com/GimoXagros/ai-work-skills/blob/v2026.09.19.2/docs/MANAGED_SKILLS.md), [전문 스킬 감사](https://github.com/GimoXagros/ai-work-skills/blob/v2026.09.19.2/docs/EMULATOR_SKILL_AUDIT.md): 활성 28개, 에뮬레이터 분석 지침 13개, 설치·해시·백업 검사 | 설치 검사와 실제 Codex 작업의 자동 선택·에뮬레이터/하드웨어 정확도를 구분. 공식 OpenAI 제품으로 표현하지 않음. |
| portal-pr16-18 | Project Portal | [PR #16](https://github.com/GimoXagros/project-portal/pull/16), [PR #17](https://github.com/GimoXagros/project-portal/pull/17), [PR #18](https://github.com/GimoXagros/project-portal/pull/18), [배포 실행](https://github.com/GimoXagros/project-portal/actions/runs/35444093435): 제보 UI/상태 조회, 세 저장소 직접 이슈 연결, 등록 프로젝트 수 집계, 공개 검사 범위 | GitHub 작성 화면 이동은 실제 제출 완료와 다름. QA 중 테스트 이슈를 만들지 않음. 공개 페이지는 게시 전 재확인 필요. |
| tistory-post2 | 기존 안내글 /2 | [공개 원문](https://gimoxagros.tistory.com/2), 공개 RSS·사이트맵: 6개 프로젝트 목록, 포털 버전·설치·제보 경로 | 현재 데이터를 포털에서 확인하도록 연결되어 있어 고정 버전 문구를 추가할 이유가 없음. 이번 판단은 공개된 본문만 대상으로 함. |
| tistory-post3 | 기존 가이드 /3 | [공개 원문](https://gimoxagros.tistory.com/3), [ND2 v1.0](https://github.com/GimoXagros/gba-narikiri2-kor/releases/tag/v1.0), [ND3 v1.2](https://github.com/GimoXagros/gba-narikiri3-kor/releases/tag/v1.2): 각 공식 릴리스와 일본판 원본 크기·코드 | 2026-09-19 v0.9d 문장은 당시 기록으로 유지. 변경은 최신 안내 단락 추가 제안뿐이며, 배포 포털 동기화 확인 전에는 게시하지 않음. |

## 근거 확인 시점과 게시 준비 상태

- 프로젝트별 공개 Release 목록과 선택한 태그의 상세를 2026-09-24 KST에 확인했습니다. `draft=false`인 공개 자산만 게시 근거로 사용했습니다.
- 대상 블로그의 공개 RSS·사이트맵과 `/2`, `/3` 전체 공개 본문을 확인했습니다. 공개 인벤토리에 없는 URL이나 향후 post ID는 만들지 않았습니다.
- 포털 배포 run `35444093435`는 대상 commit `cf71b4e`에 대해 GitHub Actions에서 `success`였습니다. 글 발행 직전에는 실제 페이지에서 현재 상태를 다시 확인해야 합니다.
- 게시 버튼, 저장 결과, 신규 글 URL은 이 문서가 생성될 때 확인되지 않았습니다. 각 metadata의 `postStatus`는 모두 `draft_ready` 또는 `no_change`입니다.
