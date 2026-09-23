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

README의 대표 버전·채널·웹 패처 입력·홈 최신 날짜·changelog 개수 설명과 THIRD_PARTY_NOTICES의 신규 BPS 출처·권리 범위를 갱신했다. 테스트의 과거 버전 고정 기대값을 현행 공개 릴리스로 갱신했으며 검증기나 배포 정책을 완화하지 않았다. 기존 주소·디자인·로고·프로젝트 수와 과거 기록은 유지했다. 새 블로그 URL은 실제 게시 전까지 포털에 연결하지 않았다.

## 블로그 조사 및 보호

`gimoxagros.tistory.com` 관리자 접근을 로그인된 Chrome에서 확인했다. 글 관리 ‘전체’ 한 페이지에는 공개 게시글 2건만 있었고 그 외 공개/비공개/임시 글은 보이지 않았다. `/2`는 자료실 안내(프로젝트 안내), `/3`은 나리키리2·3 웹 패처 사용법(설치·사용 가이드)이다. 두 글의 전체 편집기 HTML, 기존 제목·URL·카테고리·태그·공개 상태를 읽었으며 이미지·첨부는 없다. 원본은 Git이 무시하는 로컬 `qa-artifacts/blog-backups/`에 보관했고 공개 저장소에는 넣지 않는다. 2026-09-24 실행 중 Chrome 연결이 끊겨 `/3` 수정과 신규 7편의 저장·발행은 시작하지 못했다. 게시 0건, 원문 변경 0건, 신규 URL 0개다. 세부 post-map·원고는 `docs/blog/`에 남겼다.

## 게시·배포 선후관계

포털 변경은 [PR #19](https://github.com/GimoXagros/project-portal/pull/19)의 merge commit `0762cab01d41de657d4651d3ab913638f57e211f`로 main에 반영됐고 [GitHub Pages 실행 35887805241](https://github.com/GimoXagros/project-portal/actions/runs/35887805241)의 build·deploy가 성공했다. 공개 사이트에서 나리키리2 v1.0과 나리키리3 v1.2가 각 웹 패처의 기본 선택으로 나타나는 것을 확인했다. Tistory는 브라우저 연결 오류로 게시가 차단돼 완성 원고·HTML만 제공한다. 새 글 URL은 없으므로 포털의 개발노트 링크도 추가하지 않았다. 브라우저 연결 복구 후 [DEVNOTE_UPDATE_GUIDE.md](../../blog/DEVNOTE_UPDATE_GUIDE.md)와 `docs/blog/post-map.json`을 대조해 한 글씩 실제 게시한 다음 URL·fingerprint·`publishedThroughCommit`을 기록해야 한다. 기존 `/3`은 로컬 원본 백업과 현재 본문을 재대조해 날짜 붙은 최신 안내만 삽입하고, `/2`는 그대로 둔다. 타임아웃 후에는 먼저 관리 목록과 실제 URL을 조회해 중복 게시를 피한다.

검증 세부 기록은 [verification.md](verification.md), 배포 근거는 [release-facts.md](release-facts.md)를 참고한다.
