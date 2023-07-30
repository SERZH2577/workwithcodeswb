const formRef = document.querySelector('.js-form');
const textareaRef = document.querySelector('.js-form textarea');
const statisticTextRef = document.querySelector('.js-statistic__text');
const btnHandleRef = document.querySelector('.btn-handle');
const btnClearRef = document.querySelector('.btn-clear');
const btnCopyRef = document.querySelector('.btn-copy');

let barcode = '';

btnHandleRef.addEventListener('click', onOutputsTheResult);
btnClearRef.addEventListener('click', onTextareaClear);
btnCopyRef.addEventListener('click', onCopy);

function checksForMatches(arr) {
  let amountOfNumbers = 0;
  let corob = 'коробов';

  for (let i = 0; i < arr.length; i += 1) {
    amountOfNumbers += 1;
    for (let j = i + 1; j < arr.length; j += 1) {
      if (arr[i] === arr[j]) {
        statisticTextRef.innerHTML = `Есть повтор </br><span class="statistic__text-data">${arr[i]}</span>`;
        return;
      }
    }
  }

  const numStr = amountOfNumbers.toString();

  if (numStr !== '11' && numStr.slice(-1) === '1') {
    corob = 'короб';
  } else if (
    (numStr !== '12' && numStr.slice(-1) === '2') ||
    (numStr !== '13' && numStr.slice(-1) === '3') ||
    (numStr !== '14' && numStr.slice(-1) === '4')
  ) {
    corob = 'короба';
  }

  statisticTextRef.innerHTML = `Всего <span class="statistic__text-data">${amountOfNumbers}</span> ${corob}.`;
}

function onOutputsTheResult(e) {
  e.preventDefault();

  barcode = textareaRef.value
    .replace(/\n/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);

  if (barcode.length === 0) {
    return;
  }

  checksForMatches(barcode);
}

function onTextareaClear(e) {
  e.preventDefault();

  formRef.reset();
  statisticTextRef.innerHTML = '';
}

function onCopy(e) {
  e.preventDefault();

  textareaRef.select();
  document.execCommand('copy');
}
