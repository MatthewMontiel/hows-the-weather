let searchHist = [];
let lastCitySearched = "";

let getWeather = function (city) {
  let apiURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=8981a04d4bc24c1c6cc03d5640d64cf9&units=imperial";
    console.log(apiURL);
  fetch(apiURL)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displaygetWeath(data);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeather");
    });
};

let searchSubmitHandler = function (event) {
  event.preventDefault();
  let cityName = $("#cityName").val().trim();
  if (cityName) {
    getWeather(cityName);
    $("#cityName").val("");
  } else {
    alert("Please enter a city name");
  }
};

let displaygetWeath = function (weatherData) {
  $("main-city-name")
    .text(
      weatherData.name +
        " (" +
        dayjs(weatherData.dt * 1000).format("MM/DD/YYYY") +
        ")"
    )
    .append(
      `<img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png"></img>`
    );
  $("main-city-temp").text(
    "Temperature: " + weatherData.main.temp.toFixed(1) + "°F"
  );
  $("main-city-humid").text("Humidity: " + weatherData.main.humidity + "%");
  $("main-city-wind").text(
    "Wind Speed: " + weatherData.wind.speed.toFixed(1) + "mph"
  );

  fetch(
    "https://api.openweathermap.org/data/2.5/uvi?lat=" +
      weatherData.coord.lat +
      "&lon=" +
      weatherData.coord.lon +
      "&appid=8981a04d4bc24c1c6cc03d5640d64cf9"
  ).then(function (response) {
    response.json().then(function (data) {
      $("#uv-box").text(data.value);
      if (data.value >= 11) {
        $("#uv-box").css("background-color", "#6c49cb");
      } else if (data.value < 11 && data.value >= 8) {
        $("#uv-box").css("background-color", "#d90011");
      } else if (data.value < 6 && data.value >= 3) {
        $("uv-box").css("background-color", "#f7e401");
      } else {
        $("#uv-box").css("background-color", "#299501");
      }
    });
  });
  fetch(
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
      weatherData.name +
      "&appid=8981a04d4bc24c1c6cc03d5640d64cf9&units=imperial"
  ).then(function (response) {
    response.json().then(function (data) {
      $("#five-day").empty();
      for (i = 7; i <= data.list.length; i += 8) {
        let fiveDayCard =
          `
                    <section class="col-md-2 m-2 py-3 card text-white bg-primary">
                        <section class="card-body p-1">
                            <h5 class="card-title">` +
          dayjs(data.list[i].dt * 1000).format("MM/DD/YYYY") +
          `</h5>
                            <img src="https://openweathermap.org/img/wn/` +
          data.list[i].weather[0].icon +
          `.png" alt="rain">
                            <p class="card-text">Temp: ` +
          data.list[i].main.temp +
          `</p>
                            <p class="card-text">Humidity: ` +
          data.list[i].main.humidity +
          `</p>
                        </section>
                    </section>
                    `;
        $("#five-day").append(fiveDayCard);
      }
    });
  });
  lastCitySearched = weatherData.name;
  saveSearchHist(weatherData.name);
};

let saveSearchHist = function (city) {
  if (!searchHist.includes(city)) {
    searchHist.push(city);
    $("#searchHist").append(
      "<a href='#' class='list-group-item list-group-item-action' id='" +
        city +
        "'>" +
        city +
        "</a>"
    );
  }
  localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHist));

  localStorage.setItem("lastCitySearched", JSON.stringify(lastCitySearched));
  loadSearchHistory();
};

let loadSearchHistory = function () {
  searchHist = JSON.parse(localStorage.getItem("weatherSearchHistory"));
  loadSearchHistory = JSON.parse(localStorage.getItem("lastCitySearched"));
  if (!searchHist) {
    searchHist = [];
  }
  if (!lastCitySearched) {
    lastCitySearched = "";
  }
  $("#searchHist").empty();
  for (i = 0; i < searchHist.length; i++) {
    $("#searchHist").append(
      "<a href='#' class='list-group-item list-group-item-action' id='" +
        searchHist[i] +
        "'>" +
        searchHist[i] +
        "</a>"
    );
  }
};

loadSearchHistory();

if (lastCitySearched != "") {
  getWeather(lastCitySearched);
}

$("#searchBar").submit(searchSubmitHandler);
$("#searchHist").on("click", function (event) {
  let prevCity = $(event.target).closest("a").attr("id");
  getWeather(prevCity);
});
