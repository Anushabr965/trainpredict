const API_URL = "http://127.0.0.1:8000";


// Load all trains when the page opens
async function loadTrains() {

    try {

        const response = await fetch(`${API_URL}/trains`);

        if (!response.ok) {
            throw new Error("Failed to fetch trains");
        }

        const data = await response.json();

        console.log("Train data received:", data);

        displayTrains(data.trains);

    } catch (error) {

        console.error("Error loading trains:", error);

        const tableBody = document.getElementById("trainTableBody");

        tableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    Unable to load train data.
                </td>
            </tr>
        `;
    }
}


// Display trains in the table
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
            <td>${train.eta}</td>
        `;

        tableBody.appendChild(row);
    });
}


// Search for a specific train
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

            alert("Train not found.");

            return;
        }

        const train = await response.json();

        console.log("Train found:", train);

        displayTrains([train]);

    } catch (error) {

        console.error("Search error:", error);

        alert("Unable to connect to the backend.");
    }
}


// Load trains when dashboard opens
loadTrains();