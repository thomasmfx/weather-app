import {
  fetchWeather,
  toggleTemperature,
  getStoredData
} from "./index.js";

const form = document.querySelector('form');
const errorMsg = document.querySelector('#error-message-container');
const closeErrorMsg = document.querySelector('#close-error-message');
const toggleTemperatureBtns = document.querySelectorAll('.temperature');
const dropdownBtn = document.querySelector('#dropdown-btn');
const content = document.querySelector('#dropdown-content');

function getLocationValue() {
  const input = document.querySelector('#search-bar');
  const locationName = input.value;

  if (locationName !== '') {
    input.value = '';
    return locationName;
  };

  return null;
};

function displayWeather() {
  let weather = getStoredData();
  let tempPreference;

  if(localStorage.getItem('temp')) {
    tempPreference = JSON.parse(localStorage.getItem('temp'));
  } else {
    tempPreference = 'c';
  };

  if (weather) {
    document.querySelector('#main-weather-condition')
    .textContent = weather.condition;
    document.querySelector('#temp')
    .textContent = weather.temp[`${tempPreference}`];
    document.querySelector('#current-location')
    .textContent = weather.location;
    document.querySelector('#localdate')
    .textContent = weather.localDate;
    document.querySelector('#mintemp')
    .textContent = weather.minTemp[`${tempPreference}`];
    document.querySelector('#maxtemp')
    .textContent = weather.maxTemp[`${tempPreference}`];
    document.querySelector('#humidity')
    .textContent = weather.humidity;
    document.querySelector('#wind')
    .textContent = weather.wind;
    document.querySelector('#tempicon')
    .src = `./assets/1st Set - Monochrome/${weather.icon}.svg`;

    updateBackgroundColor(weather);
  };
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
};

function updateTemperatureChoice(temp) {
  const button = document.querySelectorAll('.temperature');
  button.forEach((btn) => {
    if (btn.id === temp) {
      btn.firstElementChild.className = 'stripe';
    } else {
      btn.firstElementChild.className = '';
    };
  });
};

function hideLoader() {
  const loader = document.querySelector('#loader-container');
  loader.style.visibility = 'hidden';
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  fetchWeather(getLocationValue()).then(displayWeather);
});

closeErrorMsg.addEventListener('click', () => {
  errorMsg.style.visibility = 'hidden';
  errorMsg.style.display = '';
});

dropdownBtn.addEventListener('click', () => {
  if (content.style.visibility === 'visible') {
    content.style.visibility = 'hidden';
  } else {
    content.style.visibility = 'visible';
  };
});

toggleTemperatureBtns.forEach((button) => {
  button.addEventListener('click', () => {
    toggleTemperature(button.id);
  });
});

export {
  displayWeather,
  hideLoader,
  errorMsg,
  updateTemperatureChoice
}
