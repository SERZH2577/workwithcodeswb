const nameInputRef = document.getElementById("nameInput");
const textareaRef = document.getElementById("myTextarea");
const statisticTextRef = document.querySelector(".js-statistic__text");

const clearBtn = document.getElementById("clearBtn");
const clearModal = document.getElementById("clearModal");
const confirmBtn = document.getElementById("confirmBtn");
const cancelBtn = document.getElementById("cancelBtn");

const copyBtn = document.getElementById("copyBtn");
const copyModal = document.getElementById("copyModal");
const okBtn = document.getElementById("okBtn");

const checkBtn = document.getElementById("checkBtn");

const scannerBtn = document.getElementById("scanner-btn");
const qrReader = document.getElementById("qr-reader");

let html5QrCode;
let scannedCodes = new Set(); // уже отсканированные коды
let stopBtn;

// --- Очистка ---
clearBtn.addEventListener("click", () => clearModal.classList.add("show"));
confirmBtn.addEventListener("click", () => {
  textareaRef.value = "";
  nameInputRef.value = "";
  statisticTextRef.innerHTML = "";
  clearModal.classList.remove("show");
  scannedCodes.clear();
  textareaRef.focus();
});
cancelBtn.addEventListener("click", () => clearModal.classList.remove("show"));

// --- Копирование ---
copyBtn.addEventListener("click", () => {
  const name = nameInputRef.value.trim();
  const text = textareaRef.value.trim();
  if (!name && !text) return;
  const combined = name ? name + "\n\n" + text : text;
  navigator.clipboard
    .writeText(combined)
    .then(() => copyModal.classList.add("show"));
});
okBtn.addEventListener("click", () => copyModal.classList.remove("show"));

// --- Проверка дублирования ---
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
  const seen = {},
    duplicates = [];
  values.forEach((v, i) => {
    seen[v] ? duplicates.push({ num: v, index: i }) : (seen[v] = true);
  });
  statisticTextRef.innerHTML = "";
  if (duplicates.length > 0) {
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
  const count = values.length;
  let corob = "коробов";
  if (count % 10 === 1 && count % 100 !== 11) corob = "короб";
  else if (
    [2, 3, 4].includes(count % 10) &&
    ![12, 13, 14].includes(count % 100)
  )
    corob = "короба";
  statisticTextRef.innerHTML = `Всего <span class="statistic__text-data">${count}</span> ${corob}.`;

  // --- добавляем кнопку "Поделиться" ---
  const shareBtn = document.createElement("button");
  shareBtn.textContent = "Поделиться";
  shareBtn.className = "btn share-btn";
  shareBtn.style.marginTop = "10px";

  shareBtn.addEventListener("click", () => {
    const name = nameInputRef.value.trim();
    const text = textareaRef.value.trim();
    const combined = name ? name + "\n\n" + text : text;

    if (navigator.share) {
      navigator
        .share({
          title: "Список коробов",
          text: combined,
        })
        .catch(() => {});
    } else {
      navigator.clipboard
        .writeText(combined)
        .then(() => alert("Скопировано в буфер обмена!"));
    }
  });

  if (!document.querySelector(".share-btn")) {
    statisticTextRef.appendChild(shareBtn);
  }
}
function highlightFirstDuplicate(val) {
  const text = textareaRef.value;
  const match = new RegExp(`\\b${val}\\b`).exec(text);
  if (match) {
    textareaRef.focus();
    textareaRef.setSelectionRange(match.index, match.index + val.length);
    const lineHeight = 20;
    const line = text.substring(0, match.index).split("\n").length;
    textareaRef.scrollTop = (line - 1) * lineHeight;
  }
}
function deleteAllDuplicates(values) {
  const unique = [...new Set(values)];
  textareaRef.value = unique.join("\n");
  checkDuplicates();
}

// --- QR Scanner ---
scannerBtn.addEventListener("click", startScanner);

function startScanner() {
  scannerBtn.style.display = "none";

  stopBtn = document.createElement("button");
  stopBtn.textContent = "STOP SCAN";
  stopBtn.className = "btn";
  stopBtn.id = "stop-btn";
  stopBtn.style.width = "116px";
  stopBtn.style.height = "150px";
  stopBtn.style.border = "2px solid #f33c3c";
  scannerBtn.parentNode.insertBefore(stopBtn, qrReader);

  qrReader.classList.add("active");
  qrReader.style.display = "block";

  html5QrCode = new Html5Qrcode("qr-reader");
  html5QrCode.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: { width: 200, height: 150 } },
    onScanSuccess,
    () => {}
  );

  stopBtn.addEventListener("click", stopScanner);
}

function stopScanner() {
  if (html5QrCode) {
    html5QrCode
      .stop()
      .then(() => html5QrCode.clear())
      .catch(() => {});
  }

  qrReader.classList.remove("active");
  qrReader.style.display = "block"; // показываем рамку

  if (stopBtn) {
    stopBtn.remove();
  }
  scannerBtn.style.display = "block";
}

function onScanSuccess(decodedText) {
  if (!scannedCodes.has(decodedText)) {
    scannedCodes.add(decodedText);
    textareaRef.value += (textareaRef.value ? "\n" : "") + decodedText;
    qrReader.style.borderColor = "green";
    setTimeout(() => (qrReader.style.borderColor = "#000"), 200);
  }
}
