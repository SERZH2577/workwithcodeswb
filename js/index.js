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

let codeReader;
let currentStream = null;
let scannedCodes = new Set();
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

  const seen = {};
  const duplicates = [];

  values.forEach((v, i) => {
    seen[v] ? duplicates.push({ num: v, index: i }) : (seen[v] = true);
  });

  statisticTextRef.innerHTML = "";

  if (duplicates.length > 0) {
    highlightFirstDuplicate(duplicates[0].num);

    const repeatInfo = document.createElement("div");
    repeatInfo.className = "repeat-info";
    repeatInfo.innerHTML = `Повторов: <span class="statistic__text-data">${duplicates.length}</span>`;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Удалить повторы";
    deleteBtn.className = "btn delete-btn";
    deleteBtn.style.marginTop = "10px";
    deleteBtn.addEventListener("click", () => deleteAllDuplicates(values));

    statisticTextRef.appendChild(repeatInfo);
    statisticTextRef.appendChild(deleteBtn);
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

  let shareIcon = document.querySelector(".share-icon");

  if (!shareIcon) {
    shareIcon = document.createElement("img");
    shareIcon.src = "img/share.svg";
    shareIcon.className = "share-icon";
    shareIcon.style.width = "48px";
    shareIcon.style.marginTop = "10px";

    shareIcon.addEventListener("click", () => {
      const name = nameInputRef.value.trim();
      const text = textareaRef.value.trim();
      const combined = name ? name + "\n\n" + text : text;

      if (navigator.share) {
        navigator.share({ title: "Список коробов", text: combined });
      } else {
        navigator.clipboard.writeText(combined);
        alert("Скопировано!");
      }
    });

    statisticTextRef.appendChild(shareIcon);
  }
}

function highlightFirstDuplicate(val) {
  const text = textareaRef.value;
  const match = new RegExp(`\\b${val}\\b`).exec(text);
  if (match) {
    textareaRef.focus();
    textareaRef.setSelectionRange(match.index, match.index + val.length);
  }
}

function deleteAllDuplicates(values) {
  textareaRef.value = [...new Set(values)].join("\n");
  checkDuplicates();
}

// =====================
// ✅ ZXING СКАНЕР
// =====================

scannerBtn.addEventListener("click", startScanner);

async function startScanner() {
  scannerBtn.style.display = "none";

  stopBtn = document.createElement("button");
  stopBtn.textContent = "STOP SCAN";
  stopBtn.className = "btn";
  stopBtn.style.height = "150px";
  scannerBtn.parentNode.insertBefore(stopBtn, qrReader);

  qrReader.innerHTML = ""; // очистка контейнера

  // создаем видео элемент
  const video = document.createElement("video");
  video.setAttribute("autoplay", true);
  video.setAttribute("playsinline", true);
  video.style.width = "100%";
  video.style.height = "100%";

  qrReader.appendChild(video);

  try {
    currentStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    video.srcObject = currentStream;

    await video.play(); // 🔥 КЛЮЧЕВОЙ МОМЕНТ

    codeReader = new ZXing.BrowserMultiFormatReader();

    codeReader.decodeFromVideoElement(video, (result, err) => {
      if (result) {
        const text = result.getText();

        if (!scannedCodes.has(text)) {
          scannedCodes.add(text);
          textareaRef.value += (textareaRef.value ? "\n" : "") + text;

          qrReader.style.borderColor = "green";
          setTimeout(() => (qrReader.style.borderColor = "#cfae09"), 200);
        }
      }
    });
  } catch (e) {
    console.error(e);
    alert("Нет доступа к камере");
    stopScanner();
  }

  stopBtn.addEventListener("click", stopScanner);
}

function stopScanner() {
  if (codeReader) {
    codeReader.reset();
    codeReader = null;
  }

  if (currentStream) {
    currentStream.getTracks().forEach((track) => track.stop());
    currentStream = null;
  }

  qrReader.innerHTML = ""; // убираем видео

  if (stopBtn) stopBtn.remove();
  scannerBtn.style.display = "block";
}
