function getResourcePerHourRateSpan (rateValue) {
	if (rateValue > 0) {
		return "<span style='color:green;float:right;'>+" + rateValue + "</span>";
	} else if (rateValue < 0) {
		return "<span style='color:red;float:right;'>" + rateValue + "</span>";
	} else {
		return '';
	}
}

function checkForValidUrl(tabId, changeInfo, tab) {
	if (tab.url.indexOf('.ikariam.com') > -1) {
		chrome.pageAction.show(tabId);
	}
}

var RESOURCES = [], WINE_CONSUMPTION = {}, LAST_WINE_AMOUNT_UPDATE = 0;
chrome.tabs.onUpdated.addListener(checkForValidUrl);
setTimeout(function() { updateResourcesContinuously(29000); }, 29000);
setTimeout(function() { updateWineContinuously(113000); }, 113000);

chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		//sender.tab.url - адрес вида "http://s13.ru.ikariam.com/index.php?"
		switch (request.type) {
			case "resources":
				addResourcesEntry(request);
				updateLocalTable(request.realm);
				break;

			case "wine_consumption":
				addWineConsumptionEntry(request);
				break;

			default:
				break;
		}
	}
);

function addResourcesEntry(dataObj) {
	for (var i = 0; i < RESOURCES.length; i++) {
		if (RESOURCES[i].realm == dataObj.realm && RESOURCES[i].city == dataObj.city) {
			RESOURCES[i] = dataObj;
			return;
		}
	}
	RESOURCES[RESOURCES.length] = dataObj;
}

function addWineConsumptionEntry(dataObj) {
	if (!WINE_CONSUMPTION[dataObj.realm]) {
		WINE_CONSUMPTION[dataObj.realm] = {};
	}
	WINE_CONSUMPTION[dataObj.realm][dataObj.cityName] = dataObj.rate;
}

function updateLocalTable(tableId) {
	var container = document.getElementById(tableId);
	if (!container) {
		container = document.createElement('table');
		container.setAttribute('id', tableId);
		document.getElementsByTagName('body')[0].appendChild(container);
	}

	var tableContent = "", currStr = "", currWineConsumption = "";
	for (var i = 0; i < RESOURCES.length; i++) {
		if (RESOURCES[i].realm != tableId) {
			continue;
		}
		if (WINE_CONSUMPTION[tableId][RESOURCES[i].city]) {
			currWineConsumption = getResourcePerHourRateSpan(WINE_CONSUMPTION[tableId][RESOURCES[i].city]);
		} else {
			currWineConsumption = '';
		}
		currStr = "<tr><td>" + RESOURCES[i].city 
		        + "</td><td>" + Math.floor(RESOURCES[i].wood)   + getResourcePerHourRateSpan(RESOURCES[i].woodPerHour)
		        + "</td><td>" + Math.floor(RESOURCES[i].wine)   + currWineConsumption + getResourcePerHourRateSpan(RESOURCES[i].winePerHour)
		        + "</td><td>" + Math.floor(RESOURCES[i].marble) + getResourcePerHourRateSpan(RESOURCES[i].marblePerHour)
		        + "</td><td>" + Math.floor(RESOURCES[i].glass)  + getResourcePerHourRateSpan(RESOURCES[i].glassPerHour)
		        + "</td><td>" + Math.floor(RESOURCES[i].sulfur) + getResourcePerHourRateSpan(RESOURCES[i].sulfurPerHour)
		        + "</td><td>" + RESOURCES[i].savedFromRobbery
		        + "</td></tr>";
		tableContent += currStr;
	}
	container.innerHTML = tableContent;
}

function updateResourcesContinuously(msInterval) {
	var currentTime = new Date();
	currentTime = currentTime.getTime();

	var timeDifference;
	for (var i = 0; i < RESOURCES.length; i++) {
		timeDifference = (currentTime - RESOURCES[i].timestamp) / 1000; // we need seconds
		RESOURCES[i].wood   += (RESOURCES[i].woodPerHour   / 3600) * timeDifference;
		RESOURCES[i].wine   += (RESOURCES[i].winePerHour   / 3600) * timeDifference;
		RESOURCES[i].marble += (RESOURCES[i].marblePerHour / 3600) * timeDifference;
		RESOURCES[i].glass  += (RESOURCES[i].glassPerHour  / 3600) * timeDifference;
		RESOURCES[i].sulfur += (RESOURCES[i].sulfurPerHour / 3600) * timeDifference;
		RESOURCES[i].timestamp = currentTime;
	}

	var updatedRealms = {};
	for (var i = 0; i < RESOURCES.length; i++) {
		if (!updatedRealms[RESOURCES[i].realm]) {
			updateLocalTable(RESOURCES[i].realm);
			updatedRealms[RESOURCES[i].realm] = 1;
		}
	}

	setTimeout(function() { updateResourcesContinuously(msInterval); }, msInterval);
}

function updateWineContinuously(msInterval) {
	var currentMinutes = new Date();
	currentMinutes = currentMinutes.getMinutes();
	if (currentMinutes - LAST_WINE_AMOUNT_UPDATE < 0) {
		for (var i = 0; i < RESOURCES.length; i++) {
			RESOURCES[i].wine += WINE_CONSUMPTION[RESOURCES[i].realm][RESOURCES[i].city];
		}
	}

	LAST_WINE_AMOUNT_UPDATE = currentMinutes;
	setTimeout(function() { updateWineContinuously(msInterval); }, msInterval);
}
