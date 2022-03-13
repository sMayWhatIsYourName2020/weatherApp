const getCurrent = (data) => document.querySelector(`[data-weather="${data}-current"]`);
const getAll = (data) => document.querySelectorAll(`[data-weather="${data}"]`);
const input = document.querySelector('#city');
const button = document.querySelector('.form__button');
const bgImage = document.querySelector('.degrees');
const weatherHeadling = document.querySelector('[data-headling="main"]');
const weatherDescription = document.querySelector('[data-description="description"]');
const degreeHeadling = getCurrent('degrees');
const humidity = getCurrent('humidity');
const windSpeed = getCurrent('wind-speed');
const pressure = getCurrent('pressure');
const feelsLike = getCurrent('feels-like');
const degreesWeek = getAll('degrees');
const humidityWeek = getAll('humidity');
const windSpeedWeek = getAll('wind-speed');
const pressureWeek = getAll('pressure');
const feelsLikeWeek = getAll('feels-like');
const weatherWeekHeadlings = getAll('headling');
const imageWeek = getAll('img');
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const hPaToMM = (data) => Math.round(data * 0.75);


const changeCurrentData = (obj) => {
  console.log(obj);
  degreeHeadling.textContent = Math.round(obj.current.temp);
  bgImage.style.backgroundImage = `URL('/assets/images/${obj.current.weather[0].icon}.svg')`;
  weatherHeadling.textContent = obj.current.weather[0].main;
  weatherDescription.textContent = obj.current.weather[0].description;
  humidity.textContent = obj.current.humidity;
  windSpeed.textContent = Math.round(obj.current.wind_speed);
  pressure.textContent = hPaToMM(obj.current.pressure);
  feelsLike.textContent = Math.round(obj.current.feels_like);
}

const changeWeekData = (arr) => {
  for (let i = 1; i < arr.length - 1; i++) {
    const elem = arr[i];
    console.log(elem);
    const newHumidity = Array.from(humidityWeek)[i - 1];
    newHumidity.textContent = elem.humidity;
    const newwindSpeed = Array.from(windSpeedWeek)[i - 1];
    newwindSpeed.textContent = Math.round(elem.wind_speed);
    const newPressure = Array.from(pressureWeek)[i - 1];
    newPressure.textContent = hPaToMM(elem.pressure);
    const newWeatherWeekHeadling = Array.from(weatherWeekHeadlings)[i - 1];
    newWeatherWeekHeadling.textContent = weekDays[new Date(elem.dt * 1000).getDay()];
    const newImage = Array.from(imageWeek)[i - 1];
    newImage.setAttribute('src', `/assets/images/${elem.weather[0].icon}.svg`);
    const newDegrees = Array.from(degreesWeek)[i - 1];
    newDegrees.textContent = Math.round(elem.temp.day);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  fetch(APIdata.ipService)
    .then((data) => data.json())
    .then((data) => {
      input.value = data.city;
      // const {latitude, longitude} = data;
      // search(latitude, longitude);
      toLatAndLon(data.city);
    })
    .catch(e => 1);
});


const APIdata = {
  key: 'e220e71697b7178a74e4eacaa488d2ce',
  ipService: 'https://api.ipgeolocation.io/ipgeo?apiKey=c709af55791b4ee799d73344274fab12&fields=city,latitude,longitude',
  weather: 'https://api.openweathermap.org/data/2.5/onecall?',
}

const toLatAndLon = async (cityName) => {
  const link = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${APIdata.key}`;
  fetch(link)
    .then(res => res.json())
    .then(res => {
      const { lat, lon } = res[0];
      search(lat, lon);
    })
    .catch(e => 1);
};

const search = async (latitude, longitude) => {
    const link = `${APIdata.weather}lat=${latitude}&lon=${longitude}&exclude=hourly,minutely,alerts&units=metric&appid=${APIdata.key}`;
    fetch(link)
      .then(res => res.json())
      .then(res => {
        changeCurrentData(res);
        changeWeekData(res.daily);
      })
      .catch(e => 1);
};

button.addEventListener('click', (event) => {
  event.preventDefault();
  const text = input.value;
  toLatAndLon(text);
});

input.addEventListener('focus')


