const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-navigation");
const navLinks = document.querySelectorAll(".nav-list a");

// click 이벤트와 렌더링 함수가 함께 사용하는 메뉴의 현재 상태다.
let isMenuOpen = false;

// 상태를 기준으로 class와 접근성 속성을 한곳에서 함께 갱신한다.
const renderMenu = () => {
  navigation.classList.toggle("is-open", isMenuOpen);
  menuToggle.setAttribute("aria-expanded", String(isMenuOpen));
  menuToggle.setAttribute("aria-label", isMenuOpen ? "메뉴 닫기" : "메뉴 열기");
};

menuToggle.addEventListener("click", () => {
  // 사용자 이벤트는 상태만 바꾸고, 실제 DOM 변경은 렌더링 함수에 맡긴다.
  isMenuOpen = !isMenuOpen;
  renderMenu();
});

navLinks.forEach((navLink) => {
  navLink.addEventListener("click", () => {
    if (!isMenuOpen) return;

    // 이동할 section을 선택한 뒤에도 열린 메뉴가 화면을 가리지 않게 닫는다.
    isMenuOpen = false;
    renderMenu();
  });
});

// HTML의 초기 표시도 JavaScript 상태와 일치하도록 한 번 렌더링한다.
renderMenu();
