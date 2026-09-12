import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error


# Load dataset
data = pd.read_csv("data/historical_delays.csv")

# Features
features = [
    "distance_km",
    "speed_kmh",
    "current_delay",
    "scheduled_time_minutes",
    "weather_factor",
    "congestion_level"
]

X = data[features]
y = data["actual_time_minutes"]


# Split the same way for every model
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)


# Create models
models = {
    "Linear Regression": LinearRegression(),

    "Random Forest": RandomForestRegressor(
        n_estimators=100,
        random_state=42
    ),

    "Gradient Boosting": GradientBoostingRegressor(
        n_estimators=100,
        random_state=42
    )
}


print("\nMODEL PERFORMANCE COMPARISON")
print("============================")


results = []


# Train and evaluate each model
for name, model in models.items():

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    mae = mean_absolute_error(y_test, predictions)

    rmse = mean_squared_error(
        y_test,
        predictions
    ) ** 0.5

    accuracy_10 = (
        abs(predictions - y_test) <= 10
    ).mean() * 100

    results.append({
        "Model": name,
        "MAE": mae,
        "RMSE": rmse,
        "Accuracy_10_min": accuracy_10
    })


# Display results
for result in results:

    print(f"\n{result['Model']}")
    print(f"MAE: {result['MAE']:.2f} minutes")
    print(f"RMSE: {result['RMSE']:.2f} minutes")
    print(
        f"Accuracy within ±10 minutes: "
        f"{result['Accuracy_10_min']:.2f}%"
    )


# Find best model based on MAE
best_model = min(
    results,
    key=lambda x: x["MAE"]
)

print("\n============================")
print("BEST MODEL")
print("============================")
print(best_model["Model"])
print(f"MAE: {best_model['MAE']:.2f} minutes")
print(f"RMSE: {best_model['RMSE']:.2f} minutes")
print(
    f"Accuracy within ±10 minutes: "
    f"{best_model['Accuracy_10_min']:.2f}%"
)