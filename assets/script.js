let savedSearchHistory = [];
let lastCitySearched = "";

let searchSubmitHandler = function (event) {
  event.preventDefault();
  let cityName = $("#cityName").val();
  if (cityName) {
    weatherNow(cityName);
    $("#cityName").val("");
  }
};

function weatherNow(cityName) {
  let apiURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&units=imperial&appid=8981a04d4bc24c1c6cc03d5640d64cf9";
  fetch(apiURL).then(function (response) {
    if (response.ok) {
      response.json().then(function (weatherData) {
        showWeatherData(weatherData);
      });
    }
  });
}

function showWeatherData(weatherData) {
  $("#locationName")
    .text(
      weatherData.name +
        " (" +
        dayjs(weatherData.dt * 1000).format("MM/DD/YYYY") +
        ")"
    )
    .append(
      `<img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png"></img>`
    );
  $("#locationTemp").text(
    "Temperature: " + weatherData.main.temp.toFixed(1) + "°F"
  );
  $("#locationHumid").text("Humidity: " + weatherData.main.humidity + "%");
  $("#locationWind").text(
    "Wind Speed: " + weatherData.wind.speed.toFixed(1) + " mph"
  );

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
}

let saveSearchHist = function (cityName) {
  if (!savedSearchHistory.includes(cityName)) {
    savedSearchHistory.push(cityName);
    $("#savedSearchHistory").append(
      "<br><a href='#' class='list-group-item list-group-item-action' id='" +
        cityName +
        "'>" +
        cityName +
        "</a></br>"
    );
  }
  localStorage.setItem("weatherSearchHistory", JSON.stringify(savedSearchHistory));

  localStorage.setItem("lastCitySearched", JSON.stringify(lastCitySearched));
  loadSearchHistory();
};

let loadSearchHistory = function () {
  savedSearchHistory = JSON.parse(localStorage.getItem("weatherSearchHistory"));
  loadSearchHistory = JSON.parse(localStorage.getItem("lastCitySearched"));
  if (!savedSearchHistory) {
    savedSearchHistory = [];
  }
  if (!lastCitySearched) {
    lastCitySearched = "";
  }
  $("#savedSearchHistory").empty();
  for (i = 0; i < savedSearchHistory.length; i++) {
    $("#savedSearchHistory").append(
      "<br><a href='#' class='list-group-item list-group-item-action' id='" +
        savedSearchHistory[i] +
        "'>" +
        savedSearchHistory[i] +
        "</a></br>"
    );
  }
};

$("#searchBar").submit(searchSubmitHandler);
$("#searchHist").on("click", function (event) {
  let prevCity = $(event.target).closest("a").attr("id");
  weatherNow(prevCity);
});
