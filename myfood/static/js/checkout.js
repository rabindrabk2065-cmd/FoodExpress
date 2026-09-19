document.addEventListener("DOMContentLoaded", function () {

const checkoutItems = document.getElementById("checkoutItems");

const subtotalElement = document.getElementById("subtotal");
const deliveryElement = document.getElementById("deliveryFee");
const discountElement = document.getElementById("discount");
const totalElement = document.getElementById("total");

const checkoutForm = document.getElementById("checkoutForm");
const cartDataInput = document.getElementById("cartData");

const placeOrderBtn = document.getElementById("placeOrderBtn");

const paymentInfo = document.getElementById("paymentInfo");

const paymentOptions =
    document.querySelectorAll(".payment-option");

let cart = [];

try {
    cart = JSON.parse(
        localStorage.getItem("foodCart") || "[]"
    );
} catch (error) {
    console.error("Cart data error:", error);
    cart = [];
}


console.log("CHECKOUT CART:", cart);


/* =========================
   DISPLAY CART
========================= */

function displayCart() {

    checkoutItems.innerHTML = "";

    let subtotal = 0;


    if (!Array.isArray(cart) || cart.length === 0) {

        checkoutItems.innerHTML = `
            <p class="empty-cart-message">
                Your cart is empty.
            </p>
        `;

        subtotalElement.textContent = "Rs. 0";
        deliveryElement.textContent = "Rs. 0";
        discountElement.textContent = "Rs. 0";
        totalElement.textContent = "Rs. 0";

        return;
    }


    cart.forEach(function (item) {

        const quantity =
            Number(item.quantity) || 1;


        const price =
            Number(
                String(item.price || "")
                    .replace(/[^0-9.]/g, "")
            ) || 0;


        const itemTotal =
            price * quantity;


        subtotal += itemTotal;


        const itemHTML =
            document.createElement("div");


        itemHTML.className =
            "checkout-item";


        itemHTML.innerHTML = `

            <div class="item-info">

                ${
                    item.image
                        ? `
                            <img
                                src="${item.image}"
                                class="item-image"
                                alt="${item.name || "Food"}"
                            >
                          `
                        : `
                            <div class="item-image"></div>
                          `
                }


                <div>

                    <div class="item-name">
                        ${item.name || "Food Item"}
                    </div>


                    <div class="item-quantity">

                        Size:
                        ${item.size || "Regular"}

                        &nbsp; | &nbsp;

                        Qty:
                        ${quantity}

                    </div>

                </div>

            </div>


            <div class="item-price">
                Rs. ${itemTotal.toFixed(0)}
            </div>

        `;


        checkoutItems.appendChild(itemHTML);

    });


    const deliveryFee =
        subtotal > 0 ? 50 : 0;


    const discount = 0;


    const total =
        subtotal + deliveryFee - discount;


    subtotalElement.textContent =
        "Rs. " + subtotal.toFixed(0);


    deliveryElement.textContent =
        "Rs. " + deliveryFee.toFixed(0);


    discountElement.textContent =
        "Rs. " + discount.toFixed(0);


    totalElement.textContent =
        "Rs. " + total.toFixed(0);

}


/* =========================
   PAYMENT METHOD UI
========================= */

function updatePaymentUI() {

    const selected =
        document.querySelector(
            'input[name="payment_method"]:checked'
        );


    if (!selected) {
        return;
    }


    paymentOptions.forEach(function (option) {

        option.classList.remove("active");

    });


    const selectedOption =
        selected.closest(".payment-option");


    if (selectedOption) {

        selectedOption.classList.add("active");

    }


    if (selected.value === "cod") {

        paymentInfo.innerHTML = `

            <span class="info-icon">
                🔒
            </span>

            <div>

                <strong>
                    Cash on Delivery selected
                </strong>

                <p>
                    You can pay when your order arrives.
                </p>

            </div>

        `;


        placeOrderBtn.textContent =
            "Place Order";

    }


    if (selected.value === "esewa") {

        paymentInfo.innerHTML = `

            <span class="info-icon">
                🟢
            </span>

            <div>

                <strong>
                    eSewa payment selected
                </strong>

                <p>
                    You will continue to eSewa securely after checkout.
                </p>

            </div>

        `;


        placeOrderBtn.textContent =
            "Continue to eSewa";

    }


    if (selected.value === "khalti") {

        paymentInfo.innerHTML = `

            <span class="info-icon">
                🟣
            </span>

            <div>

                <strong>
                    Khalti payment selected
                </strong>

                <p>
                    You will continue to Khalti securely after checkout.
                </p>

            </div>

        `;


        placeOrderBtn.textContent =
            "Continue to Khalti";

    }

}


paymentOptions.forEach(function (option) {

    option.addEventListener(
        "click",
        updatePaymentUI
    );

});


/* =========================
   FORM SUBMIT
========================= */

checkoutForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        /* EMPTY CART */

        if (
            !Array.isArray(cart) ||
            cart.length === 0
        ) {

            alert("Your cart is empty!");

            return;
        }


        /* GET VALUES */

        const name =
            document
                .getElementById("name")
                .value
                .trim();


        const phone =
            document
                .getElementById("phone")
                .value
                .trim();


        const email =
            document
                .getElementById("email")
                .value
                .trim();


        const address =
            document
                .getElementById("address")
                .value
                .trim();


        const city =
            document
                .getElementById("city")
                .value
                .trim();


        /* REQUIRED */

        if (!name) {

            alert("Please enter your full name.");

            document.getElementById("name").focus();

            return;
        }


        if (!phone) {

            alert("Please enter your phone number.");

            document.getElementById("phone").focus();

            return;
        }


        if (!email) {

            alert("Please enter your email address.");

            document.getElementById("email").focus();

            return;
        }


        if (!address) {

            alert(
                "Please enter your delivery address."
            );

            document
                .getElementById("address")
                .focus();

            return;
        }


        if (!city) {

            alert("Please enter your city.");

            document.getElementById("city").focus();

            return;
        }


        /* NAME */

        const namePattern =
            /^[A-Za-zÀ-ÿ]+(?:[\s'-][A-Za-zÀ-ÿ]+)*$/;


        if (!namePattern.test(name)) {

            alert(
                "Please enter a valid name."
            );

            document
                .getElementById("name")
                .focus();

            return;
        }


        if (name.length < 2) {

            alert(
                "Name must contain at least 2 characters."
            );

            document
                .getElementById("name")
                .focus();

            return;
        }


        if (name.length > 50) {

            alert(
                "Name must not exceed 50 characters."
            );

            document
                .getElementById("name")
                .focus();

            return;
        }


        /* PHONE */

        const phonePattern =
            /^(?:\+977[- ]?)?9[678]\d{8}$/;


        if (!phonePattern.test(phone)) {

            alert(
                "Please enter a valid Nepal phone number."
            );

            document
                .getElementById("phone")
                .focus();

            return;
        }


        /* EMAIL */

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;


        if (!emailPattern.test(email)) {

            alert(
                "Please enter a valid email address."
            );

            document
                .getElementById("email")
                .focus();

            return;
        }


        if (email.length > 100) {

            alert(
                "Email address must not exceed 100 characters."
            );

            document
                .getElementById("email")
                .focus();

            return;
        }


        /* ADDRESS */

        if (address.length < 5) {

            alert(
                "Please enter a complete delivery address."
            );

            document
                .getElementById("address")
                .focus();

            return;
        }


        if (address.length > 200) {

            alert(
                "Address must not exceed 200 characters."
            );

            document
                .getElementById("address")
                .focus();

            return;
        }


        /* CITY */

        const cityPattern =
            /^[A-Za-zÀ-ÿ]+(?:[\s'-][A-Za-zÀ-ÿ]+)*$/;


        if (!cityPattern.test(city)) {

            alert(
                "Please enter a valid city name."
            );

            document
                .getElementById("city")
                .focus();

            return;
        }


        if (city.length < 2) {

            alert(
                "City name must contain at least 2 characters."
            );

            document
                .getElementById("city")
                .focus();

            return;
        }


        if (city.length > 50) {

            alert(
                "City name must not exceed 50 characters."
            );

            document
                .getElementById("city")
                .focus();

            return;
        }


        /* PAYMENT */

        const paymentElement =
            document.querySelector(
                'input[name="payment_method"]:checked'
            );


        if (!paymentElement) {

            alert(
                "Please select a payment method."
            );

            return;
        }


        /* CART DATA */

        cartDataInput.value =
            JSON.stringify(cart);


        console.log(
            "CART DATA SENT:",
            cartDataInput.value
        );


        /* COD */

        if (
            paymentElement.value === "cod"
        ) {

            checkoutForm.submit();

            return;
        }


        /* ESEWA */

        if (
            paymentElement.value === "esewa"
        ) {

            alert(
                "eSewa integration will be connected in the next step."
            );

            return;
        }


        /* KHALTI */

        if (
            paymentElement.value === "khalti"
        ) {

            alert(
                "Khalti integration will be connected in the next step."
            );

            return;
        }

    }
);


/* =========================
   INITIAL LOAD
========================= */

displayCart();

updatePaymentUI();


});
