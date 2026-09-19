console.log("MOMO JS LOADED");


/* =========================
   CART DATA
========================= */

let cart = JSON.parse(
    localStorage.getItem("foodCart")
) || [];


let selectedMomo = "";

let halfPrice = 0;

let fullPrice = 0;


/* =========================
   CART COUNT
========================= */

function updateCartCount() {

    let totalQuantity = 0;

    cart.forEach(function (item) {

        totalQuantity += item.quantity;

    });


    let cartCountElement =
        document.getElementById("cartCount");


    if (cartCountElement) {

        cartCountElement.innerText =
            totalQuantity;

    }
}


/* =========================
   FILTER MOMO
========================= */

function filterMomo(category, button) {

    let cards =
        document.querySelectorAll(".momo-card");


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


    document.getElementById("searchInput").value = "";


    document.getElementById("noResult").style.display =
        found === 0 ? "block" : "none";
}


/* =========================
   SEARCH MOMO
========================= */

function searchMomo() {

    let search =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase();


    let cards =
        document.querySelectorAll(".momo-card");


    let found = 0;


    cards.forEach(function (card) {

        let name =
            card
                .querySelector("h3")
                .innerText
                .toLowerCase();


        if (name.includes(search)) {

            card.style.display = "block";

            found++;

        } else {

            card.style.display = "none";

        }

    });


    document.getElementById("noResult").style.display =
        found === 0 ? "block" : "none";
}


/* =========================
   ADD TO CART
========================= */

function addToCart(momoName) {

    selectedMomo = momoName;


    let cards =
        document.querySelectorAll(".momo-card");


    let foundCard = null;


    cards.forEach(function (card) {

        let name =
            card
                .querySelector("h3")
                .innerText
                .trim();


        if (name === momoName) {

            foundCard = card;

        }

    });


    if (!foundCard) {

        alert("Momo not found!");

        return;

    }


    /* Get full price */

    let priceText =
        foundCard
            .querySelector(".price")
            .innerText;


    fullPrice =
        parseInt(
            priceText.replace(/\D/g, "")
        );


    /* Half price = 60% of full price */

    halfPrice =
        Math.round(fullPrice * 0.6);


    /* Show price */

    document.getElementById(
        "selectedMomoName"
    ).innerText = momoName;


    document.getElementById(
        "halfPrice"
    ).innerText =
        "Rs. " + halfPrice;


    document.getElementById(
        "fullPrice"
    ).innerText =
        "Rs. " + fullPrice;


    /* Open modal */

    document.getElementById(
        "sizeModal"
    ).style.display = "flex";
}


/* =========================
   SELECT SIZE
========================= */

function selectSize(size) {

    let price;


    if (size === "Half") {

        price = halfPrice;

    } else {

        price = fullPrice;

    }


    /* Check existing item */

    let existingItem =
        cart.find(function (item) {

            return (
                item.name === selectedMomo &&
                item.size === size
            );

        });


    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({

            name: selectedMomo,

            price: price,

            size: size,

            quantity: 1

        });

    }


    /* Save cart */

    localStorage.setItem(
        "foodCart",
        JSON.stringify(cart)
    );


    /* Update count */

    updateCartCount();


    /* Close modal */

    closeSizeModal();


    /* Message */

    alert(
        selectedMomo +
        " (" +
        size +
        ") added to cart! 🛒"
    );
}


/* =========================
   CLOSE MODAL
========================= */

function closeSizeModal() {

    document.getElementById(
        "sizeModal"
    ).style.display = "none";
}


/* =========================
   PAGE LOAD
========================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCartCount();

    }
);