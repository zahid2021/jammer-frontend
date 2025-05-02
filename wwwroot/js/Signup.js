const signupBtn = document.getElementById("signup-btn");
const username = document.getElementById("fullname");
const email = document.getElementById("email");
const password = document.getElementById("password");
const PhoneNumber = document.getElementById("number");
const passwordConfirm = document.getElementById("password-confirm");
const image = document.getElementById("image");

async function loginUser(obj) {
    let data = await fetch("https://jammerapi.mahmadamin.com/api/Users/Login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(obj)
    });
    data = await data.json();

    if (data.message === "Login Successfully") {
        console.log(data.message);
        let token = data.data;
        Cookies.set('Token', token, { expires: 7 });
        let previousUrl = localStorage.getItem("previousUrl");
        console.log(previousUrl)

        if (previousUrl) {
            localStorage.removeItem("previousUrl");
            window.location.href = previousUrl;
        } else {
            window.location.pathname = "/";
        }
    } else {
        console.log(data.message);
    }
}

async function signupUser(formData) {
    try {
        let response = await fetch("https://jammerapi.mahmadamin.com/api/Users/Signup", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            let result = await response.json();

            console.log("signup successful. Now logging in...");
            loginUser({ email: email.value, password: password.value });
        } else {
            let errorMessage;
            try {
                let errorData = await response.json();
                errorMessage = errorData.message || "signup failed.";
            } catch (e) {
                errorMessage = response.statusText || "signup failed.";
            }
            console.error("signup failed:", errorMessage);
            alert(errorMessage);
        }
    } catch (error) {
        console.error("Error during signup:", error);
        alert("signup failed due to server error.");
    }
}

signupBtn.addEventListener("click", function () {
    if (password.value !== passwordConfirm.value) {
        alert("Passwords do not match.");
        return;
    }

    let formData = new FormData();
    formData.append("FullName", username.value);
    formData.append("Email", email.value);
    formData.append("Password", password.value);
    formData.append("PhoneNumber", PhoneNumber.value);
    formData.append("RoleId","2");
    formData.append("Image", image.files[0]);

    signupUser(formData);
});



document.getElementById("login").addEventListener("click", function () {
    localStorage.setItem("previousUrl", window.location.href);
    window.location.pathname = "/Home/login";

})