//Get all the necessary elemnts from the DOM
const app = document.querySelector(".weather-app");
const form = document.getElementById("locationInput");
const search = document.querySelector(".search");
const btn = document.querySelector(".submit");
const cities = document.getElementsByClassName("city");

//Default city when the page leads
let cityInput = "Lagos";

//Add click event to each city in the panel
for (city of cities) {
  city.addEventListener("click", async (e) => {
    // change from default city to the clicked one
    cityInput = e.target.textContent;
    // Function that fetches and displays all the data from the weather API
    await fetchWeatherData(cityInput);
  });
}

async function fetchWeather(event) {
  event.preventDefault();

  /* if the input field (search bar)
     is empty, throw an alert */

  if (search.value.length == 0) {
    alert("Please type in a city name");
  } else {
    /*change from default city to the
         one written in the input field*/
    cityInput = search.value;
    /*Function that fetches and displays
         all the data from the weather API */
    await fetchWeatherData(cityInput);
    //Remove all text from the input field
    search.value = "";
  }
}

// Add submit event to the form
form.addEventListener("submit", fetchWeather);

/*Function that returns a day of the week 
(Monday, Tuesday, Friday...) from a date (12 03 2021)
We will use this function later */
function dayOfTheWeek(date) {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return weekday[new Date(date).getDay()];
}

/*Function that fetches and displays
the data from the weather API */
async function fetchWeatherData(input) {
  //Fade out the app (simple animation)
  app.style.opacity = "0";
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=b72c3d7040c84c009d1191411241408&q=${input}`
    );

    const data = await response.json();

    if (!response.ok) {
      return console.log(data);
    }

    /* Get the data and time from the city and extract
          the day, month, year and time, into individual variables*/
    const date = data?.location.localtime;
    const y = parseInt(date.substr(0, 4));
    const m = parseInt(date.substr(5, 2));
    const d = parseInt(date.substr(8, 2));
    const time = date.substr(11);

    const weatherLocationDiv = document.getElementById("weather-location");
    weatherLocationDiv.innerHTML = `<h1 class="temp">${
      data.current.temp_c + "&#176;"
    }</h1>
          <div class="city-time">
            <h1 class="name">${data.location.name}</h1>
            <small>
              <span class="time">${time}</span>
              -
              <span class="date">${dayOfTheWeek(`${y}-${m}-${d}`)} </span>
            </small>
          </div>
          <div class="weather">
            <img
              src=${`icons/${data.current.condition.icon.substr(
                "//cdn.weatherapi.com/weather/64x64/".length
              )}`}
              class="icon"
              alt="icon"
              width="50"
              height="50"
            />
            <span class="condition">${data.current.condition.text}</span>
          </div>`;

    //Add the weather detaiils to the page
    const detailsDiv = document.getElementById("details");
    detailsDiv.innerHTML = `
     <h4>Weather Details</h4>
          <li>
            <span>Cloudy</span>
            <span class="cloud">${data.current.cloud + "%"}</span>
          </li>
          <li>
            <span>Humidity</span>
            <span class="humidity">${data.current.humidity + "%"}</span>
          </li>
          <li>
            <span>Wind</span>
            <span class="wind">${data.current.wind_kph + "km/h"}</span>
          </li>
    `;

    //Set default time of day
    let timeOfDay = "day";

    //Change to night if its night time in the city
    if (!data.current.is_day) {
      timeOfDay = "night";
    }

    //Get the unique id for each weather condition
    const code = data?.current?.condition?.code;

    if (code == 1000) {
      /*Set the background image to clear if the weather is clear*/
      app.style.backgroundImage = `url(images/${timeOfDay}/clear.jpg)`;
      /*Change the button bg Color depending on if its day or night*/
      btn.style.background = "#e5ba92";
      if (timeOfDay == "night") {
        btn.style.background = "#181e27";
      }
    } else if (
      /*Same thing for cloudy weather*/
      code == 1003 ||
      code == 1006 ||
      code == 1009 ||
      code == 1030 ||
      code == 1069 ||
      code == 1087 ||
      code == 1135 ||
      code == 1273 ||
      code == 1276 ||
      code == 1279 ||
      code == 1282
    ) {
      app.style.backgroundImage = `url(images/${timeOfDay}/cloudy.jpg)`;
      btn.style.background = "#fa6d1b";
      if (timeOfDay == "night") {
        btn.style.background = "#181e27";
      }
      // And rain
    } else if (
      code == 1063 ||
      code == 1069 ||
      code == 1072 ||
      code == 1150 ||
      code == 1153 ||
      code == 1180 ||
      code == 1183 ||
      code == 1186 ||
      code == 1189 ||
      code == 1192 ||
      code == 1195 ||
      code == 1204 ||
      code == 1207 ||
      code == 1240 ||
      code == 1243 ||
      code == 1246 ||
      code == 1249 ||
      code == 1252
    ) {
      app.style.backgroundImage = `url(images/${timeOfDay}/rainy.jpg)`;
      btn.style.background = "#647d75";
      if (timeOfDay == "night") {
        btn.style.background = "#325c80";
      }
      /*And finnaly...Snow*/
    } else {
      app.style.backgroundImage = `url(images/${timeOfDay}/snowy.jpg)`;
      btn.style.background = "#4d72aa";
      if (timeOfDay == "night") {
        btn.style.background = "#1b1b1b";
      }
    }
    //Fade in the page once all is done
    app.style.opacity = "1";
  } catch (error) {
    alert("City not found, please try again");
    app.style.opacity = "1";
  }
}

//Call the function on page load
window.addEventListener("load", async () => await fetchWeatherData(cityInput));
