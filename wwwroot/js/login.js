const username = document.getElementById("username");
const password = document.getElementById("password");
const loginBtn = document.getElementById("login-btn")
const loginContainer = document.getElementById("login-container");


loginBtn.addEventListener("click", function () {
    let obj = { email: username.value, password: password.value };
    username.value = "";
    password.value = "";
    loginUser(obj)
})
// Call this function after login success


async function loginUser(obj) {
    try {
        let response = await fetch("https://jammerapi.mahmadamin.com/api/Users/Login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(obj)
        });

        let data = await response.json();

        if (response.ok) {
            // If login is successful, show success message
            showLoginPopup(data.message);

            // Store token in cookies
            const token = data.data;
            Cookies.set('Token', token, { expires: 7 });

            // Redirect user to previous URL or home page
            const previousUrl = localStorage.getItem("previousUrl");
            if (previousUrl) {
                localStorage.removeItem("previousUrl");
                window.location.href = previousUrl;
            } else {
                window.location.pathname = "/";
            }
        } else {
            // If the login API returns an error, show error message
            showLoginPopup(data.message || "Login failed. Please check your credentials.");
        }
    } catch (error) {
        // Catch any network or other errors
        console.error("Error occurred:", error);
        showLoginPopup("An error occurred. Please try again later.");
    }
}



function showLoginPopup(loginMessage) {
    // Create the popup container
    const popup = document.createElement('div');
    popup.classList.add('absolute', 'top-1/2', 'left-1/2', 'transform', '-translate-x-1/2', '-translate-y-1/2', 'bg-white', 'shadow-lg', 'p-6', 'rounded-lg', 'border', 'border-gray-300', 'z-50');

    // Create the message paragraph
    const message = document.createElement('p');
    message.classList.add('text-gray-600', 'text-center');
    message.textContent = loginMessage;
    console.log("login Message")

    // Append heading and message to the popup;
    popup.appendChild(message);

    // Append the popup to the body or a specific container
    loginContainer.appendChild(popup);

    // Remove the popup after 3 seconds
    setTimeout(() => {
        popup.remove();
    }, 3000);
}
