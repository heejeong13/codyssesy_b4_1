# B4-1 평가 질문 답변 가이드

이 문서는 평가 화면의 항목 1~4에 답하기 위한 말하기용 가이드다.

- 항목 1은 실제 구현 코드의 실행 흐름을 중심으로 설명한다.
- 항목 2~4는 개념의 정의, 선택 이유, 장점과 Project 연결 순으로 설명한다.
- 답변을 그대로 외우기보다 굵은 흐름을 기억한 뒤 실제 Function과 State 이름을 사용한다.

---

## 항목 1. 실제 기능 구현과 동작 확인

### 1. 브라우저 창 크기를 줄였을 때 레이아웃이 모바일에 맞게 변경되는가?

#### 답변

이 기능은 JavaScript Event로 화면 크기를 감시하는 방식이 아니라 CSS의 Mobile First Rule과 Media Query로 구현했습니다.

기본 CSS는 768px 미만의 Mobile 화면을 기준으로 작성했습니다. Mobile에서는 Navigation을 숨기고 Hamburger Button을 표시하며, Section과 Card를 좁은 화면에 맞게 배치합니다.

화면이 768px 이상이 되면 `@media (min-width: 768px)`가 적용됩니다. 이때 Hamburger Button은 숨기고 Navigation을 가로로 표시하며 Skills를 2열로 변경합니다. 1024px 이상에서는 `@media (min-width: 1024px)`가 적용되어 제목과 여백이 커지고 Skills가 4열이 됩니다.

Projects는 다음 Grid Rule을 사용합니다.

```css
grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
```

브라우저 너비가 변경되면 CSS Media Query 조건과 Grid에 들어갈 Column 수를 브라우저가 다시 계산하므로 별도의 Resize Event나 JavaScript State 없이 화면에 맞는 Layout이 만들어집니다.

#### 코드 흐름

```text
브라우저 Viewport 너비 변경
→ 브라우저가 Media Query 조건 재평가
→ 768px / 1024px Rule 적용 또는 해제
→ display와 grid-template-columns 재계산
→ Navigation, Skills, Projects Layout 변경
```

#### 핵심 확인값

```text
Mobile          → Hamburger 표시, Navigation 숨김
768px 이상      → Hamburger 숨김, Navigation 표시, Skills 2열
1024px 이상     → Skills 4열
Projects        → 너비에 따라 Card Column 자동 조절
```

---

### 2. 테마 토글 버튼 클릭 시 다크·라이트 모드가 전환되고 새로고침 후에도 유지되는가?

#### 답변

현재 Theme은 `currentTheme` State로 관리합니다. Theme Button의 `click` Event가 발생하면 `light`와 `dark` 값을 반대로 바꾸고, 사용자가 직접 선택했다는 상태를 기록합니다.

변경한 Theme은 `localStorage`의 `portfolio-theme` Key에 저장한 다음 `renderTheme()`을 호출합니다. `renderTheme()`은 `<html>`의 `data-theme` Attribute, Button의 `aria-pressed`, `aria-label`, Font Awesome Icon Class를 한 번에 변경합니다.

CSS에는 `[data-theme="dark"]` Rule이 있고 이 Rule에서 배경색, 글자색 등 CSS Variable의 Value를 Dark용으로 교체합니다. 따라서 각 Component의 Style을 JavaScript로 직접 바꾸지 않아도 전체 화면의 색상이 변경됩니다.

페이지가 다시 열리면 Script 초기화 단계에서 `localStorage.getItem()`으로 저장값을 먼저 읽습니다. 유효한 `light` 또는 `dark`가 있으면 저장값을 사용하고, 저장값이 없을 때만 `prefers-color-scheme`의 System Theme을 사용합니다. 마지막에 `renderTheme()`을 호출하므로 새로고침 후에도 같은 Theme이 복원됩니다.

#### 코드 흐름

```text
Theme Button click
→ currentTheme을 light ↔ dark로 변경
→ hasUserThemePreference = true
→ localStorage에 currentTheme 저장
→ renderTheme()
→ html의 data-theme 변경
→ [data-theme="dark"] CSS Variable 적용
→ 전체 화면 색상, Button 설명, Icon 변경
```

```text
페이지 새로고침
→ localStorage에서 portfolio-theme 조회
→ 저장값이 있으면 currentTheme으로 사용
→ 저장값이 없으면 prefers-color-scheme 사용
→ renderTheme()
→ 저장했던 화면 복원
```

#### 핵심 코드

```js
themeToggle.addEventListener("click", () => {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  hasUserThemePreference = true;
  localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
  renderTheme();
});
```

---

### 3. 햄버거 메뉴, 스크롤 애니메이션, 맨 위로 가기 버튼 등이 정상 동작하는가?

#### 햄버거 메뉴 답변

Hamburger Button의 `click` Event가 발생하면 `setMenuOpen(!isMenuOpen)`을 호출합니다. `setMenuOpen()`은 `isMenuOpen` State를 변경한 다음 `renderMenu()`를 호출합니다.

`renderMenu()`은 Navigation의 `active` Class, Button의 `aria-expanded`와 `aria-label`, Menu Icon Class를 같은 State에서 변경합니다. CSS는 `.site-navigation.active`를 보고 Navigation을 표시합니다.

```text
Hamburger click
→ isMenuOpen 반전
→ renderMenu()
→ active, aria-expanded, aria-label, Icon Class 변경
→ CSS가 Navigation 표시 또는 숨김
```

Menu가 열린 상태에서 Navigation Link를 선택하거나 Escape를 누르면 `setMenuOpen(false)`를 호출해 같은 닫기 흐름을 재사용합니다.

#### 스크롤 애니메이션 답변

각 Section의 제목을 `IntersectionObserver`로 관찰합니다. 관찰 대상의 20% 이상이 Viewport와 교차하면 Callback이 실행되고 가장 가까운 Section에 `is-visible` Class를 추가합니다.

CSS는 `reveal-section`의 처음 상태를 투명하고 아래쪽에 배치하며, `is-visible`이 추가되면 원래 위치와 불투명도로 Transition합니다. 한 번 표시된 대상은 `unobserve()`하여 불필요한 관찰을 끝냅니다.

```text
Section 제목이 Viewport와 20% 교차
→ IntersectionObserver Callback
→ section.classList.add("is-visible")
→ CSS opacity와 transform Transition
→ Section이 나타남
```

#### 맨 위로 가기 답변

Window의 `scroll` Event에서는 `handleScroll()`을 호출합니다. 현재 `scrollY`가 300px 이상인지 계산하고 이전 값과 달라졌을 때만 `isScrollTopVisible` State를 변경합니다.

`renderScrollTopButton()`은 `is-visible` Class를 Toggle하고 CSS가 Button의 표시 상태를 변경합니다. Button을 선택하면 `window.scrollTo()`로 문서 위쪽으로 이동합니다.

```text
Window scroll
→ scrollY >= 300 계산
→ isScrollTopVisible 변경
→ renderScrollTopButton()
→ is-visible Class 변경
→ Button 표시 또는 숨김
```

```text
Scroll-to-Top Button click
→ window.scrollTo({ top: 0 })
→ 화면 최상단 이동
```

사용자가 `prefers-reduced-motion: reduce`를 설정했다면 Smooth 대신 즉시 이동하도록 `getScrollBehavior()`가 `auto`를 반환합니다.

---

### 4. GitHub API 데이터를 불러와 표시하고 Loading, Error, Empty 상태가 구분되는가?

#### 답변

GitHub 관련 State는 `projectsState` 객체에서 `status`, `repositories`, `selectedLanguage`로 관리합니다.

페이지 초기화 때 `fetchProjects()`를 호출합니다. 먼저 `status`를 `loading`으로 바꾸고 `renderProjects()`를 호출하므로 Network 응답을 기다리는 동안 Loading UI가 표시됩니다.

그다음 `fetch()`와 `await`로 GitHub API Response를 기다립니다. `fetch()`는 403이나 500에서도 자동으로 실패 처리되지 않기 때문에 `response.ok`를 직접 검사하고, false이면 Error를 발생시킵니다.

응답이 성공하면 `response.json()`으로 Repository 배열을 얻습니다. 배열에 Data가 있으면 `success`, 빈 배열이면 `empty` State로 변경합니다. Network나 HTTP 오류는 `catch`에서 `error` State로 변경합니다. `finally`의 `renderProjects()`가 마지막 State를 DOM에 반영합니다.

#### 코드 흐름

```text
페이지 초기화 또는 Retry click
→ fetchProjects()
→ projectsState.status = "loading"
→ renderProjects()
→ Loading DOM 표시
→ await fetch(GITHUB_API_URL)
→ response.ok 검사
→ await response.json()
```

```text
Repository가 있음
→ status = "success"
→ map(createProjectCard)
→ Project Card DOM

Repository 배열이 비어 있음
→ status = "empty"
→ Empty Message DOM

Network 또는 HTTP 실패
→ catch
→ status = "error"
→ Error Message와 Retry Button DOM
```

Retry Button은 API 상태에 따라 동적으로 생성되므로 `projectsView` 부모에 Event Listener를 두는 Event Delegation을 사용합니다. Retry를 선택하면 기존 `fetchProjects()`를 다시 호출해 같은 상태 흐름을 재사용합니다.

#### 핵심 State

```js
const projectsState = {
  status: "idle",
  repositories: [],
  selectedLanguage: "All",
};
```

---

### 5. 필수 입력값 누락 또는 이메일 형식 오류 시 즉각적인 Feedback이 표시되는가?

#### 답변

Form의 각 Input과 Textarea에 `input` Event Listener를 등록했습니다. 사용자가 입력할 때마다 `updateFieldState()`가 현재 Value를 Trim해서 `formState.values`에 저장하고 `getFieldError()`로 오류 Message를 계산해 `formState.errors`에 저장합니다.

그다음 `renderFieldError()`가 해당 Field의 `aria-invalid`와 가까운 Error Element의 `textContent`를 변경합니다. 따라서 잘못 입력했을 때와 올바르게 수정했을 때 Feedback이 즉시 바뀝니다.

Form 제출 시에는 `event.preventDefault()`로 기본 페이지 이동을 막고 `validateForm()`으로 모든 Field를 다시 검증합니다. 오류가 있으면 `validationError` State를 표시하고 첫 오류 Field로 Focus를 이동합니다.

오류가 없을 때만 `FormData`를 만들고 Formspree 전송을 시작합니다.

#### 코드 흐름

```text
Field input
→ updateFieldState(field)
→ formState.values 변경
→ 필수값과 Email Pattern 검사
→ formState.errors 변경
→ renderFieldError(field)
→ aria-invalid와 Error Text 변경
```

```text
Form submit
→ preventDefault()
→ validateForm()
→ 모든 Field State와 Error DOM 갱신
→ 오류가 있으면 validationError + 첫 Field Focus
→ 오류가 없으면 Formspree 전송
```

Email 검사는 기본적인 `문자@문자.문자` 형태를 정규 표현식으로 확인합니다. 실제 Email 존재 여부가 아니라 흔한 형식 오류를 빠르게 안내하기 위한 Client Validation입니다.

---

## 항목 2. 구조와 기본 구현 원칙

### 1. HTML, CSS, JavaScript를 각각의 파일로 분리한 이유와 각 파일의 역할은 무엇인가?

#### 말하기 답변

HTML은 문서의 구조와 의미, CSS는 Layout과 시각적 표현, JavaScript는 Event 처리와 State 변경을 담당하도록 관심사를 분리했습니다.

`index.html`에는 Header, Navigation, Section, Form 같은 콘텐츠 구조를 작성했습니다. `css/style.css`에는 색상, 크기, Flexbox, Grid, 반응형, Dark Theme을 작성했습니다. `js/main.js`에는 DOM 선택, Event Listener, State, Render Function, API 호출을 작성했습니다.

이렇게 분리하면 Markup을 수정할 때 동작 코드를 불필요하게 건드리지 않아도 되고, Style이나 기능의 위치를 쉽게 찾을 수 있습니다. Browser Cache와 여러 페이지에서의 파일 재사용에도 유리합니다. 핵심은 단순히 파일 개수를 늘리는 것이 아니라 각 파일의 책임을 구분해 유지보수성과 가독성을 높이는 것입니다.

---

### 2. Semantic Tag를 사용한 기준은 무엇인가?

#### 말하기 답변

화면 모양이 아니라 콘텐츠가 문서에서 담당하는 역할을 기준으로 Tag를 선택했습니다.

- `<header>`: Logo와 주요 Navigation이 있는 페이지 머리말
- `<nav>`: Section으로 이동하는 주요 Link 집합
- `<main>`: 페이지의 핵심 콘텐츠
- `<section>`: Hero, About, Skills, Projects, Contact처럼 제목이 있는 주제별 영역
- `<article>`: 각각 독립적으로 이해할 수 있는 Project Card
- `<footer>`: 저작권과 Social Link

Semantic Tag를 사용하면 개발자가 구조를 빠르게 이해할 수 있고 검색 엔진과 Screen Reader에도 영역의 의미가 전달됩니다. 단순한 Style 묶음처럼 별도의 의미가 없을 때만 `<div>`를 사용했습니다.

---

### 3. CSS Variable을 사용한 이유와 장점은 무엇인가?

#### 말하기 답변

색상, Font, 간격, 그림자처럼 반복되는 Design Value를 `:root`의 CSS Variable로 정의했습니다. 같은 색상을 여러 Selector에 직접 반복하지 않고 `var()`로 참조하므로 값을 한 곳에서 바꾸면 사용하는 모든 Component에 일관되게 반영됩니다.

특히 Dark Mode에서 장점이 큽니다. `[data-theme="dark"]`에서는 Component Rule을 다시 작성하지 않고 같은 Variable의 Value만 Dark용으로 교체합니다. 따라서 중복 Style을 줄이고 Light와 Dark Theme 사이의 역할과 대비를 관리하기 쉽습니다.

Variable 이름도 단순한 색상 이름보다 `--color-background`, `--color-text`처럼 용도를 나타내게 작성해 코드의 의미를 분명하게 했습니다.

---

### 4. `onclick` 대신 `addEventListener()`를 사용한 이유는 무엇인가?

#### 말하기 답변

`onclick` HTML Attribute는 구조와 동작 코드가 섞이고 Global Scope의 Function 이름에 의존하기 쉽습니다. 또한 하나의 Event에 여러 Handler를 연결하거나 조건에 따라 Listener를 관리하기 불편합니다.

`addEventListener()`를 사용하면 HTML은 구조만 담당하고 JavaScript에서 DOM을 선택한 뒤 Event와 Handler를 연결할 수 있습니다. 같은 Event에도 여러 Listener를 등록할 수 있고 `removeEventListener()`로 해제할 수도 있습니다. Event Object를 받아 `preventDefault()`, `target`, Keyboard 정보 등을 처리하기도 자연스럽습니다.

이 Project에서는 Button과 Form에 Inline JavaScript를 작성하지 않고 `main.js`에서 `click`, `input`, `submit`, `scroll`, `keydown` Event를 일관되게 관리했습니다.

---

## 항목 3. JavaScript 흐름과 Layout 선택

### 1. Event → State 변경 → 화면 Update 흐름을 설명할 수 있는가?

#### 말하기 답변: Dark Mode 예시

Event는 사용자의 Theme Button `click`입니다. Handler에서 `currentTheme` State를 `light`와 `dark` 사이에서 변경하고 `localStorage`에 저장합니다.

그다음 `renderTheme()`을 호출합니다. 이 Function은 `<html>`의 `data-theme`, Button의 `aria-pressed`, `aria-label`, Icon Class를 변경합니다. CSS의 `[data-theme="dark"]` Rule이 적용되면서 CSS Variable이 바뀌고 전체 화면 색상이 변경됩니다.

```text
click Event
→ currentTheme State 변경
→ renderTheme()
→ data-theme DOM Attribute 변경
→ CSS Variable 변경
→ 화면 색상 변경
```

Event Handler가 각 Component의 색상을 직접 바꾸는 것이 아니라 State를 변경하고 Render Function이 DOM을 갱신한다는 점이 핵심입니다.

---

### 2. `async/await`과 `try/catch`로 API 성공과 실패를 어떻게 처리했는가?

#### 말하기 답변

`fetchProjects()`를 `async` Function으로 만들고 `await fetch()`로 GitHub Response를 기다렸습니다. `await`는 해당 Function의 다음 실행을 보류하지만 Browser 전체를 멈추지는 않으므로 기다리는 동안 다른 Click이나 Scroll Event를 처리할 수 있습니다.

`fetch()`는 HTTP 403이나 500을 자동으로 reject하지 않기 때문에 `response.ok`를 검사하고 false이면 `throw`합니다. 성공하면 `await response.json()`으로 Body를 Array로 변환합니다.

Data가 있으면 `success`, 빈 Array이면 `empty`로 상태를 정합니다. Network 실패나 직접 발생시킨 HTTP Error는 `catch`에서 `error` State로 바꾸고 Repository를 비웁니다. `finally`에서는 결과와 상관없이 `renderProjects()`를 호출해 최종 State를 화면에 반영합니다.

---

### 3. `map`, `filter`로 GitHub Data를 Card UI로 바꾸는 과정은 무엇인가?

#### 말하기 답변

GitHub API에서 받은 원본 Repository Array는 `projectsState.repositories`에 보관합니다.

Language Button을 선택하면 `selectedLanguage` State를 변경합니다. `getFilteredRepositories()`는 `All`일 때 원본을 그대로 반환하고, 특정 언어일 때 `filter()`로 조건이 맞는 Repository만 포함된 새 Array를 만듭니다. 이 과정에서는 원본 Array를 변경하거나 API를 다시 호출하지 않습니다.

그다음 `map(createProjectCard)`이 각 Repository Object를 Card HTML String으로 변환합니다. `join("")`으로 String들을 하나로 합친 뒤 Projects Container의 `innerHTML`에 넣습니다.

```text
GitHub Repository Array
→ filter()로 선택 언어만 추출
→ map()으로 각 Object를 Card HTML로 변환
→ join("")
→ innerHTML
→ Card UI 표시
```

Repository Object에서는 Destructuring으로 이름, 설명, 언어, 별 개수, URL을 꺼내며 외부 문자열은 `escapeHtml()`을 거쳐 XSS 위험을 줄입니다.

---

### 4. Flexbox와 Grid를 어디에 적용했고 왜 선택했는가?

#### 말하기 답변

Flexbox는 한 방향의 배치와 정렬에 적합해서 Navigation Link, Button 내부 Icon, Project Card 내부처럼 가로 또는 세로 한 축을 중심으로 정렬하는 곳에 사용했습니다.

Grid는 행과 열의 2차원 Layout과 반복되는 Card 배치에 적합해서 Projects와 Skills에 사용했습니다. Projects에서는 `auto-fit`과 `minmax()`를 사용해 화면 너비에 따라 Column 수가 자동으로 바뀌게 했습니다.

정리하면 Flexbox는 한 축의 순서와 정렬, Grid는 행과 열 또는 반복 Column 구조를 기준으로 선택했습니다. 둘 중 하나가 항상 더 좋은 것이 아니라 해결하려는 Layout의 차원과 반복 구조를 기준으로 결정했습니다.

---

## 항목 4. 상태 설계와 Mobile First

### 1. State 객체를 따로 만들어 관리한 이유는 무엇이며 그냥 변수로 처리하면 안 되는가?

#### 말하기 답변

단일 Boolean처럼 값 하나만 필요한 기능은 `isMenuOpen` 같은 변수로 관리해도 충분합니다. 하지만 GitHub Projects와 Contact Form은 서로 관련된 여러 값이 함께 하나의 화면 상태를 결정합니다.

`projectsState`에는 요청 단계, Repository 목록, 선택 언어가 함께 있고 `formState`에는 Field Value, Field별 Error, 제출 상태가 함께 있습니다. 이를 State 객체로 묶으면 어떤 Data가 한 기능에 속하는지 명확하고 Render Function에 필요한 현재 상태를 한곳에서 확인할 수 있습니다.

여러 개의 흩어진 변수로도 기능을 만들 수는 있지만 값 사이의 관계를 놓치거나 일부만 변경해 DOM과 상태가 어긋날 가능성이 커집니다. 따라서 “변수로 하면 안 된다”기보다 단순 State는 변수, 관련 값이 여러 개인 State는 객체로 묶는 기준을 사용했습니다.

```text
Menu      → Boolean 하나 → isMenuOpen
Projects  → status + repositories + selectedLanguage → projectsState
Form      → values + errors + status → formState
```

---

### 2. 반응형 디자인을 Mobile First로 작성한 이유는 무엇인가?

#### 말하기 답변

Mobile은 화면 공간이 가장 제한적이므로 핵심 콘텐츠와 기능의 우선순위를 먼저 결정해야 합니다. 기본 CSS를 Mobile 기준으로 작성한 뒤 768px과 1024px 이상에서 공간이 생길 때 Layout과 Column을 확장했습니다.

이 방식은 Desktop Style을 작성한 후 좁은 화면에서 계속 덮어쓰는 것보다 기본 Rule이 단순하고 Override가 적습니다. `min-width` Media Query를 사용하므로 화면이 넓어질수록 필요한 향상 Rule만 단계적으로 추가할 수 있습니다.

또한 Mobile 사용 비중이 높고 제한적인 환경에서 먼저 동작을 보장한다는 점에서도 유리합니다. 이 Project에서는 Mobile에서 Hamburger Menu와 1열 중심 Layout을 기본으로 하고 Tablet에서 Navigation과 2열 Skills, Desktop에서 4열 Skills로 확장했습니다.

---

## 평가 답변 말하기 요령

### 구현 질문

다음 다섯 단계를 순서대로 말한다.

```text
어떤 Event가 발생한다
→ 어떤 State를 변경한다
→ 어떤 Function이 Render한다
→ DOM의 무엇이 바뀐다
→ 어떤 CSS 또는 화면 결과가 생긴다
```

### 이론 질문

다음 네 부분을 포함한다.

```text
개념의 정의
→ 이 Project에서 선택한 이유
→ 실제 적용 위치
→ 장점 또는 주의점
```

평가에서는 어려운 용어를 많이 말하는 것보다 실제 코드의 변수와 Function 이름을 사용해 원인과 결과를 연결하는 것이 중요하다.
