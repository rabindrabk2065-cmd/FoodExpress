document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");

    const username = document.getElementById("id_username");
    const password = document.getElementById("id_password");

    const usernameError = document.getElementById("usernameError");
    const passwordError = document.getElementById("passwordError");


    function clearErrors() {
        usernameError.textContent = "";
        passwordError.textContent = "";

        username.classList.remove("input-error");
        password.classList.remove("input-error");
    }


    loginForm.addEventListener("submit", function (event) {

        clearErrors();

        let valid = true;

        const usernameValue = username.value.trim();
        const passwordValue = password.value;


        if (usernameValue === "") {

            usernameError.textContent = "Username is required.";
            username.classList.add("input-error");

            valid = false;

        } else if (usernameValue.length < 3) {

            usernameError.textContent = "Username must be at least 3 characters.";
            username.classList.add("input-error");

            valid = false;
        }


        if (passwordValue === "") {

            passwordError.textContent = "Password is required.";
            password.classList.add("input-error");

            valid = false;

        } else if (passwordValue.length < 6) {

            passwordError.textContent = "Password must be at least 6 characters.";
            password.classList.add("input-error");

            valid = false;
        }


        if (!valid) {
            event.preventDefault();
        }

    });


    username.addEventListener("input", function () {

        usernameError.textContent = "";
        username.classList.remove("input-error");

    });


    password.addEventListener("input", function () {

        passwordError.textContent = "";
        password.classList.remove("input-error");

    });

});