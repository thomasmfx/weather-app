import { 
  displayWeather,
  hideLoader,
  errorMsg,
  updateTemperatureChoice
} from "./dom.js";

function formatData(data) {
  const dataObj = {};

  dataObj.condition = data.currentConditions.conditions;
  dataObj.location = data.resolvedAddress;
  dataObj.localDate = data.days[0].datetime;
  dataObj.humidity = data.days[0].humidity;
  dataObj.wind = data.days[0].windspeed;
  dataObj.icon = data.currentConditions.icon;
  dataObj.temp = {
    c: data.currentConditions.temp,
    f: Math.round(((data.currentConditions.temp * 1.8) + 32)),
    k: (data.currentConditions.temp + 273)
  };
  dataObj.minTemp = {
    c: data.days[0].tempmin,
    f: Math.round(((data.days[0].tempmin * 1.8) + 32)),
    k: (data.days[0].tempmin + 273)
  };
  dataObj.maxTemp = {
    c: data.days[0].tempmax,
    f: Math.round(((data.days[0].tempmax * 1.8) + 32)),
    k: (data.days[0].tempmax + 273)
  };

  return dataObj;
};

function storeData(dataName, data) {
  localStorage.setItem(`${dataName}`, JSON.stringify(data));
};

function getStoredData() {
  return JSON.parse(localStorage.getItem('weather'));
};

function onSucces(dataName, data) {
  storeData(dataName, formatData(data));
};

function onError() {
  errorMsg.style.visibility = 'visible';
  errorMsg.style.display = '';
};

async function fetchWeather(location) {
  try {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=FK7J8WFSF4RXPK7GLDSQ78P6S&contentType=json`,
       { mode: 'cors' }
    );
    const data = await response.json();
    console.log(data)
    return onSucces('weather', data);
  } catch (error) {
    return onError();
  };
};

function storeTemperature(temp) {
  localStorage.setItem('temp', JSON.stringify(temp));
};

function toggleTemperature(newTemp) {
  storeTemperature(newTemp);
  updateTemperatureChoice(newTemp);
  displayWeather();
};

function firstLoad() {
  const storedTemp = JSON.parse(localStorage.getItem('temp'));
  const storedWeather = JSON.parse(localStorage.getItem('weather'));

  if (storedTemp) {
    updateTemperatureChoice(storedTemp);
  } else {
    toggleTemperature('c');
  };

  if (storedWeather){
    fetchWeather(storedWeather.location)
    .then(displayWeather)
    .finally(
      setTimeout(() => {
        hideLoader();
      }, 2500)
    );
  } else {
    fetchWeather('são paulo').then(displayWeather);
    setTimeout(() => {
      hideLoader();
    }, 2500);
  };
};

window.onload = firstLoad();

export {
  fetchWeather,
  toggleTemperature,
  getStoredData
};

// In case of making too many requestes while modifying the code in some type of
// hot reload, use this object instead of fetching new requests

// let temporary = {
//   "condition": "Overcast",
//   "temp": {
//     "c": 13.9,
//     "f": Math.round(57.019999999999996),
//     "k": 286.9
//   },
//   "location": "Guaianazes, São Paulo, SP, Brasil",
//   "localDate": "2024-07-13",
//   "minTemp": {
//     c: 13.3,
//     f: Math.round(((13.3 * 1.8) + 32)),
//     k: (13.3 + 273)
//   },
//   "maxTemp": {
//     c: 17.2,
//     f: Math.round(((17.2 * 1.8) + 32)),
//     k: (17.2 + 273)
//   },
//   "humidity": 88.8,
//   "wind": 14.4,
//   "icon": "cloudy"
// }

// localStorage.setItem('weather', JSON.stringify(temporary))
