(function() {

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
	}

})();