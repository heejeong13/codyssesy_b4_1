# Vanilla JavaScript 포트폴리오 학습 노트

프로젝트를 구현하면서 학습한 개념과 질문을 정리한다.

이 문서는 로컬 학습용이며 Git으로 추적하지 않는다.

## 프로젝트의 핵심 흐름

사용자 상호작용은 다음 흐름으로 이해한다.

```text
사용자 이벤트
→ 상태 변경
→ DOM 업데이트
→ 화면 변화
```

GitHub API 같은 비동기 작업은 다음 흐름으로 이해한다.

```text
API 호출
→ loading / success / error / empty 상태 변경
→ 렌더링
→ DOM 업데이트
```

현재까지는 HTML과 CSS 기반 화면을 구현했기 때문에 JavaScript 상태 변경은 아직 없다.

## 1. 프로젝트 파일의 역할

### HTML, CSS, JavaScript 분리

- HTML은 콘텐츠와 문서 구조를 담당한다.
- CSS는 색상, 크기, 간격, 레이아웃 등 표현을 담당한다.
- JavaScript는 사용자 이벤트와 상태에 따른 동작을 담당한다.

책임을 나누면 원하는 코드를 찾고 수정하기 쉬워진다.

### `defer`

```html
<script src="js/main.js" defer></script>
```

브라우저는 HTML을 해석하면서 JavaScript 파일을 내려받고, DOM 생성이 끝난 뒤 스크립트를 실행한다. JavaScript가 아직 생성되지 않은 DOM 요소를 찾는 문제를 줄일 수 있다.

### Viewport meta 태그

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

모바일 브라우저가 페이지 너비를 실제 기기 너비에 맞춰 렌더링하도록 한다. 반응형 레이아웃이 의도한 크기로 동작하기 위해 필요하다.

### `.gitkeep`

`.gitkeep`은 Git의 공식 기능이 아니라 관례적으로 사용하는 빈 파일이다. Git은 빈 폴더를 추적하지 않으므로 빈 `images` 폴더를 저장소에 포함하기 위해 사용한다.

## 2. Semantic HTML

`header`, `nav`, `main`, `section`, `footer`처럼 역할이 드러나는 요소로 문서 구조를 작성하는 방식이다.

```text
header: 페이지 머리말과 주요 탐색 영역
nav: 주요 이동 링크 영역
main: 페이지의 핵심 콘텐츠
section: 제목을 가진 주제별 콘텐츠 영역
footer: 저작권과 부가 정보 영역
```

시맨틱 요소를 사용하면 브라우저, 검색 엔진, 스크린 리더, 개발자가 문서의 구조를 더 쉽게 이해할 수 있다.

### 이미지의 `alt`

의미 있는 이미지에는 이미지를 볼 수 없는 사용자에게 내용을 전달할 대체 텍스트가 필요하다.

```html
<img
  src="images/profile.jpg"
  alt="모니터 앞에서 안경을 쓰고 있는 캐릭터 인형"
>
```

`alt`는 파일명이나 “프로필 이미지”처럼 추상적으로 작성하기보다 이미지에서 실제로 전달되는 내용을 간결하게 설명한다. `width`와 `height`를 HTML에 작성하면 이미지가 로드되기 전에 브라우저가 공간을 확보해 레이아웃 이동을 줄일 수 있다. `loading="lazy"`는 화면에서 아직 멀리 있는 이미지를 필요할 때 불러오게 한다.

반응형 CSS에서 이미지의 `width`를 변경할 때는 `height: auto`를 함께 적용해야 원래 고정 높이가 남지 않는다. 프로필처럼 정사각형 프레임이 필요하면 `aspect-ratio: 1 / 1`로 가로와 세로 비율을 정하고, `object-fit: cover`로 이미지가 찌그러지지 않게 프레임을 채운다.

### 외부 링크의 `target`과 `rel`

```html
<a
  href="https://github.com/heejeong13"
  target="_blank"
  rel="noopener noreferrer"
>
```

`target="_blank"`는 링크를 새 탭에서 연다. `noopener`는 새 페이지가 원래 페이지의 `window.opener`에 접근하지 못하게 하고, `noreferrer`는 요청에 referrer 정보를 전달하지 않는다.

## 3. Fragment identifier

`Fragment identifier`는 **프래그먼트 아이덴티파이어**라고 읽는다. URL에서 현재 문서의 특정 위치를 가리키는 `#` 부분이다.

```html
<a href="#about">About</a>

<section id="about">
  <h2>About</h2>
</section>
```

동작 흐름은 다음과 같다.

```text
링크 클릭
→ URL에 #about 추가
→ id="about"인 DOM 요소 검색
→ 해당 요소 위치로 이동
```

`#about`은 보통 “샵 어바웃” 또는 “해시 어바웃”이라고 읽는다. 이 이동 기능은 JavaScript 없이 브라우저가 기본으로 제공한다.

## 4. 접근성 트리와 `aria-labelledby`

브라우저는 HTML을 바탕으로 DOM뿐 아니라 보조 기술에 전달할 접근성 트리도 만든다.

```text
HTML
├─ DOM: JavaScript와 화면 렌더링에 사용하는 구조
└─ 접근성 트리: 스크린 리더에 역할과 이름을 전달하는 구조
```

다음 코드를 살펴보자.

```html
<section aria-labelledby="about-title">
  <h2 id="about-title">About</h2>
</section>
```

`aria-labelledby`는 `about-title` 요소의 글자인 `About`을 section의 접근 가능한 이름으로 사용하라는 뜻이다. 스크린 리더는 이 영역을 “About 영역”처럼 안내할 수 있다.

속성을 제거해도 화면 모양, 제목 표시, anchor 이동은 달라지지 않는다. 다만 section이 “About이라는 이름의 region”으로 접근성 트리에 명확하게 전달되지 않을 수 있다.

모든 작은 영역에 무조건 사용하면 landmark가 너무 많아질 수 있으므로 사용자가 따로 탐색할 가치가 있는 주요 영역에 사용한다.

## 5. CSS Variables

CSS에서 반복해서 사용하는 값을 이름으로 관리하는 기능이다.

```css
:root {
  --color-primary: #4f46e5;
}

.button {
  background-color: var(--color-primary);
}
```

`:root`는 문서의 최상위 요소이므로 그 안에 선언한 변수를 페이지 전체에서 사용할 수 있다.

`--purple`보다 `--color-primary`처럼 역할을 기준으로 이름을 붙이면 실제 색상이 변경돼도 변수의 의미가 유지된다. 다크 모드는 요소의 CSS를 다시 작성하지 않고 `[data-theme="dark"]`에서 변수값을 재정의하는 방식으로 구현할 수 있다.

## 6. CSS Box Model과 `box-sizing`

브라우저는 요소를 다음 영역으로 계산한다.

```text
margin
└─ border
   └─ padding
      └─ content
```

기본값인 `content-box`에서는 선언한 `width`가 content만 의미한다. padding과 border는 바깥에 추가되므로 실제 요소가 예상보다 커질 수 있다.

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

`border-box`를 사용하면 선언한 `width` 안에 content, padding, border가 모두 포함된다. padding을 추가해도 요소가 선언한 너비보다 커지는 문제를 방지하기 쉽다.

- `*`: 모든 HTML 요소를 선택한다.
- `*::before`: 모든 요소의 `::before` 가상 요소를 선택한다.
- `*::after`: 모든 요소의 `::after` 가상 요소를 선택한다.

`::before`와 `::after`는 HTML을 추가하지 않고 CSS로 요소 앞뒤에 장식이나 콘텐츠를 만드는 pseudo-element다.

## 7. Mobile First와 반응형 레이아웃

Mobile First는 작은 화면의 CSS를 기본값으로 먼저 작성하고, 넓은 화면에서 필요한 변경만 `min-width` 미디어 쿼리로 추가하는 방식이다.

```css
/* 모바일 기본값 */
.skills-list {
  display: grid;
}

/* 태블릿 이상 */
@media (min-width: 768px) {
  .skills-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
```

CSS cascade 때문에 미디어 쿼리 안에서 모든 스타일을 다시 작성할 필요가 없다. 화면이 넓어졌을 때 달라지는 속성만 덮어쓴다.

현재 breakpoint는 다음과 같다.

```text
기본: 모바일
768px 이상: 태블릿
1024px 이상: 데스크톱
```

## 8. Grid의 `repeat()`, `minmax()`, `fr`

```css
grid-template-columns: repeat(2, minmax(0, 1fr));
```

이 코드를 CSS 용어로 구분하면 다음과 같다.

```text
grid-template-columns             → 속성명(property)
repeat(2, minmax(0, 1fr))         → 속성값(value)
grid-template-columns: ...;       → 선언(declaration)
```

`grid-template-columns`는 Grid 컨테이너의 열 개수와 각 열의 크기를 정하는 속성이다.

- `repeat(2, ...)`: 같은 규칙의 열을 두 개 만든다.
- `1fr`: 사용 가능한 공간의 한 비율을 의미한다.
- `minmax(0, 1fr)`: 열이 최소 0부터 사용 가능한 동일 비율까지 차지하게 한다.

최소값을 0으로 두면 긴 콘텐츠가 열의 최소 너비를 강제로 키워 Grid 바깥으로 넘치는 문제를 줄일 수 있다.

## 9. CSS 상태와 JavaScript 상태의 차이

```css
.button-link:hover {
  transform: translateY(-0.125rem);
}
```

`:hover`는 포인터가 요소 위에 있는지를 브라우저가 관리하는 CSS 상태다. 별도의 JavaScript 변수나 DOM 수정 없이 CSS 속성만 변경된다.

이후 햄버거 메뉴에서는 JavaScript가 메뉴 열림 여부를 상태로 판단하고 class를 변경한다. 이때부터 Event → State → DOM 흐름이 코드에 명확하게 나타난다.

## 10. Hamburger menu의 Event → State → DOM

햄버거 메뉴는 프로젝트에서 JavaScript 상태가 처음 등장하는 기능이다.

```text
버튼 click
→ isMenuOpen 반전
→ renderMenu() 호출
→ active class와 ARIA 속성 변경
→ CSS에 따라 메뉴 표시 또는 숨김
```

### DOM 선택

```js
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".nav-list a");
```

`querySelector()`는 조건과 일치하는 첫 번째 요소를 반환한다. `querySelectorAll()`은 일치하는 모든 요소를 NodeList로 반환하며 `forEach()`로 각 링크에 이벤트를 등록할 수 있다.

### Event

```js
menuToggle.addEventListener("click", () => {
  isMenuOpen = !isMenuOpen;
  renderMenu();
});
```

`addEventListener()`는 특정 이벤트가 발생했을 때 실행할 함수를 등록한다. `!isMenuOpen`은 현재 boolean 값을 반대로 바꾼다.

### State

```js
let isMenuOpen = false;
```

현재 메뉴가 열렸는지를 나타내는 boolean 상태다. 값이 변경돼야 하므로 재할당할 수 있는 `let`을 사용한다.

### DOM update와 Render

```js
const renderMenu = () => {
  navigation.classList.toggle("active", isMenuOpen);
  menuToggle.setAttribute("aria-expanded", String(isMenuOpen));
};
```

`renderMenu()`는 현재 상태를 DOM에 반영한다. `classList.toggle()`의 두 번째 인자가 `true`이면 class를 추가하고 `false`이면 제거한다. `setAttribute()`는 DOM 요소의 HTML 속성을 변경한다.

상태 변경과 DOM 변경을 분리하면 버튼 클릭, 링크 클릭 등 여러 이벤트가 같은 렌더링 함수를 재사용할 수 있다.

### `aria-expanded`와 `aria-controls`

```html
<button aria-controls="primary-navigation" aria-expanded="false">
```

- `aria-expanded`: 메뉴가 현재 열렸는지 보조 기술에 전달한다.
- `aria-controls`: 버튼이 제어하는 Navigation의 `id`를 가리킨다.

시각적인 열림 상태뿐 아니라 접근성 정보도 JavaScript 상태와 함께 갱신해야 한다.

### `setAttribute()`와 삼항 연산자

```js
menuToggle.setAttribute(
  "aria-label",
  isMenuOpen ? "메뉴 닫기" : "메뉴 열기",
);
```

`setAttribute(속성명, 속성값)`은 선택한 DOM 요소의 HTML 속성을 추가하거나 기존 값을 변경한다.

`조건 ? 참일 때 값 : 거짓일 때 값`은 삼항 연산자다. `isMenuOpen`이 `true`이면 `"메뉴 닫기"`, `false`이면 `"메뉴 열기"`를 반환한다.

따라서 메뉴가 열려 있으면 버튼의 다음 동작이 닫기이므로 `aria-label="메뉴 닫기"`가 되고, 닫혀 있으면 `aria-label="메뉴 열기"`가 된다. 아이콘만 있는 버튼의 용도를 스크린 리더에 현재 상태에 맞게 전달한다.

`aria-label` 값은 일반 화면에 텍스트로 표시되지 않는다. 화면을 보는 사용자는 햄버거 또는 X 아이콘의 변화를 보고 동작을 판단하고, 스크린 리더 사용자는 `aria-label`을 통해 “메뉴 열기 버튼” 또는 “메뉴 닫기 버튼”이라는 안내를 듣는다. 모든 사용자에게 글자를 직접 보여주려면 버튼 내부에 실제 텍스트 요소를 작성해야 한다.

### 버튼 클릭부터 화면 변화까지의 전체 흐름

초기 상태는 `isMenuOpen === false`다. `renderMenu()`는 Navigation에서 `active` class를 제거하고 버튼을 `aria-expanded="false"`, `aria-label="메뉴 열기"`로 만든다. 모바일 CSS의 `.site-navigation { display: none; }`이 적용돼 메뉴는 숨겨진다.

첫 번째 클릭이 발생하면 상태가 `true`로 반전된다. `renderMenu()`는 Navigation에 `active` class를 추가하고 버튼을 `aria-expanded="true"`, `aria-label="메뉴 닫기"`로 변경한다.

DOM이 변경되면 브라우저가 CSS 선택자를 다시 비교한다. `.site-navigation.active`가 일치하므로 메뉴에 `display: block`이 적용된다. 동시에 JavaScript가 Font Awesome class를 `fa-bars`에서 `fa-xmark`로 교체해 X 아이콘을 표시한다.

두 번째 클릭에서는 같은 과정이 반대로 실행된다. 상태가 `false`가 되고 class가 제거되며 ARIA 속성이 초기값으로 돌아온다. CSS 선택자가 더 이상 일치하지 않아 Navigation이 숨겨지고 아이콘도 햄버거 모양으로 돌아온다.

```text
click
→ isMenuOpen 반전
→ renderMenu()
→ class / aria-expanded / aria-label 변경
→ 브라우저가 CSS 선택자 다시 계산
→ 메뉴와 아이콘 변경
```

JavaScript가 `display`나 아이콘 그림을 직접 만드는 것이 아니다. JavaScript는 상태에 맞는 DOM class를 관리하고, 프로젝트 CSS와 Font Awesome CSS가 해당 class의 시각적 결과를 담당한다.

### `navigation.classList.toggle()`의 대상

```js
const navigation = document.querySelector(".site-navigation");
```

`querySelector(".site-navigation")`가 HTML의 `<nav class="site-navigation">`를 찾아 그 DOM 요소를 `navigation` 변수에 저장한다.

```js
navigation.classList.toggle("active", isMenuOpen);
```

따라서 `classList`와 `toggle()`의 대상은 `navigation` 변수에 저장된 `<nav>`다. `isMenuOpen`이 `true`이면 `<nav class="site-navigation active">`로 만들고, `false`이면 `active`를 제거해 `<nav class="site-navigation">`으로 되돌린다.

과제 예시에 맞춰 현재 코드도 `active` class를 사용한다. `classList.toggle("active", isMenuOpen)`처럼 두 번째 인자를 사용하면 class를 무조건 반전하는 대신 `true`일 때 추가하고 `false`일 때 제거해 JavaScript 상태와 DOM을 확실히 일치시킨다.

### Font Awesome 햄버거 아이콘

프로젝트의 핵심인 상태와 DOM 변경에 집중하기 위해 CSS로 선 세 개를 직접 그리던 방식을 Font Awesome으로 단순화했다.

```html
<i class="fa-solid fa-bars menu-icon" aria-hidden="true"></i>
```

- `fa-solid`: Font Awesome의 Solid 스타일을 사용한다.
- `fa-bars`: 햄버거 아이콘을 표시한다.
- `menu-icon`: JavaScript와 프로젝트 CSS에서 요소를 찾기 위한 class다.
- `aria-hidden="true"`: 아이콘은 장식이므로 스크린 리더에서 제외한다.

현재 상태에 따라 Font Awesome class를 교체한다.

```js
menuIcon.classList.toggle("fa-bars", !isMenuOpen);
menuIcon.classList.toggle("fa-xmark", isMenuOpen);
```

메뉴가 닫혀 있으면 `fa-bars`가 있고 `fa-xmark`는 없다. 메뉴가 열리면 반대로 `fa-bars`를 제거하고 `fa-xmark`를 추가한다. Font Awesome은 아이콘의 모양만 담당하며 `isMenuOpen`, `aria-expanded`, `aria-label`, Navigation의 `active` class는 프로젝트 JavaScript가 계속 관리한다.

이 방식은 HTML과 CSS가 짧아지는 대신 외부 Font Awesome CSS 로딩에 의존한다. 기존의 `span` 세 개 방식은 외부 의존성이 없고 transform 애니메이션을 자유롭게 만들 수 있지만, 이 프로젝트에서는 JavaScript 상태 흐름을 더 단순하게 보기 위해 Font Awesome을 선택했다.

## 11. Smooth Scroll

Navigation 링크에는 같은 문서의 section으로 즉시 이동하는 기본 anchor 동작이 있다. 이 기본 동작을 막고 JavaScript가 이동 방식을 제어한다.

```js
navLink.addEventListener("click", (event) => {
  event.preventDefault();

  const targetId = navLink.getAttribute("href");
  const targetSection = document.querySelector(targetId);

  targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
});
```

### `event.preventDefault()`

이벤트 객체의 `preventDefault()`는 링크 이동, form 제출처럼 브라우저가 기본으로 실행하는 동작을 막는다. 이벤트 자체를 없애는 것이 아니라 click 이벤트 함수는 계속 실행되고 기본 anchor 이동만 실행되지 않는다.

### `getAttribute()`와 대상 DOM 탐색

`navLink.getAttribute("href")`는 클릭한 링크에서 `#about` 같은 문자열을 가져온다. CSS 선택자에서 `#about`은 `id="about"`을 의미하므로 `document.querySelector(targetId)`로 해당 section을 찾을 수 있다.

### `scrollIntoView()`

```js
targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
```

- `behavior: "smooth"`: 즉시 점프하지 않고 부드럽게 이동한다.
- `block: "start"`: 대상 요소의 시작 부분을 viewport의 시작 부분에 맞춘다.

이 기능은 별도의 프로젝트 상태나 DOM 내용 변경이 필요하지 않다. 대상 DOM은 그대로이고 브라우저 viewport의 스크롤 위치만 달라진다.

### `history.pushState()`

`preventDefault()`를 사용하면 URL의 `#about`도 자동으로 변경되지 않는다. `window.history.pushState(null, "", targetId)`는 페이지를 새로 불러오지 않고 현재 URL에 fragment를 기록한다.

```text
링크 click
→ 기본 이동 방지
→ href에서 대상 id 읽기
→ 해당 section DOM 찾기
→ 부드럽게 viewport 이동
→ URL fragment 기록
```

## 12. Navigation Scroll State

페이지의 세로 스크롤 위치가 60px 이상일 때 Header 스타일을 변경한다.

```text
scroll 이벤트
→ window.scrollY 확인
→ isHeaderScrolled 상태 변경
→ scrolled class 추가 또는 제거
→ Header 배경색과 그림자 변경
```

### `scrollY`와 기준값 상수

```js
const NAV_SCROLL_THRESHOLD = 60;
const nextHeaderScrolled = window.scrollY >= NAV_SCROLL_THRESHOLD;
```

`window.scrollY`는 문서 최상단에서 viewport가 세로로 이동한 거리를 CSS pixel 단위로 나타낸다. `60`을 코드 여러 곳에 직접 작성하지 않고 이름이 있는 상수로 만들면 값의 의미와 수정 위치가 명확해진다.

### 상태가 달라졌을 때만 렌더링

```js
if (nextHeaderScrolled === isHeaderScrolled) return;
```

`scroll` 이벤트는 스크롤하는 동안 매우 자주 발생한다. 현재 상태와 다음 상태가 같으면 함수를 일찍 종료해 같은 class를 반복해서 수정하지 않는다.

### `classList.add()`와 `classList.remove()`

```js
if (isHeaderScrolled) {
  siteHeader.classList.add("scrolled");
  return;
}

siteHeader.classList.remove("scrolled");
```

60px 이상에서는 `scrolled` class를 확실히 추가하고, 60px 미만에서는 확실히 제거한다. `toggle()`이 class의 두 상태를 전환하는 데 편리하다면 `add()`와 `remove()`는 각 동작을 명시적으로 표현할 때 유용하다.

### `position: sticky`와 `scroll-margin-top`

`position: sticky; top: 0;`은 Header가 원래 위치에 있다가 viewport 상단에 도달하면 그 자리에 유지되게 한다. 고정된 Header가 section 제목을 가리지 않도록 section에 `scroll-margin-top`을 적용해 smooth scroll의 정렬 위치에 여유를 둔다.

### Passive scroll listener

```js
window.addEventListener("scroll", updateHeaderScrollState, { passive: true });
```

`passive: true`는 이 scroll handler가 `preventDefault()`로 스크롤을 막지 않는다는 사실을 브라우저에 알려 스크롤 처리 최적화에 도움을 준다.

## 현재 코드 리팩터링 원칙

코드 최적화는 줄 수를 무조건 줄이는 것이 아니라 중복과 불필요한 구조를 제거하면서 의도를 유지하는 작업이다. GitHub 링크가 하나뿐인 Footer에서는 `ul`, `li`, `span` 중첩을 제거하고 링크를 직접 배치했다. 또한 상위 규칙에서 이미 적용되는 `align-items: center`와 Flexbox 기본값인 `flex-wrap: nowrap`을 breakpoint에서 반복 선언하지 않았다.

반면 `isMenuOpen`, `isHeaderScrolled` 상태와 각각의 render 함수는 코드가 조금 길어도 유지한다. 이 구조는 사용자 이벤트, 상태 변경, DOM 업데이트의 책임을 구분해 프로젝트의 핵심 학습 흐름을 명확하게 보여주기 때문이다.

## 13. Scroll-to-Top

문서가 300px 이상 스크롤됐을 때만 최상단 이동 버튼을 표시한다.

```text
scroll 이벤트
→ window.scrollY >= 300 판단
→ isScrollTopVisible 상태 변경
→ is-visible class 변경
→ 버튼 표시 또는 숨김
```

### 표시 상태와 렌더링

```js
const SCROLL_TOP_THRESHOLD = 300;
let isScrollTopVisible = false;

const renderScrollTopButton = () => {
  scrollTopButton.classList.toggle("is-visible", isScrollTopVisible);
};
```

이전 상태와 다음 상태가 다를 때만 `renderScrollTopButton()`을 호출한다. CSS는 `is-visible` class가 있을 때 `opacity`, `visibility`, `pointer-events`를 변경해 버튼을 보이게 하고 조작 가능하게 만든다.

### 하나의 scroll listener 공유

```js
const handleScroll = () => {
  updateHeaderScrollState();
  updateScrollTopState();
};
```

Header와 Scroll-to-Top은 모두 같은 scroll 위치에 의존한다. 각각 별도의 scroll listener를 등록하지 않고 `handleScroll()`에서 두 상태 갱신 함수를 호출해 이벤트 연결을 한곳에서 관리한다.

### 최상단 이동

```js
window.scrollTo({ top: 0, behavior: "smooth" });
```

버튼 click 이벤트가 viewport를 문서 최상단으로 부드럽게 이동시킨다. 이동 과정에서 scroll 이벤트가 다시 발생하고, 300px 미만이 되면 상태가 `false`로 변경되어 버튼이 숨겨진다.

## 14. Dark Mode

테마 버튼 click으로 문자열 상태를 변경하고 `<html>`의 `data-theme` 속성에 반영한다.

```text
theme button click
→ currentTheme 변경
→ renderTheme()
→ data-theme 변경
→ CSS 변수값 변경
→ 전체 화면 색상 변경
```

### 문자열로 관리하는 테마 상태

```js
let currentTheme = "light";

currentTheme = currentTheme === "light" ? "dark" : "light";
```

boolean도 사용할 수 있지만 `"light"`, `"dark"` 문자열은 상태의 의미가 직접 드러나고 `data-theme` 값으로 바로 사용할 수 있다.

### `document.documentElement`와 `dataset`

```js
document.documentElement.dataset.theme = currentTheme;
```

`document.documentElement`는 최상위 `<html>` DOM 요소다. `dataset.theme`에 값을 대입하면 HTML의 `data-theme` 속성이 변경된다.

```text
dataset.theme = "dark"
→ <html data-theme="dark">
```

### CSS 변수 재정의

```css
[data-theme="dark"] {
  --color-background: #0f172a;
  --color-text: #f8fafc;
}
```

각 요소의 CSS를 다시 작성하지 않고 같은 변수의 값만 재정의한다. `body`, Header, 카드 등은 원래 사용하던 `var()`의 계산 결과가 바뀌어 자동으로 Dark 색상을 표시한다.

### 테마 버튼 접근성

`aria-pressed`는 토글 버튼의 현재 상태를 전달하고, `aria-label`은 버튼을 누르면 실행할 다음 동작을 전달한다. 아이콘은 Light 상태에서 달, Dark 상태에서 해로 변경되지만 장식이므로 `aria-hidden="true"`를 유지한다.

이번 단계에서는 테마를 메모리 상태로만 관리한다. 새로고침하면 다시 Light로 시작하며, 사용자 선택 저장은 다음 `localStorage` 단계에서 구현한다.

## 15. localStorage

`localStorage`는 브라우저를 닫거나 페이지를 새로고침해도 남아 있는 문자열 저장소다. 테마처럼 사용자가 선택한 간단한 설정을 유지하는 데 사용할 수 있다.

```text
테마 버튼 click
→ currentTheme 변경
→ localStorage 저장
→ renderTheme()

페이지 재실행
→ localStorage 읽기
→ currentTheme 초기값 결정
→ renderTheme()
```

### Key와 문자열 값

```js
const THEME_STORAGE_KEY = "portfolio-theme";

localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
```

`setItem()`은 key와 value를 저장하고 `getItem()`은 같은 key의 값을 읽는다. localStorage는 숫자나 boolean도 문자열로 저장하므로 현재 코드도 `"light"`, `"dark"` 문자열을 사용한다. 저장된 key가 없으면 `getItem()`은 `null`을 반환한다.

### 저장값 검증과 초기 상태

```js
let currentTheme = storedTheme === "dark" ? "dark" : "light";
```

11단계에서는 저장값이 정확히 `"dark"`일 때만 Dark로 시작했다. 12단계부터는 유효한 저장값이 없을 때 Light로 고정하지 않고 시스템 설정을 fallback으로 사용한다.

### Origin별 저장 공간

localStorage는 origin 단위로 분리된다. origin은 protocol, host, port의 조합이므로 Live Server의 포트가 달라지거나 GitHub Pages 주소로 이동하면 서로 다른 저장 공간을 사용한다.

```text
http://127.0.0.1:5500
http://127.0.0.1:5501
https://heejeong13.github.io
→ 각각 별도의 localStorage
```

## 16. prefers-color-scheme

`prefers-color-scheme`은 사용자가 운영체제나 브라우저에서 Light/Dark 중 어느 색상 환경을 선호하는지 알려주는 미디어 기능이다.

```js
const systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
```

`matchMedia()`는 주어진 미디어 쿼리의 현재 일치 여부를 가진 객체를 반환한다. `systemThemeQuery.matches`가 `true`이면 시스템이 Dark를 선호한다.

### 핵심 코드의 초기화 흐름

```js
const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
let hasUserThemePreference = storedTheme === "light" || storedTheme === "dark";
const systemTheme = systemThemeQuery.matches ? "dark" : "light";
let currentTheme = hasUserThemePreference ? storedTheme : systemTheme;
```

코드는 위에서 아래로 다음 순서로 실행된다.

1. `storedTheme`에 브라우저에 저장된 값을 가져온다.
2. 저장값이 `"light"` 또는 `"dark"`인지 검사해 `hasUserThemePreference` 상태를 만든다.
3. `matches`를 사용해 현재 시스템 테마를 문자열로 변환한다.
4. 유효한 사용자 선택이 있으면 `storedTheme`, 없으면 `systemTheme`을 `currentTheme`의 초기값으로 정한다.
5. 페이지 초기화 마지막의 `renderTheme()`가 이 상태를 DOM에 반영한다.

### 테마 결정 우선순위

```text
유효한 localStorage 값 존재 → 저장된 사용자 선택 사용
저장값 없음                 → prefers-color-scheme 사용
시스템이 Dark가 아님         → Light 사용
```

사용자가 직접 선택한 값은 시스템 기본값보다 구체적인 의사 표현이므로 더 높은 우선순위를 가진다.

### 테마 버튼을 클릭했을 때

```js
themeToggle.addEventListener("click", () => {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  hasUserThemePreference = true;
  localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
  renderTheme();
});
```

```text
테마 버튼 click 이벤트
→ currentTheme을 반대 테마로 변경
→ hasUserThemePreference를 true로 변경
→ localStorage에 사용자 선택 저장
→ renderTheme() 호출
→ html의 data-theme와 버튼 DOM 변경
→ CSS 변수값이 바뀌어 화면 테마 변경
```

`hasUserThemePreference = true`는 이후부터 시스템 설정보다 사용자의 버튼 선택을 우선하겠다는 상태 변경이다.

### 시스템 설정 변경 이벤트

```text
시스템 테마 change 이벤트
→ hasUserThemePreference 확인
→ 사용자 선택이 없으면 currentTheme 변경
→ renderTheme()
→ html의 data-theme 변경
→ 화면 색상 변경
```

`MediaQueryList`의 `change` 이벤트를 사용하면 페이지가 열린 상태에서 시스템 테마가 변경될 때도 화면을 즉시 맞출 수 있다. 단, `hasUserThemePreference`가 `true`이면 명시적인 사용자 선택을 보호하기 위해 변경을 무시한다.

핵심 코드는 다음과 같다.

```js
systemThemeQuery.addEventListener("change", (event) => {
  if (hasUserThemePreference) return;

  currentTheme = event.matches ? "dark" : "light";
  renderTheme();
});
```

여기서 `event.matches`는 변경된 시스템 설정이 Dark 미디어 쿼리와 일치하는지를 나타낸다. `return`은 사용자 선택이 있을 때 아래의 상태 변경과 DOM 업데이트를 실행하지 않는 조기 반환이다.

### renderTheme이 변경하는 DOM

`renderTheme()`는 현재 `currentTheme` 상태를 기준으로 다음 DOM을 함께 변경한다.

```text
document.documentElement.dataset.theme → <html data-theme="light|dark">
themeToggle의 aria-pressed            → 현재 Dark 활성 여부
themeToggle의 aria-label              → 버튼을 누르면 실행될 다음 동작
themeIcon의 Font Awesome class        → 달 또는 해 아이콘
```

CSS는 `<html>`의 `data-theme` 값에 맞는 변수를 선택한다. 따라서 JavaScript가 각 카드나 버튼의 색을 직접 바꾸지 않아도 전체 화면의 색상이 함께 변경된다.

## 17. Intersection Observer

Intersection Observer는 관찰 대상 요소가 viewport 또는 지정한 root와 교차하는 변화를 브라우저가 알려주는 API다. `scroll` 이벤트마다 `getBoundingClientRect()`를 호출해 위치를 직접 계산하지 않아도 된다.

```js
const REVEAL_THRESHOLD = 0.2;

const sectionObserver = new IntersectionObserver(callback, {
  threshold: REVEAL_THRESHOLD,
});
```

`threshold: 0.2`는 관찰 대상인 section 제목의 약 20%가 viewport와 교차하는 지점을 callback 실행 기준으로 사용한다는 뜻이다. API 카드가 추가되어 Projects section이 매우 길어져도 작은 제목을 기준으로 하면 조건을 안정적으로 충족할 수 있다.

### 핵심 실행 흐름

```text
페이지 초기화
→ 모든 .section에 reveal-section class 추가
→ 각 section의 h1 또는 h2를 sectionObserver.observe()
→ 브라우저가 교차 상태 관찰
→ 제목이 viewport에 20% 이상 진입
→ callback의 entry.isIntersecting이 true
→ closest(".section")으로 제목의 section 탐색
→ section에 is-visible class 추가
→ CSS opacity와 transform 변경
→ 화면에 section이 나타남
→ unobserve()로 해당 section 관찰 종료
```

`entry.target`은 현재 교차 상태가 바뀐 `h1` 또는 `h2` DOM이다. `closest(".section")`으로 해당 제목을 포함한 section을 찾는다. `entry.isIntersecting`은 교차 여부를 나타내는 boolean 상태이며, 이 상태가 section의 `is-visible` class와 화면 변화로 이어진다.

### 점진적 향상과 동작 감소

숨김 시작 상태인 `reveal-section`을 HTML에 미리 쓰지 않고 JavaScript에서 추가한다. JavaScript가 실행되지 않으면 class도 추가되지 않아 콘텐츠가 계속 보인다.

```css
@media (prefers-reduced-motion: reduce) {
  .section.reveal-section {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

운영체제에서 움직임 감소를 선택한 사용자에게는 애니메이션 없이 콘텐츠를 바로 표시한다.

## 18. Contact Form UI

Contact form은 이름, 이메일, 메시지를 입력받으며 각 `<label>`의 `for`와 입력 요소의 `id`를 같은 값으로 연결한다.

```text
<label for="contact-email">
                ↓ 연결
<input id="contact-email">
```

`aria-describedby="contact-email-error"`는 입력 요소와 해당 오류 문구를 연결한다. JavaScript가 오류 `<p>`의 `textContent`를 변경하면 보조 기술도 어떤 입력의 오류인지 이해할 수 있다.

Form의 `novalidate`는 검증 자체를 없애기 위한 속성이 아니다. 브라우저별 기본 팝업을 표시하지 않고 JavaScript로 상태와 DOM 변경 과정을 직접 구현하기 위해 사용한다. HTML의 `required`와 `type="email"`은 입력 목적과 제약을 나타내기 위해 그대로 유지한다.

## 19. Form Validation

### Form 상태

```js
const formState = {
  values: { name: "", email: "", message: "" },
  errors: { name: "", email: "", message: "" },
  status: "idle",
};
```

`values`는 공백을 정리한 입력값, `errors`는 각 필드의 오류 문구, `status`는 Form 전체의 `idle`, `error`, `success` 상태를 가진다. 입력 DOM 자체와 별도로 상태를 두면 상태를 기준으로 화면을 그리는 흐름이 명확해진다.

### input 이벤트의 핵심 흐름

```text
사용자가 한 필드에 입력
→ input 이벤트
→ trim()한 값을 formState.values에 저장
→ getFieldError() 결과를 formState.errors에 저장
→ 전체 status를 idle로 변경
→ 해당 필드의 aria-invalid와 오류 textContent 변경
→ 이전 제출 상태 메시지 제거
```

`input` 이벤트는 값이 바뀔 때마다 발생하므로 사용자가 오류를 수정하는 즉시 피드백도 갱신된다. `trim()`은 공백만 입력한 값을 빈 값으로 판정하기 위해 사용한다.

### submit 이벤트의 핵심 흐름

```text
메시지 보내기 버튼 클릭 또는 Enter
→ submit 이벤트
→ event.preventDefault()
→ 모든 필드 값과 오류 상태 갱신
→ 모든 필드 오류 DOM 렌더링
→ 첫 오류를 찾음
→ formState.status를 error 또는 success로 변경
→ 전체 상태 메시지 DOM 렌더링
→ 오류가 있으면 첫 번째 잘못된 필드로 focus 이동
```

버튼의 `click`이 아니라 Form의 `submit`을 처리하면 버튼 클릭과 Enter 제출을 모두 같은 검증 흐름으로 처리할 수 있다.

### 필드 오류 렌더링

```js
field.setAttribute("aria-invalid", String(hasError));
errorElement.textContent = errorMessage;
```

오류가 있으면 `aria-invalid="true"`로 바뀌고 CSS가 입력 테두리를 오류 색으로 표시한다. 동시에 가까운 오류 요소의 `textContent`가 바뀌어 화면과 접근성 트리에 같은 검증 결과가 전달된다.

이번 단계의 `success`는 입력값이 유효하다는 뜻이다. 실제 네트워크 전송과 전송 중·실패 처리는 22단계에서 Formspree 또는 EmailJS를 연결할 때 추가한다.

## 20. GitHub API Basic Request

GitHub의 사용자 repository 목록 endpoint에 GET 요청을 보내면 repository 객체의 배열을 JSON으로 받을 수 있다.

```js
const GITHUB_API_URL = "https://api.github.com/users/heejeong13/repos";
```

Token을 frontend JavaScript에 작성하면 브라우저와 공개 repository에서 누구나 확인할 수 있으므로 사용하지 않는다. 인증하지 않은 요청은 시간당 60회 제한이 있어 개발 중 반복 새로고침을 피한다.

### fetchProjects의 핵심 흐름

```text
페이지 초기화에서 fetchProjects() 호출
→ fetch()가 Promise 반환
→ await로 HTTP Response를 기다림
→ response.ok 검사
→ await response.json()으로 응답 본문 변환
→ repository 배열 반환

네트워크 또는 HTTP/JSON 오류
→ throw 또는 reject
→ catch 실행
→ 오류를 console에 기록
→ null 반환
```

핵심 코드는 다음과 같다.

```js
const fetchProjects = async () => {
  try {
    const response = await fetch(GITHUB_API_URL);

    if (!response.ok) {
      throw new Error(`GitHub API 요청 실패: ${response.status}`);
    }

    const repositories = await response.json();
    return repositories;
  } catch (error) {
    console.error("GitHub 프로젝트 요청 중 오류가 발생했습니다.", error);
    return null;
  }
};
```

### Promise와 async/await

`fetch()`는 응답을 즉시 주는 대신 미래의 결과를 나타내는 Promise를 반환한다. `async` 함수도 항상 Promise를 반환하며, `await`는 해당 Promise가 처리될 때까지 현재 `async` 함수 안의 다음 코드 실행을 기다린다. 브라우저 전체가 멈추는 것은 아니다.

### Response와 JSON 변환

첫 번째 `await fetch()`의 결과는 실제 repository 배열이 아니라 HTTP 응답 정보가 담긴 `Response` 객체다. 응답 본문도 비동기로 읽어야 하므로 `await response.json()`을 한 번 더 사용한다.

```text
fetch 결과          → Response 객체
response.json() 결과 → JavaScript repository 배열
```

### response.ok 검사

`fetch()`는 인터넷 연결 실패 같은 네트워크 오류에서는 reject된다. 하지만 서버가 403, 404, 500을 응답한 경우에는 정상적으로 `Response`를 반환하므로 `response.ok`를 직접 검사해야 한다. `ok`는 HTTP 상태 코드가 200부터 299 사이일 때 `true`다.

### null과 빈 배열의 구분

```text
repository 배열에 항목 있음 → 정상 success 후보
[]                         → 정상 요청이지만 empty 후보
null                       → 요청 또는 변환 error 후보
```

이번 단계에서는 데이터를 Console에서만 확인한다. 다음 단계에서 이 반환값을 Projects 상태로 옮기고 loading, success, error, empty에 맞춰 DOM을 렌더링한다.

## 21. GitHub API State Rendering

API 요청은 응답을 기다리는 시간과 여러 결과가 존재하므로 현재 단계를 명시적인 상태로 관리한다.

```js
const projectsState = {
  status: "idle",
  repositories: [],
};
```

```text
idle    → 아직 요청을 시작하지 않음
loading → API 응답을 기다리는 중
success → 하나 이상의 repository를 받음
empty   → 요청은 성공했지만 배열이 비어 있음
error   → 네트워크, HTTP 또는 JSON 처리 실패
```

### API 호출부터 DOM 업데이트까지

```text
fetchProjects() 호출
→ status = loading
→ renderProjects()
→ 로딩 DOM 표시 + aria-busy=true
→ fetch 요청

요청 성공
→ repositories에 배열 저장
→ length에 따라 success 또는 empty

요청 실패
→ status = error
→ repositories를 빈 배열로 초기화
→ 실제 오류는 Console에 기록

finally
→ renderProjects()
→ 최종 상태 DOM 표시 + aria-busy=false
```

### 상태를 기준으로 렌더링하기

`renderProjects()`는 API를 호출하지 않고 현재 `projectsState`만 읽는다. 각 상태에서 `innerHTML`을 변경한 뒤 `return`하므로 한 번에 하나의 UI만 표시된다.

```text
loading → spinner + “로딩 중...”
error   → “프로젝트를 불러올 수 없습니다.”
empty   → “표시할 프로젝트가 없습니다.”
success → 불러온 repository 개수
idle    → 준비 메시지
```

이 구조는 API 통신 책임과 DOM 렌더링 책임을 분리한다. 다음 단계에서 Retry가 같은 `fetchProjects()`를 호출하더라도 동일한 상태 전환과 렌더링 흐름을 재사용할 수 있다.

## 22. GitHub API Retry

Retry는 별도의 API 로직이 아니라 실패한 사용자가 같은 상태 전환을 다시 시작하는 이벤트다.

```text
error 상태 렌더링
→ Retry 버튼 DOM 생성
→ 사용자가 버튼 click
→ projectsView의 click listener가 감지
→ fetchProjects() 재호출
→ status = loading
→ 로딩 DOM
→ success / empty / error 중 새 결과 DOM
```

### 이벤트 위임

`renderProjects()`가 `innerHTML`을 교체할 때 기존 자식 DOM과 그 자식에 연결한 listener도 함께 사라진다. 계속 유지되는 부모에 listener를 연결하면 동적으로 생성되는 버튼도 처리할 수 있다.

```js
projectsView.addEventListener("click", (event) => {
  const retryButton = event.target.closest(".project-retry-button");

  if (!retryButton) return;
  fetchProjects();
});
```

1. Projects 영역 안에서 click이 발생한다.
2. 이벤트가 부모인 `projectsView`까지 전파된다.
3. `event.target.closest()`가 실제 클릭 지점 또는 가장 가까운 Retry 버튼을 찾는다.
4. Retry 버튼이 아니면 조기 반환한다.
5. Retry 버튼이면 기존 `fetchProjects()`를 호출한다.

최초 로딩과 재시도가 같은 함수를 사용하므로 상태 변경, 오류 처리, 렌더링 코드를 중복하지 않는다.

## 23. Project Card Rendering

API가 반환한 repository 객체 배열을 화면 카드로 바꾸기 위해 구조분해 할당, `map()`, 템플릿 리터럴, `join()`을 연결한다.

### 객체에서 필요한 값 꺼내기

```js
const {
  name,
  description,
  html_url: htmlUrl,
  language,
  stargazers_count: starCount,
} = repository;
```

구조분해 할당은 객체의 필요한 property를 같은 이름의 변수로 꺼낸다. `html_url: htmlUrl`과 `stargazers_count: starCount`는 API의 snake_case property를 읽기 쉬운 camelCase 변수 이름으로 바꿔 받는다.

### map에서 DOM까지 이어지는 흐름

```text
projectsState.status = success
→ renderProjects()
→ repositories.map(createProjectCard)
→ 각 repository 객체를 카드 HTML 문자열로 변환
→ 카드 문자열 배열 생성
→ join("")으로 하나의 문자열로 결합
→ projectsView.innerHTML 변경
→ article 카드 DOM 생성
→ CSS Grid가 화면 너비에 맞춰 카드 배치
```

`map()`은 원본 배열을 수정하지 않고 각 항목을 변환한 새 배열을 반환한다. `join("")`을 사용하지 않고 문자열 배열을 그대로 템플릿에 넣으면 항목 사이에 쉼표가 표시될 수 있다.

### 외부 데이터와 innerHTML

Repository 이름과 설명은 API에서 받은 외부 문자열이다. 이를 템플릿 리터럴에 그대로 넣으면 HTML 문법으로 해석될 가능성이 있으므로 `escapeHtml()`로 특수문자를 entity로 변환한다.

```text
<      → &lt;
>      → &gt;
&      → &amp;
따옴표 → &quot; 또는 &#039;
```

변환된 값은 `innerHTML`에 삽입돼도 태그가 아니라 화면의 텍스트로 표시된다.

### article과 반응형 Grid

각 Project는 다른 영역에서도 독립적으로 이해할 수 있는 제목, 설명, 메타 정보, 링크를 가지므로 `<article>`로 표현한다.

```css
grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
```

`minmax(16rem, 1fr)`은 각 열이 최소 16rem을 유지하면서 남은 공간을 나눠 갖게 한다. `auto-fit`은 컨테이너에 들어갈 수 있는 열 개수를 자동으로 계산하므로 모바일에서는 한 열, 넓은 화면에서는 여러 열로 바뀐다.

## 24. Project Language Filtering

필터는 API를 다시 호출하지 않고 이미 받은 전체 repository 배열에서 화면에 표시할 새 배열을 계산한다.

```text
필터 버튼 click
→ data-language 읽기
→ projectsState.selectedLanguage 변경
→ renderProjects()
→ repositories.filter()
→ filteredRepositories 생성
→ map()으로 카드 DOM 갱신
```

### 언어 목록의 중복 제거

```js
const languages = [
  "All",
  ...new Set(projectsState.repositories.map(getRepositoryLanguage)),
];
```

`map()`으로 각 repository의 언어만 꺼낸 뒤 `Set`을 사용해 중복값을 제거한다. Spread 문법으로 Set의 값을 다시 배열에 펼치고 맨 앞에 `All`을 추가한다. GitHub 언어값이 `null`이면 화면에서는 `기타`로 통일한다.

### filter 상태와 원본 데이터

```js
const filteredRepositories =
  selectedLanguage === "All"
    ? repositories
    : repositories.filter(
        (repository) => getRepositoryLanguage(repository) === selectedLanguage,
      );
```

`filter()`는 원본 `repositories`를 수정하지 않고 조건을 만족하는 repository만 가진 새 배열을 반환한다. 따라서 다른 언어 버튼을 눌러도 API 호출 없이 항상 전체 원본에서 다시 필터링할 수 있다.

### Event → State → DOM

사용자가 필터 버튼을 클릭하면 이벤트 위임으로 버튼의 `data-language`를 읽는다. 이 값을 `selectedLanguage` 상태에 저장하고 `renderProjects()`를 호출한다. 렌더 함수는 선택 언어에 맞는 카드만 만들고 각 버튼의 `aria-pressed`도 갱신한다.

## 25. Hero Typing Effect

타이핑 효과는 전체 문장을 바꾸는 것이 아니라 현재 표시할 글자 수를 상태로 관리한다.

```js
const typingMessage = typingText.dataset.text;
let typingIndex = 0;
```

### Timer → State → DOM

```text
startTypingEffect()
→ HTML의 완성 문장을 빈 문자열로 렌더링
→ setTimeout으로 첫 실행 예약
→ typeNextCharacter()
→ typingIndex를 1 증가
→ typingMessage.slice(0, typingIndex)
→ typingText.textContent 변경
→ 문장이 남았으면 다음 setTimeout 예약
→ 전체 문장을 표시하면 종료
```

`slice(0, typingIndex)`는 전체 원본 문장을 수정하지 않고 처음부터 현재 index까지의 새 문자열을 만든다.

### setTimeout과 setInterval

`setInterval()`은 취소하기 전까지 일정 간격으로 계속 실행된다. 현재 구현은 한 글자의 처리 뒤 다음 실행을 예약하고 문장 끝에서 자연스럽게 멈추는 재귀적 `setTimeout()`이 종료 조건을 읽기 쉽다.

### 점진적 향상과 접근성

HTML에는 처음부터 완성 문장을 넣어 JavaScript가 실패해도 제목이 보이게 한다. JavaScript가 실행될 때만 화면용 문자열을 비우고 다시 입력한다.

타이핑 span은 `aria-hidden="true"`로 설정하고 화면 낭독기용 완성 문장을 `.visually-hidden`으로 제공한다. 따라서 화면은 한 글자씩 변하지만 접근성 트리에는 안정된 제목이 전달된다.

`prefers-reduced-motion: reduce`가 활성화되면 `typingIndex`를 전체 길이로 설정해 완성 문장을 즉시 렌더링하고 cursor 애니메이션도 중지한다.

## 26. Real Contact Form Submission

이 프로젝트는 정적 GitHub Pages에서 별도 backend 없이 실제 메시지를 받을 수 있도록 Formspree endpoint를 사용한다. EmailJS보다 필요한 설정값이 적고 기존 `fetch` 학습 흐름을 그대로 유지할 수 있어 선택했다.

### Validation에서 실제 전송까지

```text
form submit 이벤트
→ event.preventDefault()
→ 모든 필드 validation

오류 있음
→ status = validationError
→ 오류 DOM 렌더링
→ 첫 오류 field로 focus

오류 없음
→ FormData 생성
→ status = submitting
→ 버튼 disabled + “전송 중...”
→ Formspree에 POST

응답 성공
→ form.reset()
→ values/errors 초기화
→ status = success

응답 실패
→ 입력값 유지
→ status = submissionError

finally
→ 상태 메시지와 버튼 DOM 렌더링
```

### FormData와 name

```js
const formData = new FormData(contactForm);
```

`FormData`는 Form 안에서 `name`을 가진 입력 요소의 현재 값을 전송 가능한 key-value 구조로 만든다. 현재 Form은 `name`, `email`, `message`라는 field를 전송한다.

### 전송 상태 렌더링

`renderFormStatus()`는 상태 문구뿐 아니라 Form의 `aria-busy`, Submit 버튼의 `disabled`와 `textContent`를 함께 변경한다. 상태와 실제 조작 가능 여부가 어긋나지 않게 한 렌더 함수에서 처리한다.

```text
idle             → 메시지 없음, 버튼 활성
validationError  → 입력 오류 안내
submitting        → 전송 안내, 버튼 비활성
success           → 성공 안내, Form 초기화
submissionError   → 실패 안내, 입력값 유지
```

전송 요청은 `Accept: application/json` header를 보내므로 Formspree의 HTML 결과 페이지로 이동하지 않고 현재 페이지에서 응답 상태를 처리할 수 있다.

## 27. Accessibility Review

접근성 검토는 ARIA를 많이 추가하는 작업이 아니라 키보드, 시각, 움직임, 동적 콘텐츠 사용자가 같은 기능과 정보를 얻는지 확인하는 과정이다.

### Skip link와 키보드 순서

페이지 첫 focus 요소로 `본문으로 건너뛰기` 링크를 제공한다. 평소에는 화면 밖에 있다가 `:focus`일 때 나타나며 `#main-content`로 이동한다.

```text
첫 Tab
→ Skip link 표시
→ Enter
→ 반복 Navigation을 건너뜀
→ Main 콘텐츠로 이동
```

모바일 메뉴가 열린 상태에서 Escape를 누르면 `isMenuOpen`을 false로 변경하고 `renderMenu()`를 호출한 뒤 focus를 Menu button으로 돌려준다.

필터 버튼은 `innerHTML` 렌더링 때 기존 DOM이 제거되므로 현재 선택 언어와 같은 새 버튼을 찾아 focus를 복원한다. 그렇지 않으면 키보드 사용자의 현재 위치가 문서의 다른 곳으로 사라질 수 있다.

### 동적 콘텐츠 알림 범위

Projects 카드 전체에 `role="status"`를 적용하면 API 성공이나 필터 변경 때 모든 카드 텍스트가 읽힐 수 있다. 따라서 카드 영역과 live region을 분리한다.

```text
projectsState 또는 selectedLanguage 변경
→ 카드 Grid DOM 갱신
→ visually hidden projectsAnnouncement에는 상태와 개수만 기록
→ 화면 낭독기는 간결한 변경 결과만 안내
```

### prefers-reduced-motion의 JavaScript 적용

CSS animation을 중지하는 것만으로는 충분하지 않다. Navigation과 Scroll-to-Top의 JavaScript smooth scroll도 움직임이므로 설정값에 따라 behavior를 선택한다.

```js
const getScrollBehavior = () =>
  motionPreferenceQuery.matches ? "auto" : "smooth";
```

실행 중 동작 감소 설정이 켜지면 타이핑 timer를 취소하고 완성 문장을 즉시 표시한다. 타이핑이 정상 완료된 뒤에도 cursor animation을 종료한다.

### 색상 대비와 변수의 역할 분리

Dark 화면에서 링크처럼 배경 위에 직접 놓이는 primary 글자색은 밝아야 한다. 반면 흰 글자를 사용하는 버튼 배경은 충분히 어두워야 한다.

```text
--color-primary         → 링크, focus처럼 배경 위의 foreground
--color-primary-surface → 흰 글자 아래의 button background
```

하나의 변수를 두 용도에 함께 사용하지 않아 Light/Dark 모두에서 대비 조합을 독립적으로 관리한다.

## 28. Code Refactoring

리팩터링은 사용자에게 보이는 기능을 추가하지 않고 같은 동작을 더 명확한 책임과 적은 중복으로 표현하는 작업이다.

### 상태 변경 규칙 모으기

```js
const setMenuOpen = (nextMenuOpen) => {
  isMenuOpen = nextMenuOpen;
  renderMenu();
};
```

메뉴 Toggle, Navigation 선택, Escape는 시작 이벤트가 다르지만 모두 같은 상태와 DOM을 변경한다. Setter 함수에 상태 변경과 렌더 호출을 묶으면 어느 이벤트에서도 둘 중 하나를 빠뜨리지 않는다.

```text
click 또는 keydown
→ setMenuOpen(nextState)
→ isMenuOpen 변경
→ renderMenu()
→ class와 ARIA DOM 변경
```

### 계산, 검증, 렌더 책임 분리

`validateForm()`은 모든 필드 상태와 오류 DOM을 갱신하고 첫 오류 필드를 반환한다. Submit handler는 반환값을 이용해 전송을 중단할지 Formspree 요청을 시작할지만 결정한다.

`getFilteredRepositories()`는 `selectedLanguage` 상태를 읽어 표시할 배열만 계산한다. `renderProjects()`는 그 배열을 카드 DOM으로 바꾸는 데 집중한다.

```text
상태 기반 계산 → getFilteredRepositories()
상태 기반 DOM  → renderProjects()
```

현재 프로젝트는 기능이 구분되어 있지만 상태가 서로 연결되는 지점이 많지 않고 전체 흐름을 한 파일에서 학습할 수 있는 규모다. 따라서 파일 분할 자체를 목표로 삼지 않고 중복 제거와 함수 책임 개선만 적용했다.

## 29. GitHub Pages Deployment

GitHub Pages는 repository의 정적 파일을 공개 URL로 제공한다. 이 프로젝트는 build가 필요하지 않으므로 `main` branch의 repository root를 publishing source로 사용한다.

```text
main branch push
→ GitHub Pages가 publishing source 변경 감지
→ main branch의 root 파일 준비
→ index.html을 시작 파일로 배포
→ 공개 URL 갱신
```

### Branch publishing source

```text
Branch: main
Folder: /(root)
```

별도 compile이나 bundle 결과가 없으므로 root의 `index.html`, `css/`, `js/`, `images/`를 그대로 제공한다. Custom workflow는 build 과정이나 배포 artifact를 직접 제어해야 할 때 더 적합하다.

### Project site의 상대경로

Project Pages URL은 사용자 domain 바로 아래가 아니라 repository 이름을 포함한다.

```text
https://heejeong13.github.io/codyssesy_b4_1/
```

따라서 `/css/style.css`처럼 domain root부터 시작하는 경로 대신 `css/style.css`처럼 현재 project path 기준 상대경로를 사용해야 한다.

## 30. README

README는 결과를 소개하는 문서이면서 구현 결정을 설명하는 문서다. 기능 이름만 나열하지 않고 실제 코드의 Event, State, Render 관계를 표와 흐름으로 기록하면 코드 리뷰에서 선택 이유를 설명할 수 있다.

### 설정값을 문서화하는 이유

```text
Header          → scrollY >= 60px
Scroll-to-Top   → scrollY >= 300px
Section reveal  → threshold 0.2
Tablet          → 768px 이상
Desktop         → 1024px 이상
```

이 값들은 JavaScript와 CSS 동작을 결정하는 계약이다. README에 같은 값을 기록하면 실행 결과가 의도인지 오류인지 판단할 기준이 생긴다.

### 스크린샷과 상대경로

README의 `images/screenshot-mobile.jpg`는 README 파일이 있는 Repository Root를 기준으로 Image를 찾는다. GitHub Pages Asset과 마찬가지로 현재 Project 구조에 맞는 상대경로를 사용한다.

## 31. Final Requirement Review

최종 검증은 코드에 기능 이름이 존재하는지 확인하는 작업이 아니라 실제 브라우저에서 Event가 기대한 State와 DOM을 만드는지 확인하는 작업이다.

### 실제 배포 검증 결과

```text
GitHub Pages 요청              → HTTP 200
GitHub API 성공                → Repository 14개 렌더링
JavaScript Filter click        → selectedLanguage 변경 → Card 3개
빈 Contact Form submit         → Field별 오류 3개
Theme button click             → data-theme="dark"
Mobile Menu click              → aria-expanded="true", Navigation 표시
Escape                         → aria-expanded="false", Navigation 숨김
Browser Console                → Error 없음
```

Formspree의 실제 전송은 제3자에게 입력 데이터를 전달하는 동작이므로 자동 검증에서는 빈 Form의 Client Validation까지만 확인한다. 사용자는 유효한 내용으로 직접 한 번 전송해 Formspree 수신 여부를 최종 확인한다.

### 배포가 처음 시작되지 않았던 이유와 해결 흐름

Pages 설정 직후 `has_pages`는 true였지만 배포 실행 기록이 없었다. 새로운 빈 Commit을 `main`에 Push해 Branch 변경 Event를 만들자 `pages build and deployment`가 시작되었다.

```text
Pages source 설정
→ 기존 Commit에는 Build 실행 없음
→ main에 새 Commit Push
→ Pages Workflow 생성
→ Build success
→ 공개 URL HTTP 200
```
