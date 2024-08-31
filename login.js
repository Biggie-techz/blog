const username = document.getElementById("username");
const password = document.getElementById("password");
const submit = document.getElementById("submit");
const account = JSON.parse(localStorage.getItem("account")) || [];

console.log(account);

submit.addEventListener("click", (event) => {
  event.preventDefault();

  const userAccount = account.find(
    (acc) => acc.username === username.value && acc.password === password.value
  );

  if (userAccount) {
    alert("You have successfully logged in!");
    submit.disabled = true;
    document.getElementById("form").style.display = "none";
    document.getElementById("loader").style.display = "block";

    setTimeout(() => {
      window.location.href = "dashboard.html";
      setTimeout(() => {
        document.getElementById("loader").style.display = "none";
        document.getElementById("form").style.display = "flex";
      }, 5000);
    }, 1500);
  } else {
    displayError("Invalid username or password");
    password.value = "";
  }
});

document.getElementById("dontHaveAnAccount").addEventListener("click", () => {
  document.getElementById("form").style.display = "none";
  document.getElementById("loader").style.display = "block";

  setTimeout(() => {
    window.location.href = "signup.html";
    setTimeout(() => {
      document.getElementById("loader").style.display = "none";
      document.getElementById("form").style.display = "flex";
    }, 5000);
  }, 1500);
});

function displayError(message) {
  const errorElement = document.getElementById("error-message");
  if (!errorElement) {
    const errorDiv = document.createElement("div");
    errorDiv.id = "error-message";
    errorDiv.style.color = "red";
    errorDiv.style.marginTop = "10px";
    errorDiv.innerText = message;
    password.parentNode.appendChild(errorDiv);
  } else {
    errorElement.innerText = message;
  }
}
