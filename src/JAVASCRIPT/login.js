const username = document.getElementById("username");
const password = document.getElementById("password");
const submit = document.getElementById("submit");
const account = JSON.parse(localStorage.getItem("account")) || [];
let countdownInterval;

username.addEventListener("input", () => {
  document.getElementById("usernamePlaceholder").innerText = "Username";
  document.getElementById("usernamePlaceholder").style.color = "grey";
  clearErrorMessage();
});

password.addEventListener("input", () => {
  document.getElementById("passwordPlaceholder").innerText = "Password";
  document.getElementById("passwordPlaceholder").style.color = "grey";
  clearErrorMessage();
});

submit.addEventListener("click", () => {
  const userAccount = account.find((obj) => obj.username === username.value);

  if (!userAccount) {
    handleInvalidUsername();
    return;
  }

  if (userAccount.isBlocked) {
    displayBlockedMessage(userAccount);
    return;
  }

  if (username.value === "" || password.value === "") {
    alert("Please input all fields!");
    return;
  }

  if (userAccount.password !== password.value) {
    handleInvalidPassword(userAccount);
  } else {
    handleLoginSuccess(userAccount);
  }
});

document.getElementById("dontHaveAnAccount").addEventListener("click", () => {
  document.body.innerHTML = `<div class="spinner" id="loader">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>`
  setTimeout(() => {
    window.location.href = "../../index.html";
  }, 2000);
});

// Functions

function handleInvalidUsername() {
  password.value = "";
  document.getElementById("usernamePlaceholder").innerText = "Invalid Username";
  document.getElementById("usernamePlaceholder").style.color = "red";
}

function handleInvalidPassword(userAccount) {
  password.value = "";
  document.getElementById("passwordPlaceholder").innerText = "Invalid Password";
  document.getElementById("passwordPlaceholder").style.color = "red";

  displayError(
    `Your account will be BLOCKED after ${
      5 - userAccount.failedAttempts
    } more incorrect attempt(s)`
  );

  userAccount.failedAttempts = (userAccount.failedAttempts || 0) + 1;
  localStorage.setItem("account", JSON.stringify(account));

  if (userAccount.failedAttempts >= 5) {
    blockAccount(userAccount);
  }
}

function handleLoginSuccess(userAccount) {
  displayLoadingSpinner();

  setTimeout(() => {
    displayLoginSuccessMessage();

    // Reset failed attempts
    userAccount.failedAttempts = 0;
    userAccount.isBlocked = false;
    userAccount.blockTime = null;

    localStorage.setItem("account", JSON.stringify(account));
    localStorage.setItem("loggedInUser", JSON.stringify(userAccount));

    setTimeout(() => {
      window.location.href = "../HTML/homepage.html";
    }, 3000);
  }, 1500);
}

function blockAccount(userAccount) {
  userAccount.isBlocked = true;
  userAccount.blockTime = new Date().getTime();
  localStorage.setItem("account", JSON.stringify(account));

  displayBlockedMessage(userAccount);
}

function startCountdown(userAccount) {
  const currentTime = new Date().getTime();
  const elapsedTime = Math.floor((currentTime - userAccount.blockTime) / 1000);
  let remainingTime = 300 - elapsedTime;

  if (remainingTime <= 0) {
    unblockAccount(userAccount);
    return;
  }

  countdownInterval = setInterval(() => {
    remainingTime--;
    if (remainingTime <= 0) {
      clearInterval(countdownInterval);
      unblockAccount(userAccount);
    } else {
      if (document.getElementById("timer-message")) {
        document.getElementById(
          "timer-message"
        ).innerText = `Your account has been blocked. Try again in ${remainingTime} seconds`;
      }
    }
  }, 1000);
}

function unblockAccount(userAccount) {
  userAccount.isBlocked = false;
  userAccount.failedAttempts = 0;
  userAccount.blockTime = null;
  localStorage.setItem("account", JSON.stringify(account));

  document.getElementById("form").innerHTML = ""; // Clear block message
  window.location.href = "../HTML/login.html";
}

function displayBlockedMessage(userAccount) {
  const remainingTime =
    300 - Math.floor((new Date().getTime() - userAccount.blockTime) / 1000);
  document.getElementById("form").innerHTML = `
    <p id="timer-message">Your account has been blocked. Try again in ${remainingTime} seconds</p>`;
  const backToLogin = document.createElement("a");
  backToLogin.href = "../HTML/login.html";
  backToLogin.textContent = "Back to Login";
  backToLogin.classList.add("submit");
  document.getElementById("form").appendChild(backToLogin);

  startCountdown(userAccount);
}

function displayError(message) {
  let errorElement = document.getElementById("error-message");
  if (!errorElement) {
    errorElement = document.createElement("div");
    errorElement.id = "error-message";
    errorElement.style.color = "red";
    errorElement.style.marginTop = "10px";
    password.parentNode.appendChild(errorElement);
  }
  errorElement.innerText = message;
}

function clearErrorMessage() {
  const errorElement = document.getElementById("error-message");
  if (errorElement) {
    errorElement.remove();
  }
}

function displayLoadingSpinner() {
  submit.innerHTML = `<div class="spinner-border" role="status">
  <span class="visually-hidden">Loading...</span>
</div>`;
}

function displayLoginSuccessMessage() {
  document.body.innerHTML = `<div class="spinner" id="loader">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>`;
}
