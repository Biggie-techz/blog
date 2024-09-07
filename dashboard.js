let welcome = document.getElementById("welcome");
let logOut = document.getElementById("logOut");
let addBlogShowAndHide = document.getElementById("addBlog");
let preview = document.getElementById("preview");
let inputBlog = document.getElementById("inputBlog");

let postArr = JSON.parse(localStorage.getItem("blogData")) || [];
console.log(postArr);
let account = JSON.parse(localStorage.getItem("account")) || [];
console.log(account);
let user = JSON.parse(localStorage.getItem("loggedInUser"));
console.log(user);

if (!user) {
  alert("Unauthorized access");
  document.body.innerHTML = "Unauthorized access";
  setTimeout(() => {
    window.location.href = "login.html";
  }, 2000);
} else {
  logOut.addEventListener("click", () => {
    let confirmLogout = confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("loggedInUser");

      document.querySelector(".container").innerHTML = `
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
        window.location.href = "login.html";
      }, 2000);
    }
  });

  addBlogShowAndHide.addEventListener("click", () => {
    inputBlog.innerHTML = `
      <button id="remove" onclick="remove()">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <p>Create post</p>
      <input id="title" type="text" placeholder="Title" />
      <p id="blog" contenteditable="true"></p>
      <div class="div">
        <input id="input" accept=".jpg,.png,.mp4" type="file" onchange="pickFile(event, image)" />
        <img id="image" />
      </div>
      <button onclick="postBlog()" class="submit">Post</button>`;
    inputBlog.classList.add("active");
    preview.classList.add("blur");
  });

  let postArr = JSON.parse(localStorage.getItem("blogData")) || [];

  function pickFile(e, imgElement) {
    let file = e.target.files[0];
    let reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
    }

    reader.addEventListener("load", (ev) => {
      imgElement.src = ev.target.result;
      imgElement.style.display = "block";
      imgElement.style.width = "50px";
      imgElement.style.height = "50px";
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
      author: user.username,
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
    user.post = postArr;
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    localStorage.setItem("blogData", JSON.stringify(postArr));

    // account.find((acctUser) => {
    //   if (acctUser.username === user.username) {
    //     account.splice(account.indexOf(acctUser), 1, user);
    //   }
    // });
    const index = account.findIndex(
      (acctUser) => acctUser.username === user.username
    );
    if (index !== -1) {
      account.splice(index, 1, user);
    }
    localStorage.setItem("account", JSON.stringify(account));

    preview.innerHTML = "";
    let blog = JSON.parse(localStorage.getItem("blogData"));

    if (!blog || blog.length === 0) {
      preview.innerHTML = "No blog found";
      preview.style.color = "grey";
      preview.style.fontSize = "3.5rem";
      return;
    }

    blog.forEach((element, index) => {
      preview.innerHTML += `
        <div class="blog-post">
        <h1>${element.title}</h1>
          <h4>By ${element.author}</h4>
          <div id="displayImage-${index}" class="displayImage">
          </div>
          <p>${element.blog}</p>
          <div class="interact">
            <button onclick="deletePost(${index})"><i class="fa-solid fa-trash"></i></button>
            <button onclick="editPost(${index})"><i class="fa-solid fa-pen-to-square"></i></button>
            <button id="likePost" onclick="like(${index})">${
        element.liked
          ? `<i class="fa-solid fa-heart" style="color: #ff1900;"></i>`
          : `<i class="fa-regular fa-heart fa-beat"></i>`
      }</button>
          </div>
        </div>`;

      // Set the background image for the current blog post
      document.getElementById(
        `displayImage-${index}`
      ).style.backgroundImage = `url(${element.image})`;
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
      <div class="div">
        <input id="editInput" accept=".jpg,.png,.mp4" type="file" onchange="pickFile(event, editImage)" />
        <img id="editImage"/>
      </div>
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
    editImage.style.height = "50px";
    editImage.style.width = "50px";
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
      author: user.username,
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
