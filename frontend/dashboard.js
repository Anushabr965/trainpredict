const API_URL = `${window.location.origin}/api`;

const FALLBACK_TRAINS = [
    {
        train_number: "12009",
        train_name: "Shatabdi Express",
        current_station: "Bengaluru City",
        next_station: "Yeshwanthpur",
        speed_kmh: 78,
        delay: 4,
        predicted_eta: 18
    },
    {
        train_number: "12677",
        train_name: "Karnataka Express",
        current_station: "Mysuru Junction",
        next_station: "Bengaluru City",
        speed_kmh: 66,
        delay: 9,
        predicted_eta: 34
    },
    {
        train_number: "16526",
        train_name: "Chamundi Express",
        current_station: "Bengaluru Cantt",
        next_station: "KSR Bengaluru",
        speed_kmh: 52,
        delay: 12,
        predicted_eta: 22
    },
    {
        train_number: "22635",
        train_name: "Vande Bharat",
        current_station: "Hubballi",
        next_station: "Bengaluru City",
        speed_kmh: 90,
        delay: 2,
        predicted_eta: 41
    },
    {
        train_number: "16595",
        train_name: "Mysuru Express",
        current_station: "Krishnarajapuram",
        next_station: "Mysuru Junction",
        speed_kmh: 58,
        delay: 7,
        predicted_eta: 28
    },
    {
        train_number: "17325",
        train_name: "Intercity Express",
        current_station: "Yesvantpur",
        next_station: "Bengaluru Cantonment",
        speed_kmh: 61,
        delay: 5,
        predicted_eta: 16
    },
    {
        train_number: "11019",
        train_name: "Mysuru - Chennai Express",
        current_station: "Bengaluru Cantonment",
        next_station: "Katpadi",
        speed_kmh: 49,
        delay: 15,
        predicted_eta: 44
    },
    {
        train_number: "12138",
        train_name: "Udyan Express",
        current_station: "KSR Bengaluru",
        next_station: "Mysuru Junction",
        speed_kmh: 72,
        delay: 3,
        predicted_eta: 19
    },
    {
        train_number: "12431",
        train_name: "Rajdhani Express",
        current_station: "Hubballi",
        next_station: "Bengaluru City",
        speed_kmh: 82,
        delay: 6,
        predicted_eta: 37
    },
    {
        train_number: "12952",
        train_name: "Golden Chariot",
        current_station: "Kengeri",
        next_station: "Ramanagara",
        speed_kmh: 43,
        delay: 11,
        predicted_eta: 26
    }
];

function getFallbackTrains() {
    return FALLBACK_TRAINS.map(train => ({
        ...train,
        predicted_eta: train.predicted_eta ?? 0
    }));
}

function updateDashboardSummary(trains) {
    const activeTrains = document.getElementById("activeTrains");
    const onTime = document.getElementById("onTime");
    const delayed = document.getElementById("delayed");
    const alerts = document.getElementById("alerts");

    if (!activeTrains || !onTime || !delayed || !alerts) {
        return;
    }

    const total = trains.length;
    const onTimeCount = trains.filter(train => Number(train.delay) <= 5).length;
    const delayedCount = trains.filter(train => Number(train.delay) > 5).length;
    const alertCount = trains.filter(train => Number(train.delay) > 10 || Number(train.speed_kmh) < 30).length;

    activeTrains.textContent = total;
    onTime.textContent = onTimeCount;
    delayed.textContent = delayedCount;
    alerts.textContent = alertCount;
}

async function loadTrains() {
    try {
        const response = await fetch(`${API_URL}/trains`);

        if (!response.ok) {
            throw new Error("Failed to fetch trains");
        }

        const data = await response.json();

        console.log("Train data received:", data);

        const trains = Array.isArray(data?.trains) && data.trains.length > 0
            ? data.trains
            : getFallbackTrains();

        const trainsWithETA = await Promise.all(
            trains.map(async (train) => {

                try {
                    const etaResponse = await fetch(
                        `${API_URL}/trains/${train.train_number}/eta`
                    );

                    const etaData = await etaResponse.json();

                    return {
                        ...train,
                        predicted_eta: etaData.predicted_eta_minutes
                    };

                } catch (error) {
                    console.error(
                        `ETA error for train ${train.train_number}:`,
                        error
                    );

                    return {
                        ...train,
                        predicted_eta: train.predicted_eta ?? "N/A"
                    };
                }
            })
        );

        displayTrains(trainsWithETA);
        updateDashboardSummary(trainsWithETA);

    } catch (error) {
        console.error("Error loading trains:", error);

        const fallbackTrains = getFallbackTrains();
        displayTrains(fallbackTrains);
        updateDashboardSummary(fallbackTrains);
    }
}


function displayTrains(trains) {

    const tableBody = document.getElementById("trainTableBody");

    tableBody.innerHTML = "";

    trains.forEach(train => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${train.train_number}</td>

            <td>${train.train_name}</td>

            <td>${train.current_station}</td>

            <td>${train.next_station}</td>

            <td>${train.speed_kmh} km/h</td>

            <td>${train.delay} min</td>

            <td>
                ${train.predicted_eta} min
            </td>
        `;

        tableBody.appendChild(row);
    });
}


async function searchTrain() {

    const searchInput = document.getElementById("trainSearch");

    const trainNumber = searchInput.value.trim();

    if (trainNumber === "") {

        alert("Please enter a train number.");

        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/trains/${trainNumber}`
        );

        if (!response.ok) {
            throw new Error("Train not found");
        }

        const train = await response.json();

        const etaResponse = await fetch(
            `${API_URL}/trains/${trainNumber}/eta`
        );

        const etaData = await etaResponse.json();

        train.predicted_eta = etaData.predicted_eta_minutes;

        displayTrains([train]);
        updateDashboardSummary([train]);

    } catch (error) {
        console.error("Search error:", error);

        const matchedTrain = getFallbackTrains().find(train =>
            train.train_number.toString() === trainNumber ||
            train.train_name.toLowerCase().includes(trainNumber.toLowerCase())
        );

        if (matchedTrain) {
            displayTrains([matchedTrain]);
            updateDashboardSummary([matchedTrain]);
            return;
        }

        alert("Unable to connect to the backend and no matching fake train was found.");
    }
}


// Load trains when page opens
loadTrains();