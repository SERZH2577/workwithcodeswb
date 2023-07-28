const formRef = document.querySelector('.js-form');
const textareaRef = document.querySelector('.js-form textarea');
const statisticTextRef = document.querySelector('.js-statistic__text');
const btnHandleRef = document.querySelector('.btn-handle');

let barcodeArr = '';

btnHandleRef.addEventListener('click', outputsTheResult);

function checksForMatches(arr) {
  let amountOfNumbers = 0;
  let corob = 'коробов';
  for (let i = 0; i < arr.length; i += 1) {
    amountOfNumbers += 1;
    for (let j = i + 1; j < arr.length; j += 1) {
      if (arr[i] === arr[j]) {
        statisticTextRef.innerHTML = `есть повтор ${arr[i]}`;
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

  statisticTextRef.innerHTML = `Повторов нет. Всего <span style="color:#b30f97; font-size:30px; font-weight:bold">${amountOfNumbers}</span> ${corob}.`;
}

function outputsTheResult(e) {
  e.preventDefault();

  barcodeArr = textareaRef.value.replace(/\n/g, ' ').trim().split(' ');

  checksForMatches(barcodeArr);
  console.log(barcodeArr);
}
