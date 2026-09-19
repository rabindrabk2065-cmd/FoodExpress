const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

const notificationBtn = document.getElementById("notificationBtn");
const notificationPanel = document.getElementById("notificationPanel");
const closeNotification = document.getElementById("closeNotification");

const searchInput = document.getElementById("searchInput");

const cartCount = document.getElementById("cartCount");
const dashboardCartCount = document.getElementById("dashboardCartCount");

/* MOBILE SIDEBAR */

if (menuBtn) {
    menuBtn.addEventListener("click", function () {
        sidebar.classList.toggle("open");
    });
}

/* NOTIFICATION */

if (notificationBtn) {
    notificationBtn.addEventListener("click", function () {
        notificationPanel.classList.toggle("show");
    });
}

if (closeNotification) {
    closeNotification.addEventListener("click", function () {
        notificationPanel.classList.remove("show");
    });
}

/* CLOSE SIDEBAR WHEN CLICKING OUTSIDE */

document.addEventListener("click", function (event) {


    if (
        window.innerWidth <= 768 &&
        sidebar.classList.contains("open") &&
        !sidebar.contains(event.target) &&
        !menuBtn.contains(event.target)
    ) {
        sidebar.classList.remove("open");
    }


});

/* CART COUNT */

function updateCartCount() {

    let cart = localStorage.getItem("foodCart");

    if (!cart) {
        cartCount.textContent = "0";
        dashboardCartCount.textContent = "0";
        return;
    }

    try {

        cart = JSON.parse(cart);

        let totalItems = 0;

        if (Array.isArray(cart)) {

            cart.forEach(function (item) {

                const quantity = Number(item.quantity) || 1;

                totalItems += quantity;

            });

        }

        cartCount.textContent = totalItems;
        dashboardCartCount.textContent = totalItems;

    } catch (error) {

        cartCount.textContent = "0";
        dashboardCartCount.textContent = "0";

    }


}

updateCartCount();

/* SEARCH */

if (searchInput) {

    searchInput.addEventListener("keyup", function () {

        const searchValue = searchInput.value.trim();

        if (searchValue.length > 0) {
            console.log("Searching for:", searchValue);
        }

    });

}

/* UPDATE CART WHEN STORAGE CHANGES */

window.addEventListener("storage", function (event) {

    if (event.key === "foodCart") {
        updateCartCount();
    }

});
