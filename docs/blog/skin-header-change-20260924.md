# 티스토리 헤더 아이콘 교체 — 2026-09-24

대상: `https://gimoxagros.tistory.com/`의 현재 적용 스킨. 포털의 승인된 공개 자산 `ICO_rev.1.png`를 재사용했다. 스킨의 다른 레이아웃·광고·카테고리 설정은 변경하지 않았다.

## 최소 변경

`skin.html`의 헤더 안에서 기존 `<span class="brand-mark" aria-hidden="true">GX</span>` 한 곳을 아래 이미지로 교체했다. 옆의 사이트명이 링크의 접근 가능한 이름을 제공하므로 이미지는 장식용 빈 `alt`를 유지한다.

```html
<img class="brand-mark brand-icon" src="https://gimoxagros.github.io/project-portal/assets/branding/ICO_rev.1.png" width="48" height="48" alt="" aria-hidden="true">
```

`style.css` 끝에는 아이콘의 흰 배경과 둥근 박스만 없애는 규칙을 추가했다. 기존 `.brand-mark`의 48px 기본 크기와 640px 이하 37px 규칙은 유지된다.

```css
.brand-mark.brand-icon{display:block;object-fit:contain;background:transparent;border-radius:0}
```

## 적용·확인

- 변경 전 live HTML/CSS의 줄바꿈 정규화 SHA-256은 각각 `505c8f0a08554d3a534c0ade238331ada0802d0b2c905b3b83178b626c67111f`, `2c38399d624ca7184e842b7b9924ed1c1304c84880617de4f76ce501f46e13c8`였다. 기존 비공개 로컬 원본과 일치함을 확인한 뒤 적용했다. 원본 파일은 저장소에 올리지 않는다.
- 공개 홈과 글 `/10`에서 이미지 URL, `naturalWidth=256`, 투명 배경, 기존 홈 링크와 사이트명 접근성 이름을 확인했다. 포털 이미지 URL도 HTTP 200이었다.
- 390px 모바일 글 화면에서 아이콘 37×37px 및 가로 넘침 없음이 확인됐다. 모바일 홈은 브라우저 뷰포트 설정이 새 탭에 반영되지 않아 실측하지 못했다. 따라서 홈의 37px 적용은 기존 공통 CSS 규칙으로만 확인했다.
