const API_URL = "http://127.0.0.1:8000/api";


async function loadAnalytics() {

    try {

        const response =
            await fetch(`${API_URL}/trains`);


        if (!response.ok) {

            throw new Error(
                "Failed to fetch train data"
            );

        }


        const data =
            await response.json();


        const trains =
            data.trains || [];


        if (trains.length === 0) {

            throw new Error(
                "No train data available"
            );

        }


        // -----------------------------
        // TOTAL DELAY
        // -----------------------------

        const totalDelay =
            trains.reduce(
                (sum, train) =>
                    sum + Number(train.delay || 0),
                0
            );


        // -----------------------------
        // AVERAGE DELAY
        // -----------------------------

        const averageDelay =
            totalDelay / trains.length;


        // -----------------------------
        // ON-TIME TRAINS
        // Delay <= 5 minutes
        // -----------------------------

        const onTimeTrains =
            trains.filter(
                train =>
                    Number(train.delay || 0) <= 5
            ).length;


        // -----------------------------
        // ON-TIME RATE
        // -----------------------------

        const onTimeRate =
            (onTimeTrains / trains.length) * 100;


        // -----------------------------
        // CRITICAL ALERTS
        // Delay > 15 minutes
        // -----------------------------

        const criticalAlerts =
            trains.filter(
                train =>
                    Number(train.delay || 0) > 15
            ).length;


        // -----------------------------
        // UPDATE HTML
        // -----------------------------

        document.getElementById(
            "averageDelay"
        ).textContent =
            `${averageDelay.toFixed(1)} min`;


        document.getElementById(
            "onTimeRate"
        ).textContent =
            `${onTimeRate.toFixed(1)}%`;


        document.getElementById(
            "trainsMonitored"
        ).textContent =
            trains.length;


        document.getElementById(
            "criticalAlerts"
        ).textContent =
            criticalAlerts;


        // -----------------------------
        // CONSOLE INFORMATION
        // -----------------------------

        console.log(
            "Analytics loaded successfully."
        );

        console.log(
            "Trains monitored:",
            trains.length
        );

        console.log(
            "Average delay:",
            averageDelay.toFixed(1),
            "minutes"
        );

        console.log(
            "On-time rate:",
            onTimeRate.toFixed(1),
            "%"
        );

        console.log(
            "Critical alerts:",
            criticalAlerts
        );


    } catch (error) {

        console.error(
            "Analytics error:",
            error
        );


        // Show fallback values
        document.getElementById(
            "averageDelay"
        ).textContent = "N/A";


        document.getElementById(
            "onTimeRate"
        ).textContent = "N/A";


        document.getElementById(
            "trainsMonitored"
        ).textContent = "N/A";


        document.getElementById(
            "criticalAlerts"
        ).textContent = "N/A";

    }

}


// Start analytics
loadAnalytics();