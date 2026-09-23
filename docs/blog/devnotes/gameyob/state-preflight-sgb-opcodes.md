# [개발노트] GameYob Custom — 상태 파일 선검사와 SGB 호스트 명령 범위

GameYob Custom v0.5.10은 Nintendo DS·DSi·Nintendo 3DS(DSpico, DS 모드)용 공개 정식 릴리스입니다. 이번 릴리스에서는 저장 상태 파일을 메모리에 반영하기 전에 구조를 확인하고, 실험적인 Super Game Boy 호스트 CPU의 65C816 명령 분기 범위를 넓혔습니다. 공개 릴리스의 자동 검사 결과와 실제 DS 무선·SGB 하드웨어 검증은 서로 다른 범위입니다.

## 확인한 변경

저장 상태 형식 8은 유지합니다. 공개 릴리스 설명은 버전 1~8의 공통 영역 길이와 mapper/SGB tail 길이를 확인하고, 큰 메모리 영역을 수정하기 전에 tail 구조 전체를 선검사하는 방식을 기록합니다. 절단·변조 입력의 검사도 포함됩니다. 다만 로딩 전체가 원자적으로 되돌아가는 transaction 방식은 아니므로 오래된 상태 파일은 별도 백업을 권장합니다.

SGB 호스트의 실험적 65C816 명령 디스패치는 릴리스 기록상 51/256에서 256/256으로 확장됐습니다. 간접·스택 상대 주소, 메모리 연산, 제어 흐름, BRK/COP, 모드별 NMI, MVN/MVP와 주소 경계 사례가 시험 대상입니다. 이 숫자는 명령 분기 범위를 뜻하며, 사이클 정확도나 완전한 SNES CPU 구현을 뜻하지 않습니다.

DS NiFi 조각 처리도 크기 오류, 누락·순서 변경, 중복, 순번 wrap, 잘못된 ACK를 다루도록 보강됐습니다. 일반·UBSan·AddressSanitizer 및 누수 검사와 SGB 명령 목록 검사는 릴리스의 자동 검사 범위에 포함됩니다.

## 배포와 검증 범위

v0.5.10은 2026-09-05 04:29:59 UTC에 공개됐습니다. 릴리스 자산은 `gameyob.nds`, `gameyob_dsi.nds`와 가이드·언어 예제·라이선스·체크섬을 포함한 패키지입니다. ROM, BIOS, DSP 펌웨어와 네이티브 3DSX는 포함되지 않습니다. 3DS에서는 NDS 파일을 DS 모드로 실행하도록 안내되어 있습니다.

릴리스 설명에 적힌 검사와 빌드 설정은 기존 공개 기록입니다. 이 글 작성 중 DS·DSi 실기 무선 연결이나 실제 SGB 호스트 프로그램을 새로 시험한 것은 아닙니다. 공개 기록도 무선 소프트웨어 시험이 물리 기기 간 검증을 대신하지 않는다고 밝힙니다. SPC700은 21/256이며 DSP envelope/echo, 최종 prototype host OBJ 합성, 65C816 cycle accounting과 외부 IRQ/reference trace는 남은 제한입니다.

## 사용자 안내

[GameYob 상세 페이지와 버전 선택](https://gimoxagros.github.io/project-portal/#/project/gameyob)에서 원하는 공개 릴리스를 확인하세요. 이전 상태 파일은 복사본을 보관한 뒤 사용하고, 특정 게임과 무선 기능이 모든 환경에서 동작한다고 가정하지 마세요.

근거: [v0.5.10 릴리스](https://github.com/GimoXagros/GameYob/releases/tag/v0.5.10), [릴리스 커밋](https://github.com/GimoXagros/GameYob/commit/4d0f29f7e07c26dbaea1006aec310fea7b50828e), [이전 정식판](https://github.com/GimoXagros/GameYob/releases/tag/v0.5.9-ko).
