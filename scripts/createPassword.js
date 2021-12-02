$document.ready(function () {

  const  passwordLength = document.getElementById("length").value
  const numbersInPassword = document.getElementById("numbers").value
  const caseSensitive = document.getElementById("case_sensitive").value
  const specialCharacters = document.getElementById("special_characters").value

const generatePassword = function() {
  let password = ''
  let  s = "!\"§$%&/()=?\u{20ac}"
  let uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let lowercase = 'abcdefghijklmnopqrstuvwxyz'
  let numbers = '123456789'
  let characters = ''

  if(caseSensitive ) characters.concat(uppercase)
  if(numbersInPassword) characters.concat(numbers)
  if(specialCharacters) characters.concat(s)


  for(let i = 0; i< passwordLength; i++){
    password += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return password
}

})
