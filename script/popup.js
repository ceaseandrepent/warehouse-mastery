document.addEventListener('DOMContentLoaded', function () {
	initTable();
});

function initTable() {
	chrome.tabs.getSelected(null, function(tab) {    
		var realm = tab.url.split('/')[2];
		var bgPage = chrome.extension.getBackgroundPage();
		var table = document.getElementById('table');

		var tableHeader = "<tr><th class='side-header'></th><th title='wood'><img src='imgs/icon_wood.png'></th><th title='wine'><img src='imgs/icon_wine.png'></th><th title='marble'><img src='imgs/icon_marble.png'></th><th title='glass'><img src='imgs/icon_glass.png'></th><th title='sulfur'><img src='imgs/icon_sulfur.png'></th></tr>";
		var tableRows = bgPage.document.getElementById(realm).innerHTML;
		
		var tableContent = tableHeader + tableRows;
		table.innerHTML = tableContent;

		var summaryRow = "<tr style='border-top:solid 2px;'><td>&sum;</td>";
		var sum;
		for (var j = 1; j < table.rows[0].cells.length; j++) {
			sum = 0;
			for (var i = 1; i < table.rows.length; i++) {
				sum += parseInt(table.rows[i].cells[j].innerHTML);
			}
			summaryRow += "<td>" + sum + "</td>";
		}
		table.innerHTML += summaryRow + "</tr>";
	});   
}
