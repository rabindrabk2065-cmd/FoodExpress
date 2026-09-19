document.addEventListener("DOMContentLoaded", function () {

    const modal = document.getElementById("categoryModal");

    const openButton = document.getElementById("openAddCategory");
    const emptyButton = document.getElementById("openAddCategoryEmpty");

    const closeButton = document.getElementById("closeCategoryModal");
    const cancelButton = document.getElementById("cancelCategory");

    const form = document.getElementById("categoryForm");

    const searchInput = document.getElementById("categorySearch");

    const categoryCards = document.querySelectorAll(".category-card");

    const noResults = document.getElementById("noResults");


    /* OPEN MODAL */

    function openModal() {
        if (modal) {
            modal.classList.add("show");
        }
    }


    if (openButton) {
        openButton.addEventListener("click", openModal);
    }

    if (emptyButton) {
        emptyButton.addEventListener("click", openModal);
    }


    /* CLOSE MODAL */

    function closeModal() {
        if (modal) {
            modal.classList.remove("show");
        }
    }


    if (closeButton) {
        closeButton.addEventListener("click", closeModal);
    }

    if (cancelButton) {
        cancelButton.addEventListener("click", closeModal);
    }


    /* CLICK OUTSIDE MODAL */

    if (modal) {

        modal.addEventListener("click", function (event) {

            if (event.target === modal) {
                closeModal();
            }

        });

    }


    /* SEARCH */

    if (searchInput) {

        searchInput.addEventListener("input", function () {

            const searchText = this.value.toLowerCase().trim();

            let visibleCount = 0;

            categoryCards.forEach(function (card) {

                const name = card.dataset.name || "";

                if (name.includes(searchText)) {

                    card.style.display = "";

                    visibleCount++;

                } else {

                    card.style.display = "none";

                }

            });


            if (noResults) {

                if (visibleCount === 0 && categoryCards.length > 0) {
                    noResults.style.display = "block";
                } else {
                    noResults.style.display = "none";
                }

            }

        });

    }


    /* ADD CATEGORY */

    if (form) {

        form.addEventListener("submit", function (event) {

            event.preventDefault();

            const name = document.getElementById("categoryName").value.trim();

            if (!name) {

                alert("Please enter category name.");

                return;
            }


            alert(
                "Category form is ready. Backend save functionality will be connected next."
            );

            form.reset();

            closeModal();

        });

    }

});


/* EDIT CATEGORY */

function editCategory(id, name) {

    alert(
        "Edit Category\n\nID: " +
        id +
        "\nName: " +
        name +
        "\n\nEdit backend will be connected next."
    );

}


/* DELETE CATEGORY */

function deleteCategory(id, name) {

    const confirmDelete = confirm(
        'Are you sure you want to delete "' +
        name +
        '"?'
    );

    if (!confirmDelete) {
        return;
    }


    alert(
        "Delete backend will be connected next.\n\nCategory ID: " +
        id
    );

}