// =====================================================
// RailPredict Dynamic Train Route Map
// =====================================================

let railMap;
let routeLine;
let stationMarkers = [];
let trainMarker;


// =====================================================
// TRAIN ROUTE DATA
// =====================================================

const trainRoutes = {

    "12007": {
        name: "Shatabdi Express",

        stations: [
            ["Bengaluru City", 12.9716, 77.5946],
            ["Yeshwanthpur", 13.0285, 77.5547],
            ["Tumakuru", 13.3379, 77.1173]
        ],

        currentStation: "Bengaluru City"
    },


    "12627": {
        name: "Karnataka Express",

        stations: [
            ["Mysuru Junction", 12.2958, 76.6394],
            ["Bengaluru City", 12.9716, 77.5946],
            ["Yeshwanthpur", 13.0285, 77.5547],
            ["Tumakuru", 13.3379, 77.1173]
        ],

        currentStation: "Mysuru Junction"
    },


    "16526": {
        name: "Chamundi Express",

        stations: [
            ["Bengaluru Cantt", 12.9937, 77.5980],
            ["KSR Bengaluru", 12.9770, 77.5725],
            ["Mandya", 12.5222, 76.8970],
            ["Mysuru Junction", 12.2958, 76.6394]
        ],

        currentStation: "Bengaluru Cantt"
    },


    "22635": {
        name: "Vande Bharat",

        stations: [
            ["Hubballi", 15.3647, 75.1240],
            ["Davangere", 14.4644, 75.9218],
            ["Tumakuru", 13.3379, 77.1173],
            ["Yeshwanthpur", 13.0285, 77.5547],
            ["Bengaluru City", 12.9716, 77.5946]
        ],

        currentStation: "Hubballi"
    },


    "16595": {
        name: "Mysuru Express",

        stations: [
            ["Krishnarajapuram", 13.0005, 77.6784],
            ["Bengaluru City", 12.9716, 77.5946],
            ["Mandya", 12.5222, 76.8970],
            ["Mysuru Junction", 12.2958, 76.6394]
        ],

        currentStation: "Krishnarajapuram"
    },


    "17325": {
        name: "Intercity Express",

        stations: [
            ["Yesvantpur", 13.0285, 77.5547],
            ["Bengaluru Cantonment", 12.9937, 77.5980],
            ["Bengaluru City", 12.9716, 77.5946]
        ],

        currentStation: "Yesvantpur"
    },


    "11019": {
        name: "Mysuru - Chennai Express",

        stations: [
            ["Bengaluru Cantonment", 12.9937, 77.5980],
            ["Kolar", 13.1367, 78.1290],
            ["Katpadi", 12.9692, 79.1559],
            ["Chennai", 13.0827, 80.2707]
        ],

        currentStation: "Bengaluru Cantonment"
    },


    "12138": {
        name: "Udyan Express",

        stations: [
            ["KSR Bengaluru", 12.9770, 77.5725],
            ["Bengaluru City", 12.9716, 77.5946],
            ["Tumakuru", 13.3379, 77.1173]
        ],

        currentStation: "KSR Bengaluru"
    },


    "12431": {
        name: "Rajdhani Express",

        stations: [
            ["Hubballi", 15.3647, 75.1240],
            ["Davangere", 14.4644, 75.9218],
            ["Tumakuru", 13.3379, 77.1173],
            ["Bengaluru City", 12.9716, 77.5946]
        ],

        currentStation: "Hubballi"
    },


    "12952": {
        name: "Golden Chariot",

        stations: [
            ["Kengeri", 12.9177, 77.4828],
            ["Bengaluru City", 12.9716, 77.5946],
            ["Ramanagara", 12.7150, 77.2813],
            ["Mysuru Junction", 12.2958, 76.6394]
        ],

        currentStation: "Kengeri"
    },


    "22209": {
        name: "Bangalore Express",

        stations: [
            ["Bengaluru City", 12.9716, 77.5946],
            ["Yeshwanthpur", 13.0285, 77.5547],
            ["Tumakuru", 13.3379, 77.1173]
        ],

        currentStation: "Bengaluru City"
    },


    "20627": {
        name: "Swarna Jayanti",

        stations: [
            ["Chikkamagaluru", 13.3161, 75.7720],
            ["Hassan", 13.0068, 76.1004],
            ["Yeshwanthpur", 13.0285, 77.5547],
            ["Bengaluru City", 12.9716, 77.5946]
        ],

        currentStation: "Chikkamagaluru"
    },


    "19305": {
        name: "Gorakhpur SF",

        stations: [
            ["Yesvantpur", 13.0285, 77.5547],
            ["Tumakuru", 13.3379, 77.1173],
            ["Gubbi", 13.3120, 76.9410],
            ["Bengaluru City", 12.9716, 77.5946]
        ],

        currentStation: "Yesvantpur"
    },


    "22814": {
        name: "Sampoorna Kranti",

        stations: [
            ["Mysuru Junction", 12.2958, 76.6394],
            ["Mandya", 12.5222, 76.8970],
            ["Bengaluru City", 12.9716, 77.5946],
            ["Yeshwanthpur", 13.0285, 77.5547]
        ],

        currentStation: "Mysuru Junction"
    },


    "20777": {
        name: "Mysuru Sampark Kranti",

        stations: [
            ["Krishnarajapuram", 13.0005, 77.6784],
            ["Bengaluru City", 12.9716, 77.5946],
            ["Mandya", 12.5222, 76.8970],
            ["Mysuru Junction", 12.2958, 76.6394]
        ],

        currentStation: "Krishnarajapuram"
    },


    "13049": {
        name: "Kashi Express",

        stations: [
            ["Bengaluru Cantonment", 12.9937, 77.5980],
            ["Kolar", 13.1367, 78.1290],
            ["Katpadi", 12.9692, 79.1559],
            ["Chennai", 13.0827, 80.2707]
        ],

        currentStation: "Bengaluru Cantonment"
    },


    "16382": {
        name: "Mysuru - Hubballi Fast",

        stations: [
            ["KSR Bengaluru", 12.9770, 77.5725],
            ["Hassan", 13.0068, 76.1004],
            ["Arsikere", 13.3145, 76.2570],
            ["Hubballi", 15.3647, 75.1240]
        ],

        currentStation: "KSR Bengaluru"
    },


    "22503": {
        name: "Namma Bengaluru",

        stations: [
            ["Bengaluru City", 12.9716, 77.5946],
            ["Hosur", 12.7409, 77.8253]
        ],

        currentStation: "Bengaluru City"
    },


    "19019": {
        name: "Kaveri Express",

        stations: [
            ["Mysuru Junction", 12.2958, 76.6394],
            ["Mandya", 12.5222, 76.8970],
            ["Bengaluru City", 12.9716, 77.5946],
            ["Yeshwanthpur", 13.0285, 77.5547]
        ],

        currentStation: "Mysuru Junction"
    }

};


// =====================================================
// CREATE MAP
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    const mapElement =
        document.getElementById("trainMap");

    if (!mapElement) {
        return;
    }


    railMap = L.map("trainMap").setView(
        [12.9716, 77.5946],
        8
    );


    // OpenStreetMap
    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:
                "&copy; OpenStreetMap contributors"
        }
    ).addTo(railMap);


    // Create train selector
    createTrainSelector();


    // Show first train
    // Updated from 12009 to 12007
    showTrainRoute("12007");

});


// =====================================================
// CREATE TRAIN SELECTOR
// =====================================================

function createTrainSelector() {

    const selector =
        document.getElementById("mapTrainSelector");

    if (!selector) {
        return;
    }


    selector.innerHTML = "";


    Object.keys(trainRoutes).forEach(function (trainNumber) {

        const train =
            trainRoutes[trainNumber];


        const option =
            document.createElement("option");


        option.value = trainNumber;


        option.textContent =
            trainNumber +
            " - " +
            train.name;


        selector.appendChild(option);

    });

}


// =====================================================
// SHOW TRAIN ROUTE
// =====================================================

function showTrainRoute(trainNumber) {

    if (!railMap) {
        return;
    }


    const train =
        trainRoutes[trainNumber];


    if (!train) {

        alert(
            "Route information is not available for this train yet."
        );

        return;
    }


    // Remove old route
    if (routeLine) {

        railMap.removeLayer(routeLine);

    }


    // Remove old station markers
    stationMarkers.forEach(function (marker) {

        railMap.removeLayer(marker);

    });

    stationMarkers = [];


    // Remove old train marker
    if (trainMarker) {

        railMap.removeLayer(trainMarker);

    }


    // Convert stations to coordinates
    const routeCoordinates =
        train.stations.map(function (station) {

            return [
                station[1],
                station[2]
            ];

        });


    // Draw route
    routeLine =
        L.polyline(
            routeCoordinates,
            {
                weight: 5
            }
        ).addTo(railMap);


    // Add station markers
    train.stations.forEach(function (station) {

        const stationName =
            station[0];

        const position = [
            station[1],
            station[2]
        ];


        const marker =
            L.marker(position)
                .addTo(railMap)
                .bindPopup(
                    "<strong>" +
                    stationName +
                    "</strong><br>" +
                    train.name +
                    "<br>" +
                    "Train No: " +
                    trainNumber
                );


        stationMarkers.push(marker);

    });


    // Find current station
    const currentStation =
        train.stations.find(function (station) {

            return station[0] ===
                train.currentStation;

        });


    // Add train marker
    if (currentStation) {

        const trainPosition = [
            currentStation[1],
            currentStation[2]
        ];


        trainMarker =
            L.marker(trainPosition)
                .addTo(railMap)
                .bindPopup(
                    "<strong>🚆 " +
                    train.name +
                    "</strong><br>" +

                    "Train No: " +
                    trainNumber +
                    "<br>" +

                    "Current Location: " +
                    train.currentStation
                )
                .openPopup();

    }


    // Zoom map to route
    railMap.fitBounds(
        routeCoordinates,
        {
            padding: [30, 30]
        }
    );

}