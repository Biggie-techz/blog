const username = document.getElementById("username");
const password = document.getElementById("password");
const submit = document.getElementById("submit");
const account = JSON.parse(localStorage.getItem("account")) || [];
let timerSeconds = JSON.parse(localStorage.getItem("seconds")) || 0;
let loggedInUser = [];
let countdownInterval;

// Display the timer if it's greater than 0
if (timerSeconds && timerSeconds > 0) {
  startCountdown();
} else {
  timerSeconds = 0;
  localStorage.removeItem("seconds");
}

console.log(account);

// Handle input field events for username and password
username.addEventListener("input", () => {
  document.getElementById("usernamePlaceholder").innerText = "Username";
  document.getElementById("usernamePlaceholder").style.color = "grey";
});
password.addEventListener("input", () => {
  document.getElementById("passwordPlaceholder").innerText = "Password";
  document.getElementById("passwordPlaceholder").style.color = "grey";
});

// Submit button event listener
submit.addEventListener("click", () => {
  if (timerSeconds > 0) {
    displayBlockedMessage();
    return; // Prevent further actions if the account is locked
  }

  if (username.value === "" || password.value === "") {
    alert("Please input all fields!");
    return;
  }

  const userAccount = account.find((obj) => obj.username === username.value);
  console.log(userAccount);

  if (!userAccount) {
    handleInvalidUsername();
  } else if (userAccount.password !== password.value) {
    handleInvalidPassword(userAccount);
  } else {
    handleLoginSuccess(userAccount);
  }
});

document.getElementById("dontHaveAnAccount").addEventListener("click", () => {
  document.getElementById("form").innerHTML = `
    <div class="spinner" id="loader">
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
  document.getElementById("form").classList.add("logInSuccess");
  setTimeout(() => {
    window.location.href = "index.html";
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

  // Display remaining attempts
  displayError(
    `Your account will be BLOCKED after ${
      5 - userAccount.index
    } more incorrect attempt(s)`
  );

  // Increment index for failed attempts
  userAccount.index++;
  localStorage.setItem("account", JSON.stringify(account));

  if (userAccount.index > 5) {
    blockAccount(userAccount);
  }
}

function handleLoginSuccess(userAccount) {
  submit.innerHTML = `<div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>`;

  setTimeout(() => {
    document.getElementById("form").innerHTML = `
    <div class="spinner" id="loader">
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
      </div>
      <h1 id="accountLogInSuccessMessage">Log in Successful</h1>`;
    document.getElementById("form").classList.add("logInSuccess");
    document.getElementById("loader").style.display = "block";
  }, 2000);

  // Reset failed attempts
  userAccount.index = 0;
  localStorage.setItem("account", JSON.stringify(account));

  // Log the user in
  loggedInUser.push(userAccount);
  localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

  // Redirect to dashboard
  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 4000);
}

function blockAccount(userAccount) {
  // Reset failed attempts
  userAccount.index = 0;
  localStorage.setItem("account", JSON.stringify(account));

  // Start block timer
  timerSeconds = 300;
  localStorage.setItem("seconds", JSON.stringify(timerSeconds));
  startCountdown();

  // Display block message
  displayBlockedMessage();
}

function startCountdown() {
  countdownInterval = setInterval(() => {
    timerSeconds--;
    localStorage.setItem("seconds", JSON.stringify(timerSeconds));

    // Update the timer in the UI
    if (document.getElementById("timer-message")) {
      document.getElementById(
        "timer-message"
      ).innerText = `Your account has been blocked. Try again in ${timerSeconds} seconds`;
    }

    if (timerSeconds <= 0) {
      clearInterval(countdownInterval);
      localStorage.removeItem("seconds");
      document.getElementById("form").innerHTML = ""; // Clear block message
      window.location.href = `login.html`;
    }
  }, 1000);
}

function displayBlockedMessage() {
  document.getElementById("form").innerHTML = `
    <p id="timer-message">Your account has been blocked. Try again in ${timerSeconds} seconds</p>`;
  let backToLogin = document.createElement("a");
  backToLogin.href = "login.html";
  backToLogin.textContent = "Back to Login";
  document.getElementById("form").appendChild(backToLogin);
  backToLogin.classList.add("submit");
}

function displayError(message) {
  const errorElement = document.getElementById("error-message");
  if (!errorElement) {
    const errorDiv = document.createElement("div");
    errorDiv.id = "error-message";
    errorDiv.style.color = "red";
    errorDiv.style.marginTop = "10px";
    errorDiv.innerText = message;
    errorDiv.style.wordBreak = "break-all";
    password.parentNode.appendChild(errorDiv);
  } else {
    errorElement.innerText = message;
  }
}
