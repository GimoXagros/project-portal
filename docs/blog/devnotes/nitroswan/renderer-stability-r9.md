# [개발노트] NitroSwan Custom — r9 렌더러 안정화 후보와 남은 확인

v0.7.7-custom.r9는 렌더링과 DMA 경계 사례를 다루는 공개 프리릴리스입니다. 안정화 정식판 r8은 그대로 유지됩니다. r9 릴리스 자체도 원피스·디지몬의 잔상 문제가 완전히 해결됐다고 단정하지 않으며 DSpico 실기 재검증이 필요하다고 안내합니다.

## r9에서 바뀐 내용

공개 릴리스에 기록된 수정은 완료된 OAM 주소가 스크롤 값으로 덮어써지는 ARM/DMA 오류, 다음 프레임의 OBJ 팔레트 작업 버퍼를 VBlank가 덮어쓰는 경우, 새 WonderSwan 프레임이 없는 화면 갱신 때 활성 BG 팔레트가 재생되지 않는 경우를 대상으로 합니다. 초기 ROM 선택/reset 중 렌더러가 정지해도 메뉴 입력 갱신이 이어지게 하고, 일시정지 중 미완성 타일/OAM 프레임 대신 완료 프레임의 색상으로 감마·대비를 계산하도록 바뀌었습니다. OAM 전송 주소와 로그 누락을 구분하는 진단 및 ARM 실행 회귀 검사도 기록되어 있습니다.

이는 공개 코드·릴리스 설명에 적힌 의도와 변경 범위입니다. 모든 잔상 사례의 원인이 확정되었거나 모든 게임이 해결되었다는 뜻은 아닙니다.

## 검증 상태

r9 릴리스는 80개 Python 테스트, native host C RTC/cache 벡터, DS/DSi 빌드, linked ARM ABI 검사, 프로파일별 합성 ARM 실행 사례 17개와 NDS header/banner 검사를 기록하고, release CI가 통과했다고 밝힙니다. melonDS의 부팅·파일 브라우저 smoke도 관찰됐지만, 동일 전투 장면 비교, 오디오/저장 왕복과 DSpico 검증은 실행되지 않았거나 차단됐습니다. 이 기록을 픽셀 정확도나 전체 게임 매트릭스로 확대 해석할 수 없습니다.

정식 r8과 비교할 때 저장 파일을 백업하고 r8을 보존하세요. [NitroSwan 프로젝트 페이지](https://gimoxagros.github.io/project-portal/#/project/nitroswan)에서 현재 버전 채널을 구분해 확인할 수 있습니다. 프리릴리스의 시험 순서와 알려진 제한은 [r9 릴리스 검증 문서](https://github.com/GimoXagros/NitroSwan/blob/v0.7.7-custom.r9/Docs/ReleaseValidation-r9.md)를 따르세요.

근거: [r9 프리릴리스](https://github.com/GimoXagros/NitroSwan/releases/tag/v0.7.7-custom.r9), [Draft PR #11](https://github.com/GimoXagros/NitroSwan/pull/11), [r8 정식판](https://github.com/GimoXagros/NitroSwan/releases/tag/v0.7.7-custom.r8).
