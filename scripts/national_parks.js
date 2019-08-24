// Description: This site can be used to view various national
// parks, filtered by location or park type
//Author: Corinne Trudeau
'use strict';

//window load even handler
window.onload = function() {
	//Location drop down data
	let stateLoc = [
		'Alabama',
		'Alaska',
		'American Samoa',
		'Arizona',
		'Arkansas',
		'California',
		'Colorado',
		'Connecticut',
		'Delaware',
		'DC',
		'Florida',
		'Georgia',
		'Guam',
		'Hawaii',
		'Idaho',
		'Illinois',
		'Indiana',
		'Iowa',
		'Kansas',
		'Kentucky',
		'Louisiana',
		'Maine',
		'Maryland',
		'Massachusetts',
		'Michigan',
		'Minnesota',
		'Mississippi',
		'Missouri',
		'Montana',
		'Nebraska',
		'Nevada',
		'New Hampshire',
		'New Jersey',
		'New Mexico',
		'New York',
		'North Carolina',
		'North Dakota',
		'Ohio',
		'Oklahoma',
		'Oregon',
		'Pennsylvania',
		'Puerto Rico',
		'Rhode Island',
		'South Carolina',
		'South Dakota',
		'Tennessee',
		'Texas',
		'Utah',
		'Vermont',
		'Virgin Islands',
		'Virginia',
		'Washington',
		'West Virginia',
		'Wisconsin',
		'Wyoming',
	];
	let stateLen = stateLoc.length;
	//Park type drop down data
	let parkType = [
		'National Park',
		'National Monument',
		'Recreation Area',
		'Scenic Trail',
		'Battlefield',
		'Historic',
		'Memorial',
		'Preserve',
		'Island',
		'River',
		'Seashore',
		'Trail',
		'Parkway',
	];
	let parkTypeLen = parkType.length;
	let typeDropDown = document.getElementById('parkTypeDD');
	let stateDropDown = document.getElementById('locationDD');

	//populates park type dropdown
	for (let i = 0; i < parkTypeLen; i++) {
		let typeDDOptions = parkType[i];
		let newDDOption = document.createElement('option');
		newDDOption.text = typeDDOptions;
		newDDOption.value = typeDDOptions;
		typeDropDown.appendChild(newDDOption);
	}
	//populates state/location dropdown
	for (let i = 0; i < stateLen; i++) {
		let stateDDOptions = stateLoc[i];
		let newDDOption = document.createElement('option');
		newDDOption.text = stateDDOptions;
		newDDOption.value = stateDDOptions;
		stateDropDown.appendChild(newDDOption);
	}

	let stateRadio = document.getElementById('sortByLoc');
	let typeRadio = document.getElementById('sortByType');
	let locFilterDiv = document.getElementById('locFilterDiv');
	let typeFilterDiv = document.getElementById('typeFilterDiv');
	let parkTableOutput = document.getElementById('parkTableOutput');

	//this function hides the park type filter options when location selected
	stateRadio.onclick = function() {
		clearTable();
		parkTableOutput.style.display = 'none';
		typeFilterDiv.style.display = 'none';
		locFilterDiv.style.display = 'block';
		stateDropDown.selectedIndex = 0;
	};
	//this function hides the state/location filter options when location selected
	typeRadio.onclick = function() {
		clearTable();
		parkTableOutput.style.display = 'none';
		locFilterDiv.style.display = 'none';
		typeFilterDiv.style.display = 'block';
		typeDropDown.selectedIndex = 0;
	};

	let tableBody = document.getElementById('tableBody');
	// retrieving national park data from json file
	let natParkObj;
	$.getJSON('data/nationalparks.json', function(data) {
		natParkObj = data;
	});

	//drop down change event handler
	stateDropDown.onchange = function() {
		let natParkJtron = document.getElementById('natParkJtron');
		natParkJtron.style.display = 'none';
		clearTable();
		parkTableOutput.style.display = 'none';
		let objLen = natParkObj.parks.length;
		for (let i = 0; i < objLen; i++) {
			let selectedPark = natParkObj.parks[i];
			if (stateDropDown.value == selectedPark.State) {
				insertRowInTable(
					parkTableOutput,
					tableBody,
					selectedPark.LocationName,
					selectedPark.City,
					selectedPark.State,
					selectedPark.Latitude,
					selectedPark.Longitude,
					selectedPark.Visit
				);
			}
		}
	};
	//drop down change event handler
	typeDropDown.onchange = function() {
		clearTable();
		let natParkJtron = document.getElementById('natParkJtron');
		natParkJtron.style.display = 'none';
		parkTableOutput.style.display = 'none';
		let objLen = natParkObj.parks.length;
		for (let i = 0; i < objLen; i++) {
			let selectedPark = natParkObj.parks[i];
			let str = selectedPark.LocationName;
			let searchResult = str.toLowerCase().indexOf(typeDropDown.value.toLowerCase());
			if (searchResult >= 0) {
				insertRowInTable(
					parkTableOutput,
					tableBody,
					selectedPark.LocationName,
					selectedPark.City,
					selectedPark.State,
					selectedPark.Latitude,
					selectedPark.Longitude,
					selectedPark.Visit
				);
			}
		}
	};

	//displays all national parks
	let showAllBtn = document.getElementById('showAllBtn');
	showAllBtn.onclick = function() {
		clearTable();
		natParkJtron.style.display = 'none';
		let objLen = natParkObj.parks.length;
		for (let i = 0; i < objLen; i++) {
			let selectedPark = natParkObj.parks[i];
			insertRowInTable(
				parkTableOutput,
				tableBody,
				selectedPark.LocationName,
				selectedPark.City,
				selectedPark.State,
				selectedPark.Latitude,
				selectedPark.Longitude,
				selectedPark.Visit
			);
		}
	};

	//functionality of reset/"start over" button
	let resetBtn = document.getElementById('resetBtn');
	resetBtn.onclick = function() {
		//sets visible divs back to initial, drop down boxes and radio buttons to initial
		natParkJtron.style.display = 'block';
		parkTableOutput.style.display = 'none';
		locFilterDiv.style.display = 'block';
		typeFilterDiv.style.display = 'none';
		stateDropDown.selectedIndex = 0;
		stateRadio.checked = true;
		//clears table contents, if any
		clearTable();
	};
};

// function to insert rows into the table
function insertRowInTable(parkTableOutput, tableBody, parkName, city, state, latitude, longitude, url) {
	parkTableOutput.style.display = 'inline-table';
	let row = tableBody.insertRow(tableBody.rows.length);
	let cell1 = row.insertCell(0);
	cell1.innerHTML = parkName;
	let cell2 = row.insertCell(1);
	cell2.innerHTML = city + ', <br>' + state;
	let cell3 = row.insertCell(2);
	cell3.innerHTML = '(' + latitude + '&#176;,' + longitude + '&#176;)';
	let cell4 = row.insertCell(3);
	if (url != undefined) {
		let urlField = document.createElement('a');
		urlField.href = url;
		urlField.innerHTML = url;
		urlField.target = "rptTab";
		cell4.appendChild(urlField);
	} else {
		cell4.innerHTML = '&nbsp;';
	}
}

//clears results table if there are any rows
function clearTable() {
	while (tableBody.childNodes.length) {
		parkTableOutput.style.display = 'none';
		tableBody.removeChild(tableBody.childNodes[0]);
	}
}
