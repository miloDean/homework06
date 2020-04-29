// This loads the current weather API and loads all the information
function openWeatherMapApi(city) {
  // This is the ajax request takes the current weather.
  $.ajax({
    url: 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=624f9a5512645f4e434f1a1d56910742&units=imperial',
    method: "GET",
  }).then(function(response) {
    // This clears the current weather box
    $('#currentWeather').empty();
    // This gets the current weather information and appends to the HTML.
    var date          = moment().format("MM/DD/YYYY");
    var nameH1        = $("<h1>").text(response.name + " (" + date + ")" + " ");
    nameH1.append(`<img src="${"http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png"}" alt="Icon">`);
    var temperatureP  = $("<p>").text("Temperature: " + response.main.temp + "° F");
    var humidityP     = $("<p>").text("Humidity: " + response.main.humidity + "%");
    var windSpeedP    = $("<p>").text("Wind Speed: " + response.wind.speed + " MPH");
    $('#currentWeather').append(nameH1,temperatureP,humidityP,windSpeedP);
  });
}

// This loads the forecast weather API and loads all the information
function forecastAPI(response) {
// This clears the forecast box
  $('#forecastInput').empty();
// This is the ajax request takes the latitude and longitude. It gets the UV index and the forecast
  $.ajax({
    url: `https://api.openweathermap.org/data/2.5/onecall?appid=624f9a5512645f4e434f1a1d56910742&lat=${response.coord.lat}&lon=${response.coord.lon}&units=imperial`,
    method: "GET",
  }).then(function(response) {
    var forecastH1 = `<h1>5 Day Forecast: </h1>`
    var uvP;
    // This gets the UV index and the switch statement checks the uv level so the correct color can be applied.
    switch(true){
      case response.current.uvi > 8:
        uvP = `<p>UV Index: <span class="btn btn-danger">${response.current.uvi}</span></p>`;
      break;
      case response.current.uvi < 2:
        uvP = `<p>UV Index: <span class="btn btn-success">${response.current.uvi}</span></p>`;
      break;
      default:
        uvP = `<p>UV Index: <span class="btn btn-warning">${response.current.uvi}</span></p>`;
    }
    // This appends the button to the html.
    $('#currentWeather').append(uvP, forecastH1);
    // This loop loads the cards for each forecast day and appends to the html
      for(var i = 0; i < 5; i++){    
        var html = `
        <div class="col-lg-2 card" style="max-width: 15rem max-height: 10rem">
          <div class="card-body">
            <h5 class="card-title">${moment().add(i+1, 'd').format("MM/DD/YYYY")}</h5>
            <img src="${"http://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon + "@2x.png"}" alt="Icon">
            <p>Temp: ${response.daily[i].temp.day + "° F"}</p>
            <p>Humidity: ${response.daily[i].humidity + "%"}</p>
          </div>
        </div>
        `;
        $('#forecastInput').append(html);
      }
  });      
}

// This loads the coordinates from the input and converts into longitude and latitude.
function getCoordinates(city){
// This is the ajax request that loads the latitude and longitude. THe success sends the information to the forecastAPI
$.ajax({
  url: 'https://api.openweathermap.org/data/2.5/weather?q='+city+'&appid=624f9a5512645f4e434f1a1d56910742&units=imperial',
  method: "GET",
  success: forecastAPI
});
}

// This function loads the search history
function savedList(city){
  // This creates a button and loads the 'id' as the city.
  var historyButton =  $("<button>").addClass("history").text(city).attr('id', city);
  // This appends the button to the html.
  $('#searchHistory').prepend(historyButton);  
}

// This is the event clicker for the history buttons
$(document).on("click", "#button", function(event){
  // This loads the user's input into a variable
  var cityInput = $("#cityInput").val().trim();
  // This clears the input box once the search is clicked.
  $('#cityInput').val("");
  // This loads the functions that loads the weather information
  openWeatherMapApi(cityInput);
  savedList(cityInput);
  getCoordinates(cityInput);
});

// This is the event clicker for the history buttons
$(document).on("click", ".history", function(event){
  // This is a variable that contains the ID of the button clicked.
  var buttonId = $(this).attr("id");
  openWeatherMapApi(buttonId);
  savedList(buttonId);
  getCoordinates(buttonId);
});
