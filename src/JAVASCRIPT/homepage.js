let welcome = document.getElementById("welcome");
let logOut = document.getElementById("logOut");
let addBlogShowAndHide = document.getElementById("addBlog");
let preview = document.getElementById("preview");
let inputBlog = document.getElementById("inputBlog");
let container = document.getElementById("container");

let postArr = JSON.parse(localStorage.getItem("blogData")) || [];
let account = JSON.parse(localStorage.getItem("account")) || [];
let user = JSON.parse(localStorage.getItem("loggedInUser"));

if (!user) {
  alert("Unauthorized access");
  document.body.innerHTML = "Unauthorized access";
  setTimeout(() => {
    window.location.href = "../HTML/login.html";
  }, 2000);
} else {
  function logout() {
    let confirmLogout = confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("loggedInUser");

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
        window.location.href = "../HTML/login.html";
      }, 2000);
    }
  }

  function profile() {
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
      window.location.href = "../HTML/profile.html";
    }, 2000);
  }

  addBlogShowAndHide.addEventListener("click", () => {
    inputBlog.innerHTML = `
      <button id="remove" onclick="remove()">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <p>Create post</p>
      <input id="title" type="text" placeholder="Title" />
      <p id="blog" contenteditable="true"></p>
      <label class="div" for="input">
        <i class="fa-regular fa-image"></i>
        <i class="fa-solid fa-arrow-up-from-bracket"></i>
        <input id="input" accept=".jpg,.png,.mp4" type="file" onchange="pickFile(event, image)" />
        <img id="image" />
      </label>
      <button onclick="postBlog()" class="submit">Post</button>`;
    inputBlog.classList.add("active");
    preview.classList.add("blur");
  });

  function pickFile(e, imgElement) {
    let file = e.target.files[0];
    let reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
    }

    reader.addEventListener("load", (ev) => {
      imgElement.src = ev.target.result;
      imgElement.style.display = "block";
      imgElement.style.width = "20px";
      imgElement.style.height = "20px";
    });
  }

  function postBlog(index = null) {
    let blog = document.getElementById("blog");
    let title = document.getElementById("title");
    let image = document.getElementById("image");
    if (title.value === "" || blog.textContent === "") {
      alert("All fields are mandatory");
      return;
    }

    let blogObj = {
      title: title.value,
      blog: blog.textContent,
      image: image.src,
      liked: false,
      author: user.username, // Store the current user's username as the author
      authorImg: user.profileImg, // Store the current user's profile image as the author image
    };

    if (index !== null) {
      postArr[index] = blogObj; // Update the existing post
    } else {
      if (postArr.find((blogObj) => blogObj.title === title.value)) {
        alert("Blog already exists");
        return;
      }
      postArr.push(blogObj); // Add a new post
    }

    inputBlog.classList.remove("active");
    preview.classList.remove("blur");

    display();
  }

  function display() {
    localStorage.setItem("blogData", JSON.stringify(postArr));

    preview.innerHTML = "";
    let blog = JSON.parse(localStorage.getItem("blogData"));

    if (!blog || blog.length === 0) {
      preview.innerHTML = "No blog found";
      preview.style.color = "grey";
      preview.style.fontSize = "3.5rem";
      return;
    }

    preview.style.color = "black";
    preview.style.fontSize = "1rem";

    // Create a copy of the array and reverse it for display
    let reversedBlog = [...blog].reverse();

    reversedBlog.forEach((element, index) => {
      // Calculate the actual index in the original array
      let actualIndex = blog.length - 1 - index;
      let defaultImage = "../../asset/download-removebg-preview.png";
      preview.innerHTML += `
        <div class="blog-post">
          <h4 style="display: flex; align-items: center; gap: 5px;">
            <img src="${
              element.authorImg || defaultImage
            }" style="border-radius: 50%; width: 40px; height: 40px; object-fit: top"/> ${
        element.author
      }
          </h4>
          <h1>"${element.title}"</h1>
          <div id="displayImage-${actualIndex}" class="displayImage"></div>
          <p><span>${element.author}: </span> ${element.blog}</p>
          <div class="interact">
            <button id="delete-${actualIndex}" onclick="deletePost(${actualIndex})" class="delete"><i class="fa-solid fa-trash"></i></button>
            <button id="edit-${actualIndex}" onclick="editPost(${actualIndex})" class="edit"><i class="fa-solid fa-pen-to-square"></i></button>
            <button id="likePost-${actualIndex}" onclick="like(${actualIndex})">
              ${
                element.liked
                  ? `<i class="fa-solid fa-heart" style="color: #ff1900;"></i>`
                  : `<i class="fa-regular fa-heart"></i>`
              }
            </button>
          </div>
        </div>`;

      // Set the background image for the current blog post
      document.getElementById(
        `displayImage-${actualIndex}`
      ).style.backgroundImage = `url(${element.image})`;

      // hide the displayImage element if the image is not available
      if (!element.image) {
        document.getElementById(
          `displayImage-${actualIndex}`
        ).style.display = `none`;
      }

      // Hide the edit and delete buttons for posts not authored by the logged-in user
      if (element.author !== user.username) {
        document.getElementById(`edit-${actualIndex}`).style.display = "none";
        document.getElementById(`delete-${actualIndex}`).style.display = "none";
      }
    });
  }

  function remove() {
    inputBlog.classList.remove("active");
    preview.classList.remove("blur");
  }

  function deletePost(index) {
    let confirmDelete = confirm("Are you sure you want to delete this post?");
    if (confirmDelete) {
      postArr.splice(index, 1);
      localStorage.setItem("blogData", JSON.stringify(postArr));
      display();
    }
  }

  function editPost(index) {
    inputBlog.innerHTML = `
      <button id="remove" onclick="remove()"><i class="fa-solid fa-xmark"></i></button>
      <p>Edit post</p>
      <input id="editTitle" type="text" placeholder="Title" />
      <div id="editBlog" contenteditable="true"></div>
      <label class="div" for="editInput">
        <i class="fa-regular fa-image"></i>
        <i class="fa-solid fa-arrow-up-from-bracket"></i>
        <input id="editInput" accept=".jpg,.png,.mp4" type="file" onchange="pickFile(event, editImage)" />
        <img id="editImage"/>
      </label>
      <button onclick="editPostBlog(${index})" class="submit">Save</button>`;

    // Populate the form with existing data for editing
    inputBlog.classList.add("active");
    preview.classList.add("blur");
    let editTitle = document.getElementById("editTitle");
    let editBlog = document.getElementById("editBlog");
    let editImage = document.getElementById("editImage");

    editTitle.value = postArr[index].title;
    editBlog.textContent = postArr[index].blog;
    editImage.src = postArr[index].image;
    editImage.style.height = "20px";
    editImage.style.width = "20px";
    editImage.style.borderRadius = "50%";
    editImage.style.alignSelf = "flex-end";
  }

  function editPostBlog(index) {
    let editTitle = document.getElementById("editTitle").value;
    let editBlog = document.getElementById("editBlog").textContent;
    let editImage = document.getElementById("editImage").src;

    if (editTitle === "" || editBlog === "") {
      alert("All fields are mandatory");
      return;
    }

    postArr[index] = {
      title: editTitle,
      blog: editBlog,
      image: editImage,
      liked: postArr[index].liked,
      author: postArr[index].author, // Retain the original author's name
      authorImg: postArr[index].authorImg, // Retain the original author's image
    };

    localStorage.setItem("blogData", JSON.stringify(postArr));
    inputBlog.classList.remove("active");
    preview.classList.remove("blur");
    display();
  }

  function like(index) {
    postArr[index].liked = !postArr[index].liked;
    localStorage.setItem("blogData", JSON.stringify(postArr));
    display();
  }

  display();
}
document.getElementById("hamburger").addEventListener("click", function () {
  document.getElementById("hamburger").classList.toggle("focus");
  document.getElementById("sidebar").classList.toggle("side_active");
  preview.classList.toggle("blur");
});
