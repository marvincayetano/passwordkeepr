let arrayFromLowToHigh = (low, high) => {
  const array = [];
  for (let i = low; i <= high; i++) {
    array.push(i);
  }
  return array;
};

let generatePassword = (characterAmount) => {
  const upperCaseCodes = arrayFromLowToHigh(65, 90);
  const lowerCaseCodes = arrayFromLowToHigh(97, 122);
  const numberCodes = arrayFromLowToHigh(48, 57);
  const symbolCodes = arrayFromLowToHigh(33, 47)
    .concat(arrayFromLowToHigh(58, 64))
    .concat(arrayFromLowToHigh(91, 96))
    .concat(arrayFromLowToHigh(123, 126));

  let startPass = [];
  if (generater.includeLowerCaseCode) {
    startPass = startPass.concat(lowerCaseCodes);
  }
  if (generater.includeUpperCaseCode) {
    startPass = startPass.concat(upperCaseCodes);
  }
  if (generater.includeNumberCodes) {
    startPass = startPass.concat(numberCodes);
  }
  if (generater.includeSymbolCodes) {
    startPass = startPass.concat(symbolCodes);
  }
  const finalPass = [];
  for (let i = 0; i < characterAmount; i++) {
    const charcter = String.fromCharCode(
      startPass[Math.floor(Math.random() * startPass.length)]
    );
    finalPass.push(charcter);
  }
  finalPass = finalPass.join("");
  return finalPass;
};

$(document).ready(function () {
  const resultDOM = $("#result");
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
    console.log(password);

    resultDOM.val(password);
  });
});
