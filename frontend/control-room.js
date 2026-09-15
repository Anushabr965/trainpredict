// =====================================================
// RAILPREDICT CONTROL ROOM
// Backend + ML ETA Connected
// =====================================================

// Train / ML APIs
const CONTROL_API_URL = "http://127.0.0.1:8000/api";

// Control Room alerts API
const CONTROL_ROOM_API_URL = "http://127.0.0.1:8000";


// =====================================================
// ANALYZE RAILWAY CONDITIONS
// =====================================================

async function analyzeControlRoom() {

    const trainNumberElement =
        document.getElementById("controlTrainNumber");

    const speedElement =
        document.getElementById("controlSpeed");

    const delayElement =
        document.getElementById("controlDelay");

    const weatherElement =
        document.getElementById("controlWeather");

    const congestionElement =
        document.getElementById("controlCongestion");

    const analysisBox =
        document.getElementById("controlAnalysis");

    const alertTableBody =
        document.getElementById("alertTableBody");


    // =================================================
    // CHECK HTML ELEMENTS
    // =================================================

    if (
        !trainNumberElement ||
        !speedElement ||
        !delayElement ||
        !weatherElement ||
        !congestionElement ||
        !analysisBox ||
        !alertTableBody
    ) {

        console.error(
            "Control Room HTML elements are missing."
        );

        return;
    }


    // =================================================
    // GET INPUT VALUES
    // =================================================

    const trainNumber =
        trainNumberElement.value.trim();

    const speed =
        Number(speedElement.value);

    const delay =
        Number(delayElement.value);

    const weather =
        Number(weatherElement.value);

    const congestion =
        Number(congestionElement.value);


    // =================================================
    // VALIDATION
    // =================================================

    if (trainNumber === "") {

        analysisBox.innerHTML = `
            <p>
                ⚠️ Please enter a train number.
            </p>
        `;

        return;
    }


    if (speed <= 0 || Number.isNaN(speed)) {

        analysisBox.innerHTML = `
            <p>
                ⚠️ Please enter a valid train speed.
            </p>
        `;

        return;
    }


    if (delay < 0 || Number.isNaN(delay)) {

        analysisBox.innerHTML = `
            <p>
                ⚠️ Delay cannot be negative.
            </p>
        `;

        return;
    }


    // =================================================
    // LOADING MESSAGE
    // =================================================

    analysisBox.innerHTML = `
        <p>
            🤖 Analyzing railway conditions and
            predicting ETA...
        </p>
    `;


    try {

        // =================================================
        // 1. GET DYNAMIC ML ETA
        // =================================================

        const etaURL =
            `${API_URL}/trains/${trainNumber}/dynamic-eta` +
            `?speed_kmh=${speed}` +
            `&current_delay=${delay}` +
            `&weather_factor=${weather}` +
            `&congestion_level=${congestion}`;


        console.log(
            "ML ETA URL:",
            etaURL
        );


        const etaResponse =
            await fetch(etaURL);


        // =================================================
        // TRAIN NOT FOUND
        // =================================================

        if (!etaResponse.ok) {

            if (etaResponse.status === 404) {

                analysisBox.innerHTML = `
                    <p>
                        ❌ Train
                        <strong>${trainNumber}</strong>
                        was not found.
                    </p>

                    <p>
                        Try:
                        <strong>12627</strong>
                        or
                        <strong>12007</strong>.
                    </p>
                `;

                return;
            }


            throw new Error(
                `ETA request failed: ${etaResponse.status}`
            );
        }


        const etaData =
            await etaResponse.json();


        console.log(
            "✅ ML ETA response:",
            etaData
        );


        // =================================================
        // 2. GET CONTROL ROOM ALERTS
        // =================================================

        const alertURL =
            `${CONTROL_ROOM_API_URL}/control-room/analyze` +
            `?speed_kmh=${speed}` +
            `&current_delay=${delay}` +
            `&weather_factor=${weather}` +
            `&congestion_level=${congestion}`;


        console.log(
            "Control Room URL:",
            alertURL
        );


        const alertResponse =
            await fetch(alertURL);


        if (!alertResponse.ok) {

            throw new Error(
                `Control Room request failed: ${alertResponse.status}`
            );
        }


        const alertData =
            await alertResponse.json();


        console.log(
            "✅ Control Room response:",
            alertData
        );


        // =================================================
        // 3. UPDATE ALERT TABLE
        // =================================================

        alertTableBody.innerHTML = "";


        if (
            !alertData.alerts ||
            alertData.alerts.length === 0
        ) {

            alertTableBody.innerHTML = `
                <tr>

                    <td colspan="3">
                        ✅ No operational
                        disruptions detected.
                    </td>

                </tr>
            `;

        } else {

            alertData.alerts.forEach(item => {

                const row =
                    document.createElement("tr");


                row.innerHTML = `
                    <td>
                        ${item.alert}
                    </td>

                    <td>
                        ${item.severity}
                    </td>

                    <td>
                        ${item.action}
                    </td>
                `;


                alertTableBody.appendChild(row);

            });

        }


        // =================================================
        // 4. COUNT ALERTS
        // =================================================

        const alertCount =
            alertData.alerts
                ? alertData.alerts.length
                : 0;


        const criticalCount =
            alertData.alerts
                ? alertData.alerts.filter(
                    item =>
                        item.severity === "Critical"
                ).length
                : 0;


        // =================================================
        // 5. NETWORK STATUS
        // =================================================

        const networkStatus =
            document.getElementById(
                "networkStatus"
            );


        if (networkStatus) {

            networkStatus.textContent =
                alertData.network_status;


            networkStatus.classList.remove(
                "green",
                "red",
                "orange"
            );


            if (
                alertData.network_status ===
                "Normal"
            ) {

                networkStatus.classList.add(
                    "green"
                );

            } else if (
                alertData.network_status ===
                "Disruption"
            ) {

                networkStatus.classList.add(
                    "red"
                );

            } else {

                networkStatus.classList.add(
                    "orange"
                );

            }

        }


        // =================================================
        // 6. CONTROL ROOM STATISTICS
        // =================================================

        const activeAlerts =
            document.getElementById(
                "activeAlerts"
            );


        const criticalSections =
            document.getElementById(
                "criticalSections"
            );


        const delayedTrains =
            document.getElementById(
                "delayedTrains"
            );


        if (activeAlerts) {

            activeAlerts.textContent =
                alertCount;

        }


        if (criticalSections) {

            criticalSections.textContent =
                criticalCount;

        }


        if (delayedTrains) {

            delayedTrains.textContent =
                delay > 5 ? "1" : "0";

        }


        // =================================================
        // 7. OPERATIONAL SUMMARY
        // =================================================

        const summaryTrain =
            document.getElementById(
                "summaryTrain"
            );


        const summarySpeed =
            document.getElementById(
                "summarySpeed"
            );


        const summaryDelay =
            document.getElementById(
                "summaryDelay"
            );


        const summaryETA =
            document.getElementById(
                "summaryETA"
            );


        if (summaryTrain) {

            summaryTrain.textContent =
                etaData.train_number;

        }


        if (summarySpeed) {

            summarySpeed.textContent =
                `${etaData.speed_kmh} km/h`;

        }


        if (summaryDelay) {

            summaryDelay.textContent =
                `${etaData.current_delay} min`;

        }


        if (summaryETA) {

            summaryETA.textContent =
                `${etaData.predicted_eta_minutes} min`;

        }


        // =================================================
        // 8. RECOMMENDED ACTION
        // =================================================

        const recommendedAction =
            alertData.alerts &&
            alertData.alerts.length > 0

                ? alertData.alerts[0].action

                : "Continue normal operations";


        // =================================================
        // 9. DISPLAY ANALYSIS
        // =================================================

        analysisBox.innerHTML = `

            <div class="dashboard-cards">

                <div class="dashboard-card">

                    <p>
                        Train
                    </p>

                    <h3>
                        ${etaData.train_number}
                    </h3>

                </div>


                <div class="dashboard-card">

                    <p>
                        Train Name
                    </p>

                    <h3>
                        ${etaData.train_name}
                    </h3>

                </div>


                <div class="dashboard-card">

                    <p>
                        Updated Speed
                    </p>

                    <h3>
                        ${etaData.speed_kmh}
                        km/h
                    </h3>

                </div>


                <div class="dashboard-card">

                    <p>
                        Current Delay
                    </p>

                    <h3>
                        ${etaData.current_delay}
                        min
                    </h3>

                </div>


                <div class="dashboard-card">

                    <p>
                        🤖 ML Predicted ETA
                    </p>

                    <h3>
                        ${etaData.predicted_eta_minutes}
                        min
                    </h3>

                </div>

            </div>


            <br>


            <p>

                <strong>
                    Weather Factor:
                </strong>

                ${etaData.weather_factor}

            </p>


            <p>

                <strong>
                    Congestion Level:
                </strong>

                ${etaData.congestion_level}

            </p>


            <p>

                <strong>
                    Prediction Method:
                </strong>

                ${etaData.prediction_method}

            </p>


            <p>

                <strong>
                    Network Status:
                </strong>

                ${alertData.network_status}

            </p>


            <p>

                <strong>
                    Recommended Action:
                </strong>

                ${recommendedAction}

            </p>

        `;


        console.log(
            "✅ Control Room analysis completed"
        );

    }


    // =================================================
    // ERROR HANDLING
    // =================================================

    catch (error) {

        console.error(
            "❌ Control Room / ML error:",
            error
        );


        analysisBox.innerHTML = `

            <p>
                ❌ Unable to connect to
                the RailPredict backend.
            </p>

            <p>

                Error:
                <strong>
                    ${error.message}
                </strong>

            </p>

            <p>

                Make sure the FastAPI server
                is running.

            </p>

        `;

    }

}


// =====================================================
// BACKWARD COMPATIBILITY
// =====================================================

// Allows the old function name to work too.

function analyzeConditions() {

    analyzeControlRoom();

}