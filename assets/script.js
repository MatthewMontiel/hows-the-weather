let searchHist = []
let lastCity= = ""

let getWeather = function(city) {
  let apiURL = "https:https://api.openweathermap.org/data/2.5/weather?" + city "&appid=8981a04d4bc24c1c6cc03d5640d64cf9";
  fetch(apiURL)
 .then(function(response) {
  if (response.ok) {
    response.json().then(function(data) {
      showWeather(data);
    }
 )}
 }) 
};

let enterSearch = function(event) {
  let cityName = $('#cityName').val().trim();
  if(cityName) {
    getWeather(cityName);
  }
};

let displaygetWeath = function(weatherInfo) {
  $("main-city-name").text(weatherInfo.name + "(" +dayjs(weatherInfo.dt *1000).format("MM/DD/YYYY") + ")").append('<img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png"></img>');
  $("main-city-temp").text("Temperature: " + weatherInfo.main.temp.toFixed(1) + "°F");
  $("main-city-humid").text("Humidity: " + weatherInfo.main.humidity + "%");
  $("main-city-wind").text("Wind Speed: " + weatherInfo.wind.speed.toFixed(1) + "mph");

  fetch("https://api.openweathermap.org/data/2.5/uvi?lat=" + weatherInfo.coord.lat + "&lon=" + weatherInfo.coord.lon + "&appid=8981a04d4bc24c1c6cc03d5640d64cf9")
  .then(function(response){
    response.json().then(function(data) {
      $(uv-box).text(data.value);
      if(data.value >= 11) {
        $("#uv-box").css("background-color", "#6c49cb")
      } else if (data.value < 11 && data.value >=8) {
        $("#uv-box").css("background-color", "#d90011")
      } else if (data.value < 6 && data.value >=3) {
        $("uv-box").css("background-color", "#f7e401")
      } else {
        $("#uv-box").css("background-color", "#299501")
      }
    })
  }) 
};

fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + weatherInfo.name + "&appid=8981a04d4bc24c1c6cc03d5640d64cf9")
  .then(function(response) {
    response.json().then(function(data) {
      $("#five-day").empty();
    })
  })