document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // MOBILE MENU
    // ==========================================

    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", function () {
            navLinks.classList.toggle("active");
        });
    }


    // ==========================================
    // CONTACT FORM VALIDATION
    // ==========================================

    const contactForm = document.getElementById("contactForm");

    if (contactForm) {

        contactForm.addEventListener("submit", function (event) {

            let valid = true;

            const name = document.getElementById("name");
            const email = document.getElementById("email");
            const subject = document.getElementById("subject");
            const message = document.getElementById("message");

            // Name validation
            if (name && name.value.trim().length < 2) {
                alert("Please enter your name.");
                name.focus();
                valid = false;
            }

            // Email validation
            if (valid && email) {

                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!emailPattern.test(email.value.trim())) {
                    alert("Please enter a valid email address.");
                    email.focus();
                    valid = false;
                }
            }

            // Subject validation
            if (valid && subject &&
                subject.value.trim().length < 3) {

                alert("Please enter a subject.");
                subject.focus();
                valid = false;
            }

            // Message validation
            if (valid && message &&
                message.value.trim().length < 10) {

                alert("Message must be at least 10 characters.");
                message.focus();
                valid = false;
            }

            if (!valid) {
                event.preventDefault();
            }

        });
    }


    // ==========================================
    // MESSAGE CHARACTER COUNTER
    // ==========================================

    const message = document.getElementById("message");
    const messageCounter = document.getElementById("messageCounter");

    if (message && messageCounter) {

        function updateCounter() {

            const length = message.value.length;

            messageCounter.textContent =
                length + " / 500";

        }

        message.addEventListener("input", updateCounter);

        updateCounter();
    }


    // ==========================================
    // FOOD EXPRESS HOTEL LOCATION
    // ==========================================

    const mapElement = document.getElementById("map");

    if (!mapElement) {
        return;
    }


    // Hotel coordinates from Django database
    const hotelLatitude =
        parseFloat("{{ contact_info.latitude|default:'' }}");

    const hotelLongitude =
        parseFloat("{{ contact_info.longitude|default:'' }}");

    const hotelName =
        "{{ contact_info.business_name|escapejs }}";

    const hotelAddress =
        "{{ contact_info.address|escapejs }}";


    // Check hotel coordinates
    if (
        isNaN(hotelLatitude) ||
        isNaN(hotelLongitude)
    ) {

        mapElement.innerHTML = `
            <div style="
                padding:20px;
                text-align:center;
                color:#777;
            ">
                Hotel location is not configured.
                Please add Latitude and Longitude
                from Django Admin.
            </div>
        `;

        return;
    }


    // ==========================================
    // CREATE MAP
    // ==========================================

    const map = L.map("map").setView(
        [hotelLatitude, hotelLongitude],
        15
    );


    // OpenStreetMap
    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution:
                '&copy; OpenStreetMap contributors'
        }
    ).addTo(map);


    // ==========================================
    // HOTEL MARKER
    // ==========================================

    const hotelMarker = L.marker([
        hotelLatitude,
        hotelLongitude
    ]).addTo(map);


    hotelMarker.bindPopup(`
        <div style="min-width:180px;">
            <strong>🏨 ${hotelName}</strong>
            <br>
            <span>${hotelAddress}</span>
        </div>
    `);


    // Open hotel popup
    hotelMarker.openPopup();


    // ==========================================
    // LOCATION BUTTON
    // ==========================================

    const locationBtn =
        document.getElementById("locationBtn");

    const routeInfo =
        document.getElementById("routeInfo");

    const distanceElement =
        document.getElementById("distance");

    const durationElement =
        document.getElementById("duration");


    let userMarker = null;
    let routingControl = null;


    if (locationBtn) {

        locationBtn.addEventListener(
            "click",
            function () {

                // Browser support check
                if (!navigator.geolocation) {

                    alert(
                        "Your browser does not support location."
                    );

                    return;
                }


                locationBtn.disabled = true;

                locationBtn.innerHTML =
                    "📍 Finding your location...";


                // ==================================
                // GET USER LOCATION
                // ==================================

                navigator.geolocation.getCurrentPosition(

                    function (position) {

                        const userLatitude =
                            position.coords.latitude;

                        const userLongitude =
                            position.coords.longitude;


                        // User coordinates
                        const userLocation = L.latLng(
                            userLatitude,
                            userLongitude
                        );


                        // ==================================
                        // USER MARKER
                        // ==================================

                        if (userMarker) {

                            userMarker.setLatLng(
                                userLocation
                            );

                        } else {

                            userMarker = L.marker(
                                userLocation
                            ).addTo(map);

                        }


                        userMarker.bindPopup(
                            "📍 Your Current Location"
                        );


                        // ==================================
                        // ROUTING
                        // ==================================

                        if (routingControl) {

                            map.removeControl(
                                routingControl
                            );

                        }


                        routingControl =
                            L.Routing.control({

                                waypoints: [

                                    userLocation,

                                    L.latLng(
                                        hotelLatitude,
                                        hotelLongitude
                                    )

                                ],

                                routeWhileDragging: false,

                                addWaypoints: false,

                                draggableWaypoints: false,

                                showAlternatives: false,

                                fitSelectedRoutes: true,

                                lineOptions: {

                                    styles: [
                                        {
                                            color: "#ff4d00",
                                            weight: 6,
                                            opacity: 0.8
                                        }
                                    ]

                                },

                                createMarker: function () {
                                    return null;
                                }

                            }).addTo(map);


                        // ==================================
                        // ROUTE FOUND
                        // ==================================

                        routingControl.on(
                            "routesfound",
                            function (event) {

                                const route =
                                    event.routes[0];

                                const summary =
                                    route.summary;


                                // Distance in KM
                                const distanceKm =
                                    (
                                        summary.totalDistance /
                                        1000
                                    ).toFixed(2);


                                // Time in minutes
                                const totalMinutes =
                                    Math.round(
                                        summary.totalTime /
                                        60
                                    );


                                let timeText;


                                if (
                                    totalMinutes < 60
                                ) {

                                    timeText =
                                        totalMinutes +
                                        " minutes";

                                } else {

                                    const hours =
                                        Math.floor(
                                            totalMinutes / 60
                                        );

                                    const minutes =
                                        totalMinutes % 60;

                                    timeText =
                                        hours +
                                        " hr " +
                                        minutes +
                                        " min";
                                }


                                // Display route information
                                if (distanceElement) {

                                    distanceElement.textContent =
                                        distanceKm +
                                        " km";

                                }


                                if (durationElement) {

                                    durationElement.textContent =
                                        timeText;

                                }


                                if (routeInfo) {

                                    routeInfo.style.display =
                                        "flex";

                                }


                                locationBtn.disabled = false;

                                locationBtn.innerHTML =
                                    "📍 Update My Location";

                            }
                        );


                        // ==================================
                        // ROUTE ERROR
                        // ==================================

                        routingControl.on(
                            "routingerror",
                            function () {

                                alert(
                                    "Could not calculate route. Please try again."
                                );

                                locationBtn.disabled = false;

                                locationBtn.innerHTML =
                                    "📍 Try Again";

                            }
                        );

                    },


                    // ==================================
                    // LOCATION ERROR
                    // ==================================

                    function (error) {

                        locationBtn.disabled = false;

                        locationBtn.innerHTML =
                            "📍 Use My Location";


                        if (
                            error.code ===
                            error.PERMISSION_DENIED
                        ) {

                            alert(
                                "Location permission was denied. Please allow location access in your browser."
                            );

                        } else if (
                            error.code ===
                            error.POSITION_UNAVAILABLE
                        ) {

                            alert(
                                "Your location could not be detected."
                            );

                        } else if (
                            error.code ===
                            error.TIMEOUT
                        ) {

                            alert(
                                "Location request timed out. Please try again."
                            );

                        } else {

                            alert(
                                "Unable to get your location."
                            );
                        }

                    },

                    {
                        enableHighAccuracy: true,

                        timeout: 15000,

                        maximumAge: 0
                    }
                );

            }
        );
    }

});