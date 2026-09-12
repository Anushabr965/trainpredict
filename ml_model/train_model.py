import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error
import joblib
import os

# Load dataset
data_path = "data/historical_delays.csv"
data = pd.read_csv(data_path)

# Features used by the model
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

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Create and train model
model = LinearRegression()
model.fit(X_train, y_train)

# Make predictions
predictions = model.predict(X_test)

# Calculate performance
mae = mean_absolute_error(y_test, predictions)
rmse = mean_squared_error(y_test, predictions) ** 0.5

print("Linear Regression Model")
print("-----------------------")
print(f"MAE: {mae:.2f} minutes")
print(f"RMSE: {rmse:.2f} minutes")

# Save model
os.makedirs("ml_model", exist_ok=True)

joblib.dump(model, "ml_model/linear_regression_model.pkl")

print("Model saved successfully!")