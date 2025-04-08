import { useEffect, useState, useCallback } from "react";
import Search from "../search";

export default function Weather() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [unit, setUnit] = useState("metric");
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  // Wrap fetchWeatherData in useCallback to memoize it
  const fetchWeatherData = useCallback(
    async (param) => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${param}&units=${unit}&appid=e34b4c51d8c2b7bf48d5217fe52ff79e`
        );

        const data = await response.json();
        if (data) {
          setWeatherData(data);
          setLoading(false);
        }
      } catch (e) {
        setLoading(false);
        console.log(e);
      }
    },
    [unit]
  ); // Add unit as dependency since it's used in the function

  async function handleSearch() {
    if (search.trim() !== "") {
      fetchWeatherData(search);
    }
  }

  function getCurrentDate() {
    return new Date().toLocaleDateString("en-us", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  function getWeatherIcon(condition) {
    const iconMap = {
      "01d": "sun",
      "01n": "moon",
      "02d": "cloud-sun",
      "02n": "cloud-moon",
      "03d": "cloud",
      "03n": "cloud",
      "04d": "cloud",
      "04n": "cloud",
      "09d": "cloud-rain",
      "09n": "cloud-rain",
      "10d": "cloud-sun-rain",
      "10n": "cloud-moon-rain",
      "11d": "bolt",
      "11n": "bolt",
      "13d": "snowflake",
      "13n": "snowflake",
      "50d": "smog",
      "50n": "smog",
    };
    return iconMap[condition] || "cloud";
  }

  useEffect(() => {
    fetchWeatherData("bangalore");
  }, [fetchWeatherData]); // Now we can safely add fetchWeatherData to dependencies

  return (
    <div className={`weather-app ${darkMode ? "dark" : ""}`}>
      <div className="app-header">
        <h1>Weather Forecast</h1>
        <div className="header-controls">
          <div className="unit-toggle">
            <button
              className={unit === "metric" ? "active" : ""}
              onClick={() => setUnit("metric")}
            >
              °C
            </button>
            <button
              className={unit === "imperial" ? "active" : ""}
              onClick={() => setUnit("imperial")}
            >
              °F
            </button>
          </div>
          <button className="dark-mode-toggle" onClick={toggleDarkMode}>
            <i className={`fas fa-${darkMode ? "sun" : "moon"}`}></i>
          </button>
        </div>
      </div>

      <Search
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
      />

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading weather data...</p>
        </div>
      ) : (
        weatherData && (
          <div className="weather-container">
            <div className="location-info">
              <h2>
                {weatherData?.name}, <span>{weatherData?.sys?.country}</span>
              </h2>
              <p className="date">{getCurrentDate()}</p>
            </div>

            <div className="current-weather">
              <div className="temperature">
                <i
                  className={`fas fa-${getWeatherIcon(
                    weatherData?.weather[0]?.icon
                  )}`}
                ></i>
                <span>
                  {Math.round(weatherData?.main?.temp)}°
                  {unit === "metric" ? "C" : "F"}
                </span>
              </div>
              <p className="description">
                {weatherData?.weather[0]?.description}
              </p>
            </div>

            <div className="weather-details">
              <div className="detail-card">
                <i className="fas fa-wind"></i>
                <div>
                  <p>
                    {weatherData?.wind?.speed}{" "}
                    {unit === "metric" ? "m/s" : "mph"}
                  </p>
                  <p>Wind Speed</p>
                </div>
              </div>

              <div className="detail-card">
                <i className="fas fa-tint"></i>
                <div>
                  <p>{weatherData?.main?.humidity}%</p>
                  <p>Humidity</p>
                </div>
              </div>

              <div className="detail-card">
                <i className="fas fa-temperature-low"></i>
                <div>
                  <p>
                    {Math.round(weatherData?.main?.feels_like)}°
                    {unit === "metric" ? "C" : "F"}
                  </p>
                  <p>Feels Like</p>
                </div>
              </div>

              <div className="detail-card">
                <i className="fas fa-compress-alt"></i>
                <div>
                  <p>{weatherData?.main?.pressure} hPa</p>
                  <p>Pressure</p>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
