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

function storeWeather(weatherObj) {
  localStorage.setItem('weather', JSON.stringify(weatherObj));
};


function hideLoader(){
  const loader = document.querySelector('#loader-container');
  loader.style.visibility = 'hidden';
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
    storeWeather(weather)
  } catch (error) {
    errorMsg.style.visibility = 'visible';
    errorMsg.style.display = '';
    return null;
  };

  return weather;
};

function updateBackgroundColor(weather){
  const body = document.querySelector('body');
  if (weather.icon.includes('day')) {
    body.style.background = 'var(--day)';
  } else if (weather.icon.includes('night')) {
    body.style.background = 'var(--night)';
  } else if (weather.icon.includes('snow')) {
    body.style.background = 'var(--snow)';
  } else if (
    weather.icon.includes('overcast')
    || weather.icon.includes('cloudy')
  ) {
    body.style.background = 'var(--overcast)';
  } else if (weather.icon.includes('rain')) { 
    body.style.background = 'var(--rain)';
  } else {
    body.style.background = 'var(--default)';
  };
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
    updateBackgroundColor(weatherObj)
  };
};

locationForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const weather = await fetchWeather(getInputValue());
  displayWeather(weather);
});

closeErrorMsg.addEventListener('click', () => {
  errorMsg.style.visibility = 'hidden';
  errorMsg.style.display = '';
});

async function firstLoad(){
  if(localStorage.getItem('weather')){
    let data = JSON.parse(localStorage.getItem('weather'))
    displayWeather(data)
    setTimeout(() => {
      hideLoader();
    }, 1000)
  } else {
    let data = await fetchWeather('são paulo')
    displayWeather(data)
    setTimeout(() => {
      hideLoader();
    }, 1000)
  }
}

window.onload = firstLoad()

