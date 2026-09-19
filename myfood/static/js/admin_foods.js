document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("foodSearch");
    const categoryFilter = document.getElementById("categoryFilter");
    const rows = document.querySelectorAll(".food-row");
    const noResults = document.getElementById("noResults");
    const ratedFoods = document.getElementById("ratedFoods");

    let selectedFoodId = null;


    /* =========================
       SEARCH + CATEGORY FILTER
    ========================== */

    function filterFoods() {

        const searchValue = searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";

        const categoryValue = categoryFilter
            ? categoryFilter.value.toLowerCase()
            : "all";

        let visibleCount = 0;

        rows.forEach(function (row) {

            const foodName =
                row.dataset.name || "";

            const foodCategory =
                row.dataset.category || "";

            const matchesSearch =
                foodName.includes(searchValue);

            const matchesCategory =
                categoryValue === "all" ||
                foodCategory === categoryValue;

            if (matchesSearch && matchesCategory) {

                row.style.display = "";
                visibleCount++;

            } else {

                row.style.display = "none";

            }

        });


        if (noResults) {

            if (visibleCount === 0) {
                noResults.style.display = "block";
            } else {
                noResults.style.display = "none";
            }

        }

    }


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterFoods
        );

    }


    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            filterFoods
        );

    }


    /* =========================
       COUNT RATED FOODS
    ========================== */

    let ratedCount = 0;

    rows.forEach(function (row) {

        const rating =
            parseFloat(row.dataset.rating || "0");

        if (rating > 0) {
            ratedCount++;
        }

    });


    if (ratedFoods) {
        ratedFoods.textContent = ratedCount;
    }


    /* =========================
       DELETE FOOD MODAL
    ========================== */

    window.deleteFood = function (foodId, foodName) {

        selectedFoodId = foodId;

        const deleteMessage =
            document.getElementById("deleteMessage");

        if (deleteMessage) {

            deleteMessage.textContent =
                `Are you sure you want to delete "${foodName}"?`;

        }

        const modal =
            document.getElementById("deleteModal");

        if (modal) {
            modal.style.display = "flex";
        }

    };


    window.closeDeleteModal = function () {

        const modal =
            document.getElementById("deleteModal");

        if (modal) {
            modal.style.display = "none";
        }

        selectedFoodId = null;

    };


    window.confirmDelete = function () {

        if (!selectedFoodId) {
            return;
        }

        /*
            अहिले delete URL जोडिएको छैन।

            Backend delete view बनेपछि:
            window.location.href =
                `/admin-panel/foods/${selectedFoodId}/delete/`;
        */

        alert(
            "Delete functionality backend मा जोड्न बाँकी छ."
        );

        closeDeleteModal();

    };


    /* =========================
       EDIT FOOD
    ========================== */

    window.editFood = function (foodId) {

        /*
            अहिले edit URL जोडिएको छैन।

            Backend edit view बनेपछि:
            window.location.href =
                `/admin-panel/foods/${foodId}/edit/`;
        */

        alert(
            "Edit functionality backend मा जोड्न बाँकी छ."
        );

    };


    /* =========================
       ADD FOOD MODAL
    ========================== */

    window.openAddFoodMessage = function () {

        const modal =
            document.getElementById("addFoodModal");

        if (modal) {
            modal.style.display = "flex";
        }

    };


    window.closeAddFoodMessage = function () {

        const modal =
            document.getElementById("addFoodModal");

        if (modal) {
            modal.style.display = "none";
        }

    };


    /* =========================
       CLOSE MODAL OUTSIDE
    ========================== */

    window.addEventListener("click", function (event) {

        const deleteModal =
            document.getElementById("deleteModal");

        const addFoodModal =
            document.getElementById("addFoodModal");


        if (event.target === deleteModal) {
            closeDeleteModal();
        }


        if (event.target === addFoodModal) {
            closeAddFoodMessage();
        }

    });


    /* =========================
       ESC KEY
    ========================== */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            closeDeleteModal();
            closeAddFoodMessage();

        }

    });

});