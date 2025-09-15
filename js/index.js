const formRef = document.getElementById("myForm");
const textareaRef = document.getElementById("myTextarea");
const statisticTextRef = document.querySelector(".js-statistic__text");

// --- Модалки ---
const clearBtn = document.getElementById("clearBtn");
const clearModal = document.getElementById("clearModal");
const confirmBtn = document.getElementById("confirmBtn");
const cancelBtn = document.getElementById("cancelBtn");

const copyBtn = document.getElementById("copyBtn");
const copyModal = document.getElementById("copyModal");
const okBtn = document.getElementById("okBtn");

// --- Очистка ---
clearBtn.addEventListener("click", () => {
  clearModal.classList.add("show");
});

confirmBtn.addEventListener("click", () => {
  textareaRef.value = "";
  statisticTextRef.innerHTML = "";
  clearModal.classList.remove("show");
  textareaRef.focus();
});

cancelBtn.addEventListener("click", () => {
  clearModal.classList.remove("show");
});

// --- Копирование ---
copyBtn.addEventListener("click", () => {
  if (textareaRef.value.trim() === "") return;
  textareaRef.select();
  document.execCommand("copy");
  copyModal.classList.add("show");
});

okBtn.addEventListener("click", () => {
  copyModal.classList.remove("show");
});

// --- Закрытие кликом по фону ---
window.addEventListener("click", (event) => {
  if (event.target === clearModal) clearModal.classList.remove("show");
  if (event.target === copyModal) copyModal.classList.remove("show");
});

// --- Проверка на дубли (Проверить) ---
const checkBtn = document.getElementById("checkBtn");

checkBtn.addEventListener("click", () => {
  const values = textareaRef.value
    .replace(/\n/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);

  if (values.length === 0) {
    statisticTextRef.innerHTML = "";
    return;
  }

  for (let i = 0; i < values.length; i++) {
    for (let j = i + 1; j < values.length; j++) {
      if (values[i] === values[j]) {
        statisticTextRef.innerHTML = `Есть повтор: <span class="statistic__text-data">${values[i]}</span>`;
        return;
      }
    }
  }

  // Вывод количества
  const count = values.length;
  let corob = "коробов";
  if (count % 10 === 1 && count % 100 !== 11) corob = "короб";
  else if (
    [2, 3, 4].includes(count % 10) &&
    ![12, 13, 14].includes(count % 100)
  )
    corob = "короба";

  statisticTextRef.innerHTML = `Всего <span class="statistic__text-data">${count}</span> ${corob}.`;
});
