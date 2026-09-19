console.log("CHOWMEIN JS LOADED");


// =========================
// LOAD CART
// =========================

let cart = JSON.parse(
    localStorage.getItem("foodCart")
) || [];

let selectedFood = "";
let halfPrice = 0;
let fullPrice = 0;


// =========================
// UPDATE CART COUNT
// =========================

function updateCartCount() {

    let totalQuantity = 0;

    cart.forEach(function (item) {
        totalQuantity += item.quantity;
    });

    let cartCountElement =
        document.getElementById("cartCount");

    if (cartCountElement) {
        cartCountElement.innerText = totalQuantity;
    }
}


// =========================
// CATEGORY FILTER
// =========================

function filterFood(category, button) {

    let cards =
        document.querySelectorAll(".food-card");

    let buttons =
        document.querySelectorAll(".category-btn");

    buttons.forEach(function (btn) {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    let found = 0;

    cards.forEach(function (card) {

        if (
            category === "all" ||
            card.dataset.category === category
        ) {

            card.style.display = "block";
            found++;

        } else {

            card.style.display = "none";

        }

    });

    document.getElementById(
        "searchInput"
    ).value = "";

    document.getElementById(
        "noResult"
    ).style.display =
        found === 0 ? "block" : "none";
}


// =========================
// SEARCH
// =========================

function searchFood() {

    let search =
        document.getElementById("searchInput")
            .value
            .toLowerCase();

    let cards =
        document.querySelectorAll(".food-card");

    let found = 0;

    cards.forEach(function (card) {

        let name =
            card.querySelector("h3")
                .innerText
                .toLowerCase();

        if (name.includes(search)) {

            card.style.display = "block";
            found++;

        } else {

            card.style.display = "none";

        }

    });

    document.getElementById(
        "noResult"
    ).style.display =
        found === 0 ? "block" : "none";
}


// =========================
// ADD TO CART
// =========================

function addToCart(foodName) {

    selectedFood = foodName;

    let cards =
        document.querySelectorAll(".food-card");

    let foundCard = null;

    cards.forEach(function (card) {

        let name =
            card.querySelector("h3")
                .innerText
                .trim();

        if (name === foodName) {
            foundCard = card;
        }

    });


    if (!foundCard) {

        alert("Food not found!");

        return;
    }


    // FULL PRICE

    let priceText =
        foundCard.querySelector(".price")
            .innerText;

    fullPrice =
        parseInt(
            priceText.replace(/\D/g, "")
        );


    // HALF PRICE

    halfPrice =
        Math.round(fullPrice * 0.6);


    // SHOW FOOD NAME

    document.getElementById(
        "selectedFoodName"
    ).innerText = foodName;


    // SHOW HALF PRICE

    document.getElementById(
        "halfPrice"
    ).innerText =
        "Rs. " + halfPrice;


    // SHOW FULL PRICE

    document.getElementById(
        "fullPrice"
    ).innerText =
        "Rs. " + fullPrice;


    // SHOW POPUP

    document.getElementById(
        "sizeModal"
    ).style.display = "flex";
}


// =========================
// SELECT HALF / FULL
// =========================

function selectSize(size) {

    let price;

    if (size === "Half") {

        price = halfPrice;

    } else {

        price = fullPrice;

    }


    // CHECK EXISTING ITEM

    let existingItem =
        cart.find(function (item) {

            return (
                item.name === selectedFood &&
                item.size === size
            );

        });


    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({

            name: selectedFood,

            price: price,

            size: size,

            quantity: 1

        });

    }


    // SAVE

    localStorage.setItem(
        "foodCart",
        JSON.stringify(cart)
    );


    // UPDATE COUNT

    updateCartCount();


    // CLOSE POPUP

    closeSizeModal();


    // MESSAGE

    alert(
        selectedFood +
        " (" +
        size +
        ") added to cart! 🛒"
    );
}


// =========================
// CLOSE POPUP
// =========================

function closeSizeModal() {

    document.getElementById(
        "sizeModal"
    ).style.display = "none";
}


// =========================
// PAGE LOAD
// =========================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCartCount();

    }
);