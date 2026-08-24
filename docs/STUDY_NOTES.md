# Vanilla JavaScript Portfolio 스터디 노트

이 문서는 현재 Portfolio 프로젝트를 스스로 설명할 수 있도록 HTML, CSS, JavaScript와 브라우저·네트워크의 기초 개념을 실제 코드 흐름에 연결한 학습 자료다.

단순히 용어를 외우기보다 다음 질문에 답할 수 있는 것을 목표로 한다.

```text
브라우저는 HTML, CSS, JavaScript를 어떤 순서로 처리하는가?
사용자 Event는 어떻게 State를 바꾸는가?
State는 어떻게 DOM과 화면에 반영되는가?
네트워크 응답을 기다리는 동안 JavaScript는 어떻게 동작하는가?
성공하지 않은 상황을 UI에서 어떻게 표현하는가?
```

---

## 1. 먼저 이해할 전체 구조

웹 페이지는 세 기술의 역할이 결합된 결과다.

| 기술 | 주된 역할 | 이 프로젝트의 예시 |
| --- | --- | --- |
| HTML | 정보의 구조와 의미 | Header, Navigation, Section, Form |
| CSS | 배치와 시각적 표현 | 반응형 Layout, Dark mode, Animation |
| JavaScript | 동작과 상태 변경 | Menu, Theme, Form, GitHub API |

브라우저의 기본 처리 흐름은 다음과 같다.

```text
index.html 다운로드
→ HTML 해석
→ DOM 생성
→ css/style.css 다운로드 및 해석
→ CSSOM 생성
→ DOM + CSSOM으로 화면 배치와 그리기
→ defer가 적용된 js/main.js 실행
→ Event listener 등록
→ 사용자의 입력을 기다림
```

### DOM이란?

DOM(Document Object Model)은 브라우저가 HTML 문서를 JavaScript로 다룰 수 있게 객체 형태로 표현한 구조다.

```html
<button class="theme-toggle">테마 변경</button>
```

브라우저는 이 요소를 DOM 객체로 만들기 때문에 JavaScript에서 선택하고 변경할 수 있다.

```js
const themeToggle = document.querySelector(".theme-toggle");
themeToggle.textContent = "다크 모드";
```

HTML 원본 파일이 직접 바뀌는 것은 아니다. 현재 브라우저 메모리에 존재하는 DOM이 바뀐다.

---

## 2. HTML 기초

### 2.1 Element, Tag, Attribute

```html
<a class="logo" href="#home" aria-label="홈으로 이동">Portfolio</a>
```

- `<a>`: 시작 Tag
- `</a>`: 종료 Tag
- 전체 코드: Element
- `class`, `href`, `aria-label`: Attribute
- `Portfolio`: Text content

Attribute는 Element의 설정이나 상태를 표현한다. JavaScript는 `getAttribute()`와 `setAttribute()`로 값을 읽거나 바꿀 수 있다.

### 2.2 Semantic HTML

Semantic Tag는 Element의 역할을 이름으로 전달한다.

- `<header>`: 페이지 또는 영역의 머리말
- `<nav>`: 주요 이동 링크
- `<main>`: 문서의 핵심 내용
- `<section>`: 주제별 영역
- `<article>`: 독립적으로 이해 가능한 콘텐츠
- `<footer>`: 저작권, 관련 링크 등의 마무리 정보

`<div>`도 화면을 묶을 수 있지만 자체 의미가 없다. Semantic Tag를 사용하면 개발자, 검색 엔진, Screen Reader가 구조를 더 쉽게 이해한다.

### 2.3 Heading 구조

`<h1>`부터 `<h6>`까지는 글자 크기를 정하는 도구가 아니라 문서의 제목 계층을 나타낸다.

```text
h1: 페이지의 대표 제목
└─ h2: About
└─ h2: Skills
└─ h2: Projects
   └─ h3: 각 Project 이름
└─ h2: Contact
```

디자인 크기는 CSS로 정하고 문서 계층은 Heading Level로 정한다.

### 2.4 `id`, `class`, Fragment Identifier

- `id`: 문서 안에서 하나의 Element를 식별한다.
- `class`: 여러 Element에 같은 스타일이나 역할을 적용한다.
- `#projects`: URL에서 특정 `id`를 가리키는 Fragment Identifier다.

```html
<a href="#projects">프로젝트 보기</a>
<section id="projects">...</section>
```

링크를 선택하면 브라우저는 같은 문서의 `id="projects"` 위치로 이동한다. Fragment Identifier는 보통 “프래그먼트 아이덴티파이어”라고 읽는다.

### 2.5 `aria-labelledby`와 접근 가능한 이름

```html
<section aria-labelledby="projects-title">
  <h2 id="projects-title">Projects</h2>
</section>
```

`aria-labelledby`는 Section의 접근 가능한 이름을 다른 Element의 `id`로 연결한다. 화면에는 변화가 없지만 Accessibility Tree에서 해당 영역이 `Projects`라는 이름을 가진 Region으로 전달된다.

```text
HTML DOM
→ 브라우저가 의미와 ARIA를 해석
→ Accessibility Tree 생성
→ Screen Reader가 영역 이름을 안내
```

ARIA는 시각적 디자인을 바꾸는 CSS Attribute가 아니다. 보조 기술에 의미와 상태를 전달한다.

### 2.6 Image와 `alt`

```html
<img src="images/profile.jpg" alt="프로필 사진">
```

`alt`는 Image를 볼 수 없을 때 대신 전달할 의미다. 장식용 Image라면 빈 값 `alt=""`을 사용하지만, 의미 있는 Image라면 목적을 설명해야 한다.

### 2.7 Form과 Label

```html
<label for="contact-email">이메일</label>
<input id="contact-email" name="email" type="email">
```

`for`와 `id`가 같으면 Label을 선택해도 Input으로 Focus가 이동한다. Screen Reader도 Input의 이름을 `이메일`로 이해한다.

`name`은 서버로 전송될 Data의 Key다.

```text
name="email" + 사용자가 입력한 값
→ FormData의 email Key와 Value
→ Formspree로 전송
```

### 2.8 `defer`

```html
<script src="js/main.js" defer></script>
```

`defer`를 사용하면 HTML Parsing을 막지 않고 JavaScript를 내려받는다. HTML DOM 생성이 끝난 뒤 Script가 실행되므로 `querySelector()`가 아래쪽 Element를 정상적으로 찾을 수 있다.

---

## 3. CSS 기초

### 3.1 Selector, Property, Value

```css
.button-link {
  background-color: var(--color-primary-surface);
}
```

- `.button-link`: Selector
- `background-color`: Property
- `var(--color-primary-surface)`: Property Value

`grid-template-columns`도 Property이고 `repeat(...)`가 그 Property의 Value다.

### 3.2 Cascade, Specificity, Source Order

하나의 Element에 여러 Rule이 적용되면 브라우저는 다음을 고려해 최종 Style을 결정한다.

1. 중요도와 작성 출처
2. Selector Specificity
3. Specificity가 같으면 뒤에 작성된 Rule

`class` Selector는 Element Selector보다 구체적이다. 지나치게 강한 Selector나 `!important`를 자주 사용하면 나중에 Style을 덮어쓰기 어려워진다.

### 3.3 Inheritance

일부 Property는 부모의 값을 자식이 물려받는다.

- 주로 상속됨: `color`, `font-family`, `line-height`
- 주로 상속되지 않음: `margin`, `padding`, `border`, `width`

모든 Property가 상속되는 것은 아니다.

### 3.4 Box Model

모든 Element는 사각형 Box로 배치된다.

```text
Margin
└─ Border
   └─ Padding
      └─ Content
```

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

기본 `content-box`에서는 지정한 Width에 Padding과 Border가 추가된다. `border-box`에서는 Width 안에 Content, Padding, Border를 포함하므로 Layout 크기를 계산하기 쉽다.

`*::before`, `*::after`까지 포함하는 이유는 가상 Element도 같은 크기 계산 규칙을 사용하게 하기 위해서다.

### 3.5 CSS Variable

```css
:root {
  --color-background: #f8fafc;
}

[data-theme="dark"] {
  --color-background: #0f172a;
}
```

Component에서 직접 색상을 반복하지 않고 의미가 있는 Variable을 사용한다.

```css
body {
  background-color: var(--color-background);
}
```

Dark mode에서는 `data-theme`에 따라 Variable Value만 바뀌고 `body` Rule은 그대로 재사용된다.

### 3.6 Flexbox와 Grid

Flexbox는 한 방향의 정렬과 배치에 적합하다.

```text
Logo ← Header의 가로축 → Navigation
```

Grid는 행과 열을 함께 다루는 카드 Layout에 적합하다.

```css
grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
```

- `minmax(16rem, 1fr)`: 각 Column은 최소 `16rem`, 여유 공간이 있으면 같은 비율로 확장
- `auto-fit`: Container에 들어가는 만큼 Column을 자동 생성
- `repeat()`: 같은 Column 규칙 반복

따라서 화면이 좁으면 1열, 넓으면 여러 열로 자연스럽게 바뀐다.

### 3.7 Mobile First와 Media Query

기본 Rule을 Mobile에 맞추고 더 넓은 화면에서 필요한 Style을 추가한다.

```css
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
```

이 프로젝트의 기준은 다음과 같다.

```text
0~767px    Mobile
768~1023px Tablet
1024px~    Desktop
```

Mobile에서 Menu를 숨기고 Hamburger Button을 표시하며, 768px부터 반대로 전환한다.

### 3.8 Class와 CSS 상태

```js
navigation.classList.toggle("active", isMenuOpen);
```

```css
.site-navigation { display: none; }
.site-navigation.active { display: block; }
```

JavaScript가 직접 `display` Style을 작성하는 대신 State를 의미하는 Class를 변경한다. CSS는 그 Class를 보고 시각적 결과를 결정한다.

```text
isMenuOpen = true
→ active Class 추가
→ .site-navigation.active Rule 적용
→ Menu 표시
```

### 3.9 Transition과 Animation

- `transition`: Property Value가 바뀔 때 두 상태 사이를 보간한다.
- `animation`: `@keyframes`에 작성한 여러 단계를 시간에 따라 실행한다.

`prefers-reduced-motion: reduce`는 사용자가 움직임을 줄이도록 설정했는지 확인하는 Media Feature다. 멀미나 집중 방해를 줄이기 위해 Animation과 Smooth Scroll을 최소화한다.

---

## 4. JavaScript 기본 문법

### 4.1 `const`와 `let`

- `const`: 변수에 다른 값을 다시 대입하지 않는다.
- `let`: 실행 중 값이 바뀐다.

```js
const NAV_SCROLL_THRESHOLD = 60;
let isMenuOpen = false;
```

`const` Object의 내부 Property는 바뀔 수 있다. `const`는 객체를 가리키는 변수의 재대입을 막는 것이지 객체 전체를 불변으로 만들지는 않는다.

### 4.2 Data Type

- String: `"dark"`
- Number: `300`
- Boolean: `true`, `false`
- Undefined: 값이 아직 지정되지 않음
- Null: 의도적으로 값이 없음을 표현
- Object: Key와 Value의 묶음
- Array: 순서가 있는 값의 목록

```js
const projectsState = {
  status: "idle",
  repositories: [],
  selectedLanguage: "All",
};
```

### 4.3 Function과 Arrow Function

Function은 반복할 동작을 이름이 있는 단위로 묶는다.

```js
const setMenuOpen = (nextMenuOpen) => {
  isMenuOpen = nextMenuOpen;
  renderMenu();
};
```

- Parameter: `nextMenuOpen`
- Argument: 호출할 때 전달하는 실제 값
- Return value: Function이 호출한 곳에 돌려주는 결과

Function을 작게 나누면 Event 처리, 계산, State 변경, DOM 변경의 책임을 구분할 수 있다.

### 4.4 Scope

Scope는 변수에 접근할 수 있는 범위다.

- Global/Module Scope: 파일 전체에서 접근
- Function Scope: Function 내부
- Block Scope: `{}` 내부의 `const`, `let`

State를 모든 곳에서 직접 수정하면 흐름을 추적하기 어렵다. 이 프로젝트는 Setter나 정해진 Event Handler에서 State를 변경하고 Render Function으로 DOM을 갱신한다.

### 4.5 조건문과 조기 반환

```js
if (!targetSection) return;
```

조건을 만족하지 않으면 Function을 즉시 종료한다. 중첩된 `if`를 줄이고 예외 조건을 먼저 처리할 수 있다.

### 4.6 Array Method

#### `forEach()`

각 요소에 동작을 실행한다. 반환 배열을 만들지 않는다.

```js
navLinks.forEach((navLink) => {
  navLink.addEventListener("click", handler);
});
```

#### `map()`

각 요소를 다른 값으로 변환해 길이가 같은 새 배열을 만든다.

```text
Repository Object 배열
→ map(createProjectCard)
→ Card HTML String 배열
```

#### `filter()`

조건이 true인 요소만 모아 새 배열을 만든다.

```js
repositories.filter(
  (repository) => getRepositoryLanguage(repository) === selectedLanguage,
);
```

원본 배열을 직접 변경하지 않으므로 전체 Filter로 돌아갈 때 다시 사용할 수 있다.

### 4.7 Destructuring

```js
const { name, description, language, html_url: htmlUrl } = repository;
```

Object에서 필요한 Property를 꺼낸다. `html_url: htmlUrl`은 API의 Property 이름을 JavaScript에서 사용할 이름으로 바꾼다.

### 4.8 Template Literal

Backtick을 사용하면 여러 줄 String과 변수 삽입이 가능하다.

```js
const card = `<h3>${safeName}</h3>`;
```

API Data를 HTML에 넣을 때는 신뢰할 수 없는 문자가 Markup으로 해석되지 않도록 Escape가 필요하다.

---

## 5. DOM 선택과 변경

### 5.1 DOM 선택

```js
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".nav-list a");
```

- `querySelector()`: 처음 일치하는 Element 하나
- `querySelectorAll()`: 일치하는 Element 목록인 NodeList

### 5.2 DOM 변경 방법

- `textContent`: Text 변경
- `innerHTML`: 내부 Markup 교체
- `classList.add/remove/toggle`: Class 변경
- `setAttribute()`: Attribute 변경

```js
menuToggle.setAttribute("aria-expanded", String(isMenuOpen));
```

`isMenuOpen`은 Boolean이지만 HTML Attribute Value는 String으로 기록한다.

### 5.3 `textContent`와 `innerHTML`

`textContent`는 입력을 Text로 처리하므로 기본적으로 안전하다. `innerHTML`은 String을 HTML로 해석하므로 동적인 Card처럼 Markup 전체를 만들 때 편리하지만 외부 Data를 그대로 삽입하면 XSS 위험이 있다.

이 프로젝트는 GitHub API Data에 `escapeHtml()`을 적용한 뒤 `innerHTML`에 넣는다.

### 5.4 Event Listener

```js
menuToggle.addEventListener("click", () => {
  setMenuOpen(!isMenuOpen);
});
```

Event Listener는 지금 Function을 실행하는 코드가 아니다. 브라우저에 “앞으로 이 Event가 발생하면 이 Function을 호출해 달라”고 등록한다.

주요 Event는 다음과 같다.

- `click`: Button이나 Link 선택
- `input`: Input Value가 바뀜
- `submit`: Form 제출 시도
- `scroll`: 문서 Scroll 위치 변경
- `keydown`: Keyboard Key 누름
- `change`: Media Query 등의 상태 변경

### 5.5 Event Object와 `preventDefault()`

브라우저는 Event Handler에 Event Object를 전달한다.

```js
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
});
```

Form의 기본 동작은 Action URL로 이동하며 제출하는 것이다. `preventDefault()`는 기본 이동을 막고 JavaScript가 검증과 비동기 전송, DOM 업데이트를 제어하게 한다.

### 5.6 Event Delegation

GitHub API 응답 후 생기는 Retry와 Filter Button은 처음 Script가 실행될 때 존재하지 않거나 다시 생성된다. 부모 Element에 Listener를 두면 Event Bubbling을 이용해 자식의 Click을 처리할 수 있다.

```text
자식 Button click
→ Event가 부모로 전파
→ 부모 Listener 실행
→ event.target.closest()로 대상 확인
```

---

## 6. State와 Render

State는 현재 UI를 결정하는 JavaScript Data다.

```js
let isMenuOpen = false;
```

DOM을 State처럼 여기고 여기저기서 직접 확인하기보다 State를 먼저 바꾸고 Render Function이 DOM을 갱신하게 한다.

```text
Menu Button click                 Event
→ isMenuOpen = !isMenuOpen        State 변경
→ renderMenu()                    Render
→ active, aria-expanded 변경      DOM 업데이트
→ Menu 표시와 Icon 변경           화면 변화
```

### State와 DOM은 다르다

- State: JavaScript가 기억하는 현재 값
- DOM: 브라우저가 표현하는 문서 구조와 Attribute
- Screen: CSS까지 적용된 사용자가 보는 결과

State만 바꾸고 Render를 호출하지 않으면 화면은 바뀌지 않는다. DOM만 임시로 바꾸고 State를 갱신하지 않으면 다음 Render에서 서로 다른 결과가 생길 수 있다.

### React와의 연결

Vanilla JavaScript에서는 직접 `renderMenu()`를 호출하고 DOM을 수정한다. React는 State 변경 후 UI를 다시 계산하는 과정을 Library가 관리한다. 따라서 이 프로젝트의 Event → State → Render 이해가 React State 학습의 기반이 된다.

---

## 7. 동기와 비동기

### 7.1 동기(Synchronous)

동기 코드는 현재 작업이 끝난 뒤 다음 줄을 실행한다.

```js
const nextTheme = currentTheme === "light" ? "dark" : "light";
currentTheme = nextTheme;
renderTheme();
```

위 코드는 작성된 순서로 완료된다.

### 7.2 비동기(Asynchronous)

네트워크 요청, Timer, 사용자 Event는 결과가 나중에 도착한다. JavaScript가 응답이 올 때까지 브라우저 전체를 멈추면 Click이나 Scroll도 처리할 수 없으므로 기다리는 작업은 브라우저에 맡긴다.

```text
fetch 요청 시작
→ JavaScript는 다른 코드 실행 가능
→ Network 응답 도착
→ Promise 처리 작업 예약
→ Call Stack이 비면 이어서 실행
```

### 7.3 Call Stack과 Event Loop

- Call Stack: 현재 실행 중인 Function의 순서
- Web API: Browser가 처리하는 Timer, Network, DOM Event 등의 기능
- Queue: 나중에 실행할 Callback이 기다리는 곳
- Event Loop: Call Stack이 비었는지 확인하고 기다리는 작업을 실행으로 옮기는 과정

JavaScript 실행 Thread는 기본적으로 하나지만 Browser가 Network 작업까지 같은 방식으로 막아서 처리하는 것은 아니다.

### 7.4 Promise

Promise는 지금은 없지만 미래에 완료될 결과를 표현하는 객체다.

```text
pending   아직 완료되지 않음
fulfilled 성공적으로 완료됨
rejected  실패함
```

`fetch()`는 HTTP Response를 즉시 반환하지 않고 Promise를 반환한다.

### 7.5 `async`와 `await`

```js
const fetchProjects = async () => {
  const response = await fetch(GITHUB_API_URL);
  const repositories = await response.json();
};
```

- `async`: Function이 Promise를 반환하게 한다.
- `await`: Promise 결과가 정해질 때까지 해당 `async` Function의 나머지 실행을 보류한다.

`await`가 Browser 전체 JavaScript를 멈추는 것은 아니다. 해당 `async` Function 바깥의 Event는 계속 처리할 수 있다.

---

## 8. HTTP, API, JSON, fetch

### 8.1 Client와 Server

- Client: 현재 페이지를 실행하는 Browser
- Server: GitHub나 Formspree처럼 요청을 받고 응답하는 시스템
- API: Client와 Server가 Data를 주고받는 약속

```text
Browser Client
→ HTTP Request
→ GitHub API Server
→ HTTP Response
→ Browser Client
```

### 8.2 HTTP Request와 Response

Request에는 URL, Method, Header, Body 등이 포함될 수 있다.

- `GET`: Data 조회
- `POST`: Data 전송 또는 생성 요청

Response에는 Status Code, Header, Body가 포함된다.

- `200` 계열: 성공
- `400` 계열: Client 요청 문제 또는 권한·제한 문제
- `500` 계열: Server 문제

### 8.3 JSON

JSON은 Data 교환에 많이 사용하는 Text 형식이다.

```json
{
  "name": "codyssesy_b4_1",
  "language": "JavaScript"
}
```

`response.json()`도 Body를 모두 읽고 JavaScript Object로 변환하는 비동기 작업이므로 `await`가 필요하다.

### 8.4 `fetch()`

```js
const response = await fetch(GITHUB_API_URL);
```

`fetch()` Promise는 Network 자체가 실패하면 reject된다. 그러나 Server가 `404`나 `500`을 응답한 것은 HTTP 통신 자체는 완료된 것이므로 자동으로 reject되지 않는다.

```js
if (!response.ok) {
  throw new Error(`GitHub API 요청 실패: ${response.status}`);
}
```

따라서 `response.ok`를 직접 확인해야 Error UI로 보낼 수 있다.

### 8.5 `try`, `catch`, `finally`

```js
try {
  // 실패할 수 있는 비동기 처리
} catch (error) {
  // 실패 State 설정
} finally {
  // 성공과 실패 모두 실행할 DOM Render
}
```

- `try`: 정상 경로 시도
- `catch`: throw 또는 reject된 Error 처리
- `finally`: 결과와 관계없이 실행

이 프로젝트는 `finally`에서 `renderProjects()`를 호출해 마지막 State가 항상 DOM에 반영되게 한다.

### 8.6 API UI State

Network UI에는 성공 화면만 있으면 안 된다.

```text
idle     요청 전
loading  요청 중
success  Data가 있는 성공
empty    요청은 성공했지만 표시할 Data가 없음
error    요청 또는 Parsing 실패
```

```text
fetchProjects()
→ status = loading
→ renderProjects()
→ fetch와 JSON parsing
→ status = success / empty / error
→ renderProjects()
```

Loading Render를 요청 전에 실행하므로 느린 Network에서도 사용자는 현재 상황을 알 수 있다.

### 8.7 Rate Limit

GitHub API는 인증 없이 호출할 수 있지만 요청 횟수 제한이 있다. 짧은 시간에 계속 새로고침하면 `403` Response가 올 수 있다.

이 프로젝트는 다음 방식으로 대응한다.

- Frontend에 Token을 넣지 않는다.
- Language Filter 때 API를 다시 호출하지 않는다.
- 실패하면 Error UI와 Retry Button을 제공한다.

공개 JavaScript에 Token을 작성하면 누구나 Browser 개발자 도구와 Repository에서 볼 수 있으므로 Secret이 아니다.

---

## 9. Form 검증과 실제 전송

### 9.1 Client Validation

Client Validation은 빠른 사용자 Feedback을 위한 것이다.

```text
input
→ 해당 Field Value State 변경
→ Error 계산
→ Error Text와 aria-invalid 변경
```

```text
submit
→ preventDefault()
→ 모든 Field 검증
→ 오류가 있으면 첫 Field에 Focus
→ 유효하면 전송 시작
```

Client Validation만으로 보안을 보장할 수는 없다. 사용자는 Browser JavaScript를 우회할 수 있으므로 중요한 Service는 Server에서도 반드시 검증해야 한다.

### 9.2 Email Pattern

이 프로젝트의 정규 표현식은 기본적인 Email 형태를 검사한다.

```js
/^[^\s@]+@[^\s@]+\.[^\s@]+$/
```

완벽한 Email 존재 여부를 증명하지는 않는다. 사용자가 흔히 하는 형식 실수를 빠르게 찾는 수준이다.

### 9.3 FormData

```js
const formData = new FormData(contactForm);
```

Form 안에서 `name` Attribute가 있는 Field의 현재 값을 Key-Value 형태로 모은다.

### 9.4 Form 전송 State

```text
idle
→ validationError
→ submitting
→ success 또는 submissionError
```

전송 중 Button을 `disabled`로 만들어 중복 제출을 줄인다. 성공하면 Form과 State를 초기화하고 실패하면 입력값을 유지해 재시도할 수 있게 한다.

---

## 10. Browser API와 저장소

### 10.1 `localStorage`

`localStorage`는 Browser에 String Data를 저장하고 새로고침 후에도 유지한다.

```js
localStorage.setItem("portfolio-theme", currentTheme);
const storedTheme = localStorage.getItem("portfolio-theme");
```

이 프로젝트의 Theme 우선순위는 다음과 같다.

```text
유효한 사용자 저장값이 있음
→ 저장값 사용

저장값이 없음
→ prefers-color-scheme 사용
```

`localStorage`에는 Password나 Token 같은 Secret을 저장하지 않는다. 같은 Origin의 JavaScript에서 읽을 수 있기 때문이다.

### 10.2 `matchMedia()`

```js
window.matchMedia("(prefers-color-scheme: dark)");
```

CSS Media Query 조건을 JavaScript에서도 확인한다. `change` Event를 통해 System 설정이 실행 중 바뀌는 상황도 처리할 수 있다.

### 10.3 Intersection Observer

Scroll Event에서 매번 모든 Element 위치를 계산하는 대신 Browser에 특정 Element가 Viewport와 교차하는지 관찰해 달라고 요청한다.

```js
new IntersectionObserver(callback, { threshold: 0.2 });
```

`threshold: 0.2`는 관찰 대상의 약 20%가 교차할 때 Callback을 실행한다는 뜻이다. 한 번 표시한 Section은 `unobserve()`해 불필요한 관찰을 끝낸다.

---

## 11. 접근성 기초

접근성은 ARIA를 많이 추가하는 것이 아니라 다양한 입력과 출력 방식에서도 같은 정보와 기능을 사용할 수 있게 하는 것이다.

### 이 프로젝트의 주요 접근성 처리

- Semantic Tag와 Heading 계층
- Skip Link
- Form Label 연결
- 의미 있는 Image `alt`
- Keyboard Focus Style
- Mobile Menu의 `aria-expanded`, `aria-controls`, 동적 Label
- Escape로 열린 Menu 닫기와 Focus 복원
- API·Form 상태의 Live Region
- `aria-invalid`, `aria-describedby`
- `prefers-reduced-motion`
- Light/Dark 색상 대비

### `aria-label`은 화면에 보이는가?

일반적으로 화면 Text로 표시되지 않는다. Icon만 있는 Button의 접근 가능한 이름을 제공하며 Screen Reader와 Accessibility Tree에서 사용한다.

Menu State가 바뀌면 다음을 함께 변경한다.

```text
시각적 Icon: fa-bars ↔ fa-xmark
CSS 상태: active false ↔ true
보조 기술 상태: aria-expanded false ↔ true
접근 가능한 이름: 메뉴 열기 ↔ 메뉴 닫기
```

한 State에서 모두 Render해야 시각 정보와 접근성 정보가 어긋나지 않는다.

---

## 12. 보안 기초

### 12.1 XSS

XSS(Cross-Site Scripting)는 외부 입력이 HTML이나 Script로 해석되어 실행되는 문제다.

GitHub Repository 이름과 설명은 외부 API Data다. Template Literal로 `innerHTML`에 넣기 전에 `escapeHtml()`로 특수 문자를 Entity로 바꾼다.

```text
<  → &lt;
>  → &gt;
&  → &amp;
```

가능하다면 `textContent`를 우선 사용하고 Markup 생성이 필요할 때만 `innerHTML`을 신중하게 사용한다.

### 12.2 Frontend Secret

Browser로 전달되는 HTML, CSS, JavaScript는 사용자가 확인할 수 있다. 따라서 GitHub Token, Private API Key, Password를 Frontend Source에 넣으면 안 된다.

Formspree의 공개 Form Endpoint는 제출 위치를 식별하는 값이지 계정 전체 권한을 가진 Secret Key와는 역할이 다르다.

---

## 13. Git과 GitHub Pages

### Git 기본 흐름

```text
Working Directory에서 파일 수정
→ git add로 Staging Area에 선택
→ git commit으로 변경 이력 저장
→ git push로 GitHub Remote에 전송
```

- Commit: 의미가 있는 변경 단위와 Snapshot
- Branch: 독립적인 Commit 흐름을 가리키는 이름
- Remote: GitHub 같은 외부 Repository

### GitHub Pages

이 프로젝트는 Build가 필요 없는 정적 사이트다.

```text
main Branch Push
→ GitHub Pages Build와 Deployment
→ Root의 index.html 제공
→ CSS, JavaScript, Image 요청
```

Project Site URL에는 Repository 이름이 포함된다.

```text
https://heejeong13.github.io/codyssesy_b4_1/
```

따라서 `/css/style.css` 같은 Domain Root 절대경로보다 `css/style.css` 같은 Project 기준 상대경로를 사용한다.

---

## 14. 이 프로젝트의 핵심 흐름 네 가지

### 14.1 Mobile Menu

```text
click
→ isMenuOpen 변경
→ renderMenu()
→ active, aria-expanded, aria-label, Icon Class 변경
→ Navigation 표시 또는 숨김
```

### 14.2 Theme

```text
click
→ currentTheme 변경
→ localStorage 저장
→ renderTheme()
→ data-theme 변경
→ CSS Variable 변경
→ 전체 색상 변경
```

### 14.3 GitHub Projects

```text
페이지 초기화 또는 Retry click
→ status = loading
→ Loading DOM
→ fetch + await
→ success / empty / error
→ renderProjects()
→ Card 또는 상태 DOM
```

### 14.4 Contact Form

```text
input / submit
→ formState.values와 errors 변경
→ renderFieldError() / renderFormStatus()
→ Text, aria-invalid, Button 상태 변경
→ 사용자 Feedback
```

---

## 15. 공부할 때 사용하는 설명 틀

새로운 코드를 볼 때 다음 순서로 설명한다.

1. 어떤 DOM을 선택했는가?
2. 어떤 Event를 기다리는가?
3. Event가 발생하면 어떤 State가 바뀌는가?
4. 어느 Render Function을 호출하는가?
5. DOM의 Class, Attribute, Text, HTML 중 무엇이 바뀌는가?
6. 어떤 CSS Rule이 적용되어 화면이 바뀌는가?
7. 실패하거나 값이 없을 때는 어떻게 되는가?
8. Keyboard와 Screen Reader에서도 같은 의미가 전달되는가?

예를 들어 Theme 기능은 다음처럼 답한다.

```text
theme-toggle Button을 선택한다.
click Event를 등록한다.
currentTheme을 light와 dark 사이에서 변경한다.
선택값을 localStorage에 저장한다.
renderTheme()이 html의 data-theme을 변경한다.
[data-theme="dark"] CSS Variable이 적용된다.
Button의 aria-label과 Icon도 같은 State에서 변경한다.
```

---

## 16. 스스로 확인할 핵심 질문

1. HTML과 DOM은 무엇이 다른가?
2. Semantic Tag를 사용하면 누구에게 어떤 정보가 전달되는가?
3. `class`와 `id`는 각각 언제 사용하는가?
4. `aria-label`과 화면 Text는 무엇이 다른가?
5. `box-sizing: border-box`가 크기 계산을 어떻게 바꾸는가?
6. Flexbox와 Grid를 각각 선택한 이유는 무엇인가?
7. Mobile First는 CSS 작성 순서를 어떻게 바꾸는가?
8. `const` Object의 Property는 왜 변경할 수 있는가?
9. `map`, `filter`, `forEach`의 결과 차이는 무엇인가?
10. Event Listener는 등록 시점과 실행 시점이 어떻게 다른가?
11. State를 먼저 바꾸고 Render Function을 호출하는 이유는 무엇인가?
12. 동기 코드와 비동기 코드는 실행 흐름이 어떻게 다른가?
13. Promise의 세 상태는 무엇인가?
14. `await`가 Browser 전체를 멈추지 않는다는 말은 무슨 뜻인가?
15. `fetch()`에서 `response.ok`를 확인해야 하는 이유는 무엇인가?
16. Loading, Empty, Error를 Success와 따로 관리해야 하는 이유는 무엇인가?
17. Language Filter 때 API를 다시 호출하지 않는 이유는 무엇인가?
18. Client Form Validation만으로 보안을 보장할 수 없는 이유는 무엇인가?
19. `innerHTML`에 API Data를 넣을 때 Escape가 필요한 이유는 무엇인가?
20. Frontend Source에 Token을 저장하면 안 되는 이유는 무엇인가?

이 질문에 프로젝트의 실제 변수명과 Function 이름을 사용해 답할 수 있다면 이 프로젝트의 핵심 기초를 이해한 것이다.

### 16.1 HTML과 DOM은 무엇이 다른가?

HTML은 문서의 구조와 내용을 작성한 Markup 원본이다. DOM은 Browser가 HTML을 Parsing한 뒤 JavaScript가 읽고 변경할 수 있도록 Memory에 만든 Object Tree다.

JavaScript에서 `textContent`, `classList`, `setAttribute()`를 사용하면 현재 DOM이 바뀌고 화면이 다시 그려진다. 이 변경은 Browser 안의 현재 문서에 적용되는 것이며 `index.html` 파일 자체를 수정하지는 않는다.

### 16.2 Semantic Tag를 사용하면 누구에게 어떤 정보가 전달되는가?

Semantic Tag는 개발자에게 코드 구조를, 검색 엔진에게 문서의 콘텐츠 구조를, Screen Reader에게 영역의 역할을 전달한다.

예를 들어 `<nav>`는 단순한 Box가 아니라 Navigation 영역임을 나타내고 `<main>`은 핵심 콘텐츠를 나타낸다. 이 정보는 Browser가 Accessibility Tree를 만들 때도 사용된다.

### 16.3 `class`와 `id`는 각각 언제 사용하는가?

`class`는 여러 Element가 같은 Style이나 역할을 공유할 때 사용한다. Project Card처럼 반복되는 Element에 적합하다.

`id`는 문서에서 하나의 Element를 고유하게 식별할 때 사용한다. Form의 `label for` 연결, `aria-labelledby`, `#projects` Fragment 이동처럼 정확히 하나를 가리켜야 할 때 사용한다.

### 16.4 `aria-label`과 화면 Text는 무엇이 다른가?

화면 Text는 시각적으로 표시되며 일반적으로 접근 가능한 이름으로도 사용된다. `aria-label`은 보통 화면에는 표시되지 않고 Accessibility Tree에서 Element의 이름을 제공하거나 기존 이름을 덮어쓴다.

이 Project의 Icon Button은 눈으로는 Moon이나 Menu Icon이 보이지만 Screen Reader는 모양의 의미를 알 수 없다. 그래서 `aria-label="다크 모드로 전환"`, `aria-label="메뉴 열기"`를 제공하고 State가 바뀌면 Label도 함께 변경한다.

### 16.5 `box-sizing: border-box`가 크기 계산을 어떻게 바꾸는가?

기본 `content-box`에서는 설정한 Width가 Content만 의미하고 Padding과 Border가 바깥에 추가된다. 따라서 실제 Box가 지정한 Width보다 커질 수 있다.

`border-box`에서는 설정한 Width 안에 Content, Padding, Border가 포함된다. 반응형 Layout에서 Element의 실제 크기를 예측하기 쉬워져 전체 Element와 `::before`, `::after`에 공통 적용했다.

### 16.6 Flexbox와 Grid를 각각 선택한 이유는 무엇인가?

Flexbox는 한 축의 배치와 정렬에 적합하다. Navigation Link, Button 내부, Project Card 내부처럼 가로 또는 세로 방향으로 순서와 간격을 다루는 곳에 사용했다.

Grid는 행과 열 또는 반복되는 Column Layout에 적합하다. Projects와 Skills처럼 여러 Card를 2차원으로 배치하는 곳에 사용했다. Projects의 `auto-fit`과 `minmax()`는 화면 너비에 맞춰 Column 수를 자동으로 조절한다.

### 16.7 Mobile First는 CSS 작성 순서를 어떻게 바꾸는가?

Mobile First에서는 가장 좁은 화면의 Style을 Media Query 밖의 기본 Rule로 먼저 작성한다. 그다음 `min-width: 768px`, `min-width: 1024px`에서 넓은 화면에 필요한 Layout만 추가한다.

이 Project는 Mobile의 숨겨진 Navigation과 Hamburger Button을 기본으로 하고 Tablet부터 Navigation 표시와 Skills 2열, Desktop에서 Skills 4열을 추가한다.

### 16.8 `const` Object의 Property는 왜 변경할 수 있는가?

`const`는 변수에 다른 값을 다시 대입하지 못하게 한다. Object를 `const`로 선언하면 변수가 같은 Object Reference를 계속 가리키게 할 뿐 Object 내부 Property까지 불변으로 만들지는 않는다.

따라서 `projectsState = 다른객체`는 할 수 없지만 `projectsState.status = "loading"`은 가능하다. 내부 변경까지 막으려면 별도의 불변 처리 방식이 필요하다.

### 16.9 `map`, `filter`, `forEach`의 결과 차이는 무엇인가?

- `map()`: 각 요소를 변환해 원본과 길이가 같은 새 Array를 반환한다. Repository를 Card HTML로 바꿀 때 사용한다.
- `filter()`: 조건이 true인 요소만 포함한 새 Array를 반환한다. 선택한 언어의 Repository를 추릴 때 사용한다.
- `forEach()`: 각 요소에 동작을 실행하지만 새 Array를 반환하지 않는다. 여러 Navigation Link에 Listener를 등록할 때 사용한다.

세 Method 모두 목적이 다르므로 반환 결과가 필요한지와 어떤 결과를 만들려는지를 기준으로 선택한다.

### 16.10 Event Listener는 등록 시점과 실행 시점이 어떻게 다른가?

`addEventListener()`를 실행하는 시점에는 Callback을 Browser에 등록할 뿐 Callback 내용이 바로 실행되지는 않는다.

이후 사용자가 Click하거나 Input하는 등 지정한 Event가 실제로 발생하면 Browser가 Callback을 호출한다. 예를 들어 페이지 초기화 때 Menu Click Listener를 등록하고, `isMenuOpen`은 사용자가 Button을 누른 시점에 변경된다.

### 16.11 State를 먼저 바꾸고 Render Function을 호출하는 이유는 무엇인가?

State를 UI의 단일 기준으로 사용하기 위해서다. Event Handler가 State를 변경하고 Render Function이 State를 읽어 DOM을 갱신하면 화면이 왜 현재 모습인지 Data로 추적할 수 있다.

Menu에서는 `isMenuOpen`을 먼저 변경한 뒤 `renderMenu()`가 `active`, `aria-expanded`, Icon을 함께 바꾼다. 여러 곳에서 DOM을 각각 직접 바꾸면 시각적 상태와 접근성 상태가 서로 달라질 수 있다.

### 16.12 동기 코드와 비동기 코드는 실행 흐름이 어떻게 다른가?

동기 코드는 현재 작업이 완료된 뒤 다음 줄로 이동한다. Theme 값 계산과 `renderTheme()` 호출 같은 일반적인 코드는 작성 순서에 따라 실행된다.

비동기 작업은 결과가 나중에 도착한다. Network 요청을 Browser에 맡긴 뒤 JavaScript는 다른 Event를 처리할 수 있고, Response가 도착하면 중단했던 `async` Function의 다음 작업이 이어진다.

### 16.13 Promise의 세 상태는 무엇인가?

- `pending`: 아직 결과가 정해지지 않은 상태
- `fulfilled`: 작업이 성공해 결과가 정해진 상태
- `rejected`: 작업이 실패해 Error가 정해진 상태

한 번 fulfilled 또는 rejected가 된 Promise는 다시 pending으로 돌아가거나 다른 완료 상태로 바뀌지 않는다.

### 16.14 `await`가 Browser 전체를 멈추지 않는다는 말은 무슨 뜻인가?

`await`는 현재 `async` Function의 나머지 실행만 Promise 결과가 나올 때까지 보류한다. Main Thread가 Network Response를 기다리며 계속 막혀 있는 것이 아니다.

따라서 GitHub API 응답을 기다리는 동안에도 Browser는 화면을 그리고 사용자의 Scroll이나 다른 Button Event를 처리할 수 있다. Promise가 완료되면 Event Loop를 통해 해당 Function의 다음 부분이 실행된다.

### 16.15 `fetch()`에서 `response.ok`를 확인해야 하는 이유는 무엇인가?

`fetch()`는 Network 연결 자체가 실패하면 reject되지만 Server가 403, 404, 500 Response를 정상적으로 보내면 Promise가 fulfilled될 수 있다.

따라서 HTTP 요청이 성공 범위인지 `response.ok`로 직접 확인해야 한다. false일 때 `throw`해야 `catch`로 이동해 Error State와 Retry UI를 표시할 수 있다.

### 16.16 Loading, Empty, Error를 Success와 따로 관리해야 하는 이유는 무엇인가?

세 상태는 원인과 사용자가 취할 행동이 다르기 때문이다.

- Loading: 아직 기다려야 한다.
- Empty: 요청은 성공했지만 표시할 Data가 없다.
- Error: 요청에 실패했으므로 Retry가 필요하다.
- Success: Data를 Card로 볼 수 있다.

모두 빈 화면으로 처리하면 사용자는 현재 요청 중인지, Data가 없는지, 실패했는지 판단할 수 없다.

### 16.17 Language Filter 때 API를 다시 호출하지 않는 이유는 무엇인가?

이미 `projectsState.repositories`에 전체 Repository를 저장했기 때문이다. Filter Button은 `selectedLanguage`만 바꾸고 저장된 Array에 `filter()`를 적용하면 된다.

이 방식은 불필요한 Network 지연과 GitHub API Rate Limit 소비를 줄이고 Filter Event → State → Render 흐름을 명확하게 만든다.

### 16.18 Client Form Validation만으로 보안을 보장할 수 없는 이유는 무엇인가?

Client JavaScript는 사용자가 개발자 도구로 변경하거나 비활성화할 수 있고, HTTP 요청을 Form UI 없이 직접 만들 수도 있다.

따라서 Client Validation은 빠른 UX Feedback을 위한 것이며 중요한 Data의 형식, 권한, 위험 여부는 Server에서도 다시 검증해야 한다.

### 16.19 `innerHTML`에 API Data를 넣을 때 Escape가 필요한 이유는 무엇인가?

`innerHTML`은 String을 단순 Text가 아니라 HTML Markup으로 해석한다. 외부 Data에 `<script>`나 Event Attribute 같은 문자열이 포함되면 의도하지 않은 HTML이나 Script로 실행될 위험이 있다.

이 Project는 GitHub의 이름, 설명, 언어, URL을 `escapeHtml()`로 변환해 특수 문자를 Text Entity로 만든 뒤 Card HTML에 넣는다. Markup이 필요 없다면 `textContent`를 사용하는 것이 더 안전하다.

### 16.20 Frontend Source에 Token을 저장하면 안 되는 이유는 무엇인가?

Browser가 실행하는 HTML, CSS, JavaScript는 사용자에게 다운로드되므로 개발자 도구, Network Tab, Source Map, GitHub Repository에서 확인할 수 있다.

따라서 Frontend에 넣은 Token은 Secret으로 보호되지 않는다. 권한이 있는 Token은 Server 환경 변수에 보관하고 Server가 필요한 API를 대신 호출해야 한다. 이 Project의 GitHub API는 공개 요청을 사용하며 Token을 Source에 넣지 않았다.

---

### 16번 활용 방법

각 답변을 다음 순서로 말하는 연습을 한다.

```text
한 문장 정의
→ 왜 필요한지
→ 이 Project에서 사용한 실제 예시
→ 주의점 또는 다른 방식과의 차이
```

문장을 통째로 암기하기보다 `isMenuOpen`, `renderMenu()`, `projectsState`, `fetchProjects()`처럼 실제 코드의 이름을 포함해 자신의 말로 설명하는 것이 중요하다.
