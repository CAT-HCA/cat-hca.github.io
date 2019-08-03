// Description: This script will calculate the cost of a car rental
//based on selected options on UI
//Author: Corinne Trudeau
"use strict";

/*
*This is the window.onload event handler
*/
window.onload = function ()
{
    let pickupDateField = document.getElementById("inputPickupDate");
    let numDaysField = document.getElementById("inputNumDays");
    let tollTagField = document.getElementById("selectTollTag");
    let gpsField = document.getElementById("selectGps");
    let roadsideField = document.getElementById("selectRoadside");
    let over25Field = document.getElementById("notUnder25");
    let carTypeField = document.getElementById("inputCarType");
    let hiddendiv = document.getElementById("hiddendiv");

    let calcBtn = document.getElementById("calcBtn");

    /*
    *This is the button click event handler
    */
    calcBtn.onclick = function ()
    {
        //Get Data from UI
        let pickupDate = pickupDateField.value;
        let numDays = Number(numDaysField.value);


        //Process Data and call other functions
        let carCost = getCarCost(numDays, carTypeField);
        let optionsCost = getOptionsCost(numDays, tollTagField.checked, gpsField.checked, roadsideField.checked);
        let ageCost = getAgeCost(carCost, over25Field.checked);
        let returnDate = getReturnDate(pickupDate, numDays);
        let totalCost = carCost + optionsCost + ageCost;

        hiddendiv.style.display = 'block';
        

        //Display results
        document.getElementById("carRentalCostOutput").innerHTML = carCost.toFixed(2);

        document.getElementById("optionCostOutput").innerHTML = optionsCost.toFixed(2);

        document.getElementById("under25CostOutput").innerHTML = ageCost.toFixed(2);

        document.getElementById("returnDateOutput").innerHTML = returnDate;

        document.getElementById("totalCostOutput").innerHTML = totalCost.toFixed(2);

    }
}

/*
* This function will determine the cost of just the car rental
* @param numDays (number) - number of days of rental
* @param carTypeField (string) - the option selected by the user on the drop down box
* @return carCost (number) - returns the car cost
*/
function getCarCost(numDays, carTypeField)
{
    var carType = carTypeField.options[carTypeField.selectedIndex].value;
    switch (carType)
    {
        case "Economy":
            carCost = 29.99;
            break;
        case "Compact":
            carCost = 39.99;
            break;
        case "Intermediate":
            carCost = 49.99;
            break;
        case "FullSize":
            carCost = 59.99;
            break;
        default:
            alert("Please select a style of car");
            break; 
    }
    var carCost = carCost *numDays;
    return carCost;
}

/*
* This function will determine the cost of additional options
* by determining which options were selected and multiplying
* by number of days
* @param numDays (number) - number of days of rental
* @param tollTag (boolean) - value of tollTag checkbox
* @param gps (boolean) - value of gps checkbox
* @param roadside (boolean) - value of roadside checkbox
* @return optionsCost (number) - returns the options cost
*/
function getOptionsCost(numDays, tollTag, gps, roadside)
{
    let optionsCost = 0;
    if (tollTag)
    {
        optionsCost += (3.95 * numDays);
    }
    if (gps)
    {
        optionsCost += (2.95 * numDays);
    }
    if (roadside)
    {
        optionsCost += (2.95 * numDays);
    }
    return optionsCost;
}

/*
* This function will determine if there is an additional
* surcharge for age under 25 and applies the surcharge of
* 30% to the carCost (NOT total cost)
* @param carCost (number) - subtotal of cost of car
* @param over25 (boolean) - value of age from radio buttons (under or over 25)
* @return ageCost (number) - returns the surcharge amount if any
*/
function getAgeCost(carCost, over25)
{
    let ageCost;
    if (over25)
    {
        ageCost = 0;
    }
    else
    {
        ageCost = carCost * .3;
    }
    return ageCost;
}

/*
* This function will determine the date the vehicle needs to be returned by 
* @param pickupDate (date) - selected pickup date from UI
* @param numDays (number) - number of days of rental
* @return returnDate (date) - date vehicle needs to be returned
*/
function getReturnDate(pickupDate, numDays)
{
    let returnDate;
    const mSecPerDay = 1000 * 60 * 60* 24;
    let pickupDateMSec = Date.parse(pickupDate);
    let mSecPassed = (numDays + 1) * mSecPerDay;
    returnDate = new Date(pickupDateMSec + mSecPassed);
    returnDate = returnDate.toDateString();
    return returnDate;
}