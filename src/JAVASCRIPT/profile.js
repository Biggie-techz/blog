let user = JSON.parse(localStorage.getItem("loggedInUser"));
let account = JSON.parse(localStorage.getItem("account"));
let blogObj = JSON.parse(localStorage.getItem("blogData"));
let defaultImage =  "../../../asset/download-removebg-preview.png";
console.log(blogObj);

let profileImg = document.getElementById("profileImg");
let profileName = document.getElementById("profileName");
let editUserName = document.getElementById("editUserName");
let editUsernameBtn = document.getElementById("editUsernameBtn");
let editProfileImgBtn = document.getElementById("editProfileImgBtn");
let container = document.getElementById("container");
let logOut = document.getElementById("logOut");
let deleteLabel = document.createElement("label");

if (!user) {
  alert("Unauthorized access");
  document.body.innerHTML = "Unauthorized access";
  setTimeout(() => {
    window.location.href = "../HTML/login.html";
  }, 2000);
}

function logout() {
  let confirmLogout = confirm("Are you sure you want to log out?");
  if (confirmLogout) {
    
    container.innerHTML = `
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
    document.getElementById("loader").style.display = "block";
    localStorage.removeItem("loggedInUser");

    setTimeout(() => {
      window.location.href = "../HTML/login.html";
    }, 2000);
  }
}
``;

function homepage() {
  container.innerHTML = `
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
  document.getElementById("loader").style.display = "block";

  setTimeout(() => {
    window.location.href = "../HTML/homepage.html";
  }, 2000);
}

// Function to handle file selection and update the profile image
function pickFile(e, imgElement) {
  let file = e.target.files[0];
  let reader = new FileReader();

  if (file) {
    reader.readAsDataURL(file);
  }

  reader.addEventListener("load", (ev) => {
    const imageUrl = ev.target.result;
    imgElement.style.backgroundImage = `url(${imageUrl})`;
    imgElement.style.backgroundSize = "cover";
    imgElement.style.backgroundPosition = "center";
    imgElement.style.backgroundRepeat = "no-repeat";

    // Save the image URL to the user object and local storage
    account.forEach((acct) => {
      if (acct.username === user.username) {
        acct.profileImg = imageUrl;
      }
    });
    blogObj.forEach((blog) => {
      if (blog.author === user.username) {
        blog.authorImg = imageUrl;
      }
    });
    user.profileImg = imageUrl;
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    localStorage.setItem("account", JSON.stringify(account));
    localStorage.setItem("blogData", JSON.stringify(blogObj));
  });
  displayImage();
}

// Function to display the saved profile image when the page loads
function displayImage() {
  if (user.profileImg) {
    profileImg.style.backgroundImage = `url(${user.profileImg})`;
    profileImg.style.backgroundSize = "cover";
    profileImg.style.backgroundPosition = "center";
    profileImg.style.backgroundRepeat = "no-repeat";
    
    if (user.profileImg === defaultImage) {
      deleteLabel.style.display = "none";
    } else {
      deleteLabel.innerHTML = ` <i class="fa-solid fa-trash"></i> `;
      document.getElementById("editProfileImgBtn").appendChild(deleteLabel);
      profileImg.style.boxShadow = "1px 1px 10px rgba(0, 0, 0, 0.4)";
    }
  }
}

deleteLabel.addEventListener("click", () => {
  let confirmRemoveImg = confirm("Are you sure you want to delete this image?");
  if (confirmRemoveImg) {
    profileImg.style.backgroundImage = `url(${defaultImage})`;
    profileImg.style.backgroundSize = "cover";
    profileImg.style.backgroundPosition = "center";
    profileImg.style.backgroundRepeat = "no-repeat";
    // Save the image URL to the user object and local storage
    account.forEach((acct) => {
      if (acct.username === user.username) {
        acct.profileImg = defaultImage;
      }
    });
    blogObj.forEach((blog) => {
      if (blog.author === user.username) {
        blog.authorImg = defaultImage;
      }
    });
    user.profileImg = defaultImage;
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    localStorage.setItem("account", JSON.stringify(account));
    localStorage.setItem("blogData", JSON.stringify(blogObj));
  }
  displayImage();
});

function displayUsername() {
  profileName.innerHTML = user.username;
}

function editUser() {
  editUserName.innerHTML = `
      <button id="remove" onclick="remove()">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <p>Edit Username</p>
      <input id="username" type="text" placeholder="Username" />
      <button onclick="edit()" class="submit">Edit</button>`;
  editUserName.classList.add("active");
  editUsernameBtn.style.display = "none";
  editProfileImgBtn.style.display = "none";
  container.classList.add("blur");
}

function remove() {
  editUserName.classList.remove("active");
  editUsernameBtn.style.display = "block";
  editProfileImgBtn.style.display = "block";
  container.classList.remove("blur");
}

function edit() {
  let newUsername = document.getElementById("username").value;
  if (newUsername === "") {
    alert("Please enter a username");
    return;
  }

  // Update the username in the account list
  let account = JSON.parse(localStorage.getItem("account"));
  let userIndex = account.findIndex(
    (acctUser) => acctUser.username === user.username
  );
  if (userIndex !== -1) {
    account[userIndex].username = newUsername;
    localStorage.setItem("account", JSON.stringify(account));
  }

  // Update the username in the blog posts
  blogObj.forEach((blog) => {
    if (blog.author === user.username) {
      blog.author = newUsername;
    }
  });
  localStorage.setItem("blogData", JSON.stringify(blogObj));

  // Update the username in the logged-in user object
  user.username = newUsername;
  localStorage.setItem("loggedInUser", JSON.stringify(user));

  // Update the username displayed on the profile
  displayUsername();
  remove();
}

document.getElementById("hamburger").addEventListener("click", function () {
  document.getElementById("hamburger").classList.toggle("focus");
  document.getElementById("sidebar").classList.toggle("side_active");
  hero.classList.toggle("blur");
});
// Call displayImage and displayUsername when the page loads
displayImage();
displayUsername();
