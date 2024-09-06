let welcome = document.getElementById("welcome");
let user = JSON.parse(localStorage.getItem("loggedInUser"));
console.log(user);
if (!user) {
  alert("Unauthroized access");
  window.location.href = "login.html";
  document.body.innerHTML = "Unauthorized access";
}
user.forEach((user) => {
  welcome.innerHTML = `Welcome ${user.username}`;
});
let logOut = document.createElement("a");
logOut.innerHTML = "Log Out";
logOut.classList.add("logOut");
document.querySelector(".container").appendChild(logOut);
logOut.addEventListener("click", function () {
  localStorage.removeItem("loggedInUser");
  document.querySelector(
    ".container"
  ).innerHTML = `<div class="spinner" id="loader">
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
  document.getElementById("loader").style.display = "block";

  setTimeout(() => {
    window.location.href = "login.html";
    setTimeout(() => {
      document.getElementById("loader").style.display = "none";
    }, 10000);
  }, 2000);
});
