document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", function(e){
            e.preventDefault();

            const username = document.getElementById("newUsername").value.trim();
            const password = document.getElementById("newPassword").value.trim();

            if (!username || !password)
                return alert("Please fill out all fields.");

            // Check if user already exists
            if (localStorage.getItem("user_" + username)) {
                return alert("Username already exists.");
            }

            // Save user
            localStorage.setItem("user_" + username, password);

            alert("Account created successfully! Please log in.");
            window.location.href = "login.html";
        });
    }



    /* LOGIN FORM HANDLING */
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function(e){
            e.preventDefault();

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            const savedPassword = localStorage.getItem("user_" + username);

            if (!savedPassword) {
                return alert("User not found.");
            }

            if (password !== savedPassword) {
                return alert("Invalid password.");
            }

            // Successful login
            localStorage.setItem("loggedIn", "true");
            localStorage.setItem("username", username);
            window.location.href = "index.html";
        });
    }



    /* REMOVE BACKGROUND AFTER LOGIN */
    if (localStorage.getItem("loggedIn") === "true") {
        document.body.classList.add("no-bg");
    }



    /* SIGN IN / LOG OUT LINK HANDLING */
    const signInLink = document.getElementById("signin-link");
    if (signInLink) {
        if (localStorage.getItem("loggedIn") === "true") {
            signInLink.textContent = "Log Out";
            signInLink.href = "#";
            signInLink.addEventListener("click", function(e){
                e.preventDefault();
                localStorage.removeItem("loggedIn");
                localStorage.removeItem("username");
                window.location.href = "login.html";
            });
        } else {
            signInLink.href = "login.html";
        }
    }



    /* LOAD CATALOG ON INDEX PAGE */
    if (document.getElementById("product-list")) loadCatalog();
});



/* LOAD PRODUCTS FROM XML */
function loadCatalog() {
    fetch("beauty_products.xml")
    .then(res => res.text())
    .then(data => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data,"application/xml");
        displayProducts(xml);
    });
}



/* DISPLAY ALL PRODUCTS */
function displayProducts(xml) {
    const container = document.getElementById("product-list");
    const title = document.getElementById("catalog-title");
    title.textContent = "All Products";

    const products = xml.getElementsByTagName("product");
    container.innerHTML = "";

    for (let p of products) {
        const name = p.getElementsByTagName("name")[0].textContent;
        const price = p.getElementsByTagName("price")[0].textContent;
        const image = p.getElementsByTagName("image")[0].textContent;

        const card = document.createElement("div");
        card.classList.add("product-card");
        card.innerHTML = `
            <img src="${image}" alt="${name}">
            <div class="product-card-info">
                <h3>${name}</h3>
                <span class="price">$${price}</span>
            </div>
        `;
        container.appendChild(card);
    }
}



/* SHOW CATEGORY FILTER */
function showCategory(category) {
    fetch("beauty_products.xml")
    .then(res => res.text())
    .then(data => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data,"application/xml");
        displayCategory(xml, category);
    });
}



/* DISPLAY PRODUCTS BY CATEGORY*/
function displayCategory(xml, category) {
    const container = document.getElementById("product-list");
    const title = document.getElementById("catalog-title");
    title.textContent = category.charAt(0).toUpperCase() + category.slice(1);

    const products = xml.getElementsByTagName("product");
    container.innerHTML = "";

    for (let p of products) {
        if (p.getAttribute("category") !== category) continue;

        const name = p.getElementsByTagName("name")[0].textContent;
        const price = p.getElementsByTagName("price")[0].textContent;
        const image = p.getElementsByTagName("image")[0].textContent;

        const card = document.createElement("div");
        card.classList.add("product-card");
        card.innerHTML = `
            <img src="${image}" alt="${name}">
            <div class="product-card-info">
                <h3>${name}</h3>
                <span class="price">$${price}</span>
            </div>
        `;
        container.appendChild(card);
    }
}
