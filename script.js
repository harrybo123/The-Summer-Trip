document.addEventListener('DOMContentLoaded', () => {
    const itineraryContent = document.getElementById('itinerary-content');
    const flightsContent = document.getElementById('flights-content');
    const weatherContent = document.getElementById('weather-content');
    const activitiesContent = document.getElementById('activities-content');
    const quickInfoContent = document.getElementById('quick-info-content');

    const itinerary = {
        '2024-08-10': 'Arrive in SLC, Stay at Le Meridien Downtown',
        '2024-08-11': 'Explore SLC & relax',
        '2024-08-12': 'Drive to Yellowstone area, Stay at Island Park or Old Faithful Inn',
        '2024-08-13': 'Explore Grand Prismatic Spring & Old Faithful geyser',
        '2024-08-14': 'More exploration, West Yellowstone Rodeo at 7pm',
        '2024-08-15': 'Drive to SLC & stay 1 night',
        '2024-08-16': 'Flight to HNL, Stay at Four Seasons Oahu at Ko Olina',
        '2024-08-17': 'Explore Pearl Harbour',
        '2024-08-18': 'Relax',
        '2024-08-19': 'Exploring Oahu round trip',
        '2024-08-20': 'Flight to LIH, Stay at Royal Sonesta Kauai',
        '2024-08-21': 'Explore Kauai',
        '2024-08-22': 'Relax in Kauai',
        '2024-08-23': 'Flight to SEA, Stay at Four Seasons Seattle',
        '2024-08-24': 'Explore Seattle',
        '2024-08-25': 'Flight to LHR'
    };

    const flights = [
        { date: '2024-08-10', flight: 'LHR 10.55 to SLC 14.25 Virgin 10hr 30 mins' },
        { date: '2024-08-16', flight: 'SLC 11.20 to HNL 13.53 DELTA 6hr 33 mins' },
        { date: '2024-08-20', flight: 'HNL 14.35 to LIH 15.18 Hawaiian Airlines 43 mins' },
        { date: '2024-08-23', flight: 'LIH 13.07 to SEA 22.00 Alaska Airlines 5 hrs 53 mins' },
        { date: '2024-08-25', flight: 'SEA 19.40 to LHR 13.00 on 26th Aug' }
    ];

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // Display today's itinerary
    if (itinerary[today]) {
        itineraryContent.innerHTML = `<p>${itinerary[today]}</p>`;
    } else {
        itineraryContent.innerHTML = '<p>No itinerary for today.</p>';
    }

    // Display upcoming flights
    flightsContent.innerHTML = flights.map(flight => `<p>${flight.date}: ${flight.flight}</p>`).join('');

    // Display quick info
    const tomorrowFlight = flights.find(flight => flight.date === tomorrowStr);
    if (tomorrowFlight) {
        quickInfoContent.innerHTML = `<p>Flight tomorrow: ${tomorrowFlight.flight}</p>`;
    } else {
        quickInfoContent.innerHTML = '<p>No flights tomorrow.</p>';
    }

    // Fetch and display weather
    fetchWeather();

    // Fetch and display nearby activities
    fetchNearbyActivities();

    function fetchWeather() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                fetchWeatherData(latitude, longitude);
            }, () => {
                // Default location (e.g., New York City) if user denies geolocation
                const defaultLatitude = 40.7128;
                const defaultLongitude = -74.0060;
                fetchWeatherData(defaultLatitude, defaultLongitude);
            });
        } else {
            weatherContent.innerHTML = '<p>Geolocation is not supported by this browser.</p>';
        }
    }

    function fetchWeatherData(latitude, longitude) {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const current = data.current;
                weatherContent.innerHTML = `
                    <p>Temperature: ${current.temperature_2m}°C</p>
                    <p>Wind Speed: ${current.wind_speed_10m} m/s</p>
                `;
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                weatherContent.innerHTML = '<p>Unable to fetch weather data.</p>';
            });
    }

    function fetchNearbyActivities() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                fetchNearbyActivitiesData(latitude, longitude);
            }, () => {
                // Default location (e.g., New York City) if user denies geolocation
                const defaultLatitude = 40.7128;
                const defaultLongitude = -74.0060;
                fetchNearbyActivitiesData(defaultLatitude, defaultLongitude);
            });
        } else {
            activitiesContent.innerHTML = '<p>Geolocation is not supported by this browser.</p>';
        }
    }

    function fetchNearbyActivitiesData(latitude, longitude) {
        const apiKey = 'QCBM136AletNdNNmtRz8tgpS7JglIWN7iJ9Hlmyh-KQ0C5NS4wALdmjLDHckCB4QtQ4qCddy4Ly03gJ-IgI-j0VvIDGkvJCyiTvmD5VyjmSafEoUh_39kjSuHfebZnYx';
        const url = `https://api.yelp.com/v3/businesses/search?latitude=${latitude}&longitude=${longitude}&term=tourist%20attractions&radius=20000&categories=Tourist%20Attractions&sort_by=best_match&limit=20`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${apiKey}`
            }
        };

        fetch(url, options)
            .then(response => response.json())
            .then(data => {
                activitiesContent.innerHTML = data.businesses.map(activity => `<p>${activity.name}</p>`).join('');
            })
            .catch(error => {
                console.error('Error fetching nearby activities data:', error);
                activitiesContent.innerHTML = '<p>Unable to fetch nearby activities data.</p>';
            });
    }
});
