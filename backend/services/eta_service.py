def calculate_eta(distance_km, speed_kmh, current_delay):
    if speed_kmh <= 0:
        return None

    travel_time_hours = distance_km / speed_kmh
    travel_time_minutes = travel_time_hours * 60

    predicted_time = travel_time_minutes + current_delay

    return round(predicted_time, 2)