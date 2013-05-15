function wipeCommas(str) {
	var res = [];
	for (var i = 0; i < str.length; i++) {
		if (str[i] == ',') {
			continue;
		}
		else {
			res += str[i];
		}
	}
	return parseInt(res);
}

function getAndSendResourceDataContinuously() {
	getAndSendResourceDataOnce();
	setTimeout(function() { getAndSendResourceDataContinuously() }, 17000);
}

function getAndSendResourceDataOnce () {
	var cityName = document.getElementById('js_cityBread').innerText;
	var wood = wipeCommas(document.getElementById('js_GlobalMenu_wood').innerText);
	var wine = wipeCommas(document.getElementById('js_GlobalMenu_wine').innerText);
	var marble = wipeCommas(document.getElementById('js_GlobalMenu_marble').innerText);
	var glass = wipeCommas(document.getElementById('js_GlobalMenu_crystal').innerText);
	var sulfur = wipeCommas(document.getElementById('js_GlobalMenu_sulfur').innerText);


	Resource = {}
	var currentTime = new Date();
	currentTime = currentTime.getTime();
	Resource.realm     = document.location.href.split('/')[2];
	Resource.timestamp = currentTime;
	Resource.city      = cityName;
	Resource.wood      = wood;
	Resource.wine      = wine;
	Resource.marble    = marble;
	Resource.glass     = glass;
	Resource.sulfur    = sulfur;

	Resource.woodPerHour   = parseInt(document.getElementById('js_GlobalMenu_resourceProduction').innerText);
	Resource.winePerHour   = parseInt(document.getElementById('js_GlobalMenu_production_wine').innerText);
	Resource.marblePerHour = parseInt(document.getElementById('js_GlobalMenu_production_marble').innerText);
	Resource.glassPerHour  = parseInt(document.getElementById('js_GlobalMenu_production_crystal').innerText);
	Resource.sulfurPerHour = parseInt(document.getElementById('js_GlobalMenu_production_sulfur').innerText);

	chrome.extension.sendMessage(Resource);
}

var CITY_NAME_AT_PREVIOUS_CHECK = '';
function checkCityAndUpdate() {
	var cityName = document.getElementById('js_cityBread').innerText;
	if (CITY_NAME_AT_PREVIOUS_CHECK != cityName) {
		getAndSendResourceDataOnce();
		CITY_NAME_AT_PREVIOUS_CHECK = cityName;
	}
	setTimeout(function() { checkCityAndUpdate() }, 1000);
}

checkCityAndUpdate();
getAndSendResourceDataContinuously();
