(function(){

	var API_WORLDTIME_KEY = "9349c1debe5144dc9f6225928162703";
	var API_WORLDTIME = "HTTPS: https://api.worldweatheronline.com/free/v2/weather.ashx?format=json&key=" + API_WORLDTIME_KEY + "&q=";
	//https://api.worldweatheronline.com/free/v2/tz.ashx?format=json
	var API_WEATHER_KEY = "7c5547f7bf573c56d170f8559bc6756f";
	var API_WEATHER_URL = "http://api.openweathermap.org/data/2.5/weather?APPID=" + API_WEATHER_KEY + "&";
	var IMG_WEATHER = "http://openweathermap.org/img/w/";

	var today = new Date();
	var timeNow = today.toLocaleTimeString();

	var $body = $("body");
	var $loader = $(".loader");
	var nombreNuevaCiudad = $("[data-input='cityAdd']");
	var buttonAdd = $("[data-button='add']");

	var cityWeather = {};
	cityWeather.zone;
	cityWeather.icon;
	cityWeather.temp;
	cityWeather.temp_max;
	cityWeather.temp_min;
	cityWeather.main;

	$( buttonAdd ).on("click", addNewCity);

	$( nombreNuevaCiudad ).on("keypress", function(event){
		if(event.which == 13){
			addNewCity();
		}
	});

	if (navigator.geolocation) {

		navigator.geolocation.getCurrentPosition(getCoords, errorFound);

	} else {
		alert("Actualiza tu Navegador :( ");
	}

	function errorFound(error) {
		alert("Un error a ocurrido :( " + error.code);
			// 0: Error desconocido
			// 1: Permiso denegado
			// 2: Posicion no esta disponible
			// 3: Timeout
	}

	function getCoords(position) {
		var lat = position.coords.latitude;
		var lon = position.coords.longitude;
		console.log("Tu posicion es: " + lat + "," + lon);
		$.getJSON(API_WEATHER_URL + "lat=" + lat + "&lon=" + lon, getCurrentWeather);
	};

	function getCurrentWeather(data) {
	cityWeather.zone = data.name;
	cityWeather.icon = IMG_WEATHER + data.weather[0].icon + ".png";
	cityWeather.temp = data.main.temp - 273.15;
	cityWeather.temp_max = data.main.temp_max - 273.15;
	cityWeather.temp_min = data.main.temp_min - 273.15;
	cityWeather.main = data.weather[0].main;

	renderTemplate(cityWeather);
	};

	function activateTemplate(id)
	{
		var t = document.querySelector(id);
		return document.importNode(t.content, true);
	};

	function renderTemplate(cityWeather, localtime){

		var clone = activateTemplate("#template--city");

		var timeToShow;
		if(localtime == true){
			timeToShow = localtime;
		}else {
			timeToShow = timeNow;
		}


		clone.querySelector("[data-time]").innerHTML = timeToShow;
		clone.querySelector("[data-city]").innerHTML = cityWeather.zone;
		clone.querySelector("[data-icon]").src = cityWeather.icon;
		clone.querySelector("[data-temp='max']").innerHTML = cityWeather.temp_max.toFixed(1);
		clone.querySelector("[data-temp='min']").innerHTML = cityWeather.temp_min.toFixed(1);
		clone.querySelector("[data-temp='current']").innerHTML = cityWeather.temp.toFixed(1);
		
		$($loader).hide();
		//$(".loader").hide();

		$($body).append(clone);


	}

	function addNewCity(event) {
		event.preventDefault();
		$.getJSON(API_WEATHER_URL + "q=" + $(nombreNuevaCiudad).val(), getWeatherNewCity );
	}

	function getWeatherNewCity(data){
		
		$.getJSON(API_WORLDTIME + $(nombreNuevaCiudad).val(), function(response){

		cityWeather = {};
		cityWeather.zone = data.name;
		cityWeather.icon = IMG_WEATHER + data.weather[0].icon + ".png";
		cityWeather.temp = data.main.temp - 273.15;
		cityWeather.temp_max = data.main.temp_max - 273.15;
		cityWeather.temp_min = data.main.temp_min - 273.15;

		//console.log(response);
		renderTemplate(cityWeather, response.data.time_zone[0].localtime);

		}) ;

	
	}

})();