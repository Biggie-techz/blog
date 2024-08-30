const username = document.getElementById("username");
const password = document.getElementById("password");
const submit = document.getElementById("submit");
const account = JSON.parse(localStorage.getItem("account")) || [];
console.log(account);

submit.addEventListener("click", (event) => {
  // Find the account object where both the username and password match
  const userAccount = account.find(
    (acc) => acc.username === username.value && acc.password === password.value
  );

  if (userAccount) {
    alert("You have successfully logged in!");
    document.getElementById("form").style.display = "none";
    document.getElementById("loader").style.display = "block";
 
    setTimeout(() => {
      document.getElementById("form").style.display = "flex";
      document.getElementById("loader").style.display = "none";
      window.location.href = "dashboard.html";
    }, 2000);
  } else {
    alert("Invalid username or password");
  }
});
document.getElementById("haveAnAccount").addEventListener("click", () => {
  window.location.href = "dashboard.html";
});
