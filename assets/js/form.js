document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("[data-form]");
  const overlay = document.getElementById("successOverlay");
  const popover = document.getElementById("successPopover");

  if (!form) return;

  hideAllErrors();

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    hideAllErrors();

    const nameInput = document.querySelector("[data-name]");
    const phoneInput = document.querySelector("[data-phone]");

    const nameErrorSpan = nameInput
      ?.closest(".input-wrapper")
      ?.querySelector(".input-error");
    const phoneErrorSpan = phoneInput
      ?.closest(".input-wrapper")
      ?.querySelector(".input-error");

    let hasErrors = false;

    // Name Validation
    if (!nameInput.value.trim()) {
      showError(nameInput, nameErrorSpan, "Name is required");
      hasErrors = true;
    } else {
      const nameRegex = /^[A-Za-z\s\-]+$/;
      if (!nameRegex.test(nameInput.value)) {
        showError(
          nameInput,
          nameErrorSpan,
          "Only Latin letters, spaces and hyphens allowed"
        );
        hasErrors = true;
      }

      if (nameInput.value !== nameInput.value.trim()) {
        showError(
          nameInput,
          nameErrorSpan,
          "Name cannot have leading or trailing spaces"
        );
        hasErrors = true;
      }

      if (nameInput.value.includes("  ")) {
        showError(
          nameInput,
          nameErrorSpan,
          "Name cannot have multiple consecutive spaces"
        );
        hasErrors = true;
      }
    }

    // Phone Validation
    if (!phoneInput.value.trim()) {
      showError(phoneInput, phoneErrorSpan, "Phone is required");
      hasErrors = true;
    } else {
      const phoneWithoutSpaces = phoneInput.value.replace(/\s/g, "");
      const phoneRegex = /^[0-9+]+$/;

      if (!phoneRegex.test(phoneWithoutSpaces)) {
        showError(
          phoneInput,
          phoneErrorSpan,
          "Only numbers and plus sign allowed"
        );
        hasErrors = true;
      }

      if (phoneWithoutSpaces[0] !== "+") {
        showError(
          phoneInput,
          phoneErrorSpan,
          "Phone must start with plus symbol"
        );
        hasErrors = true;
      }

      if (/\s/.test(phoneInput.value)) {
        showError(phoneInput, phoneErrorSpan, "Phone cannot contain spaces");
        hasErrors = true;
      }
    }

    if (!hasErrors) {
      openPopover();
      clearFormFields();
      // form.submit();
    }
  });

  function clearFormFields() {
    const nameInput = document.querySelector("[data-name]");
    const phoneInput = document.querySelector("[data-phone]");

    if (nameInput) {
      nameInput.value = "";
    }

    if (phoneInput) {
      phoneInput.value = "";
    }
  }

  function showError(input, errorSpan, message) {
    input.classList.add("border-2", "border-[#ef4444]", "bg-[#ef44441A]");

    if (errorSpan) {
      errorSpan.textContent = message;
      errorSpan.style.display = "block";
    }
  }

  function hideAllErrors() {
    document.querySelectorAll(".input-error").forEach((span) => {
      span.style.display = "none";
    });

    document.querySelectorAll("[data-name], [data-phone]").forEach((input) => {
      input.classList.remove("border-2", "border-[#ef4444]", "bg-[#ef44441A]");
    });

    if (overlay && overlay.classList.contains("active")) {
      closePopover();
    }
  }

  function openPopover() {
    if (overlay) {
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  function closePopover() {
    if (overlay) {
      overlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  if (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) {
        closePopover();
      }
    });
  }
  if (popover) {
    popover.addEventListener("click", function (e) {
      closePopover();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay && overlay.classList.contains("active")) {
      closePopover();
    }
  });

  const nameInput = document.querySelector("[data-name]");
  const phoneInput = document.querySelector("[data-phone]");

  if (nameInput) {
    nameInput.addEventListener("input", function () {
      const wrapper = this.closest(".input-wrapper");
      const errorSpan = wrapper?.querySelector(".input-error");
      if (errorSpan) {
        errorSpan.style.display = "none";
      }
      this.classList.remove("border-2", "border-[#ef4444]", "bg-[#ef44441A]");

      if (overlay && overlay.classList.contains("active")) {
        closePopover();
      }
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener("input", function () {
      const wrapper = this.closest(".input-wrapper");
      const errorSpan = wrapper?.querySelector(".input-error");
      if (errorSpan) {
        errorSpan.style.display = "none";
      }
      this.classList.remove("border-2", "border-[#ef4444]", "bg-[#ef44441A]");

      if (overlay && overlay.classList.contains("active")) {
        closePopover();
      }
    });
  }
});
