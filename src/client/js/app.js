const geoNames = "http://api.geonames.org/searchJSON?q=";
const username = "asdfdsaf";
const darkURL =
  "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/";
const darkKey = "4102b2d6ffc4d973858ef4cb47f9af4a";
const pixaKey = "15556976-165c621141aa47612d1778c27";
const pixaURL = "https://pixabay.com/api/?key=";
const form = document.getElementById("form");
const from = document.querySelector('input[name="from"]');
const to = document.querySelector('input[name="to"]');
const date = document.querySelector('input[name="date"]');
const result = document.getElementById("result");
const print = document.getElementById("print");

//Event Listener

form.addEventListener("submit", trip);

print.addEventListener("click", function(e) {
  window.print();
  result.classList.add("invisible");
  location.reload();
});

//Function

function trip(e) {
  e.preventDefault();
  //Acquiring and storing user trip data
  const fromText = from.value;
  const toText = to.value;
  const dateText = date.value;
  const timestamp = new Date(dateText).getTime() / 1000;

  // function checkInput to validate input
  Client.inputCheck(fromText, toText);

  getCityInfo(geoNames, toText, username)
    .then(cityData => {
      const cityLat = cityData.geonames[0].lat;
      const cityLong = cityData.geonames[0].lng;
      const country = cityData.geonames[0].countryName;
      const weatherData = getWeather(cityLat, cityLong, country, timestamp);
      return weatherData;
    })
    .then(weatherData => {
      const userData = postData("http://localhost:8080/add", {
        fromText,
        toText,
        dateText,
        weather: weatherData.currently.temperature,
        summary: weatherData.currently.summary
      });
      return userData;
    })
    .then(userData => {
      updateUI(userData);
    });
}

//Geonames
//http://www.geonames.org/export/web-services.html

const getCityInfo = async (geoNames, toText, username) => {
  const res = await fetch(
    `${geoNames}${toText}&maxRows=10&username=${username}`
  );
  try {
    const cityData = await res.json();
    return cityData;
  } catch (error) {
    console.log("error", error);
  }
};

// DarkSky
//https://darksky.net/dev/docs
const getWeather = async (cityLat, cityLong, country, timestamp) => {
  const req = await fetch(
    `${darkURL}/${darkKey}/${cityLat},${cityLong},${timestamp}?exclude=minutely,hourly,daily,flags`
  );
  try {
    const weatherData = await req.json();
    return weatherData;
  } catch (error) {
    console.log("error", error);
  }
};

// POST data to our local server
const postData = async (url = "", data = {}) => {
  const req = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    },
    body: JSON.stringify({
      depCity: data.fromText,
      arrCity: data.toText,
      date: data.dateText,
      weather: data.weather,
      summary: data.summary
    })
  });
  try {
    const userData = await req.json();
    return userData;
  } catch (error) {
    console.log("error", error);
  }
};

const updateUI = async userData => {
  result.classList.remove("invisible");
  result.scrollIntoView({ behavior: "smooth" });

  const res = await fetch(
    pixaURL + pixaKey + "&q=" + userData.arrCity + "+city&image_type=photo"
  );

  try {
    const image = await res.json();
    let d = userData.date.split("-");
    let newDate = d[1] + "/" + d[2] + "/" + d[0];

    document.querySelector("#city").innerHTML = userData.arrCity;
    document.querySelector("#date").innerHTML = newDate;
    document.querySelector("#summary").innerHTML = userData.summary;
    document.querySelector("#temp").innerHTML = userData.weather;
    document
      .querySelector("#Pixabay")
      .setAttribute("src", image.hits[0].webformatURL);
  } catch (error) {
    console.log("error", error);
  }
};

export { trip };
