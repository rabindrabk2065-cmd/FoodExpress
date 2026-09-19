console.log("CART JS LOADED");


// =========================
// LOAD CART
// =========================

let cartData = JSON.parse(
    localStorage.getItem("foodCart") || "[]"
);


// =========================
// DISPLAY CART
// =========================

function displayCart() {

    const cartItems = document.getElementById("cartItems");
    const emptyCart = document.getElementById("emptyCart");
    const cartSummary = document.getElementById("cartSummary");

    // Safety check
    if (!cartItems) {
        console.log("cartItems not found");
        return;
    }

    // Clear old items
    cartItems.innerHTML = "";


    // =========================
    // EMPTY CART
    // =========================

    if (cartData.length === 0) {

        if (emptyCart) {
            emptyCart.style.display = "block";
        }

        if (cartSummary) {
            cartSummary.style.display = "none";
        }

        return;
    }


    // =========================
    // CART HAS ITEMS
    // =========================

    if (emptyCart) {
        emptyCart.style.display = "none";
    }

    if (cartSummary) {
        cartSummary.style.display = "block";
    }


    // =========================
    // DISPLAY EACH ITEM
    // =========================

    cartData.forEach(function (item, index) {

        const price = Number(item.price) || 0;

        const quantity =
            Number(item.quantity) || 1;

        const itemTotal =
            price * quantity;


        const div =
            document.createElement("div");

        div.className = "cart-item";


        div.innerHTML = `

            <div class="item-info">

                <h3>
                    ${item.name || "Food Item"}
                </h3>

                <p>
                    Size:
                    <strong>
                        ${item.size || "Regular"}
                    </strong>
                </p>

                <p>
                    Price:
                    <strong>
                        Rs. ${price}
                    </strong>
                </p>

            </div>


            <div class="quantity-control">

                <button
                    type="button"
                    onclick="decreaseCartItem(${index})">
                    −
                </button>

                <span>
                    ${quantity}
                </span>

                <button
                    type="button"
                    onclick="increaseCartItem(${index})">
                    +
                </button>

            </div>


            <div class="item-total">

                <strong>
                    Rs. ${itemTotal}
                </strong>

            </div>


            <button
                type="button"
                class="remove-btn"
                onclick="removeCartItem(${index})">
                Remove
            </button>

        `;


        cartItems.appendChild(div);

    });


    // Calculate total
    calculateTotal();
}


// =========================
// INCREASE QUANTITY
// =========================

function increaseCartItem(index) {

    if (!cartData[index]) {
        return;
    }


    cartData[index].quantity =
        (Number(cartData[index].quantity) || 1) + 1;


    saveCart();
}


// =========================
// DECREASE QUANTITY
// =========================

function decreaseCartItem(index) {

    if (!cartData[index]) {
        return;
    }


    const quantity =
        Number(cartData[index].quantity) || 1;


    if (quantity > 1) {

        cartData[index].quantity =
            quantity - 1;

    }


    saveCart();
}


// =========================
// REMOVE ITEM
// =========================

function removeCartItem(index) {

    if (!cartData[index]) {
        return;
    }


    cartData.splice(index, 1);


    saveCart();
}


// =========================
// SAVE CART
// =========================

function saveCart() {

    localStorage.setItem(
        "foodCart",
        JSON.stringify(cartData)
    );


    displayCart();
}


// =========================
// CALCULATE TOTAL
// =========================

function calculateTotal() {

    let subtotal = 0;


    cartData.forEach(function (item) {

        const price =
            Number(item.price) || 0;

        const quantity =
            Number(item.quantity) || 1;


        subtotal +=
            price * quantity;

    });


    // =========================
    // DELIVERY FEE
    // =========================

    let delivery = 0;


    if (subtotal > 0) {

        delivery = 50;

    }


    // =========================
    // GRAND TOTAL
    // =========================

    const grandTotal =
        subtotal + delivery;


    // =========================
    // UPDATE HTML
    // =========================

    const subtotalElement =
        document.getElementById("subtotal");

    const deliveryElement =
        document.getElementById("delivery");

    const grandTotalElement =
        document.getElementById("grandTotal");


    if (subtotalElement) {

        subtotalElement.textContent =
            subtotal;

    }


    if (deliveryElement) {

        deliveryElement.textContent =
            delivery;

    }


    if (grandTotalElement) {

        grandTotalElement.textContent =
            grandTotal;

    }

}


// =========================
// CHECKOUT
// =========================

function checkout() {

    if (cartData.length === 0) {

        alert("Your cart is empty.");

        return;

    }


    window.location.href =
        "/checkout/";

}


// =========================
// PAGE LOAD
// =========================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Cart data:",
            cartData
        );

        displayCart();

    }
);