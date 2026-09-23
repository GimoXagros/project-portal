# 2026-09-24 콘텐츠 동기화 요약

## 프로젝트별 포털 반영

| 프로젝트 | 이전 대표 공개판 | 현재 대표 공개판 / 병행 시험판 | 변경 위치 | 판단 |
| --- | --- | --- | --- | --- |
| GameYob | v0.5.10 | v0.5.10 | 없음 | 새 공개 릴리스 없음, 현행 유지 |
| GBARunner3 | custom-v0.1.3 | custom-v0.1.3 / custom-v0.1.3-rc3 | 프로젝트 데이터, 버전 선택, changelog | 정식 기본 유지, 새 시험판만 선택 가능하게 추가 |
| NitroSwan | v0.7.7-custom.r8 | v0.7.7-custom.r8 / v0.7.7-custom.r9 | 프로젝트 데이터, 버전 선택, changelog | 정식 기본 유지, 새 시험판 자산 3종 추가 |
| 나리키리2 | v0.9d 프리릴리즈 | v1.0 정식 | 프로젝트 데이터, changelog, BPS 내부 자산 | AN9J 일본어 원본 입력과 새 출력 해시 반영; 이전 버전 선택 보존 |
| 나리키리3 | v1.1a | v1.2 정식 | 프로젝트 데이터, changelog, BPS 내부 자산 | B3TJ 일본어 원본 입력과 새 출력 해시 반영; v1.1a 선택 보존 |
| AI Work Skills | v2026.09.19.2 | v2026.09.19.2 | 없음 | 새 공개 릴리스 없음, 현행 유지 |

README의 대표 버전·채널·웹 패처 입력·홈 최신 날짜·changelog 개수 설명과 THIRD_PARTY_NOTICES의 신규 BPS 출처·권리 범위를 갱신했다. 테스트의 과거 버전 고정 기대값을 현행 공개 릴리스로 갱신했으며 검증기나 배포 정책을 완화하지 않았다. 기존 주소·디자인·로고·프로젝트 수와 과거 기록은 유지했다. 실제 게시 후속 작업에서 프로젝트 업데이트 타임라인에 개발노트 `/4`–`/9`, 전체 업데이트 목록에 포털 개발노트 `/10`을 연결했다.

## 블로그 조사 및 보호

`gimoxagros.tistory.com` 관리자 접근을 로그인된 Chrome에서 확인했다. 초기 조사 때 공개 게시글은 `/2`, `/3` 두 건이었다. 두 글의 전체 편집기 HTML과 메타데이터를 읽고 원본은 Git이 무시하는 로컬 `qa-artifacts/blog-backups/`에 보관했다. 연결 복구 후 `/3` 원문 2,458자와 백업이 일치하는지 재확인하고, 최신 N2 v1.0·N3 v1.2 단락을 원문 끝에 한 번만 덧붙여 같은 URL로 공개 저장했다. `/2`는 변경하지 않았다. 신규 개발노트 7편은 기존 `프로젝트 안내` 카테고리로 각각 `/4`–`/10`에 공개했고, 관리자 목록은 9건이다. 전체 공개 페이지의 제목·주요 내용·근거 링크를 확인했다.

## 게시·배포 선후관계

포털 릴리스 변경은 [PR #19](https://github.com/GimoXagros/project-portal/pull/19)의 merge commit `0762cab01d41de657d4651d3ab913638f57e211f`로 main에 반영됐고 [GitHub Pages 실행 35887805241](https://github.com/GimoXagros/project-portal/actions/runs/35887805241)의 build·deploy가 성공했다. 공개 사이트에서 나리키리2 v1.0과 나리키리3 v1.2가 각 웹 패처의 기본 선택으로 나타나는 것을 확인했다. 연결 차단 상태는 [PR #20](https://github.com/GimoXagros/project-portal/pull/20)에 중간 기록으로 남겼다. 이후 Chrome 연결 복구로 블로그 게시를 마쳤고, 실제 URL·본문 지문·출처 커밋은 `docs/blog/post-map.json`과 글별 metadata에 기록했다. 새 포털 링크는 공개 페이지를 확인한 `/4`–`/10`만 사용한다.

검증 세부 기록은 [verification.md](verification.md), 배포 근거는 [release-facts.md](release-facts.md)를 참고한다.
