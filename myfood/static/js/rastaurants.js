function searchRestaurants() {

    let input = document.getElementById("restaurantSearch");
    let search = input.value.toLowerCase();

    let cards = document.querySelectorAll(".restaurant-card");

    cards.forEach(function (card) {

        let name = card.querySelector("h2").textContent.toLowerCase();

        if (name.includes(search)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }

    });
}