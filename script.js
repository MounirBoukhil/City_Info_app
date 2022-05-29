"use strict";
const section2 = document.querySelector(".s2");
const section3 = document.querySelector(".s3");
const countryName = document.querySelector(".countryName");
const continentName = document.querySelector(".continentName");
const temperatureName = document.querySelector(".Temperature");
const condition = document.querySelector(".condition");
const researchButton = document.querySelector(".researchButton");
const researchInput = document.querySelector(".searchInput");
const windSpeedName = document.querySelector(".windSpeed");
const localTimeName = document.querySelector(".localTime");
const spinnerContainer = document.querySelector(".spinner-container");
let map;

const showMessageinSearchInput = function () {
  let y = 0;
  let msg = "Enter The City Name ";
  function writeMessage() {
    if (y < msg.length) {
      researchInput.placeholder += msg.charAt(y);
      y++;
      setTimeout(writeMessage, 100);
    }
  }
  writeMessage();
};
showMessageinSearchInput();

const researchInfo = function (event) {
  event.preventDefault();
  if (researchInput.value) {
    showSpinner();
    getInfo(researchInput.value);
  }
};
researchButton.addEventListener("click", researchInfo);
researchButton.addEventListener("click", function (keyPress) {
  if (keyPress == "Enter") {
    researchInfo(keyPress);
  }
});

const getInfo = function (city) {
  fetch(`https://api.weatherapi.com/v1/current.json?key=b8d0a9dadb1d4576904235718210211&q=${city}&aqi=no`)
    .then((resp) => resp.json())
    .then((info) => addInfo(info))
    .catch((err) => console.error(`${err} 💥💥💥`));
};
const addInfo = function (data) {
  let info = {
    cityName: data.location.name,
    Country: data.location.country,
    Continent: data.location.tz_id.split("/")[0],
    Temperature: `${data.current.temp_c} c | ${data.current.temp_f} f`,
    Condition: data.current.condition.text,
    windSpeed: `${data.current.wind_kph} km/h | ${data.current.wind_mph} m/h`,
    localTimeName: data.location.localtime,
    Coords: { Latitude: data.location.lat, Longitude: data.location.lon },
  };
  countryName.textContent = info.Country;
  continentName.textContent = info.Continent;
  temperatureName.textContent = info.Temperature;
  condition.textContent = info.Condition;
  windSpeedName.textContent = info.windSpeed;
  localTimeName.textContent = info.localTimeName;
  section2.classList.remove("hidden");
  spinnerContainer.classList.remove("loading-spinner");
  return creatMap(info.cityName, info.Coords.Latitude, info.Coords.Longitude);
};
const creatMap = function (locationName, lat, lon) {
  section3.innerHTML = `<div id="map"></div>`;
  map = L.map("map");
  map.setView([lat, lon], 8);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  L.marker([lat, lon]).addTo(map).openPopup();

  let mapPromise = new Promise((resolve, reject) => {
    if (map._loaded) {
      resolve("success");
    } else {
      reject("failed to download the map");
    }
  });
  return mapPromise;
};

const showSpinner = function () {
  section2.classList.add("hidden");
  spinnerContainer.classList.add("loading-spinner");
};
