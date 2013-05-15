﻿function checkForValidUrl(tabId, changeInfo, tab) {
	if (tab.url.indexOf('.ikariam.com') > -1) {
		chrome.pageAction.show(tabId);
	}
}
chrome.tabs.onUpdated.addListener(checkForValidUrl);


var RESOURCES = [];
function addItem(dataObj) {
	for (var i = 0; i < RESOURCES.length; i++) {
		if (RESOURCES[i].realm == dataObj.realm && RESOURCES[i].city == dataObj.city) {
			RESOURCES[i] = dataObj;
			return;
		}
	}
	RESOURCES[RESOURCES.length] = dataObj;
}

function getResourcePerHourRateSpan (rateValue) {
	if (rateValue) {
		return "<span style='color:green;float:right;'>+" + rateValue + "</span>";
	} else {
		return '';
	}
}

function updateLocalTable(tableId) {
	var container = document.getElementById(tableId);
	if (!container) {
		container = document.createElement('table');
		container.setAttribute('id', tableId);
		document.getElementsByTagName('body')[0].appendChild(container);
	}
	var tableContent = "";
	for (var i = 0; i < RESOURCES.length; i++) {
		if (RESOURCES[i].realm != tableId) {
			continue;
		}
		var currStr = "<tr><td class='side-header'>" + RESOURCES[i].city 
		            + "</td><td>" + Math.floor(RESOURCES[i].wood)   + getResourcePerHourRateSpan(RESOURCES[i].woodPerHour)
		            + "</td><td>" + Math.floor(RESOURCES[i].wine)   + getResourcePerHourRateSpan(RESOURCES[i].winePerHour)
		            + "</td><td>" + Math.floor(RESOURCES[i].marble) + getResourcePerHourRateSpan(RESOURCES[i].marblePerHour)
		            + "</td><td>" + Math.floor(RESOURCES[i].glass)  + getResourcePerHourRateSpan(RESOURCES[i].glassPerHour)
		            + "</td><td>" + Math.floor(RESOURCES[i].sulfur) + getResourcePerHourRateSpan(RESOURCES[i].sulfurPerHour)
		            + "</td></tr>";
		tableContent += currStr;
	}
	container.innerHTML = tableContent;
}

chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		//sender.tab.url - адрес вида "http://s13.ru.ikariam.com/index.php?"
		addItem(request);
		updateLocalTable(request.realm);
	}
);

function updateResources () {
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

	setTimeout(function() { updateResources(); }, 29000);
}

setTimeout(function() { updateResources(); }, 29000);
