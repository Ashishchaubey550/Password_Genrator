const inputslider = document.querySelector("[data-number-slider]");
const lengthdisplay = document.querySelector("[data-length-number]");
const passwordDisplay = document.querySelector("[data-password-display]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copymsg]");
const upperCaseCheck = document.querySelector("#uppercase");
const lowerCaseCheck = document.querySelector("#Lowercase");
const numbersCheck = document.querySelector("#Number");
const symbolCheck = document.querySelector("#Symbol");
const indicator = document.querySelector("[data-strength-indicator]");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const generatebutton = document.querySelector("[generatebtn]");

let password = "";
let passwordLength = 10;
let checkCount = 0;

setIndicator("#ccc");

// Handle slider control
handleControl();

function handleControl() {
    inputslider.value = passwordLength;
    lengthdisplay.innerText = passwordLength;
    const min = inputslider.min;
    const max = inputslider.max;
    inputslider.style.backgroundColor = ((passwordLength - min) / (max - min)) * 100 + "%   100%";
}
// Set indicator
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    // Shadow
}

//   // Corrected the argument here

// Get random integer
function getrandominteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomNumber() {
    return getrandominteger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getrandominteger(97, 122)); // Updated upper bound to 122
}

function generateUpperCase() {
    return String.fromCharCode(getrandominteger(65, 90)); // Updated upper bound to 90
}

function generateSymbol() {
    const symbols = "!@#$%^&*()_+[]{}|;:,.<>?";
    return symbols[getrandominteger(0, symbols.length - 1)];
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasSymbol = false;
    let hasNumber = false;

    if (upperCaseCheck.checked) hasUpper = true;
    if (lowerCaseCheck.checked) hasLower = true;
    if (symbolCheck.checked) hasSymbol = true;
    if (numbersCheck.checked) hasNumber = true;

    if (hasLower && hasNumber && (hasSymbol || hasUpper) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if ((hasLower || hasUpper) && (hasNumber || hasSymbol) && passwordLength >= 6) {
        setIndicator("#0f0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    } catch (e) {
        copyMsg.innerText = "Failed";
    }
    // To make the copy message span visible
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

inputslider.addEventListener("input", (e) => {
    passwordLength = e.target.value;
    handleControl();
});

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyContent();
    }
});

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++;
    });
    // special condition
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleControl();
    }
}
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

function shufflePassword(arr) {
    // Fisher-Yates shuffle method
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr.join("");
}

generatebutton.addEventListener('click', () => {
    // when no checkboxes are checked
    if (checkCount === 0) return;
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleControl();
    }

    // Reset password
    password = "";

    // Generate characters based on selected checkboxes
    let funcArr = [];
    if (upperCaseCheck.checked)
        funcArr.push(generateUpperCase);
    if (lowerCaseCheck.checked)
        funcArr.push(generateLowerCase);
    if (numbersCheck.checked)
        funcArr.push(generateRandomNumber);
    if (symbolCheck.checked)
        funcArr.push(generateSymbol);

    for (let i = 0; i < passwordLength; i++) {
        const randomIndex = getrandominteger(0, funcArr.length - 1);
        password += funcArr[randomIndex]();
    }

    // Shuffle the generated password
    password = shufflePassword(password.split(""));

    // Show in UI
    passwordDisplay.value = password;

    // Calculate strength
    calcStrength();
    console.log("Hello");
});