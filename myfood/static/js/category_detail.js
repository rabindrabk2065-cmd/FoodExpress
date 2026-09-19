document.addEventListener("DOMContentLoaded", function () {

    const cartCount = document.getElementById("cartCount");
    const addButtons = document.querySelectorAll(".add-cart-btn");
    const toast = document.getElementById("toast");

    function getCart() {
        try {
            return JSON.parse(
                localStorage.getItem("foodCart")
            ) || [];
        } catch (error) {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem(
            "foodCart",
            JSON.stringify(cart)
        );
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

    function showToast() {

        toast.classList.add("show");

        setTimeout(function () {
            toast.classList.remove("show");
        }, 2000);
    }

    addButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const id = this.dataset.id;
                const name = this.dataset.name;
                const price = Number(this.dataset.price);
                const image = this.dataset.image;

                let cart = getCart();

                const existingItem = cart.find(
                    function (item) {
                        return String(item.id) === String(id);
                    }
                );

                if (existingItem) {

                    existingItem.quantity += 1;

                } else {

                    cart.push({
                        id: id,
                        name: name,
                        price: price,
                        image: image,
                        quantity: 1
                    });

                }

                saveCart(cart);

                updateCartCount();

                showToast();
            }
        );

    });

    updateCartCount();

});