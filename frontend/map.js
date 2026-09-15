// =====================================================
// RailPredict Train Route Map
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    const mapElement = document.getElementById("trainMap");

    // Stop if map container does not exist
    if (!mapElement) {
        return;
    }


    // =================================================
    // CREATE MAP
    // =================================================

    const map = L.map("trainMap").setView(
        [13.1986, 77.7066],
        9
    );


    // =================================================
    // OPENSTREETMAP
    // =================================================

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:
                "&copy; OpenStreetMap contributors"
        }
    ).addTo(map);


    // =================================================
    // ROUTE STATIONS
    // =================================================

    const stations = [

        {
            name: "Bengaluru",
            position: [12.9716, 77.5946]
        },

        {
            name: "Yeshwanthpur",
            position: [13.0285, 77.5547]
        },

        {
            name: "Tumakuru",
            position: [13.3379, 77.1173]
        },

        {
            name: "Arsikere",
            position: [13.3145, 76.2570]
        },

        {
            name: "Hubballi",
            position: [15.3647, 75.1240]
        }

    ];


    // =================================================
    // GET ROUTE COORDINATES
    // =================================================

    const routeCoordinates = stations.map(
        station => station.position
    );


    // =================================================
    // DRAW TRAIN ROUTE
    // =================================================

    L.polyline(
        routeCoordinates,
        {
            weight: 5
        }
    ).addTo(map);


    // =================================================
    // ADD STATION MARKERS
    // =================================================

    stations.forEach(function (station) {

        L.marker(station.position)
            .addTo(map)
            .bindPopup(
                "<strong>" +
                station.name +
                "</strong>"
            );

    });


    // =================================================
    // CURRENT TRAIN LOCATION
    // =================================================

    const trainPosition = [
        13.0285,
        77.5547
    ];


    L.marker(trainPosition)
        .addTo(map)
        .bindPopup(

            "<strong>🚆 Karnataka Express</strong><br>" +

            "Train No: 12627<br>" +

            "Current Location: Yeshwanthpur"

        )
        .openPopup();


    // =================================================
    // FIT MAP TO ROUTE
    // =================================================

    map.fitBounds(
        routeCoordinates,
        {
            padding: [30, 30]
        }
    );

});