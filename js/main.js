const menuToggle = document.querySelector(".menu-toggle");
const menuIcon = document.querySelector(".menu-icon");
const navigation = document.querySelector(".site-navigation");
const navLinks = document.querySelectorAll(".nav-list a");
const siteHeader = document.querySelector(".site-header");
const scrollTopButton = document.querySelector(".scroll-top-button");

const NAV_SCROLL_THRESHOLD = 60;
const SCROLL_TOP_THRESHOLD = 300;

// click 이벤트와 렌더링 함수가 함께 사용하는 메뉴의 현재 상태다.
let isMenuOpen = false;

// scroll 이벤트와 렌더링 함수가 함께 사용하는 Header의 현재 상태다.
let isHeaderScrolled = false;

// scroll 이벤트와 렌더링 함수가 함께 사용하는 버튼의 표시 상태다.
let isScrollTopVisible = false;

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

window.addEventListener("scroll", handleScroll, { passive: true });

// 새로고침 시 복원된 스크롤 위치까지 초기 상태에 반영한다.
renderMenu();
handleScroll();
