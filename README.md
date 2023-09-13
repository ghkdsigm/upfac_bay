# UPFAC

|최초 작성  | 2023. 08. 28|
|:-------: |:-------:|
|수정  | 2023. 08. 29|

---

아이템베이 UPFAC 퍼블리싱 가이드

---

## 1. 크로스 브라우징
- 작업
    - 크롬
    - 사파리
    - 엣지
    - 네이버웨일
    - 파이어폭스
    - 오페라

- 미작업
    - 익스

---

## 2. 작업 환경(라이브러리 버전 정보)
- swiper.js 
    - v4.5.1(예정 버전up 가능성있음)
- jquery
    - v3.5.1(WebGl에 맞춰 버전 수정 예정)

---

## 3. 반응형 분기
- 반응형
    - min-width는 고해상도 PC 작업 시만 사용(고해상도 PC 안맞출수도 있음)
    - 나머지 max-width 기준 작업
- 고해상도 PC
    - 1921px
- 저해상도 PC
    - 1024px
- 테블릿
    - 768px ~ 1023px
- 테블릿, 모바일
    - 480px ~ 767px
- 모바일
    - ~ 480px

---

## 4. 사용 값
- 공통
    - <h1></h1> 태크 사용X logo공통 사용
    - 컬러 기본 값 - #1C1B1B
    - font-size - 16px
    - 반응형 페이지 적용으로 sprite 이미지 사용X

- Web
    - px

- Mobile
    - px

## 5. 폴더구조
```
IB_UPFAC_RESOURCE
ㄴ resources
   ㄴ assets
      ㄴ css
      ㄴ fonts
      ㄴ js
   ㄴ html
   ㄴ guide.html (산출물 페이지)
   ㄴ index.html
```
다음과 같은 구조를 기본 구조로 지정하며 작업자들간의 논의에 따라 구조를 변경할 수 있다.

---

## 6. Branch 명
- 작업 전 `master`에서 branch를 생성 후 작업을 시작합니다.
- branch명은 `일감번호_일감명` 'ex) 8034_캐릭터_거래_활성화_프로모션' 으로 하여 생성합니다.
- 작업이 끝난뒤 branch를 푸시하여 공유합니다.
- 실서버 적용 후 master에 작업 branch를 병합합니다.

---

## 7. title 형식 및 seo 작업

```c
<title>타이틀 이름</title>
<meta name="description" content="상세설명" />
<meta name="keywords" content="3D, 건축, 디자인, 파일" />
```

- og

```c
<meta name="og:site_name" content="웹사이트 이름" />
<meta name="og:title" content="웹페이지 제목" />
<meta name="og:description" content="상세설명" />
<meta name="og:type" content="website" />
<meta name="og:image" content="이미지 경로 800*420 사이즈정도" />
```

---

## 8. 퍼블 배포 url

- url : https://castlewon96.github.io/upfac/

---

## 8. css구조

ㅡ 공통 css
   ㄴ common.css (공통 미시 요소 - 버튼, 컬러, 폰트 등)
   ㄴ style.css (공통 거시 레이아웃 - 게시판, 리스트, 탭, 슬라이드 등)
   ㄴ reset.css
   ㄴ font.css
   ㄴ responsive.css (공통 반응형)

ㅡ Portion's css
   ㅡ login (login + member)
      ㄴ login.css (자체 반응형)

   ㅡ products
      ㄴ products.css (자체 반응형)

   ㅡ members
      ㄴ members.css (자체 반응형)

   ㅡ mypage
      ㄴ mypage.css (자체 반응형)

---
