let arrayFromLowToHigh = (low, high) => {
  const array = [];
  for (let i = low; i <= high; i++) {
    array.push(i);
  }
  return array;
};

let generatePassword = (generater) => {
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
  let finalPass = [];
  for (let i = 0; i < generater.characterAmount; i++) {
    const charcter = String.fromCharCode(
      startPass[Math.floor(Math.random() * startPass.length)]
    );
    finalPass.push(charcter);
  }
  finalPass = finalPass.join("");
  return finalPass;
};

$(document).ready(function () {
  const resultDOM = document.getElementById("result");
  const lengthDOM = document.getElementById("length");
  const lowercaseDOM = document.getElementById("lowercase");
  const uppercaseDOM = document.getElementById("uppercase");
  const numbersDOM = document.getElementById("numbers");
  const symbolsDOM = document.getElementById("symbols");
  const generatebtn = document.getElementById("generate");
  const form = document.getElementById("passwordGeneratorForm");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const characterAmount = lengthDOM.value;
    const includeLowercase = lowercaseDOM.checked;
    const includeUppercase = uppercaseDOM.checked;
    const includeNumbers = numbersDOM.checked;
    const includeSymbols = symbolsDOM.checked;
    const options = {
      characterAmount,
      includeLowercase,
      includeUppercase,
      includeNumbers,
      includeSymbols,
    };
    const password = generatePassword(options);
    $("#new_password").val(password);
  });
});
