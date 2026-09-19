document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("userSearch");
    const filterSelect = document.getElementById("userFilter");

    const rows = document.querySelectorAll(".user-row");

    const noResults = document.getElementById("noResults");

    const activeUsers = document.getElementById("activeUsers");
    const staffUsers = document.getElementById("staffUsers");


    /* COUNT USERS */

    let activeCount = 0;
    let staffCount = 0;


    rows.forEach(function (row) {

        if (row.dataset.active === "true") {
            activeCount++;
        }

        if (row.dataset.staff === "true") {
            staffCount++;
        }

    });


    if (activeUsers) {
        activeUsers.textContent = activeCount;
    }

    if (staffUsers) {
        staffUsers.textContent = staffCount;
    }



    /* FILTER USERS */

    function filterUsers() {

        const searchText =
            searchInput.value.toLowerCase().trim();

        const filter =
            filterSelect.value;

        let visibleCount = 0;


        rows.forEach(function (row) {

            const username =
                row.dataset.username || "";

            const email =
                row.dataset.email || "";

            const isActive =
                row.dataset.active === "true";

            const isStaff =
                row.dataset.staff === "true";


            const matchesSearch =
                username.includes(searchText) ||
                email.includes(searchText);


            let matchesFilter = true;


            if (filter === "active") {

                matchesFilter = isActive;

            }

            else if (filter === "inactive") {

                matchesFilter = !isActive;

            }

            else if (filter === "staff") {

                matchesFilter = isStaff;

            }


            if (matchesSearch && matchesFilter) {

                row.style.display = "";

                visibleCount++;

            } else {

                row.style.display = "none";

            }

        });


        if (noResults) {

            if (visibleCount === 0 && rows.length > 0) {

                noResults.style.display = "block";

            } else {

                noResults.style.display = "none";

            }

        }

    }


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterUsers
        );

    }


    if (filterSelect) {

        filterSelect.addEventListener(
            "change",
            filterUsers
        );

    }



    /* CLOSE USER MODAL */

    const modal =
        document.getElementById("userModal");

    const closeButton =
        document.getElementById("closeUserModal");

    const closeModalButton =
        document.getElementById("closeModalButton");


    function closeModal() {

        if (modal) {
            modal.classList.remove("show");
        }

    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeModal
        );

    }


    if (closeModalButton) {

        closeModalButton.addEventListener(
            "click",
            closeModal
        );

    }


    if (modal) {

        modal.addEventListener(
            "click",
            function (event) {

                if (event.target === modal) {
                    closeModal();
                }

            }
        );

    }



    /* ADD USER */

    const addUserButton =
        document.getElementById("addUserButton");


    if (addUserButton) {

        addUserButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "/admin/auth/user/add/";

            }
        );

    }

});



/* VIEW USER */

function viewUser(id, username, email) {

    const modal =
        document.getElementById("userModal");

    const avatar =
        document.getElementById("modalAvatar");

    const usernameElement =
        document.getElementById("modalUsername");

    const emailElement =
        document.getElementById("modalEmail");


    if (avatar) {

        avatar.textContent =
            username.charAt(0).toUpperCase();

    }


    if (usernameElement) {

        usernameElement.textContent =
            username;

    }


    if (emailElement) {

        emailElement.textContent =
            email || "No email available";

    }


    if (modal) {

        modal.classList.add("show");

    }

}



/* DELETE USER */

function deleteUser(id, username) {

    const confirmDelete =
        confirm(
            'Are you sure you want to delete user "' +
            username +
            '"?'
        );


    if (!confirmDelete) {
        return;
    }


    alert(
        "Delete backend will be connected next.\n\n" +
        "User ID: " +
        id
    );

}