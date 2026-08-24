# 예상 평가 질문

각 구현 단계에서 학습한 내용을 점검하기 위한 예상 질문과 답변을 기록한다.

이 문서는 로컬 학습용이며 Git으로 추적하지 않는다.

## 1단계: Project structure

### 1. 왜 JavaScript 파일을 연결할 때 `defer`를 사용했나요?

HTML 해석을 막지 않으면서 DOM 생성이 끝난 후 JavaScript가 실행되도록 하기 위해서다. 따라서 JavaScript가 아직 생성되지 않은 DOM 요소를 찾는 문제를 줄일 수 있다.

### 2. CSS와 JavaScript를 외부 파일로 분리한 이유는 무엇인가요?

HTML은 구조, CSS는 표현, JavaScript는 동작이라는 책임을 분리해 코드를 찾고 수정하기 쉽게 만들기 위해서다.

### 3. `viewport` meta 태그가 왜 필요한가요?

모바일 브라우저가 페이지 너비를 실제 기기 너비에 맞춰 렌더링하도록 해 반응형 레이아웃이 의도대로 동작하게 하기 위해서다.

### 4. `.gitkeep`은 Git의 공식 기능인가요?

아니다. Git은 빈 폴더를 추적하지 않기 때문에 빈 폴더를 저장소에 포함하려고 관례적으로 추가하는 빈 파일이다.

## 2단계: Semantic HTML

### 1. 시맨틱 HTML을 사용하는 이유는 무엇인가요?

요소의 모양이 아니라 역할을 마크업에 표현해 브라우저, 검색 엔진, 스크린 리더, 개발자가 문서 구조를 더 쉽게 이해하도록 하기 위해서다.

### 2. `header`, `main`, `section`, `footer`는 각각 어떤 역할을 하나요?

`header`는 페이지의 머리말과 주요 탐색 영역, `main`은 페이지의 핵심 콘텐츠, `section`은 제목을 가진 주제별 영역, `footer`는 페이지의 저작권과 부가 정보를 나타낸다.

### 3. Navigation 링크의 `href`와 section의 `id`는 어떻게 연결되나요?

`href="#about"`인 링크를 선택하면 브라우저는 같은 문서에서 `id="about"`인 요소를 찾아 그 위치로 이동한다. 이를 fragment identifier라고 한다.

### 4. section에 `aria-labelledby`를 사용한 이유는 무엇인가요?

section과 해당 제목 요소의 관계를 명시해 보조 기술이 각 영역의 이름을 정확히 전달하도록 하기 위해서다. 속성값은 제목 요소의 `id`와 같아야 한다.

### 5. 프로필 이미지에 구체적인 `alt`를 작성한 이유는 무엇인가요?

이미지를 볼 수 없는 사용자에게 이미지가 전달하는 내용을 텍스트로 제공하기 위해서다. 파일명이나 “이미지” 같은 표현보다 실제 보이는 내용을 간결하게 설명한다.

### 6. 새 창으로 여는 GitHub 링크에 `rel="noopener noreferrer"`를 사용한 이유는 무엇인가요?

새 페이지가 원래 페이지의 `window.opener`에 접근하지 못하게 하고 불필요한 referrer 정보 전달을 줄이기 위해서다.

## 3단계: CSS Variables

### 1. CSS 변수를 `:root`에 선언하는 이유는 무엇인가요?

`:root`는 문서의 최상위 요소를 선택하므로 그 안의 모든 요소가 공통 변수를 사용할 수 있다. 공통 디자인 값을 한곳에서 관리하면 수정과 재사용이 쉬워진다.

### 2. CSS 변수는 어떻게 선언하고 사용하나요?

`--color-primary: #4f46e5;`처럼 두 개의 하이픈으로 시작하는 이름에 값을 선언하고, 필요한 곳에서 `color: var(--color-primary);`처럼 사용한다.

### 3. `--color-primary`처럼 역할 중심으로 이름을 지은 이유는 무엇인가요?

`--purple`처럼 현재 색 자체를 이름으로 사용하면 디자인이나 테마가 바뀔 때 의미가 어긋날 수 있다. 역할 중심 이름은 실제 값이 바뀌어도 사용 목적을 유지한다.

### 4. CSS 변수가 다크 모드 구현에 어떻게 사용되나요?

요소별 스타일은 같은 변수를 계속 사용하고, `[data-theme="dark"]`에서 변수값만 어두운 색으로 재정의한다. 그러면 여러 요소의 CSS를 각각 다시 작성하지 않아도 테마가 변경된다.

## 4단계: Mobile base styles

### 1. Mobile First 방식은 무엇인가요?

작은 화면에 필요한 기본 CSS를 먼저 작성하고, 더 넓은 화면의 변경 사항을 `min-width` 미디어 쿼리로 추가하는 방식이다. 핵심 콘텐츠와 제약이 많은 모바일 화면부터 설계할 수 있다.

### 2. `box-sizing: border-box`를 모든 요소에 적용한 이유는 무엇인가요?

선언한 `width`와 `height` 안에 padding과 border가 포함되도록 해 요소의 실제 크기를 계산하기 쉽게 만들기 위해서다.

### 3. `rem` 단위를 사용한 이유는 무엇인가요?

루트 요소의 글자 크기를 기준으로 계산되므로 일관된 크기 체계를 만들 수 있고, 사용자가 브라우저의 기본 글자 크기를 변경했을 때 함께 반응할 수 있다.

### 4. 모바일 Navigation을 아직 숨기지 않은 이유는 무엇인가요?

현재는 숨겨진 메뉴를 다시 여는 햄버거 버튼과 JavaScript가 없기 때문이다. 제어 수단 없이 메뉴를 숨기면 사용자가 Navigation에 접근할 수 있으므로 6단계에서 버튼과 동작을 함께 구현한다.

## 5단계: Responsive layout

### 1. `min-width` 미디어 쿼리를 사용한 이유는 무엇인가요?

모바일 스타일을 기본값으로 유지하고 화면이 충분히 넓어질 때 필요한 변경만 추가하기 위해서다. 이는 Mobile First 방식과 일치한다.

### 2. 768px와 1024px에서는 무엇이 달라지나요?

768px부터 Header가 세로에서 가로 배치로 바뀌고 Skills가 2열이 된다. 1024px부터 제목과 section 간격이 커지고 Skills가 4열이 된다.

### 3. `repeat(2, minmax(0, 1fr))`는 어떤 의미인가요?

동일한 너비의 열 두 개를 만든다. 각 열은 최소 0부터 사용 가능한 공간의 동일한 비율까지 차지하며, 긴 콘텐츠로 인해 Grid가 컨테이너 밖으로 넘치는 문제를 줄인다.

### 4. 미디어 쿼리에서 모든 스타일을 다시 작성하지 않는 이유는 무엇인가요?

CSS cascade에 따라 모바일 기본값이 그대로 상속되기 때문이다. 넓은 화면에서 달라져야 하는 속성만 덮어쓰면 중복을 줄이고 화면 크기별 차이를 쉽게 파악할 수 있다.

## 6단계: Navigation과 Hamburger menu

### 1. 햄버거 메뉴에서 이벤트, 상태, DOM 업데이트는 각각 무엇인가요?

이벤트는 버튼의 `click`, 상태는 메뉴 열림 여부를 저장하는 `isMenuOpen`, DOM 업데이트는 `renderMenu()`가 수행하는 class와 ARIA 속성 변경이다.

### 2. DOM을 이벤트 함수에서 직접 모두 변경하지 않고 `renderMenu()`로 분리한 이유는 무엇인가요?

버튼 클릭과 메뉴 링크 클릭처럼 여러 이벤트가 같은 화면을 변경하므로, 상태를 화면에 반영하는 책임을 한 함수에 모아 중복과 불일치를 줄이기 위해서다.

### 3. `aria-expanded`와 `aria-controls`는 어떤 역할을 하나요?

`aria-expanded`는 제어 대상이 현재 열렸는지 알려주고, `aria-controls`는 버튼이 어떤 요소를 제어하는지 해당 요소의 `id`로 연결한다.

### 4. `classList.toggle("active", isMenuOpen)`의 두 번째 인자는 무엇인가요?

두 번째 인자가 `true`이면 class를 추가하고 `false`이면 제거한다. 단순히 현재 class를 반전하는 대신 JavaScript 상태와 DOM class가 항상 같아지도록 한다.

## 7단계: Smooth scroll

### 1. Navigation 링크에서 `event.preventDefault()`를 사용한 이유는 무엇인가요?

브라우저가 anchor 대상 위치로 즉시 이동하는 기본 동작을 막고, JavaScript의 `scrollIntoView()`로 부드러운 이동을 제어하기 위해서다.

### 2. 클릭한 링크에 대응하는 section은 어떻게 찾나요?

링크의 `href`에서 `#about` 같은 값을 가져오고 `document.querySelector(targetId)`에 전달해 같은 `id`를 가진 section을 찾는다.

### 3. `scrollIntoView({ behavior: "smooth", block: "start" })`는 무엇을 하나요?

선택한 요소가 viewport의 시작 부분에 오도록 부드럽게 스크롤한다. `behavior`는 이동 방식, `block`은 세로 정렬 위치를 정한다.

### 4. `history.pushState()`를 사용한 이유는 무엇인가요?

`preventDefault()` 때문에 자동으로 변경되지 않는 URL의 fragment를 페이지 새로고침 없이 기록해 현재 section 주소를 공유하거나 브라우저 탐색 기록에서 사용할 수 있게 하기 위해서다.

## 8단계: Navigation scroll state

### 1. Navigation 스타일이 변경되는 정확한 기준은 무엇인가요?

`window.scrollY >= 60`일 때다. 현재 코드는 `NAV_SCROLL_THRESHOLD` 상수에 60을 저장해 기준값의 의미를 명확히 표시한다.

### 2. `scrollY`는 무엇인가요?

문서의 최상단에서 현재 viewport가 세로로 얼마나 이동했는지를 CSS pixel 단위로 나타내는 읽기 전용 값이다.

### 3. 같은 스크롤 상태일 때 DOM 업데이트를 생략하는 이유는 무엇인가요?

`scroll` 이벤트는 짧은 시간에 여러 번 발생하므로 상태가 바뀌지 않았는데 class를 계속 추가하거나 제거하는 불필요한 DOM 작업을 막기 위해서다.

### 4. `classList.add()`와 `classList.remove()`는 각각 언제 실행되나요?

60px 이상이면 `scrolled` class를 추가하고 60px 미만으로 돌아오면 제거한다. CSS는 해당 class의 존재 여부에 따라 Header 배경과 그림자를 바꾼다.

## 9단계: Scroll-to-top

### 1. Scroll-to-Top 버튼이 표시되는 정확한 기준은 무엇인가요?

`window.scrollY >= 300`일 때다. 현재 코드는 `SCROLL_TOP_THRESHOLD` 상수에 300을 저장한다.

### 2. 버튼 표시 여부를 상태로 따로 관리하는 이유는 무엇인가요?

스크롤할 때마다 DOM을 직접 변경하지 않고, 이전 상태와 다음 상태가 달라졌을 때만 render 함수를 실행해 상태와 화면의 관계를 명확하게 만들기 위해서다.

### 3. Header와 Scroll-to-Top에서 하나의 scroll listener를 사용하는 이유는 무엇인가요?

두 기능 모두 같은 `window`의 scroll 위치에 의존하므로 하나의 `handleScroll()`에서 각 상태 갱신 함수를 호출해 중복 이벤트 리스너를 만들지 않기 위해서다.

### 4. `window.scrollTo({ top: 0, behavior: "smooth" })`는 무엇을 하나요?

문서의 세로 위치 0, 즉 최상단으로 viewport를 부드럽게 이동시킨다. 이동 중 발생하는 scroll 이벤트가 버튼 상태를 다시 `false`로 바꾼다.

## 10단계: Dark mode

### 1. 다크 모드의 Event → State → DOM 흐름은 무엇인가요?

테마 버튼 click으로 `currentTheme`을 변경하고 `renderTheme()`가 `<html>`의 `data-theme`, 버튼 ARIA 속성, 아이콘 class를 갱신한다. CSS는 변경된 `data-theme`에 맞는 변수값을 적용한다.

### 2. `[data-theme="dark"]`에서 요소별 스타일이 아닌 CSS 변수만 재정의한 이유는 무엇인가요?

각 요소는 동일한 의미의 변수를 계속 사용하고 테마별 실제 값만 바꾸면 되므로 중복 CSS를 줄이고 Light/Dark 디자인을 일관되게 관리할 수 있기 때문이다.

### 3. `document.documentElement`는 어떤 요소인가요?

현재 HTML 문서의 최상위 `<html>` 요소다. 여기에 `data-theme`을 설정하면 하위의 모든 요소가 해당 테마 변수를 사용할 수 있다.

### 4. `aria-pressed`와 `aria-label`을 모두 변경하는 이유는 무엇인가요?

`aria-pressed`는 토글 버튼의 현재 선택 상태를 전달하고, `aria-label`은 지금 버튼을 누르면 실행될 다음 동작을 “다크 모드로 전환” 또는 “라이트 모드로 전환”으로 안내한다.

## 11단계: localStorage

### 1. `localStorage`를 사용하는 이유는 무엇인가요?

사용자가 선택한 테마 문자열을 브라우저에 저장해 페이지를 새로고침하거나 다시 방문해도 같은 설정으로 시작하기 위해서다.

### 2. `getItem()`과 `setItem()`은 각각 무엇을 하나요?

`getItem(key)`은 해당 key로 저장된 문자열을 읽고 없으면 `null`을 반환한다. `setItem(key, value)`은 key와 문자열 값을 저장하거나 기존 값을 덮어쓴다.

### 3. localStorage key를 상수로 만든 이유는 무엇인가요?

읽기와 쓰기에서 동일한 문자열을 반복하지 않고 `THEME_STORAGE_KEY` 한곳에서 관리해 오타와 수정 누락을 방지하기 위해서다.

### 4. 저장값이 `dark`가 아닐 때 Light로 초기화한 이유는 무엇인가요?

현재 단계에서 허용하는 테마 값은 `light`와 `dark`뿐이므로, 저장값이 없거나 예상하지 못한 문자열이면 안전한 기본값인 Light를 사용하기 위해서다.

## 12단계: System color scheme

### 1. 시스템 다크 모드는 어떻게 감지하나요?

`window.matchMedia("(prefers-color-scheme: dark)")`가 반환한 객체의 `matches`를 확인한다. 시스템이 Dark이면 `true`, 아니면 `false`다.

### 2. 저장된 테마와 시스템 테마 중 무엇을 우선하나요?

사용자가 직접 선택해 localStorage에 저장한 테마를 우선한다. 유효한 저장값이 없을 때만 시스템 설정을 초기 테마로 사용한다.

### 3. `matchMedia`의 `change` 이벤트는 왜 사용하나요?

페이지가 열린 상태에서 운영체제의 색상 설정이 바뀌는 이벤트를 감지해, 사용자 저장값이 없는 경우 `currentTheme` 상태와 DOM을 즉시 갱신하기 위해서다.

### 4. `hasUserThemePreference` 상태가 필요한 이유는 무엇인가요?

시스템 설정을 따르는 중인지 사용자가 테마를 명시적으로 선택했는지 구분하기 위해서다. 사용자가 선택한 뒤에는 시스템 변경이 그 선택을 덮어쓰지 않는다.

## 13단계: Intersection Observer

### 1. Intersection Observer를 사용하는 이유는 무엇인가요?

`scroll` 이벤트마다 모든 요소의 위치를 직접 계산하지 않고 브라우저가 관찰 대상과 viewport의 교차 상태가 바뀔 때 알려주도록 하기 위해서다.

### 2. `threshold: 0.2`는 무엇을 의미하나요?

관찰 대상인 section 제목의 약 20%가 viewport와 교차할 때 callback이 실행될 기준을 의미한다. 과제 권장값인 0.2 이상을 충족한다.

### 3. `entry.isIntersecting`은 어떤 상태인가요?

현재 관찰 중인 section 제목이 설정한 교차 기준에 따라 viewport 안에 들어왔는지를 나타내는 boolean이다. `true`일 때 제목이 속한 section에 `is-visible` class를 추가한다.

### 4. 표시한 section을 `unobserve()`하는 이유는 무엇인가요?

애니메이션을 한 번만 실행하고 이미 표시된 요소의 교차 상태를 계속 관찰하는 불필요한 작업을 줄이기 위해서다.

### 5. `reveal-section` class를 JavaScript에서 추가하는 이유는 무엇인가요?

JavaScript가 실패하거나 비활성화된 경우 CSS만으로 콘텐츠가 계속 보이게 하는 점진적 향상을 위해서다.

## 14단계: Contact form UI

### 1. `label`의 `for`와 입력 요소의 `id`를 연결하는 이유는 무엇인가요?

Label을 클릭해도 연결된 입력 요소에 초점이 이동하고, 접근성 도구가 입력 요소의 이름을 올바르게 전달할 수 있기 때문이다.

### 2. `aria-describedby`는 어떤 역할을 하나요?

입력 요소와 가까이 있는 에러 메시지의 `id`를 연결해 보조 기술이 입력값과 함께 오류 설명을 전달할 수 있게 한다.

### 3. Form에 `novalidate`를 사용한 이유는 무엇인가요?

`required`와 `type="email"`의 의미는 유지하면서 브라우저 기본 오류 팝업 대신 JavaScript가 만든 일관된 오류 UI를 표시하기 위해서다.

### 4. `autocomplete` 속성을 사용한 이유는 무엇인가요?

브라우저가 이름과 이메일 필드의 목적을 이해하고 저장된 사용자 정보를 정확한 필드에 자동 완성할 수 있게 하기 위해서다.

## 15단계: Form validation

### 1. Form validation의 Event → State → DOM 흐름은 무엇인가요?

`input` 또는 `submit` 이벤트가 발생하면 입력값을 검증해 `formState.values`, `errors`, `status`를 변경하고 렌더링 함수가 에러 문구, `aria-invalid`, 상태 메시지를 갱신한다.

### 2. `submit` 이벤트에서 `event.preventDefault()`를 사용하는 이유는 무엇인가요?

Form의 기본 제출로 페이지가 이동하거나 새로고침되는 것을 막고 현재 화면에서 검증 결과를 표시하기 위해서다.

### 3. 입력값에 `trim()`을 적용하는 이유는 무엇인가요?

공백만 입력한 값을 실제 내용이 있는 값으로 인정하지 않고 빈 값 오류로 처리하기 위해서다.

### 4. 오류가 있을 때 첫 번째 잘못된 필드에 focus를 이동하는 이유는 무엇인가요?

사용자가 수정해야 할 시작 위치를 즉시 알 수 있게 해 키보드와 보조 기술 사용성을 높이기 위해서다.

## 16단계: GitHub API basic request

### 1. `fetch()`는 무엇을 반환하나요?

HTTP 요청의 미래 결과를 나타내는 Promise를 즉시 반환한다. 응답이 도착하면 Promise가 `Response` 객체로 이행된다.

### 2. `async/await`를 사용하는 이유는 무엇인가요?

Promise 기반 비동기 코드를 위에서 아래로 읽히는 형태로 작성하고 `try/catch`에서 요청과 JSON 변환 오류를 함께 처리하기 위해서다.

### 3. `response.ok`를 직접 검사해야 하는 이유는 무엇인가요?

`fetch()`는 네트워크 자체가 실패할 때는 reject되지만 403이나 404 같은 HTTP 오류 응답만으로는 reject되지 않기 때문이다. `ok`는 상태 코드가 200~299인지 알려준다.

### 4. 실패할 때 빈 배열 대신 `null`을 반환하는 이유는 무엇인가요?

빈 배열은 요청에는 성공했지만 repository가 없는 empty 상태를 의미할 수 있다. `null`을 사용하면 API 오류와 정상적인 빈 결과를 다음 렌더링 단계에서 구분할 수 있다.

### 5. GitHub token을 JavaScript에 작성하지 않는 이유는 무엇인가요?

브라우저로 전달되는 JavaScript는 누구나 확인할 수 있어 token이 공개되기 때문이다. 이번 프로젝트는 공개 API를 인증 없이 사용하며 시간당 60회 제한을 고려한다.

## 17단계: GitHub API states

### 1. API 상태를 별도 객체로 관리하는 이유는 무엇인가요?

요청 로직과 화면 변경을 분리하고 동일한 `projectsState`를 기준으로 loading, success, error, empty 화면 중 하나를 일관되게 렌더링하기 위해서다.

### 2. loading 상태는 언제 설정하나요?

`fetch()`를 호출하기 직전에 `projectsState.status`를 `loading`으로 변경하고 즉시 `renderProjects()`를 호출해 응답을 기다리는 동안 로딩 UI를 보여준다.

### 3. success와 empty는 어떻게 구분하나요?

요청과 JSON 변환에 성공한 뒤 repository 배열의 `length`가 0보다 크면 success, 0이면 empty로 설정한다.

### 4. `finally`에서 렌더링하는 이유는 무엇인가요?

요청 성공과 실패 중 어느 경로로 끝나더라도 마지막으로 결정된 상태를 DOM에 반드시 반영하기 위해서다.

### 5. `aria-busy`는 어떤 역할을 하나요?

Projects 영역이 현재 갱신 중인지 보조 기술에 전달한다. loading이면 `true`, 요청이 끝나면 `false`가 된다.

## 18단계: GitHub API Retry

### 1. Retry 버튼은 언제 표시되나요?

`projectsState.status`가 `error`일 때만 `renderProjects()`가 오류 문구와 함께 Retry 버튼을 생성한다.

### 2. Retry를 위해 새로운 요청 함수를 만들지 않은 이유는 무엇인가요?

최초 요청과 재시도는 모두 loading부터 최종 상태까지 같은 흐름을 사용하므로 기존 `fetchProjects()`를 재사용해 중복을 피하기 위해서다.

### 3. 이벤트 위임이란 무엇인가요?

자식 요소마다 listener를 연결하는 대신 공통 부모에 listener 하나를 연결하고 발생한 이벤트의 `target`으로 실제 클릭 대상을 판별하는 방식이다.

### 4. 이 프로젝트에서 이벤트 위임을 사용한 이유는 무엇인가요?

Retry 버튼은 error 상태를 렌더링할 때 `innerHTML`로 동적으로 생성되고 다음 상태에서 제거된다. 계속 존재하는 `.projects-view`가 클릭을 처리하면 버튼이 다시 생성돼도 listener를 재등록할 필요가 없다.

### 5. Retry의 Event → State → DOM 흐름은 무엇인가요?

Retry 버튼 click을 부모가 감지하고 `fetchProjects()`를 호출하면 status가 loading으로 바뀌어 로딩 DOM이 표시되고, 요청 결과에 따라 success, empty, error DOM으로 다시 변경된다.

## 19단계: Project card rendering

### 1. `map()`과 `join("")`은 각각 어떤 역할을 하나요?

`map()`은 repository 객체 배열을 카드 HTML 문자열 배열로 변환하고, `join("")`은 쉼표 없이 하나의 HTML 문자열로 합친다.

### 2. 구조분해 할당에서 `html_url: htmlUrl`은 무엇을 의미하나요?

GitHub 객체의 `html_url` 값을 꺼내 JavaScript에서 읽기 쉬운 `htmlUrl`이라는 새 변수 이름으로 사용하는 것이다.

### 3. Project card에 `<article>`을 사용한 이유는 무엇인가요?

각 repository 카드가 제목과 설명, 정보, 링크를 가진 독립적으로 이해 가능한 콘텐츠 단위이기 때문이다.

### 4. API 문자열을 `escapeHtml()`로 변환하는 이유는 무엇인가요?

외부 데이터의 `<`, `>`, 따옴표 등이 `innerHTML`에서 실제 HTML 태그나 속성으로 해석되는 것을 막고 텍스트로 표시하기 위해서다.

### 5. Projects Grid에 `auto-fit`과 `minmax()`를 사용한 이유는 무엇인가요?

카드의 최소 너비를 보장하면서 사용 가능한 가로 공간에 맞춰 열 개수가 자동으로 바뀌게 해 별도의 카드용 breakpoint를 줄이기 위해서다.

## 20단계: Project language filtering

### 1. 언어 필터에서 관리하는 상태는 무엇인가요?

`projectsState.selectedLanguage`가 현재 선택한 언어를 저장하며 기본값은 모든 프로젝트를 의미하는 `All`이다.

### 2. 필터 버튼을 누를 때 API를 다시 호출하지 않는 이유는 무엇인가요?

전체 repository 배열이 이미 `projectsState.repositories`에 있으므로 로컬 배열의 `filter()`만 사용하면 더 빠르고 API rate limit도 소비하지 않기 때문이다.

### 3. 언어 버튼 목록은 어떻게 만드나요?

Repository 배열을 `map()`으로 언어 배열로 바꾸고 `Set`으로 중복을 제거한 뒤 `All`을 앞에 추가한다.

### 4. `filter()`는 원본 배열을 변경하나요?

변경하지 않는다. 조건을 통과한 항목만 포함한 새 배열을 반환하므로 전체 repository 상태를 유지한 채 화면에 표시할 목록만 만들 수 있다.

### 5. 필터 버튼에 `aria-pressed`를 사용하는 이유는 무엇인가요?

각 버튼이 토글 가능한 선택 버튼이며 현재 어떤 언어가 선택됐는지 화면과 보조 기술에 함께 전달하기 위해서다.

## 21단계: Hero typing effect

### 1. 타이핑 효과에서 상태는 무엇인가요?

전체 문장인 `typingMessage`와 현재 몇 글자까지 표시할지 나타내는 `typingIndex`다. 렌더 함수는 `slice()`로 해당 범위만 DOM에 표시한다.

### 2. `setInterval()` 대신 재귀적인 `setTimeout()`을 사용한 이유는 무엇인가요?

한 글자 처리가 끝난 뒤 다음 실행을 예약하고 문장이 끝나면 더 이상 timer를 만들지 않아 실행 흐름과 종료 조건을 한곳에서 관리하기 쉽기 때문이다.

### 3. HTML에 완성 문장을 미리 작성하는 이유는 무엇인가요?

JavaScript가 실패하거나 비활성화되어도 Hero 제목이 보이도록 하는 점진적 향상을 위해서다. JavaScript가 정상 실행될 때만 내용을 비우고 타이핑을 시작한다.

### 4. 타이핑 중인 span에 `aria-hidden="true"`를 사용한 이유는 무엇인가요?

화면 낭독기가 매 글자 DOM 변경을 반복해서 읽지 않게 하고, 별도의 visually hidden 완성 문장을 제목으로 한 번만 전달하기 위해서다.

### 5. `prefers-reduced-motion`에서는 어떻게 동작하나요?

타이핑과 cursor 깜빡임을 실행하지 않고 완성된 문장을 즉시 표시해 사용자의 동작 감소 설정을 존중한다.

## 22단계: Real contact form submission

### 1. 이 프로젝트에서 Formspree를 선택한 이유는 무엇인가요?

정적 GitHub Pages에서도 별도 backend 없이 사용할 수 있고, 기존 Vanilla JavaScript의 submit, validation, fetch, 상태 렌더링 흐름을 그대로 학습할 수 있기 때문이다.

### 2. Formspree 요청에 `Accept: application/json`을 보내는 이유는 무엇인가요?

HTML 페이지로 이동하는 응답 대신 JavaScript에서 처리할 수 있는 JSON 형식의 성공 또는 오류 응답을 요청하기 위해서다.

### 3. FormData는 언제 생성하나요?

모든 필드가 유효한지 확인한 뒤 `new FormData(contactForm)`으로 생성한다. 입력 요소의 `name`이 전송할 field 이름이 된다.

### 4. 전송 중 버튼을 비활성화하는 이유는 무엇인가요?

사용자가 여러 번 클릭해 같은 메시지를 중복 전송하는 것을 방지하고 현재 요청이 처리 중임을 나타내기 위해서다.

### 5. Form은 언제 초기화하나요?

Formspree가 성공 응답을 반환했을 때만 초기화한다. 실패한 경우 입력값을 유지해 사용자가 내용을 다시 작성하지 않고 재시도할 수 있게 한다.

### 6. 실제 전송의 Event → State → DOM 흐름은 무엇인가요?

유효한 submit 이벤트 후 상태를 submitting으로 변경해 버튼과 메시지를 갱신하고, fetch 결과에 따라 success 또는 submissionError로 바꾼 뒤 최종 DOM을 렌더링한다.

## 23단계: Accessibility review

### 1. Skip link를 추가한 이유는 무엇인가요?

키보드 사용자가 매 페이지 방문 시 반복되는 Navigation을 모두 거치지 않고 첫 Tab에서 바로 Main 콘텐츠로 이동할 수 있게 하기 위해서다.

### 2. Projects 전체에서 `role="status"`를 제거한 이유는 무엇인가요?

성공 렌더링 때 모든 카드 내용이 한꺼번에 읽히는 것을 막기 위해서다. 별도의 visually hidden live region에는 상태와 표시 개수만 간결하게 전달한다.

### 3. 동작 감소 설정이 JavaScript 스크롤에도 적용돼야 하는 이유는 무엇인가요?

CSS animation뿐 아니라 `scrollIntoView()`와 `scrollTo()`의 smooth 동작도 움직임을 만들기 때문이다. 설정이 켜지면 behavior를 `auto`로 사용한다.

### 4. 모바일 메뉴에서 Escape를 지원하는 이유는 무엇인가요?

키보드 사용자가 열린 메뉴를 일반적인 종료 키로 닫고 메뉴를 열었던 버튼으로 focus를 되돌릴 수 있게 하기 위해서다.

### 5. Primary foreground와 button background 변수를 분리한 이유는 무엇인가요?

Dark 배경에서 읽기 좋은 밝은 링크색을 흰 버튼 글자의 배경으로도 사용하면 대비가 부족할 수 있다. 용도별 변수를 분리해 두 조합의 대비를 각각 보장한다.

### 6. 타이핑 cursor를 완료 후 중지하는 이유는 무엇인가요?

정보 전달이 끝난 뒤 불필요하게 계속 깜빡이는 움직임을 제거하고, 동작 감소 설정이 실행 중 바뀌어도 남은 timer를 즉시 취소하기 위해서다.

## 24단계: Code refactoring

### 1. `setMenuOpen()`으로 상태 변경을 모은 이유는 무엇인가요?

Toggle click, Navigation click, Escape key가 모두 같은 상태와 DOM을 바꾸므로 `isMenuOpen` 변경 후 `renderMenu()` 호출이라는 규칙을 한 함수에서 보장하기 위해서다.

### 2. `validateForm()`을 submit handler에서 분리한 이유는 무엇인가요?

이벤트 handler는 제출 흐름을 제어하고, `validateForm()`은 모든 field 상태 갱신과 첫 오류 반환을 담당하게 해 각 함수의 책임을 명확히 하기 위해서다.

### 3. `getFilteredRepositories()`는 왜 렌더 함수와 분리했나요?

선택 상태를 기반으로 표시할 배열을 계산하는 로직과 DOM 문자열을 만드는 로직을 분리해 filter 조건을 독립적으로 읽고 수정할 수 있게 하기 위해서다.

### 4. 리팩터링에서 파일을 여러 JavaScript module로 나누지 않은 이유는 무엇인가요?

현재 규모에서는 한 파일 안의 상태와 흐름을 함께 보는 것이 Vanilla JavaScript 학습에 유리하며, module 간 의존성을 추가할 만큼 복잡하지 않기 때문이다.

### 5. 리팩터링 후 반드시 기존 기능 검증이 필요한 이유는 무엇인가요?

리팩터링은 의도한 화면 동작을 바꾸지 않는 작업이므로 이전과 같은 이벤트, 상태, DOM 결과가 유지되는지 확인해야 하기 때문이다.

## 25단계: GitHub Pages deployment

### 1. GitHub Pages가 `main` branch의 root를 배포하도록 설정한 이유는 무엇인가요?

최종 코드가 기본 branch에 반영될 때마다 repository root의 정적 파일을 자동 배포해 저장소와 공개 사이트의 버전을 일치시키기 위해서다.

### 2. 정적 사이트에 build 단계가 없는 이유는 무엇인가요?

현재 프로젝트는 브라우저가 바로 실행할 HTML, CSS, JavaScript로 구성되어 별도의 framework compile이나 bundle 결과를 만들 필요가 없기 때문이다.

### 3. Custom workflow 대신 branch 배포를 사용한 이유는 무엇인가요?

별도 build 과정이 없고 현재 Git 인증에는 workflow 수정 scope가 없기 때문이다. GitHub가 제공하는 branch publishing source만으로 같은 정적 파일을 더 단순하게 배포할 수 있다.

### 4. Publishing source의 `(root)`는 무엇을 의미하나요?

선택한 main branch의 `docs/` 같은 하위 폴더가 아니라 repository 최상위의 `index.html`을 시작 파일로 배포한다는 뜻이다.

### 5. 로컬에서는 동작하지만 Pages에서 깨질 수 있는 경로는 무엇인가요?

`/css/style.css` 같은 root 절대경로는 project site의 repository 하위 URL을 무시할 수 있다. 현재는 `css/style.css`, `js/main.js`, `images/profile.jpg` 같은 상대경로를 사용한다.

## 26단계: README

### 1. README에 기능 목록뿐 아니라 상태 흐름을 기록한 이유는 무엇인가요?

이 프로젝트의 핵심 평가 기준은 완성 화면뿐 아니라 Event가 State와 DOM 변경으로 이어지는 과정을 설명하는 것이므로 구현 의도를 코드 밖에서도 확인할 수 있게 하기 위해서다.

### 2. Scroll 기준값과 Observer threshold를 README에 명시한 이유는 무엇인가요?

60px, 300px, 0.2처럼 화면 동작을 결정하는 값은 구현자가 선택한 기준이므로 리뷰어가 실제 동작과 요구사항 충족 여부를 같은 기준으로 검증할 수 있게 하기 위해서다.

### 3. GitHub API의 각 상태를 문서에 구분한 이유는 무엇인가요?

네트워크 요청은 성공만 보장되지 않으므로 loading, success, empty, error를 각각 어떤 UI로 처리했는지 명시해 비동기 상태 설계를 설명하기 위해서다.

### 4. 스크린샷을 Repository 안의 상대경로로 연결한 이유는 무엇인가요?

GitHub README와 Local 환경 모두에서 같은 파일을 표시하고 Repository 이동이나 Domain 변경에도 링크가 유지되게 하기 위해서다.

## 27단계: Final requirement review

### 1. 최종 검증을 소스 코드 확인만으로 끝내면 안 되는 이유는 무엇인가요?

CSS breakpoint, 실제 API 응답, Focus, 저장된 테마처럼 브라우저 실행 환경에서만 확인되는 동작이 있으므로 배포 URL에서 Event와 화면 결과를 직접 검증해야 하기 때문이다.

### 2. 필터링 때 API를 다시 호출하지 않는 이유는 무엇인가요?

이미 성공 상태에 저장된 Repository 배열을 재사용하면 불필요한 네트워크 요청과 GitHub API rate limit 소비를 줄이고 Filter State와 Render 관계도 명확해진다.

### 3. `aria-expanded`는 메뉴의 시각적 상태와 어떻게 연결되나요?

하나의 `isMenuOpen` 상태에서 `.active` Class와 `aria-expanded`를 함께 렌더링하므로 화면에 보이는 열림 상태와 Screen Reader가 전달받는 상태가 일치한다.

### 4. 최종 배포에서 상대경로를 확인해야 하는 이유는 무엇인가요?

Project Pages는 Domain Root가 아니라 Repository 이름 아래에서 제공되므로 Root 절대경로를 사용하면 Local에서는 보이던 CSS, JavaScript, Image가 배포 환경에서 깨질 수 있기 때문이다.
