let arrayLength = (low, high) => {
  const array = [];
  for (let i = low; i <= high; i++) {
    array.push(i);
  }
  return array;
};

const upperCaseCode = arrayLength(65, 70);
const lowerCaseCode = arrayLength(97, 100);
const numberCode = arrayLength(48, 50);
const symbolCode = arrayLength(33, 40)
  .concat(arrayLength(58, 60))
  .concat(arrayLength(91, 94))
  .concat(arrayLength(123, 124));

let generatePassword = (options) => {
  let startPass = [];
  if (options.includeLowercase) {
    startPass = startPass.concat(lowerCaseCode);
  }
  if (options.includeUppercase) {
    startPass = startPass.concat(upperCaseCode);
  }
  if (options.includeNumbers) {
    startPass = startPass.concat(numberCode);
  }
  if (options.includeSymbols) {
    startPass = startPass.concat(symbolCode);
  }

  const finalPass = [];
  for (let i = 0; i < options.characterAmount; i++) {
    const characterCode = startPass[Math.floor(Math.random() * startPass.length)];
    finalPass.push(String.fromCharCode(characterCode));
  }

  return finalPass.join("");
};

$(document).ready(function () {
  const resultDOM = $("#resultDOM");
  const lengthDOM = $("#length");
  const lowercaseDOM = $("#lowercase");
  const uppercaseDOM = $("#uppercase");
  const numbersDOM = $("#numbers");
  const symbolsDOM = $("#symbols");
  const generatebtn = $("#generate");

  generatebtn.on("click", (event) => {
    event.preventDefault();
    const characterAmount = parseInt(lengthDOM.val());
    const includeLowercase = lowercaseDOM.is(":checked");
    const includeUppercase = uppercaseDOM.is(":checked");
    const includeNumbers = numbersDOM.is(":checked");
    const includeSymbols = symbolsDOM.is(":checked");

    const options = {
      characterAmount,
      includeLowercase,
      includeUppercase,
      includeNumbers,
      includeSymbols,
    };

    const password = generatePassword(options);

    resultDOM.val(password);
  });
});
