document.addEventListener("DOMContentLoaded", function () {

    const registerForm = document.getElementById("registerForm");

    const username = document.getElementById("id_username");
    const email = document.getElementById("id_email");
    const password = document.getElementById("id_password1");
    const confirmPassword = document.getElementById("id_password2");

    const usernameError = document.getElementById("usernameError");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const confirmPasswordError = document.getElementById("confirmPasswordError");


    function clearErrors() {

        usernameError.textContent = "";
        emailError.textContent = "";
        passwordError.textContent = "";
        confirmPasswordError.textContent = "";

        username.classList.remove("input-error");
        email.classList.remove("input-error");
        password.classList.remove("input-error");
        confirmPassword.classList.remove("input-error");
    }


    registerForm.addEventListener("submit", function (event) {

        clearErrors();

        let valid = true;


        const usernameValue = username.value.trim();
        const emailValue = email.value.trim();
        const passwordValue = password.value;
        const confirmPasswordValue = confirmPassword.value;


        if (usernameValue === "") {

            usernameError.textContent =
                "Username is required.";

            username.classList.add("input-error");

            valid = false;

        } else if (usernameValue.length < 3) {

            usernameError.textContent =
                "Username must be at least 3 characters.";

            username.classList.add("input-error");

            valid = false;
        }


        if (emailValue === "") {

            emailError.textContent =
                "Email is required.";

            email.classList.add("input-error");

            valid = false;

        } else if (!isValidEmail(emailValue)) {

            emailError.textContent =
                "Please enter a valid email address.";

            email.classList.add("input-error");

            valid = false;
        }


        if (passwordValue === "") {

            passwordError.textContent =
                "Password is required.";

            password.classList.add("input-error");

            valid = false;

        } else if (passwordValue.length < 8) {

            passwordError.textContent =
                "Password must be at least 8 characters.";

            password.classList.add("input-error");

            valid = false;
        }


        if (confirmPasswordValue === "") {

            confirmPasswordError.textContent =
                "Please confirm your password.";

            confirmPassword.classList.add("input-error");

            valid = false;

        } else if (passwordValue !== confirmPasswordValue) {

            confirmPasswordError.textContent =
                "Passwords do not match.";

            confirmPassword.classList.add("input-error");

            valid = false;
        }


        if (!valid) {
            event.preventDefault();
        }

    });


    function isValidEmail(email) {

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return emailPattern.test(email);
    }


    username.addEventListener("input", function () {

        usernameError.textContent = "";

        username.classList.remove("input-error");

    });


    email.addEventListener("input", function () {

        emailError.textContent = "";

        email.classList.remove("input-error");

    });


    password.addEventListener("input", function () {

        passwordError.textContent = "";

        password.classList.remove("input-error");

    });


    confirmPassword.addEventListener("input", function () {

        confirmPasswordError.textContent = "";

        confirmPassword.classList.remove("input-error");

    });

});