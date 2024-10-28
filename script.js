const searchBtn = document.querySelector(".search-btn");
const inputText = document.querySelector(".input-text");
const weatherInfoSection = document.querySelector(".weather-info");
const searchCitySection = document.querySelector(".search-city");
const notFoundSection = document.querySelector(".not-found");
const forecastContainer = document.querySelector(".forecast-item-container");

const apiKey = "410b9acfb60984a4d3b30f3fdce80b66"; // Substitua pela sua chave de API
const weatherApiURL = "https://api.openweathermap.org/data/2.5/weather";
const forecastApiURL = "https://api.openweathermap.org/data/2.5/forecast";

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const city = inputText.value.trim();
  if (city) {
    fetchWeather(city);
    fetchForecast(city);
  }
});

async function fetchWeather(city) {
  try {
    const response = await fetch(
      `${weatherApiURL}?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();

    if (response.ok) {
      updateWeatherInfo(data);
    } else {
      showNotFound();
    }
  } catch (error) {
    console.error("Erro ao buscar informações climáticas:", error);
    showNotFound();
  }
}

async function fetchForecast(city) {
  try {
    const response = await fetch(
      `${forecastApiURL}?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();

    if (response.ok) {
      updateForecastInfo(data);
    } else {
      console.error("Erro ao buscar a previsão do tempo");
    }
  } catch (error) {
    console.error("Erro ao buscar a previsão do tempo:", error);
  }
}

function getDataWet(id) {
  if (id <= 232) return "thunderstorm.svg";
  if (id <= 321) return "drizzle.svg";
  if (id <= 531) return "rain.svg";
  if (id <= 622) return "snow.svg";
  if (id <= 781) return "atmosphere.svg";
  if (id == 800) return "clear.svg";
  return "clouds.svg";
}

function updateWeatherInfo(data) {
  const {
    name: city,
    main: { temp, humidity },
    weather: [{ id, main }],
    wind: { speed },
  } = data;

  document.querySelector(".local h4").textContent = city;
  document.querySelector(".weather-summary-info h1").textContent = `${Math.round(temp)}ºC`;
  document.querySelector(".weather-summary-info h3").textContent = main;
  document.querySelector(".condition-item:nth-child(1) h5:nth-child(2)").textContent = `${humidity}%`;
  document.querySelector(".condition-item:nth-child(2) h5:nth-child(2)").textContent = `${speed} M/s`;

  const currentDate = new Date();
  document.querySelector(".date-local").textContent = currentDate.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const weatherIcon = getDataWet(id);
  document.querySelector(".weather-img").src = `./assets/weather/${weatherIcon}`;

  weatherInfoSection.style.display = "block";
  searchCitySection.style.display = "none";
  notFoundSection.style.display = "none";
}

function updateForecastInfo(data) {
  const dailyForecasts = getDailyForecasts(data.list);
  forecastContainer.innerHTML = "";

  dailyForecasts.forEach((forecast) => {
    const forecastElement = document.createElement("div");
    forecastElement.classList.add("forecast-item");

    const dateElement = document.createElement("h5");
    dateElement.classList.add("forecast-item-date", "roboto-regular");
    dateElement.textContent = forecast.date;

    const imgElement = document.createElement("img");
    imgElement.classList.add("forecast-item-img");
    imgElement.src = `./assets/weather/${getDataWet(forecast.weatherId)}`;

    const tempElement = document.createElement("h5");
    tempElement.classList.add("forecast-item-temp");
    tempElement.textContent = `${Math.round(forecast.temp)}ºC`;

    forecastElement.appendChild(dateElement);
    forecastElement.appendChild(imgElement);
    forecastElement.appendChild(tempElement);
    forecastContainer.appendChild(forecastElement);
  });
}

function getDailyForecasts(list) {
  const forecasts = [];
  const dailyForecastMap = {};
  const currentDate = new Date();

  list.forEach((item) => {
    const forecastDate = new Date(item.dt_txt);

    if (forecastDate.getDate() !== currentDate.getDate() && forecastDate > currentDate) {
      const day = forecastDate.getDate();
      const month = forecastDate.getMonth();

      if (!dailyForecastMap[`${day}-${month}`] || forecastDate.getHours() === 12) {
        dailyForecastMap[`${day}-${month}`] = {
          date: forecastDate.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
          temp: item.main.temp,
          weatherId: item.weather[0].id,
          timestamp: forecastDate.getTime(),
        };
      }
    }
  });

  Object.values(dailyForecastMap)
    .sort((a, b) => a.timestamp - b.timestamp)
    .forEach((forecast) => {
      forecasts.push(forecast);
    });

  return forecasts.slice(0, 5);
}

function showNotFound() {
  weatherInfoSection.style.display = "none";
  searchCitySection.style.display = "none";
  notFoundSection.style.display = "block";
}
