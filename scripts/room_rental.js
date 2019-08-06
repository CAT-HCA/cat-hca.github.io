// Description: This script will calculate the cost of a room rental
//based on selected options on UI
//Author: Corinne Trudeau
"use strict";


/*
* This function will pull the proper object out of the array to refer to
* @param roomType (string) - roomType selected by user on drop down
* @return result (object) - selected object from array
*/
function getRoomInfo(roomType)
{
    let priceList = 
    [
        {name:"queen", guests: 5, lowSeasonRate: 150, highSeasonRate: 250},
        {name:"king", guests: 2, lowSeasonRate: 150, highSeasonRate: 250},
        {name:"kingSuite", guests: 4, lowSeasonRate: 190, highSeasonRate: 310},
        {name:"twoBedSuite", guests: 6, lowSeasonRate: 210, highSeasonRate: 350}
    ];

   let obj;
   for (let i = 0; i < priceList.length; i++)
   {
      if (priceList[i].name == roomType)
      {
         obj = priceList[i];
         break;
      }
   }
   return obj;
}
/*
*This is the window.onload event handler
*/
window.onload = function ()
{
    let checkInDateField = document.getElementById("inputCheckinDate");
    let numNightsField = document.getElementById("inputNumNights");
    let adultCountField = document.getElementById("inputAdultCount");
    let childCountField = document.getElementById("inputChildCount");
    let roomTypeField = document.getElementById("inputRoomType");
    let breakfastField = document.getElementById("noBreakfast");
    let aaaDiscField = document.getElementById("aaaDisc");
    let seniorDiscField = document.getElementById("seniorDisc");
    let militaryDiscField = document.getElementById("militaryDisc");
    let hiddendiv = document.getElementById("hiddendiv");
    let calcBtn = document.getElementById("calcBtn");

    /*
    *This is the button click event handler
    */
   calcBtn.onclick = function ()
    {
        //Get Data from UI
        let roomType = roomTypeField.options[roomTypeField.selectedIndex].value;
        let checkInDate = new Date(checkInDateField.value);
        let numNights = Number(numNightsField.value);
        let numAdults = Number(adultCountField.value);
        let numChild = Number(childCountField.value);
        let totalGuests = numChild + numAdults;
        let taxPercent = .12;

        hiddendiv.style.display = 'block';

        //Process Data and call other functions
        let roomInfo = getRoomInfo(roomType);
        let customerCount = canRoomHoldCustomer(roomInfo, totalGuests);
        if (customerCount == false)
        {
            alert("Your guest count is too big for your selected room.");
            return;
        }
        let checkInDateCalc = getCheckInDate(checkInDate);
        let checkOutDate = getCheckOutDate(checkInDate, numNights);
        let breakfastCost = getBreakfastCost(numNights, numAdults, numChild, breakfastField.checked, seniorDiscField.checked);
        let roomCost = getRoomCost(roomInfo, checkInDate, numNights);
        let discountAmount = getDiscount(roomCost, aaaDiscField.checked, seniorDiscField.checked, militaryDiscField.checked);
        let roomSubtotal = roomCost + breakfastCost;
        let taxAmount = roomSubtotal * (taxPercent);
        let totalCost = roomSubtotal - discountAmount + taxAmount;
      

        //Display results
        document.getElementById("checkinDateOutput").innerHTML = checkInDateCalc;
        document.getElementById("checkoutDateOutput").innerHTML = checkOutDate;
        document.getElementById("roomAndBfastCostOutput").innerHTML = roomSubtotal.toFixed(2);
        if (discountAmount > 0){
            document.getElementById("discountSavingsOutput").innerHTML = discountAmount.toFixed(2);
        }
        else
        {
            discountAmount = "";
            document.getElementById("discountSavingsOutput").innerHTML = discountAmount;
        }
        document.getElementById("taxOutput").innerHTML = taxAmount.toFixed(2);
        document.getElementById("totalCostOutput").innerHTML = totalCost.toFixed(2);

    }
}




/*
* This function will determine if your selected number of guests is greater
* than the max occupancy of selected room type
* @param roomType (string) - roomType selected by user on drop down
* @param numGuests (number) - number of guests
* @return result (boolean) - true or false that the guests will fit in the room
*/
function canRoomHoldCustomer(roomInfo, numGuests)
{
    let result = false;
    
    if (roomInfo.guests >= numGuests)
    {
        result = true;
    }
    return result;
}

/*
* This function will determine the cost of just your room rental
* @param roomType (string) - roomType selected by user on drop down
* @param checkinDate (date) - date of checkin (to be used if calculating
* off-season/on-season rates)
* @param numNights (number) - number of nights of stay
* @return roomCost (number) - cost of room
*/
function getRoomCost(roomInfo, checkinDate, numNights)
{
    let roomCost = roomInfo.lowSeasonRate * numNights;
    return roomCost;
}

/*
* This function will determine the cost of breakfast (if requested)
* @param numNights (number) - number of nights of stay
* @param numAdults (number) - number of adult guests
* @param numKids (number) - number of child guests
* @param breakfastTrue (boolean) - true or false value of breakfast selection
* @param seniorDiscTrue (boolean) - true or false value of senior discount selection
* @return breakfastCost (number) - cost of breakfast
*/
function getBreakfastCost(numNights, numAdults, numKids, breakfastTrue, seniorDiscTrue)
{
    let breakfastCost;
    let kidBfastPrice = 3.95;
    let adultBfastPrice = 6.96;

    if (seniorDiscTrue != false )
    {
        breakfastCost = 0;
    }
    else
    {
        if (breakfastTrue != false)
        {
            breakfastCost = 0;
        }
        else
        {
            let kidBfastCost = numNights * kidBfastPrice * numKids;
            let adultBfastCost = numNights * adultBfastPrice * numAdults;
            breakfastCost = kidBfastCost + adultBfastCost;
        }
    }
    return breakfastCost;
}

/*
* This function will determine the date the vehicle needs to be returned by 
* @param roomCostBeforeDiscount (number) - room cost before discount
* @param aaaDiscTrue (boolean) - true or false value of AAA discount selection
* @param seniorDiscTrue (boolean) - true or false value of Senior discount selection
* @param militaryDiscTrue (boolean) - true or false value of military discount selection
* @return returnDate (discount) - discount amount, if any
*/
function getDiscount(roomCostBeforeDiscount, aaaDiscTrue, seniorDiscTrue, militaryDiscTrue)
{
    let discount = 0;
    const aaaOrSeniorDiscRate = .1;
    const miliDiscRate = .2;
    if (aaaDiscTrue || seniorDiscTrue)
    {
        discount = roomCostBeforeDiscount * aaaOrSeniorDiscRate;
    }
    else if (militaryDiscTrue)
    {
        discount = roomCostBeforeDiscount * miliDiscRate;
    }
    else
    {
        discount = 0;
    }
    return discount;
}

/*
* These function will determine the check in and check out dates
*/
function getCheckOutDate(checkInDate, numNights)
{
    let checkOutDate;
    const mSecPerDay = 1000 * 60 * 60* 24;
    let checkInDateMSec = Date.parse(checkInDate);
    let mSecPassed = (numNights + 1) * mSecPerDay;
    checkOutDate = new Date(checkInDateMSec + mSecPassed);
    checkOutDate = checkOutDate.toDateString();
    return checkOutDate;
}

function getCheckInDate(checkInDate)
{
    const mSecPerDay = 1000 * 60 * 60* 24;
    let checkInDateMSec = Date.parse(checkInDate);
    let newCheckInDate = new Date(checkInDateMSec + (mSecPerDay * 1));
    newCheckInDate = newCheckInDate.toDateString();
    return newCheckInDate;
}