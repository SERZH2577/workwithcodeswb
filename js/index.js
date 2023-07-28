const formRef = document.querySelector('.js-form');
const textareaRef = document.querySelector('.js-form textarea');
const statisticTextRef = document.querySelector('.js-statistic__text');
const btnHandleRef = document.querySelector('.btn-handle');

// const barcodeArr = [
//   '046100698500332072',
//   '046100698500331891',
//   '046100698500336728',
//   '046100698500420175',
//   '046100698500419780',
//   '046100698500340930',
//   '046100698500258808',
//   '046100698500430730',
//   '046100698500418936',
//   '046100698500424135',
//   '046100698500423336',
//   '046100698500421608',
//   '046100698500423633',
//   '046100698500264052',
//   '046100698500276635',
//   '046100698500427549',
//   '046100698500368798',
//   '046100698500379879',
//   '046100698500437968',
//   '046100698500377783',
//   '046100698500377509',
//   '046100698500327207',
//   '046100698500409712',
//   '046100698500403178',
//   '046100698500320222',
//   '046100698500368590',
//   '046100698500371323',
//   '046100698500426115',
//   '046100698500416642',
// ];

let barcodeArr = '';

btnHandleRef.addEventListener('click', outputsTheResult);

function checksForMatches(arr) {
  let amountOfNumbers = 0;
  for (let i = 0; i < arr.length; i += 1) {
    amountOfNumbers += 1;
    for (let j = i + 1; j < arr.length; j += 1) {
      if (arr[i] === arr[j]) {
        statisticTextRef.innerHTML = `есть повтор ${arr[i]}`;
        return;
      }
    }
  }
  statisticTextRef.innerHTML = `Повторов нет. Всего ${amountOfNumbers} уникальных номеров.`;
}

function outputsTheResult(e) {
  e.preventDefault();

  barcodeArr = textareaRef.value.replace(/\n/g, ' ').trim().split(' ');

  checksForMatches(barcodeArr);
  console.log(barcodeArr);
}
