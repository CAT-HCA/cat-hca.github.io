"use strict";

//document ready event handler
$(function() {
	//on click event handler of jumbotron button "Plan your day of relaxation"
	$("#jtronBtn").on("click", e => {
		//auto plays spa music (in footer)
		let myAudio = document.getElementById("audioId");
		myAudio.load();
		//function to hide a visible element, pass in the jquery selector
		hideElement($("#jtron"));
		hideElement($("#homepageCards"));
		//function to show a hidden element, pass in the jquery selector
		showElement($("#servicesHeader"));
		showElement($("#viewCategories"));
		//on click of View Categories button/dropdown
		$("#viewCategories").on("click", e => {
			$("#categoryList").empty();
			//calling function to populate category dropdown
			getCategories();
		});
	});
});

//function to return categories and populate drop down list with badges
function getCategories() {
	//call to categories api (returns ALL categories)
	$.getJSON("/api/categories", categories => {
		//looping through returned categories to create drop down items
		//WIP - on Monday would like to figure out how to only make the call once
		//and not on each click
		$.each(categories, (index, category) => {
			//appending a tag with Category name and <a>
			$("#categoryList").append(
				$("<a />")
					.html(
						`${category.Category}&nbsp;&nbsp;<span class="float-right badge badge-info badge-pill">${
							category.Count
						}</span>`
					)
					.attr("id", index)
					.attr("href", "#")
					.addClass("dropdown-item")
					//on the click of a category
					.on("click", e => {
						e.preventDefault();
						$("#accordion").empty();
						$("#categoryName").text(category.Category);
						//calling function to return services by Category value
						getServices(category.Value);
					})
			);
		});
	});
	showElement($("#categoryContainer"));
}

//function to populate card headings with each service within category
//passing in selected category value
function getServices(category) {
	showElement($("#servicesContainer"));
	//calling api to return services BY CATEGORY
	$.getJSON(`/api/services/bycategory/${category}`, services => {
		//looping through returned services to create card headings
		for (let i = 0; i < services.length; i++) {
			//appending card heading to accordion (after card0)
			if (i == 0) {
				//create card header
				createHtml("", "true", i, services);
				//create card body
				getService(services[i].ServiceID, i, "collapse show");
			} else {
				//create card header
				createHtml("collapsed", "false", i, services);
				//create card body
				getService(services[i].ServiceID, i, "collapse");
			}
		}
	});
}
//function to create card header html to attend to append to accordion
//pass in required bootstrap accordion classes, value of i for determining elem ids, and services object
function createHtml(btnClass, ariaExpVal, i, services) {
	$("#accordion").append(
		$("<div />")
			.addClass("card")
			.attr("id", `cardId${[i]}`)
	);
	let cardId = $(`#cardId${[i]}`);
	//appending bootstrap accordion card styling/formatting divs
	cardId.append(
		$("<div />")
			.addClass("card-header bg-primary")
			.attr("id", `cardHeadingDiv${[i]}`)
	);
	$(`#cardHeadingDiv${[i]}`).append(
		$("<h2 />")
			.addClass("mb-0")
			.attr("id", `cardHeading${[i]}`)
	);
	$(`#cardHeading${[i]}`).append(
		$("<button />")
			.addClass("btn btn-link text-dark " + btnClass)
			.html(services[i].ServiceName)
			.attr({
				id: `cardBtn${[i]}`,
				type: "button",
				"data-toggle": "collapse",
				"data-target": `#collapse${[i]}`,
				"aria-expanded": ariaExpVal,
				"aria-controls": `collapse${[i]}`,
			})
	);
}

//function to populate card bodies
// pass in serviceId of selected service and concatenated cardId#
function getService(serviceId, cardIdNum, collapseClass) {
	$(`#cardId${cardIdNum}`).append(
		$("<div />")
			.addClass(collapseClass)
			.attr({
				id: `collapse${cardIdNum}`,
				"aria-labelledby": `cardHeadingDiv${cardIdNum}`,
				"data-parent": "#accordion",
			})
	);
	$.getJSON(`/api/services/${serviceId}`, service => {
		$(`#collapse${cardIdNum}`).append(
			$("<div />")
				.addClass("card-body")
				.attr("id", `cardBodyId${cardIdNum}`)
				.html(
					`<p class="serviceDescription font-italic">${service.Description}</p>
                <p class="servicePrice"><span class="text-info font-weight-bold">Price: </span>$${service.Price}</p>
                <p class="serviceLength"><span class="text-info font-weight-bold">Duration: </span>${
					service.Minutes
				} minutes</p>
                `
				)
		);
	});
}

//function to show a hidden element, pass in the jquery selector
function showElement(el2show) {
	el2show.css("display", "block");
}
//function to hide a visible element, pass in the jquery selector
function hideElement(el2hide) {
	el2hide.css("display", "none");
}
