import { FormValidator } from "../assets/js/forms/FormValidator.js";
import { PopoverManager } from "../assets/js/forms/PopoverManager.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log(
    "%c🚀 Инициализация формы",
    "background: #4886FF; color: white; padding: 2px 5px; border-radius: 3px;",
  );

  // Находим элементы
  const form = document.querySelector("[data-form]");
  const openPopupBtn = document.querySelector("[data-open-popup]");
  const closePopupBtn = document.querySelector("[data-close-popup]");

  console.log("📋 Поиск элементов DOM:");
  console.log("   - Форма [data-form]:", form ? "✅ Найдена" : "❌ НЕ НАЙДЕНА");
  console.log(
    "   - Кнопка открытия [data-open-popup]:",
    openPopupBtn ? "✅ Найдена" : "❌ НЕ НАЙДЕНА",
  );
  console.log(
    "   - Кнопка закрытия [data-close-popup]:",
    closePopupBtn ? "✅ Найдена" : "❌ НЕ НАЙДЕНА",
  );

  if (!form) {
    console.error(
      "%c❌ КРИТИЧЕСКАЯ ОШИБКА: Форма не найдена! Проверьте атрибут [data-form] в HTML",
      "color: red; font-weight: bold;",
    );
    return;
  }

  // Проверяем наличие полей в форме
  const nameInput = form.querySelector('[data-validate="name"]');
  const phoneInput = form.querySelector('[data-validate="phone"]');
  const checkboxInput = form.querySelector('[data-validate="checkbox"]');

  console.log("📝 Поля формы:");
  console.log(
    "   - Поле имени [data-validate='name']:",
    nameInput ? "✅ Найдено" : "❌ НЕ НАЙДЕНО",
  );
  console.log(
    "   - Поле телефона [data-validate='phone']:",
    phoneInput ? "✅ Найдено" : "❌ НЕ НАЙДЕНО",
  );
  console.log(
    "   - Чекбокс [data-validate='checkbox']:",
    checkboxInput ? "✅ Найдено" : "❌ НЕ НАЙДЕНО",
  );

  // Проверяем элементы попапа
  const overlay = document.getElementById("successOverlay");
  const popover = document.getElementById("successPopover");

  console.log("🪟 Попап элементы:");
  console.log(
    "   - Оверлей #successOverlay:",
    overlay ? "✅ Найден" : "❌ НЕ НАЙДЕН",
  );
  console.log(
    "   - Попап #successPopover:",
    popover ? "✅ Найден" : "❌ НЕ НАЙДЕН",
  );

  if (!overlay || !popover) {
    console.warn(
      "⚠️ Попап не будет работать: отсутствуют элементы #successOverlay или #successPopover в HTML",
    );
  }

  // Инициализация классов
  console.log("🛠 Инициализация классов...");

  let validator, popup;

  try {
    validator = new FormValidator(form);
    console.log("   ✅ FormValidator инициализирован успешно");
  } catch (error) {
    console.error("   ❌ Ошибка инициализации FormValidator:", error);
  }

  try {
    popup = new PopoverManager("successOverlay", "successPopover");
    console.log("   ✅ PopoverManager инициализирован успешно");
  } catch (error) {
    console.error("   ❌ Ошибка инициализации PopoverManager:", error);
  }

  // Отправка формы
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(
      "%c📤 Отправка формы",
      "background: #FFA500; color: white; padding: 2px 5px; border-radius: 3px;",
    );

    if (!validator) {
      console.error("❌ FormValidator не инициализирован");
      return;
    }

    console.log("🔍 Запуск валидации...");
    const isValid = validator.validateAll();

    console.log(
      "   - Результат валидации:",
      isValid ? "✅ Успешно" : "❌ Есть ошибки",
    );

    if (isValid) {
      const formData = validator.getFormData();
      console.log("   📦 Данные формы:", formData);

      if (popup) {
        console.log("   🟢 Открываем попап успеха");
        popup.open();
      } else {
        console.error("   ❌ PopoverManager не инициализирован");
      }

      console.log("✅ Форма успешно обработана");
    } else {
      const errors = validator.getErrors();
      console.log("   ❌ Ошибки валидации:", errors);

      // Показываем первую ошибку в консоли
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        console.log(
          `   ⚠️ Первое поле с ошибкой: ${firstErrorField} - "${errors[firstErrorField]}"`,
        );
      }
    }
  });

  // Открыть попап по кнопке
  if (openPopupBtn) {
    openPopupBtn.addEventListener("click", () => {
      console.log("🟢 Ручное открытие попапа по кнопке");
      if (popup) {
        popup.open();
      } else {
        console.error("❌ PopoverManager не инициализирован");
      }
    });
    console.log("   ✅ Обработчик для открытия попапа добавлен");
  } else {
    console.log(
      "   ⏭️ Кнопка открытия попапа отсутствует, обработчик не добавлен",
    );
  }

  // Закрыть попап по кнопке
  if (closePopupBtn) {
    closePopupBtn.addEventListener("click", () => {
      console.log("🔴 Ручное закрытие попапа по кнопке");
      if (popup) {
        popup.close();
      } else {
        console.error("❌ PopoverManager не инициализирован");
      }
    });
    console.log("   ✅ Обработчик для закрытия попапа добавлен");
  } else {
    console.log(
      "   ⏭️ Кнопка закрытия попапа отсутствует, обработчик не добавлен",
    );
  }

  console.log(
    "%c✅ Инициализация завершена",
    "background: #4CAF50; color: white; padding: 2px 5px; border-radius: 3px;",
  );
});
