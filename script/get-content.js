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
	setTimeout(function() { getAndSendResourceDataContinuously(); }, 17000);
}

function getAndSendResourceDataOnce () {
	var cityName = document.getElementById('js_cityBread').innerText;
	var wood   = wipeCommas(document.getElementById('js_GlobalMenu_wood').innerText);
	var wine   = wipeCommas(document.getElementById('js_GlobalMenu_wine').innerText);
	var marble = wipeCommas(document.getElementById('js_GlobalMenu_marble').innerText);
	var glass  = wipeCommas(document.getElementById('js_GlobalMenu_crystal').innerText);
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

	var wineConsumption = document.getElementById('warehouse_mastery_wine_consumption_' + cityName);
	if (wineConsumption) {
		Resource.winePerHour -= parseInt(wineConsumption.innerText);
	}

	chrome.extension.sendMessage(Resource);
}

var CITY_INFO_AT_PREVIOUS_CHECK = '';
function checkAndUpdate() {
	var cityInfo = document.getElementById('js_cityBread').innerText
				 + document.getElementById('js_GlobalMenu_wood').innerText
				 + document.getElementById('js_GlobalMenu_wine').innerText
				 + document.getElementById('js_GlobalMenu_marble').innerText
				 + document.getElementById('js_GlobalMenu_crystal').innerText
				 + document.getElementById('js_GlobalMenu_sulfur').innerText
				 + document.getElementById('js_GlobalMenu_resourceProduction').innerText
				 + document.getElementById('js_GlobalMenu_production_wine').innerText
				 + document.getElementById('js_GlobalMenu_production_marble').innerText
				 + document.getElementById('js_GlobalMenu_production_crystal').innerText
				 + document.getElementById('js_GlobalMenu_production_sulfur').innerText;
	if (CITY_INFO_AT_PREVIOUS_CHECK != cityInfo) {
		getAndSendResourceDataOnce();
		CITY_INFO_AT_PREVIOUS_CHECK = cityInfo;
	}
	setTimeout(function() { checkAndUpdate(); }, 900);
}

function injectInfoGatherer() {
	var script = document.createElement('script');
	script.setAttribute('type', 'text/javascript');
	script.innerText = "(function() { function updateWineConsumption() { var containerId = 'warehouse_mastery_wine_consumption_' + dataSetForView.relatedCityData[dataSetForView.relatedCityData.selectedCity].name; var container = document.getElementById(containerId); if (!container) { container = document.createElement('div'); container.setAttribute('id', containerId); container.setAttribute('style', 'display:none;'); document.getElementsByTagName('body')[0].appendChild(container); } container.innerHTML = dataSetForView.wineSpendings; } updateWineConsumption(); }());";
	document.getElementsByTagName('body')[0].appendChild(script);
}

injectInfoGatherer();
checkAndUpdate();
getAndSendResourceDataContinuously();

/*
(function() {
	function updateWineConsumption() {
		var containerId = 'warehouse_mastery_wine_consumption_'
		                + dataSetForView.relatedCityData[dataSetForView.relatedCityData.selectedCity].name;
		var container = document.getElementById(containerId);
		if (!container) {
			container = document.createElement('div');
			container.setAttribute('id', containerId);
			container.setAttribute('style', 'display:none;');
			document.getElementsByTagName('body')[0].appendChild(container);
		}
		container.innerHTML = dataSetForView.wineSpendings;
	}

	updateWineConsumption();
}());
*/
