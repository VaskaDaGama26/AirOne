function getBurgerElements() {
  const overlay = document.getElementById("burger-overlay");
  const burger = document.getElementById("burger-menu");
  const toggleButton = document.getElementById("burger");

  if (!overlay || !burger || !toggleButton) {
    console.warn("Бургер-меню: не найдены необходимые элементы");
    return null;
  }

  return { overlay, burger, toggleButton };
}

function closeBurger({ burger, overlay, toggleButton }) {
  burger.classList.remove("flex");
  burger.classList.add("hidden");
  overlay.classList.add("hidden");
  toggleButton.setAttribute("aria-expanded", "false");
  document.body.classList.remove("overflow-hidden");
}

function openBurger({ burger, overlay, toggleButton }) {
  burger.classList.remove("hidden");
  burger.classList.add("flex");
  overlay.classList.remove("hidden");
  toggleButton.setAttribute("aria-expanded", "true");
  document.body.classList.add("overflow-hidden");
}

function toggleBurgerState(burgerData) {
  const { toggleButton } = burgerData;
  const isExpanded = toggleButton.getAttribute("aria-expanded") === "true";

  if (isExpanded) {
    closeBurger(burgerData);
  } else {
    openBurger(burgerData);
  }
}

function prepareBurger() {
  const elements = getBurgerElements();
  if (!elements) return;

  const { toggleButton, burger, overlay } = elements;
  toggleButton.setAttribute("aria-expanded", "false");
  toggleButton.setAttribute("aria-controls", "burger");

  const handleClickToggle = () => toggleBurgerState(elements);
  const handleClickOverlay = () => closeBurger(elements);
  const handleEscape = (e) => {
    if (e.key === "Escape" && !burger.classList.contains("hidden")) {
      closeBurger(elements);
    }
  };

  function checkScreenSize() {
    const isMobile = window.innerWidth < 1280;

    if (isMobile) {
      toggleButton.addEventListener("click", handleClickToggle);
      overlay.addEventListener("click", handleClickOverlay);
      document.addEventListener("keydown", handleEscape);
    } else {
      closeBurger(elements);
      toggleButton.removeEventListener("click", handleClickToggle);
      overlay.removeEventListener("click", handleClickOverlay);
      document.removeEventListener("keydown", handleEscape);
    }
  }

  // Инициализация бургера
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
}

document.addEventListener("DOMContentLoaded", () => {
  prepareBurger();
});
