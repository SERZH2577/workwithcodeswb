const formRef = document.getElementById("myForm");
const nameInputRef = document.getElementById("nameInput");
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
clearBtn.addEventListener("click", () => clearModal.classList.add("show"));

confirmBtn.addEventListener("click", () => {
  textareaRef.value = "";
  nameInputRef.value = "";
  statisticTextRef.innerHTML = "";
  clearModal.classList.remove("show");
  textareaRef.focus();
});

cancelBtn.addEventListener("click", () => clearModal.classList.remove("show"));

// --- Копирование ---
copyBtn.addEventListener("click", () => {
  const name = nameInputRef.value.trim();
  const text = textareaRef.value.trim();
  if (!name && !text) return;

  const combined = name ? name + "\n\n" + text : text;

  navigator.clipboard.writeText(combined).then(() => {
    copyModal.classList.add("show");
  });
});

okBtn.addEventListener("click", () => copyModal.classList.remove("show"));

// --- Закрытие кликом по фону ---
window.addEventListener("click", (event) => {
  if (event.target === clearModal) clearModal.classList.remove("show");
  if (event.target === copyModal) copyModal.classList.remove("show");
});

// --- Проверка на дубли ---
const checkBtn = document.getElementById("checkBtn");
checkBtn.addEventListener("click", checkDuplicates);

function checkDuplicates() {
  const values = textareaRef.value
    .replace(/\n/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (values.length === 0) {
    statisticTextRef.innerHTML = "";
    return;
  }

  const seen = {};
  const duplicates = [];

  values.forEach((val, idx) => {
    if (seen[val]) duplicates.push({ num: val, index: idx });
    else seen[val] = true;
  });

  statisticTextRef.innerHTML = "";

  if (duplicates.length > 0) {
    // скроллим к первому повтору
    highlightFirstDuplicate(duplicates[0].num);

    const repeatInfo = document.createElement("div");
    repeatInfo.className = "repeat-info";
    repeatInfo.innerHTML = `Повторов: <span class="statistic__text-data">${duplicates.length}</span>`;

    const btn = document.createElement("button");
    btn.textContent = "Удалить повторы";
    btn.className = "btn delete-btn";
    btn.style.marginTop = "10px";

    btn.addEventListener("click", () => deleteAllDuplicates(values));

    statisticTextRef.appendChild(repeatInfo);
    statisticTextRef.appendChild(btn);
    return;
  }

  // Вывод количества коробов
  const count = values.length;
  let corob = "коробов";
  if (count % 10 === 1 && count % 100 !== 11) corob = "короб";
  else if (
    [2, 3, 4].includes(count % 10) &&
    ![12, 13, 14].includes(count % 100)
  )
    corob = "короба";

  statisticTextRef.innerHTML = `Всего <span class="statistic__text-data">${count}</span> ${corob}.`;
}

function highlightFirstDuplicate(duplicateValue) {
  const text = textareaRef.value;
  const regex = new RegExp(`\\b${duplicateValue}\\b`);
  const match = regex.exec(text);

  if (match) {
    textareaRef.focus();
    textareaRef.setSelectionRange(
      match.index,
      match.index + duplicateValue.length
    );

    const lineHeight = 20;
    const beforeText = text.substring(0, match.index);
    const line = beforeText.split("\n").length;
    textareaRef.scrollTop = (line - 1) * lineHeight;
  }
}

function deleteAllDuplicates(values) {
  const unique = [...new Set(values)];
  textareaRef.value = unique.join("\n");
  checkDuplicates();
}
