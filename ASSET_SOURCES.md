# 프로젝트 로고 출처

사이트는 외부 이미지 hotlink를 사용하지 않습니다. 아래 원본은 출처 보존용으로 `assets-source/`에 저장하고, 공개 화면에서는 투명도를 유지한 lossless WebP 파생 파일을 사용합니다.

## GameYob

- 원본 저장소: <https://github.com/GimoXagros/GameYob>
- 브랜치: `master`
- 원본 파일: `logo.png`
- 확인 commit SHA: `ab334e79999fd4010dfad173793f05bdd7fe86bb`
- 원본 blob SHA: `1bc2690f744678480fb6168d60af9cdf9af3ed59`
- 출처 보존 파일: `assets-source/projects/gameyob/logo.png`
- 사이트 표시 파일: `public/assets/projects/gameyob/logo.webp`
- 최적화: RGBA PNG 1254×1254, 1,695,314 bytes → lossless RGBA WebP 960×960, 551,722 bytes
- Credits: 원본/Upstream `Stewmath/GameYob`, 커스텀 저장소 및 추가 작업 `GimoXagros/GameYob`
- 라이선스: 원본 저장소의 고지 확인

## GBARunner3

- 원본 저장소: <https://github.com/GimoXagros/GBARunner3>
- 브랜치: `develop`
- 원본 파일: `logo.png`
- 확인 commit SHA: `853179ffc5b9c669aa4f70ba2f207a7302905fb3`
- 원본 blob SHA: `cb100954c638eeacda2aaf21f2c26326d91defa0`
- 출처 보존 파일: `assets-source/projects/gbarunner3/logo.png`
- 사이트 표시 파일: `public/assets/projects/gbarunner3/logo.webp`
- 최적화: RGBA PNG 1254×1254, 1,471,685 bytes → lossless RGBA WebP 960×960, 552,076 bytes
- Credits: 원본/Upstream `Gericom/GBARunner3`, 커스텀 저장소 및 추가 작업 `GimoXagros/GBARunner3`
- 라이선스: 원본 저장소의 고지 확인

## NitroSwan

- 원본 저장소: <https://github.com/GimoXagros/NitroSwan>
- 브랜치: `main`
- 원본 파일: `logo.png`
- 확인 commit SHA: `d19a87b3bb0303efa2b907d75e77e977eaabed77`
- 원본 blob SHA: `ab59e8602b0ca2aed9e6f757eea816dfebabe120`
- 출처 보존 파일: `assets-source/projects/nitroswan/logo.png`
- 사이트 표시 파일: `public/assets/projects/nitroswan/logo.webp`
- 최적화: RGBA PNG 512×512, 38,554 bytes → lossless RGBA WebP 512×512, 16,326 bytes
- Credits: 원본/Upstream `FluBBaOfWard/NitroSwan`, 커스텀 저장소 및 추가 작업 `GimoXagros/NitroSwan`
- 라이선스: 원본 저장소의 고지 확인

## 갱신 원칙

로고를 교체할 때는 지정 브랜치의 파일과 commit/blob SHA를 다시 확인합니다. 원본은 파괴적으로 수정하지 않으며, 공개 파생 파일도 비율·투명도·색상을 유지합니다. `projects.json`의 `branding.logo`, 크기와 대체 텍스트를 함께 갱신한 뒤 `npm run validate:data`와 `npm run build`를 실행합니다.
