'use strict';

//window on load event handler
window.onload = function() {
	let objs;
	let dropDownList = document.getElementById('mtnSelect');

	//retrieving data from json file
	$.getJSON('data/mountains.json', function(data) {
		objs = data;
		for (let i = 0; i < objs.mountains.length; i++) {
			let mountainOption = objs.mountains[i].name;
			let dropDownoptions = document.createElement('option');
			dropDownoptions.text = mountainOption;
			dropDownList.appendChild(dropDownoptions);
		}
	});

	//dropdown list on change event handler (when user makes a selection)
	dropDownList.onchange = function() {
		//mountain variables pulled from json object
		let mtnJtron = document.getElementById('mtnJtron');
		mtnJtron.style.display = 'none';
		let selection = objs.mountains[mtnSelect.selectedIndex - 1];
		let mtnName = selection.name;
		let mtnElev = selection.elevation;
		let mtnEffort = selection.effort;
		let mtnImg = selection.img;
		let mtnDesc = selection.desc;
		let mtnLat = selection.coords.lat;
		let mtnLong = selection.coords.lng;

		//URL for sunrise/sunset time API
		let concatURL = 'https://api.sunrise-sunset.org/json?lat=' + mtnLat + '&lng=' + mtnLong + '&date=today';
		let timeObj, sunriseTime, sunsetTime;

		//sunrise & sunset time API by long/lat
		$.getJSON(concatURL, function(data) {
			//time variables pulled from API
			timeObj = data;
			sunriseTime = timeObj.results.sunrise;
			sunsetTime = timeObj.results.sunset;

			//time Conversion API url
			let codeLookupURL =
				'http://api.timezonedb.com/v2.1/get-time-zone?key=Z5NMTI9BSFUC&format=json&by=position&lat=' +
				mtnLat +
				'&lng=' +
				mtnLong;
			let timeConversionObj;

			//API for looking up time zone difference from coordinates
			$.getJSON(codeLookupURL, function(codeData) {
				timeConversionObj = codeData;
				let timeOffset = timeConversionObj.gmtOffset;
				let timeOffsetMS = timeOffset * 1000;
				//splitting off hours to adjust for timezone
				let riseTime = new Date('01-01-1970 ' + sunriseTime);
				let riseTimeMS = Date.parse(riseTime);
				let localRiseTimeMS = riseTimeMS + timeOffsetMS;
				let localRiseTime = new Date(localRiseTimeMS);
				let localRiseHour = localRiseTime.getHours();
				let localRiseMin = localRiseTime.getMinutes();
				let localRiseSec = localRiseTime.getSeconds();
				if (localRiseSec < 10) {
					localRiseSec = new String('0' + localRiseSec);
				}
				let localRiseOutputTime = localRiseHour + ':' + localRiseMin + ':' + localRiseSec + ' AM';
				let setTime = new Date('01-01-1970 ' + sunsetTime);
				let setTimeMS = Date.parse(setTime);
				let localSetTimeMS = setTimeMS + timeOffsetMS;
				let localSetTime = new Date(localSetTimeMS);
				let localSetHour = localSetTime.getHours();
				let localSetMin = localSetTime.getMinutes();
				let localSetSec = localSetTime.getSeconds();
				if (localSetSec < 10) {
					localSetSec = new String('0' + localSetSec);
				}
				let localSetOutputTime = localSetHour - 12 + ':' + localSetMin + ':' + localSetSec + ' PM';

				//row7 - Today's Sunrise
				let row7 = displayTable.insertRow(displayTable.rows.length);
				let cell1_7 = row7.insertCell(0);
				cell1_7.innerHTML = "Today's Sunrise";
				let cell2_7 = row7.insertCell(1);
				cell2_7.innerHTML = localRiseOutputTime;

				//row8 - Today's Sunset
				let row8 = displayTable.insertRow(displayTable.rows.length);
				let cell1_8 = row8.insertCell(0);
				cell1_8.innerHTML = "Today's Sunset";
				let cell2_8 = row8.insertCell(1);
				cell2_8.innerHTML = localSetOutputTime;
			});
		});
		//clears table when new selection is made
		let displayTable = document.getElementById('mtnTblOutput');
		while (displayTable.childNodes.length) {
			displayTable.innerHTML = '';
		}
		//row1  - Name
		let row1 = displayTable.insertRow(displayTable.rows.length);
		let cell1_1 = row1.insertCell(0);
		cell1_1.innerHTML = mtnName;
		cell1_1.className = 'bg-info text-center text-white mtnName';
		cell1_1.style.fontSize = 'x-large';
		cell1_1.colSpan = '2';

		//row2  - Elevation
		let row2 = displayTable.insertRow(displayTable.rows.length);
		let cell1_2 = row2.insertCell(0);
		cell1_2.innerHTML = 'Elevation';
		let cell2_2 = row2.insertCell(1);
		cell2_2.innerHTML = mtnElev + ' ft';

		//row3 - Effort
		let row3 = displayTable.insertRow(displayTable.rows.length);
		let cell1_3 = row3.insertCell(0);
		cell1_3.innerHTML = 'Effort';
		let cell2_3 = row3.insertCell(1);
		cell2_3.innerHTML = mtnEffort;

		//row4 - Photo
		let row4 = displayTable.insertRow(displayTable.rows.length);
		let cell1_4 = row4.insertCell(0);
		cell1_4.innerHTML = 'Photo';
		let imgSrc = document.createElement('img');
		imgSrc.src = 'images/' + mtnImg;
		imgSrc.alt = 'mountain photo';
		let cell2_4 = row4.insertCell(1);
		cell2_4.appendChild(imgSrc);

		//row5 - Description
		let row5 = displayTable.insertRow(displayTable.rows.length);
		let cell1_5 = row5.insertCell(0);
		cell1_5.innerHTML = 'Description';
		let cell2_5 = row5.insertCell(1);
		cell2_5.innerHTML = mtnDesc;

		//row6 - Coordinates
		let row6 = displayTable.insertRow(displayTable.rows.length);
		let cell1_6 = row6.insertCell(0);
		cell1_6.innerHTML = 'Coordinates';
		let cell2_6 = row6.insertCell(1);
		cell2_6.innerHTML = '(' + mtnLat + ' &#176;,  ' + mtnLong + ' &#176; )';
	};
};
