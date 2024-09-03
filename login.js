const username = document.getElementById("username");
const password = document.getElementById("password");
const submit = document.getElementById("submit");
const account = JSON.parse(localStorage.getItem("account")) || [];

let loggedInUser = [];
console.log(account);
username.addEventListener("input", () => {
  document.getElementById("usernamePlaceholder").innerText = "Username";
  document.getElementById("usernamePlaceholder").style.color = "grey";
});
password.addEventListener("input", () => {
  document.getElementById("passwordPlaceholder").innerText = "Password";
  document.getElementById("passwordPlaceholder").style.color = "grey";
});
submit.addEventListener("click", () => {
  if (username.value === "" || password.value === "") {
    alert("Please input all fields!");
    return;
  }
  const userAccount = account.find((obj) => obj.username === username.value);
  console.log(userAccount);

  if (!userAccount) {
    password.value = "";
    document.getElementById("usernamePlaceholder").innerText =
      "invalid Username";
    document.getElementById("usernamePlaceholder").style.color = "red";
  } else if (userAccount && password.value !== userAccount.password) {
    password.value = "";
    document.getElementById("passwordPlaceholder").innerText =
      "invalid Password";
    document.getElementById("passwordPlaceholder").style.color = "red";
  }
  if (userAccount && password.value === userAccount.password) {
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
      <h1 id="accountLogInSuccessMessage">Log in Successfull</h1>`;
      document.getElementById("form").classList.add("logInSuccess");
      document.getElementById("loader").style.display = "block";
    }, 2000);

    // Reset the index and updating local storage
    userAccount.index = 0;
    localStorage.setItem("account", JSON.stringify(account));

    loggedInUser.push(userAccount);
    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

    console.log(userAccount);

    setTimeout(() => {
      window.location.href = "dashboard.html";
      setTimeout(() => {
        document
          .getElementById("form")
          .removeChild(document.getElementById("loader"));
        document.getElementById("form").classList.remove("logInSuccess");
      }, 10000);
    }, 4000);
  } else {
    document.getElementById("passwordPlaceholder").innerText =
      "invalid Password";
    document.getElementById("passwordPlaceholder").style.color = "red";
    displayError(`Your account will be BLOCKED after ${[5 - userAccount.index]} more incorrect attempts`);

    userAccount.index++;
    localStorage.setItem("account", JSON.stringify(account));
    password.value = "";
    if (userAccount.index > 5) {
      userAccount.index = 0;
      localStorage.setItem("account", JSON.stringify(account));
      document.getElementById("form").innerHTML = "";
      document.getElementById("form").innerHTML =
        "Your account has been blocked. A recovery link has been sent to your email";
      document.getElementById("form").style.color = "red";
      document.getElementById("form").style.width = "100%";
      document.getElementById("form").style.textAlign = "center";
      let backToSignup = document.createElement("a");
      backToSignup.href = "index.html";
      backToSignup.textContent = "Back to Signup";
      document.getElementById("form").appendChild(backToSignup);
      backToSignup.classList.add("submit");
    }
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
  document.getElementById("loader").style.display = "block";
  setTimeout(() => {
    window.location.href = "index.html";
    setTimeout(() => {
      document
        .getElementById("form")
        .removeChild(document.getElementById("loader"));
      document.getElementById("form").style.display = "flex";
    }, 10000);
  }, 2000);
});

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
