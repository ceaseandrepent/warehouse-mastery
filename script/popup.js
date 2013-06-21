function getResourcePerHourRateSpan (rateValue) {
	if (rateValue > 0) {
		return "<span style='color:green;float:right;'>+" + rateValue + "</span>";
	} else if (rateValue < 0) {
		return "<span style='color:red;float:right;'>" + rateValue + "</span>";
	} else {
		return '';
	}
}

document.addEventListener('DOMContentLoaded', function () {
	initTable();
});

function initTable() {
	chrome.tabs.getSelected(null, function(tab) {    
		var realm = tab.url.split('/')[2];
		var bgPage = chrome.extension.getBackgroundPage();
		var table = document.getElementById('table');

		var tableHeader = "<tr><th></th><th title='wood'><img src='imgs/icon_wood.png'></th><th title='wine' style='width:auto;'><img src='imgs/icon_wine.png'></th><th title='marble'><img src='imgs/icon_marble.png'></th><th title='glass'><img src='imgs/icon_glass.png'></th><th title='sulfur'><img src='imgs/icon_sulfur.png'></th><th title='Saved from robbery' style='color:white;'>Insured</th></tr>";
		var tableRows = bgPage.document.getElementById(realm).innerHTML;
		
		var tableContent = tableHeader + tableRows;
		table.innerHTML = tableContent;

		var summaryRow = "<tr style='border-top:solid 2px;'><td>&sum;</td>";
		var sums = [], tmp; 
		for (var j = 1; j < table.rows[0].cells.length; j++) {
			sums[0] = 0;
			sums[1] = 0;
			sums[2] = 0;
			for (var i = 1; i < table.rows.length; i++) {
				tmp = table.rows[i].cells[j].innerHTML.match(/-?\d+/g);
				if (tmp[0]) sums[0] += parseInt(tmp[0]);
				if (tmp[1]) sums[1] += parseInt(tmp[1]);
				if (tmp[2]) sums[2] += parseInt(tmp[2]);
			}
			summaryRow += "<td>"
			           + sums[0]
			           + getResourcePerHourRateSpan(sums[1])
			           + getResourcePerHourRateSpan(sums[2])
			           + "</td>";
		}
		table.innerHTML += summaryRow + "</tr>";
	});   
}
