const trains = [

    {
        number: "12627",
        name: "Karnataka Express",
        route: "Bengaluru → New Delhi",
        station: "Bengaluru Cantt",
        speed: "72 km/h",
        delay: "5 min",
        eta: "10:42 AM",
        status: "On Time"
    },

    {
        number: "16526",
        name: "KSR Bengaluru Express",
        route: "Bengaluru → Kannur",
        station: "Yeshwanthpur",
        speed: "64 km/h",
        delay: "12 min",
        eta: "11:15 AM",
        status: "Delayed"
    },

    {
        number: "12677",
        name: "Ernakulam Express",
        route: "Bengaluru → Ernakulam",
        station: "Bengaluru",
        speed: "81 km/h",
        delay: "2 min",
        eta: "12:05 PM",
        status: "On Time"
    },

    {
        number: "16515",
        name: "Karwar Express",
        route: "Bengaluru → Karwar",
        station: "Tumakuru",
        speed: "58 km/h",
        delay: "18 min",
        eta: "1:20 PM",
        status: "Delayed"
    },

    {
        number: "12649",
        name: "Sampark Kranti",
        route: "Bengaluru → Hazrat Nizamuddin",
        station: "Tumakuru",
        speed: "76 km/h",
        delay: "0 min",
        eta: "2:10 PM",
        status: "On Time"
    }

];


function displayTrains(trainList) {

    const tableBody =
        document.getElementById("trainTableBody");

    tableBody.innerHTML = "";


    trainList.forEach(train => {

        let statusClass = "on-time";

        if (train.status === "Delayed") {
            statusClass = "delayed";
        }


        const row = document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>${train.number}</strong><br>
                ${train.name}
            </td>

            <td>
                ${train.route}
            </td>

            <td>
                ${train.station}
            </td>

            <td>
                ${train.speed}
            </td>

            <td>
                ${train.delay}
            </td>

            <td>
                <strong>${train.eta}</strong>
            </td>

            <td>
                <span class="status ${statusClass}">
                    ${train.status}
                </span>
            </td>

        `;


        tableBody.appendChild(row);

    });

}


displayTrains(trains);



/* SEARCH FUNCTION */

const searchBox =
    document.getElementById("trainSearch");


searchBox.addEventListener("input", function () {

    const searchText =
        this.value.toLowerCase();


    const filteredTrains =
        trains.filter(train =>

            train.number
                .toLowerCase()
                .includes(searchText)

            ||

            train.name
                .toLowerCase()
                .includes(searchText)

        );


    displayTrains(filteredTrains);

});