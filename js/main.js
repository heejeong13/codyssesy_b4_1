const menuToggle = document.querySelector(".menu-toggle");
const menuIcon = document.querySelector(".menu-icon");
const navigation = document.querySelector(".site-navigation");
const navLinks = document.querySelectorAll(".nav-list a");
const siteHeader = document.querySelector(".site-header");
const scrollTopButton = document.querySelector(".scroll-top-button");
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const contactForm = document.querySelector(".contact-form");
const formFields = contactForm.querySelectorAll("input, textarea");
const formStatus = contactForm.querySelector(".form-status");
const revealSections = document.querySelectorAll(".section");
const projectsView = document.querySelector(".projects-view");

const NAV_SCROLL_THRESHOLD = 60;
const SCROLL_TOP_THRESHOLD = 300;
const REVEAL_THRESHOLD = 0.2;
const THEME_STORAGE_KEY = "portfolio-theme";
const GITHUB_API_URL = "https://api.github.com/users/heejeong13/repos";
const systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REQUIRED_FIELD_MESSAGES = {
  name: "이름을 입력해주세요.",
  email: "이메일을 입력해주세요.",
  message: "메시지를 입력해주세요.",
};
const FORM_STATUS_MESSAGES = {
  idle: "",
  error: "입력 내용을 다시 확인해주세요.",
  success: "입력 내용이 확인되었습니다.",
};
const HTML_CHARACTER_ENTITIES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#039;",
};

// click 이벤트와 렌더링 함수가 함께 사용하는 메뉴의 현재 상태다.
let isMenuOpen = false;

// scroll 이벤트와 렌더링 함수가 함께 사용하는 Header의 현재 상태다.
let isHeaderScrolled = false;

// scroll 이벤트와 렌더링 함수가 함께 사용하는 버튼의 표시 상태다.
let isScrollTopVisible = false;

// light와 dark만 유효한 사용자 선택으로 인정해 잘못된 저장값을 걸러낸다.
const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
let hasUserThemePreference = storedTheme === "light" || storedTheme === "dark";
const systemTheme = systemThemeQuery.matches ? "dark" : "light";

// 저장된 선택이 없을 때만 운영체제의 색상 설정을 초기 상태로 사용한다.
let currentTheme = hasUserThemePreference ? storedTheme : systemTheme;

// 입력값, 필드별 오류, 제출 결과를 DOM과 분리해 하나의 상태로 관리한다.
const formState = {
  values: {
    name: "",
    email: "",
    message: "",
  },
  errors: {
    name: "",
    email: "",
    message: "",
  },
  status: "idle",
};

// API 요청 단계와 repository 데이터를 한곳에서 관리해 화면 상태를 구분한다.
const projectsState = {
  status: "idle",
  repositories: [],
};

// 상태를 기준으로 class와 접근성 속성을 한곳에서 함께 갱신한다.
const renderMenu = () => {
  navigation.classList.toggle("active", isMenuOpen);
  menuToggle.setAttribute("aria-expanded", String(isMenuOpen));
  menuToggle.setAttribute("aria-label", isMenuOpen ? "메뉴 닫기" : "메뉴 열기");

  // Font Awesome class만 교체해 상태에 맞는 아이콘을 표시한다.
  menuIcon.classList.toggle("fa-bars", !isMenuOpen);
  menuIcon.classList.toggle("fa-xmark", isMenuOpen);
};

// classList.add/remove를 사용해 스크롤 상태를 Header DOM에 반영한다.
const renderHeaderScrollState = () => {
  if (isHeaderScrolled) {
    siteHeader.classList.add("scrolled");
    return;
  }

  siteHeader.classList.remove("scrolled");
};

const updateHeaderScrollState = () => {
  const nextHeaderScrolled = window.scrollY >= NAV_SCROLL_THRESHOLD;

  // 같은 상태에서는 DOM을 다시 수정하지 않아 불필요한 렌더링을 줄인다.
  if (nextHeaderScrolled === isHeaderScrolled) return;

  isHeaderScrolled = nextHeaderScrolled;
  renderHeaderScrollState();
};

const renderScrollTopButton = () => {
  scrollTopButton.classList.toggle("is-visible", isScrollTopVisible);
};

// 테마 상태를 html 속성, 버튼 설명, Font Awesome 아이콘에 함께 반영한다.
const renderTheme = () => {
  const isDark = currentTheme === "dark";

  document.documentElement.dataset.theme = currentTheme;
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "라이트 모드로 전환" : "다크 모드로 전환",
  );
  themeIcon.classList.toggle("fa-moon", !isDark);
  themeIcon.classList.toggle("fa-sun", isDark);
};

const getFieldError = (fieldName, value) => {
  if (!value) return REQUIRED_FIELD_MESSAGES[fieldName];

  if (fieldName === "email") {
    if (!EMAIL_PATTERN.test(value)) return "올바른 이메일 형식을 입력해주세요.";
  }

  return "";
};

const renderFieldError = (field) => {
  const errorMessage = formState.errors[field.name];
  const errorElement = document.querySelector(`#${field.id}-error`);
  const hasError = Boolean(errorMessage);

  field.setAttribute("aria-invalid", String(hasError));
  errorElement.textContent = errorMessage;
};

const renderFormStatus = () => {
  formStatus.textContent = FORM_STATUS_MESSAGES[formState.status];
  formStatus.classList.toggle("is-error", formState.status === "error");
  formStatus.classList.toggle("is-success", formState.status === "success");
};

const updateFieldState = (field) => {
  const value = field.value.trim();

  formState.values[field.name] = value;
  formState.errors[field.name] = getFieldError(field.name, value);
};

const escapeHtml = (value) => {
  // API 문자열이 innerHTML에서 실제 태그나 속성으로 실행되지 않게 변환한다.
  return String(value).replace(
    /[&<>"']/g,
    (character) => HTML_CHARACTER_ENTITIES[character],
  );
};

const createProjectCard = (repository) => {
  const {
    name,
    description,
    html_url: htmlUrl,
    language,
    stargazers_count: starCount,
  } = repository;
  const safeName = escapeHtml(name);
  const safeDescription = escapeHtml(description || "등록된 설명이 없습니다.");
  const safeLanguage = escapeHtml(language || "기타");
  const safeUrl = escapeHtml(htmlUrl);

  return `
    <article class="project-card">
      <h3>${safeName}</h3>
      <p class="project-description">${safeDescription}</p>
      <ul class="project-meta" aria-label="프로젝트 정보">
        <li>
          <i class="fa-solid fa-code" aria-hidden="true"></i>
          ${safeLanguage}
        </li>
        <li>
          <i class="fa-solid fa-star" aria-hidden="true"></i>
          ${starCount}
        </li>
      </ul>
      <a
        class="project-link"
        href="${safeUrl}"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="${safeName} 저장소 새 창에서 보기"
      >
        저장소 보기
        <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
      </a>
    </article>
  `;
};

const renderProjects = () => {
  const { status, repositories } = projectsState;

  projectsView.setAttribute("aria-busy", String(status === "loading"));

  if (status === "loading") {
    projectsView.innerHTML = `
      <p class="projects-status">
        <i class="fa-solid fa-spinner loading-icon" aria-hidden="true"></i>
        로딩 중...
      </p>
    `;
    return;
  }

  if (status === "error") {
    projectsView.innerHTML = `
      <div class="projects-error">
        <p class="projects-status is-error">프로젝트를 불러올 수 없습니다.</p>
        <button class="project-retry-button" type="button">다시 시도</button>
      </div>
    `;
    return;
  }

  if (status === "empty") {
    projectsView.innerHTML = `
      <p class="projects-status">표시할 프로젝트가 없습니다.</p>
    `;
    return;
  }

  if (status === "success") {
    projectsView.innerHTML = `
      <div class="projects-grid">
        ${repositories.map(createProjectCard).join("")}
      </div>
    `;
    return;
  }

  projectsView.innerHTML = `
    <p class="projects-status">GitHub 프로젝트를 준비하고 있습니다.</p>
  `;
};

const fetchProjects = async () => {
  projectsState.status = "loading";
  renderProjects();

  try {
    const response = await fetch(GITHUB_API_URL);

    // fetch는 403이나 404에서도 reject되지 않으므로 HTTP 성공 여부를 직접 검사한다.
    if (!response.ok) {
      throw new Error(`GitHub API 요청 실패: ${response.status}`);
    }

    const repositories = await response.json();

    projectsState.repositories = repositories;
    projectsState.status = repositories.length > 0 ? "success" : "empty";
  } catch (error) {
    projectsState.status = "error";
    projectsState.repositories = [];
    console.error("GitHub 프로젝트 요청 중 오류가 발생했습니다.", error);
  } finally {
    // 요청 결과와 관계없이 마지막 상태를 Projects DOM에 반드시 반영한다.
    renderProjects();
  }
};

const sectionObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const section = entry.target.closest(".section");

      // 높이가 긴 section도 제목이 20% 들어오면 표시하고 관찰을 끝낸다.
      section.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: REVEAL_THRESHOLD },
);

const updateScrollTopState = () => {
  const nextScrollTopVisible = window.scrollY >= SCROLL_TOP_THRESHOLD;

  if (nextScrollTopVisible === isScrollTopVisible) return;

  isScrollTopVisible = nextScrollTopVisible;
  renderScrollTopButton();
};

// 하나의 scroll 이벤트에서 위치에 의존하는 UI 상태를 함께 갱신한다.
const handleScroll = () => {
  updateHeaderScrollState();
  updateScrollTopState();
};

menuToggle.addEventListener("click", () => {
  // 사용자 이벤트는 상태만 바꾸고, 실제 DOM 변경은 렌더링 함수에 맡긴다.
  isMenuOpen = !isMenuOpen;
  renderMenu();
});

navLinks.forEach((navLink) => {
  navLink.addEventListener("click", (event) => {
    // 브라우저의 즉시 이동을 막고 JavaScript가 부드러운 이동을 제어한다.
    event.preventDefault();

    const targetId = navLink.getAttribute("href");
    const targetSection = document.querySelector(targetId);

    if (!targetSection) return;

    if (isMenuOpen) {
      // 이동할 section을 선택한 뒤에도 열린 메뉴가 화면을 가리지 않게 닫는다.
      isMenuOpen = false;
      renderMenu();
    }

    targetSection.scrollIntoView({ behavior: "smooth", block: "start" });

    // 기본 anchor 이동을 막았으므로 공유 가능한 #주소는 직접 기록한다.
    window.history.pushState(null, "", targetId);
  });
});

scrollTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

themeToggle.addEventListener("click", () => {
  // 이벤트에서 변경한 상태를 저장한 뒤 DOM 갱신은 renderTheme()에 맡긴다.
  currentTheme = currentTheme === "light" ? "dark" : "light";
  hasUserThemePreference = true;
  localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
  renderTheme();
});

systemThemeQuery.addEventListener("change", (event) => {
  // 명시적인 사용자 선택이 있다면 시스템 설정이 바뀌어도 덮어쓰지 않는다.
  if (hasUserThemePreference) return;

  currentTheme = event.matches ? "dark" : "light";
  renderTheme();
});

formFields.forEach((field) => {
  field.addEventListener("input", () => {
    // 입력 이벤트마다 해당 필드의 상태만 갱신해 오류를 바로 수정할 수 있게 한다.
    updateFieldState(field);
    formState.status = "idle";
    renderFieldError(field);
    renderFormStatus();
  });
});

contactForm.addEventListener("submit", (event) => {
  // 브라우저의 페이지 이동을 막고 현재 문서에서 검증 결과를 렌더링한다.
  event.preventDefault();

  formFields.forEach((field) => {
    updateFieldState(field);
    renderFieldError(field);
  });

  const firstInvalidField = Array.from(formFields).find(
    (field) => formState.errors[field.name],
  );

  formState.status = firstInvalidField ? "error" : "success";
  renderFormStatus();

  // 오류가 있으면 사용자가 바로 수정할 수 있도록 첫 번째 필드로 초점을 옮긴다.
  if (firstInvalidField) firstInvalidField.focus();
});

projectsView.addEventListener("click", (event) => {
  // 동적으로 생성되는 Retry 버튼을 부모에서 감지해 listener를 다시 만들지 않는다.
  const retryButton = event.target.closest(".project-retry-button");

  if (!retryButton) return;
  fetchProjects();
});

window.addEventListener("scroll", handleScroll, { passive: true });

revealSections.forEach((section) => {
  // CSS 시작 상태는 JavaScript에서 추가해 JS 실패 시 콘텐츠가 숨지 않게 한다.
  section.classList.add("reveal-section");
  sectionObserver.observe(section.querySelector("h1, h2"));
});

// 새로고침 시 복원된 스크롤 위치까지 초기 상태에 반영한다.
renderMenu();
renderTheme();
handleScroll();
fetchProjects();
