document.addEventListener("DOMContentLoaded", function () {

    const cartCount = document.getElementById("cartCount");

    function getCart() {

        try {

            return JSON.parse(
                localStorage.getItem("foodCart")
            ) || [];

        } catch (error) {

            return [];

        }
    }

    function updateCartCount() {

        const cart = getCart();

        let totalQuantity = 0;

        cart.forEach(function (item) {

            totalQuantity += Number(
                item.quantity || 0
            );

        });

        cartCount.textContent = totalQuantity;
    }

    updateCartCount();

});