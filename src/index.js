const locationForm = document.querySelector('form');
const errorMsg = document.querySelector('#error-message-container');
const closeErrorMsg = document.querySelector('#close-error-message');

function getInputValue() {
  const input = document.querySelector('#search-bar');
  const locationName = input.value;

  if (locationName !== '') {
    input.value = '';
    return locationName;
  };

  return null;
};

async function fetchWeather(location){
  const weather = {};

  try {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=FK7J8WFSF4RXPK7GLDSQ78P6S&contentType=json`,
       { mode: 'cors' }
    );
    const data = await response.json();

    weather.condition = data.currentConditions.conditions;
    weather.temp = data.currentConditions.temp;
    weather.location = data.resolvedAddress;
    weather.localDate = data.days[0].datetime;
    weather.minTemp = data.days[0].tempmin;
    weather.maxTemp = data.days[0].tempmax;
    weather.humidity = data.days[0].humidity;
    weather.wind = data.days[0].windspeed;
    weather.icon = data.currentConditions.icon;
  } catch (error) {
    errorMsg.style.visibility = 'visible';
    errorMsg.style.display = '';
    return null;
  };

  return weather;
}

function displayWeather(weatherObj) {
  if (weatherObj){
    document.querySelector('#main-weather-condition')
    .textContent = weatherObj.condition;
    document.querySelector('#temp')
    .textContent = weatherObj.temp;
    document.querySelector('#current-location')
    .textContent = weatherObj.location;
    document.querySelector('#localdate')
    .textContent = weatherObj.localDate;
    document.querySelector('#mintemp')
    .textContent = weatherObj.minTemp;
    document.querySelector('#maxtemp')
    .textContent = weatherObj.maxTemp;
    document.querySelector('#humidity')
    .textContent = weatherObj.humidity;
    document.querySelector('#wind')
    .textContent = weatherObj.wind;
    document.querySelector('#tempicon')
    .src = `../assets/1st Set - Monochrome/${weatherObj.icon}.svg`;
  };

  return null;
};

function storeWeather(weatherObj) {
  localStorage.setItem('weather', JSON.stringify(weatherObj));
};

locationForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const weather = await fetchWeather(getInputValue());
  displayWeather(weather);
  storeWeather(weather);
});

closeErrorMsg.addEventListener('click', () => {
  errorMsg.style.visibility = 'hidden';
  errorMsg.style.display = '';
});

window.onload = () => {
  if (localStorage.getItem('weather') != null) {
    displayWeather(JSON.parse(localStorage.getItem('weather')));
  };
};



