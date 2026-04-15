const crypto = require("crypto");

const CHAR_SETS = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>/?"
};

function getRandomInt(max) {
  return crypto.randomInt(0, max);
}

function pickRandom(characters) {
  return characters[getRandomInt(characters.length)];
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = getRandomInt(i + 1);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generatePassword(options) {
  const {
    length = 12,
    includeSymbols = true,
    includeNumbers = true,
    includeUppercase = true,
    includeLowercase = true
  } = options;

  const groups = [];

  if (includeLowercase) groups.push(CHAR_SETS.lowercase);
  if (includeUppercase) groups.push(CHAR_SETS.uppercase);
  if (includeNumbers) groups.push(CHAR_SETS.numbers);
  if (includeSymbols) groups.push(CHAR_SETS.symbols);

  if (groups.length === 0) {
    throw new Error("Select at least one character type");
  }

  if (length < groups.length) {
    throw new Error("Length is too short for selected options");
  }

  let allCharacters = "";
  groups.forEach((group) => {
    allCharacters += group;
  });

  const passwordChars = groups.map((group) => pickRandom(group));

  while (passwordChars.length < length) {
    passwordChars.push(pickRandom(allCharacters));
  }

  return shuffle(passwordChars).join("");
}

module.exports = { generatePassword };
