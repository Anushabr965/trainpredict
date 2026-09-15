// =====================================================
// RAILPREDICT CONTROL ROOM
// Backend + ML ETA Connected
// =====================================================

const API_URL = "http://127.0.0.1:8000";


// =====================================================
// ANALYZE RAILWAY CONDITIONS
// =====================================================

async function analyzeConditions() {

    // -------------------------------------------------
    // GET INPUT VALUES
    // -------------------------------------------------

    const trainNumber =
        document.getElementById("controlTrainNumber").value.trim();

    const speed =
        Number(document.getElementById("controlSpeed").value);

    const delay =
        Number(document.getElementById("controlDelay").value);

    const weather =
        Number(document.getElementById("controlWeather").value);

    const congestion =
        Number(document.getElementById("controlCongestion").value);

    const analysisBox =
        document.getElementById("controlAnalysis");

    const alertTableBody =
        document.getElementById("alertTableBody");


    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (trainNumber === "") {

        analysisBox.innerHTML = `
            <p>⚠️ Please enter a train number.</p>
        `;

        return;
    }


    if (speed <= 0) {

        analysisBox.innerHTML = `
            <p>⚠️ Please enter a valid train speed.</p>
        `;

        return;
    }


    if (delay < 0) {

        analysisBox.innerHTML = `
            <p>⚠️ Delay cannot be negative.</p>
        `;

        return;
    }


    // -------------------------------------------------
    // LOADING MESSAGE
    // -------------------------------------------------

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


        const etaResponse =
            await fetch(etaURL);


        // TRAIN NOT FOUND

        if (!etaResponse.ok) {

            if (etaResponse.status === 404) {

                analysisBox.innerHTML = `
                    <p>
                        ❌ Train ${trainNumber}
                        was not found.
                    </p>

                    <p>
                        Try train
                        <strong>12627</strong>
                        or
                        <strong>12007</strong>.
                    </p>
                `;

                return;
            }

            throw new Error(
                "ETA request failed"
            );

        }


        const etaData =
            await etaResponse.json();


        // =================================================
        // 2. GET CONTROL ROOM ALERTS
        // =================================================

        const alertURL =
            `${API_URL}/control-room/analyze` +
            `?speed_kmh=${speed}` +
            `&current_delay=${delay}` +
            `&weather_factor=${weather}` +
            `&congestion_level=${congestion}`;


        const alertResponse =
            await fetch(alertURL);


        if (!alertResponse.ok) {

            throw new Error(
                "Control Room request failed"
            );

        }


        const alertData =
            await alertResponse.json();


        console.log(
            "ML ETA response:",
            etaData
        );

        console.log(
            "Control Room response:",
            alertData
        );


        // =================================================
        // 3. UPDATE OPERATIONAL ALERT TABLE
        // =================================================

        alertTableBody.innerHTML = "";


        if (
            !alertData.alerts ||
            alertData.alerts.length === 0
        ) {

            alertTableBody.innerHTML = `
                <tr>

                    <td colspan="4">

                        ✅ No operational
                        disruptions detected.

                    </td>

                </tr>
            `;

        }

        else {

            alertData.alerts.forEach(
                item => {

                    const row =
                        document.createElement("tr");


                    row.innerHTML = `

                        <td>
                            ${item.alert}
                        </td>

                        <td>
                            Current Route
                        </td>

                        <td>
                            ${item.severity}
                        </td>

                        <td>
                            ${item.action}
                        </td>

                    `;


                    alertTableBody.appendChild(row);

                }
            );

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
        // 5. UPDATE NETWORK STATUS
        // =================================================

        const networkStatus =
            document.getElementById(
                "networkStatus"
            );


        networkStatus.textContent =
            alertData.network_status;


        // Remove old status classes

        networkStatus.classList.remove(
            "green",
            "red",
            "orange"
        );


        // Apply status class

        if (
            alertData.network_status === "Normal"
        ) {

            networkStatus.classList.add(
                "green"
            );

        }

        else if (
            alertData.network_status === "Disruption"
        ) {

            networkStatus.classList.add(
                "red"
            );

        }

        else {

            networkStatus.classList.add(
                "orange"
            );

        }


        // =================================================
        // 6. UPDATE CONTROL ROOM STATISTICS
        // =================================================

        document.getElementById(
            "activeAlerts"
        ).textContent =
            alertCount;


        document.getElementById(
            "criticalSections"
        ).textContent =
            criticalCount;


        // Selected train is considered delayed
        // when delay is greater than 5 minutes.

        document.getElementById(
            "delayedTrains"
        ).textContent =
            delay > 5 ? "1" : "0";


        // =================================================
        // 7. UPDATE OPERATIONAL SUMMARY
        // =================================================

        document.getElementById(
            "summaryTrain"
        ).textContent =
            etaData.train_number;


        document.getElementById(
            "summarySpeed"
        ).textContent =
            `${etaData.speed_kmh} km/h`;


        document.getElementById(
            "summaryDelay"
        ).textContent =
            `${etaData.current_delay} min`;


        document.getElementById(
            "summaryETA"
        ).textContent =
            `${etaData.predicted_eta_minutes} min`;


        // =================================================
        // 8. DISPLAY ANALYSIS RESULT
        // =================================================

        const recommendedAction =
            alertData.alerts &&
            alertData.alerts.length > 0

                ? alertData.alerts[0].action

                : "Continue normal operations";


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


        // =================================================
        // 9. SUCCESS MESSAGE IN CONSOLE
        // =================================================

        console.log(
            "✅ Control Room analysis completed"
        );

    }


    // =================================================
    // ERROR HANDLING
    // =================================================

    catch (error) {

        console.error(
            "Control Room / ML error:",
            error
        );


        analysisBox.innerHTML = `

            <p>
                ❌ Unable to connect to
                the RailPredict backend.
            </p>

            <p>
                Make sure the FastAPI server
                is running.
            </p>

        `;

    }

}