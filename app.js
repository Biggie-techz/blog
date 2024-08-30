const firstName = document.getElementById("firstName");
const firstNamePlaceholder = document.getElementById("firstNamePlaceholder");
const lastName = document.getElementById("lastName");
const lastNamePlaceholder = document.getElementById("lastNamePlaceholder");
const username = document.getElementById("username");
const usernamePlaceholder = document.getElementById("usernamePlaceholder");
const email = document.getElementById("email");
const emailPlaceholder = document.getElementById("emailPlaceholder");
const phone = document.getElementById("phone");
const phonePlaceholder = document.getElementById("phonePlaceholder");
const password = document.getElementById("password");
const passwordPlaceholder = document.getElementById("passwordPlaceholder");
const confirmPassword = document.getElementById("confirmPassword");
const confirmPasswordPlaceholder = document.getElementById(
  "confirmPasswordPlaceholder"
);
const submit = document.getElementById("submit");

let acctObj = {};
let account = JSON.parse(localStorage.getItem("account")) || [];

const nameRegex = /^[a-zA-Z-]+$/;
const usernameRegex = /^[a-zA-Z0-9-_]+$/;
const phoneRegex = /^[0][7-9][0-1][0-9]{8}$/;
const emailRegex = /^[a-zA-Z0-9._]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,4}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,16}$/;

firstName.addEventListener("input", () => {
  if (nameRegex.test(firstName.value) || firstName.value == "") {
    firstName.style.outline = "none";
    firstNamePlaceholder.style.color = "grey";
    firstNamePlaceholder.innerHTML = "First Name";
  } else {
    firstName.style.outline = "2px solid red";
    firstNamePlaceholder.style.color = "red";
    firstNamePlaceholder.innerHTML = "Invalid Name Format";
  }
});
lastName.addEventListener("input", () => {
  if (nameRegex.test(lastName.value) || lastName.value == "") {
    lastName.style.outline = "none";
    lastNamePlaceholder.style.color = "grey";
    lastNamePlaceholder.innerHTML = "Last Name";
  } else {
    lastName.style.outline = "2px solid red";
    lastNamePlaceholder.style.color = "red";
    lastNamePlaceholder.innerHTML = "Invalid Name Format";
  }
});
username.addEventListener("input", () => {
  const usernameExists = account.some((acc) => acc.username === username.value);
  if (usernameExists) {
    usernamePlaceholder.style.color = "red";
    usernamePlaceholder.innerHTML = "Username taken";
    return;
  }
  if (usernameRegex.test(username.value) || username.value == "") {
    username.style.outline = "none";
    usernamePlaceholder.style.color = "grey";
    usernamePlaceholder.innerHTML = "Username";
  } else {
    username.style.outline = "2px solid red";
    usernamePlaceholder.style.color = "red";
    usernamePlaceholder.innerHTML = "Invalid Username Format";
  }
});
email.addEventListener("input", () => {
  const emailExists = account.some((acc) => acc.email === email.value);
  if (emailExists) {
    emailPlaceholder.style.color = "red";
    emailPlaceholder.innerHTML = "Account with this email already exists";
    return;
  }
  if (emailRegex.test(email.value) || email.value == "") {
    email.style.outline = "none";
    emailPlaceholder.style.color = "grey";
    emailPlaceholder.innerHTML = "Email";
  } else {
    email.style.outline = "2px solid red";
    emailPlaceholder.style.color = "red";
    emailPlaceholder.innerHTML = "Invalid Email Format";
  }
});
phone.addEventListener("input", () => {
  const phoneExists = account.some((acc) => acc.phone === phone.value);
  if (phoneExists) {
    phonePlaceholder.style.color = "red";
    phonePlaceholder.innerHTML =
      "Account with this phone number already exists";
    return;
  }
  if (phoneRegex.test(phone.value) || phone.value == "") {
    phone.style.outline = "none";
    phonePlaceholder.style.color = "grey";
    phonePlaceholder.innerHTML = "Phone Number";
  } else {
    phone.style.outline = "2px solid red";
    phonePlaceholder.style.color = "red";
    phonePlaceholder.innerHTML = "Invalid Phone Number";
  }
});
password.addEventListener("input", () => {
  if (passwordRegex.test(password.value) || password.value == "") {
    password.style.border = "1px solid rgba(105, 105, 105, 0.397)";
    passwordPlaceholder.style.color = "grey";
    passwordPlaceholder.innerHTML = "Password";
  } else {
    password.style.outline = "none";
    password.style.border = "2px solid red";
    password.style.borderBottom = "none";
    passwordPlaceholder.style.color = "red";
    passwordPlaceholder.innerHTML =
      "Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character";
  }
});
confirmPassword.addEventListener("input", () => {
  if (confirmPassword.value == password.value) {
    confirmPassword.style.border = "1px solid rgba(105, 105, 105, 0.397)";
    confirmPasswordPlaceholder.style.color = "grey";
    confirmPasswordPlaceholder.innerHTML = "Confirm Password";
  } else {
    confirmPassword.style.outline = "none";
    confirmPassword.style.border = "2px solid red";
    confirmPassword.style.borderBottom = "none";
    confirmPasswordPlaceholder.style.color = "red";
  }
});

submit.addEventListener("click", () => {
  const usernameExists = account.some((acc) => acc.username === username.value);
  const emailExists = account.some((acc) => acc.email === email.value);
  const phoneExists = account.some((acc) => acc.phone === phone.value);

  if (usernameExists) {
    alert("Username already exists");
    username.value = "";
  }
  if (emailExists) {
    alert("Email already exists");
    email.value = "";
  }
  if (phoneExists) {
    alert("Phone number already exists");
    phone.value = "";
    return;
  }

  if (
    nameRegex.test(firstName.value) &&
    nameRegex.test(lastName.value) &&
    usernameRegex.test(username.value) &&
    emailRegex.test(email.value) &&
    phoneRegex.test(phone.value) &&
    passwordRegex.test(password.value) &&
    confirmPassword.value === password.value
  ) {
    acctObj = {
      firstName: firstName.value,
      lastName: lastName.value,
      username: username.value,
      email: email.value,
      phone: phone.value,
      password: password.value,
    };
    account.push(acctObj);
    localStorage.setItem("account", JSON.stringify(account));
    alert("Account created successfully");
    document.getElementById("form").style.display = "none";
    document.getElementById("loader").style.display = "block";
    setTimeout(() => {
      document.getElementById("form").style.display = "flex";
      document.getElementById("loader").style.display = "none";
      window.location.href = "login.html";
    }, 2500);
  } else {
    alert("Please input all fields correctly");
  }
});

document.getElementById('haveAnAccount').addEventListener('click', () => {
  window.location.href = 'login.html';
});
console.log(JSON.parse(localStorage.getItem("account")));
