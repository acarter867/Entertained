//DOM element variables
const leftArrow = document.getElementById('left-arrow'),
rightArrow = document.getElementById('right-arrow'),
month = document.getElementById('month'),
calendarTable = document.getElementById('calendar-table'),
btnNewEvent = document.getElementById('btn-create-new-event'),
eventInput = document.getElementById('txt-new-event'),
btnCitySearch = document.getElementById('city-search'),
txtCitySearch = document.getElementById('txt-search'),
btnSubmitEvent = document.getElementById('btn-new-event'),
btnConfirmEdit = document.getElementById('btn-confirm-edit'),
eventList = document.getElementById('event-list'),
btnGenerateRandom = document.getElementById('random-activity'),
txtEventName = document.getElementById('txt-event-name'),
txtEventDescription = document.getElementById('txt-event-description'),
txtStartTime = document.getElementById('txt-start-time'),
txtEndTime = document.getElementById('txt-end-time'),
txtLocation = document.getElementById('txt-event-location'),
btnConfirmDelete = document.getElementById('btn-confirm-delete'),
btnCancelDelete = document.getElementById('btn-cancel-delete'),
modalConfirm = document.getElementById('modal-confirm');

//Array of months for getMonth() indexing
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

//Currently selected calendar day
let selectedDate = '';


//Reset event input fields
function resetEventInput(){
    txtEventName.value = "";
    txtEventDescription.value = "";
    txtStartTime.value = "";
    txtEndTime.value = "";
    txtLocation.value = "";
}

btnNewEvent.addEventListener('click', resetEventInput)

//Boilerplate function to reset elements with 'card' class name and avoid duplicates
function removeChildrenByClassName(className){
    const toDelete = document.getElementsByClassName(className);
    while(toDelete.length > 0){
        toDelete[0].parentNode.removeChild(toDelete[0])
    }
}

//Boilerplate function to remove single element of array without changing the order. 
//Given the index of the element to be deleted, and the original array, we copy each element *with the exception of the indexToDelete (i)* into a new array, which gets returned
function removeElementFromArray(originalArray, indexToDelete){
    let updatedArray = [];
    for(let i = 0; i < originalArray.length; i++){
        if(i == indexToDelete){
            continue;
        }else{
            updatedArray.push(originalArray[i]);
        }
    }
    return updatedArray;
}

//Prep modals when page is open
document.addEventListener('DOMContentLoaded', function(){
    var modalEls = document.querySelectorAll('.modal');
    var instances = M.Modal.init(modalEls);

    //Event listener for event submission button
    btnSubmitEvent.addEventListener('click', () => {
        btnSubmitEvent.textContent = "Create Event!"
        //Force name field as required, so modal cannot be closed by submit button
        if(document.getElementById('txt-event-name').value == ""){
            btnSubmitEvent.classList.remove('modal-close')
            console.log("Error, name field is empty")
        }else{
            //If name field is not empty, add new event to calendar, and close input modal
            btnSubmitEvent.classList.add('modal-close');
            newEvent();

            //Refresh daily events modal for up-to-date event list
            let currentCellDate = String(currentMonth + 1).padStart(2, '0') + "/" + selectedDate.substring(3,5) + "/" + currentYear;
            let currCellEvents = getEventsByDay(currentCellDate);
            fillDailyModal(currCellEvents);
            resetEventInput();
        }
    })
})

/*      Take city from search input => pass into OpenWeatherMap (OWM) API for city coords => 
        pass latitude and longitude data from OWM API response into SeatGeek API call for event list by city =>  Generate and display card for each event through getEventCards() */
function getCityCoords(city){
    let APIKey = '22c381336de0f996a4083c7ecafd3174';
    let queryCity = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + APIKey;
     //Query city for coordinates from OpenWeatherMap
    fetch(queryCity)
    .then(result => { 
        console.log(result.status)
        return result.json();
    })
    .then(data => {
        console.log(data)
        try{
            let something = 'https://api.seatgeek.com/2/events?' + 'lon=' + data[0].lon+ '&' + 'lat=' + data[0].lat +  '&client_id=MzEzNjU0MzZ8MTY3Mjk2NjkyNi4xMTAzMDM'
            fetch(something)
            .then(result => {
                console.log(result);
                return result.json();
            })
            .then(data => {
                for(let i = 0; i < data.events.length; i++){
                    getEventCards(data.events[i])
                };
            });
        }catch{
            //TODO: Create Modals to inform user of any errors when attempting API call************************************************************************************************************************************
            console.log("failed");
        }  
    });
}

//Retrieve and display events based on city name
btnCitySearch.addEventListener('click', () => {
    removeChildrenByClassName("card");
    getCityCoords(txtCitySearch.value);
    txtCitySearch.textContent = "";
});

//Function to call bored API
function getBored(){
    try{
        let queryString = 'https://www.boredapi.com/api/activity/';
        fetch(queryString)
        .then(result => {
            console.log(result);
            return result.json();
        })
        .then(data => {
            //Remove previous input text & auto-populate event input fields
            resetEventInput();
            let txtEventName = document.getElementById('txt-event-name'),
            txtEventDescription = document.getElementById('txt-event-description');
            txtEventName.value = "Activity: " + data.activity;
            txtEventDescription.value = "Type: " + data.type;
            
        });
    }catch{
    //TODO: Create Modals to inform user of any errors when attempting API call************************************************************************************************************************************
    console.log("failed");
    }
}

//Call Bored API on button click
btnGenerateRandom.addEventListener('click', () => {
    getBored();
});




//Initialization of current month and year
let currentMonth = 0;
let currentYear = 0;

//Sets current (Today's) date
function setDate(){
    let date = new Date();
    currentMonth = date.getMonth();
    currentYear = date.getFullYear();
    month.textContent = months[currentMonth] + " " + currentYear;
    generateCalendar();
}

//Go back one month
leftArrow.addEventListener('click', () => {
    generateCalendar('left');
});

//Go forward one month
rightArrow.addEventListener('click', () =>{
    generateCalendar('right');
});

//Returns number of days in month
function daysInMonth(year, month){
    return new Date(year, month, 0).getDate();
}

//Returns day of week that a given month starts on 
function firstWeekday(month, year){
    const d = new Date(month + " 1, " + currentYear);
    let day = d.getDay();
    return day;
}

//Function to avoid repeat printing of childElements


//create calendar layout for given month
function generateCalendar(direction){
    let today = new Date();
    let thisYear = today.getFullYear();
    let thisMonth = today.getMonth();
    let currentDate = today.getDate();

    //Call removeChildrenByClassName to avoid multiples of days in month
    removeChildrenByClassName('rows');
    //Determine whether to go to next or previous month
    if(direction === 'left'){
        if(currentMonth == 0){
            currentMonth = 11;
            currentYear--;
        }else{
            currentMonth -= 1;
        }
    }else if(direction === 'right'){
        if(currentMonth == 11){
            currentMonth = 0;
            currentYear++;
        }else{
            currentMonth++;
        }
    }
    //Displays current month
    month.textContent = months[currentMonth] + " " + currentYear;

    //Number of days in currently selected month
    let numDays = daysInMonth(currentYear, currentMonth + 1);

    //Day of the week that the month starts on, to prevent starting every month on sunday by default
    let beginningDay = firstWeekday(months[currentMonth], currentYear);

    /*Need to iterate (using 'i') the number of days in the month PLUS the number of blank spaces (determined by which day of the week a particular month starts on). 
                                EX: February starts on a wednesday, so we need 3 empty spaces at the beginning of the calendar for Sunday, Monday, and Tuesday.*/

    //We can iterate the total number of days in any given month using a second iterator, 'j', that starts at 1.
    for(let i = 0, j = 1; i < numDays + beginningDay; i++){
        //If i is evenly divisible by 7, we have completed a full week, and need a new row.
        if(i % 7 == 0){
           var newRow = document.createElement('tr');
           newRow.setAttribute('class', 'rows');
           calendarTable.appendChild(newRow);
        }
        let newCell = document.createElement('td');
        //If i < beginningDay, we have not reached the weekday which the currently selected month has started on, and should leave a blank space.
        if(i < beginningDay){
            newCell.textContent = " ";
        }else{
            newCell.setAttribute('class', 'has-date')
            newCell.textContent = j;
            newCell.style.border = '1px solid black';
            let currentCellDate = String(currentMonth + 1).padStart(2, '0') + "/" + newCell.textContent.padStart(2, '0') + "/" + currentYear;
            let currCellEvents = getEventsByDay(currentCellDate);

            //If selected cell has events, add indicator icon next to date
            if(currCellEvents.length !== 0){
                let newDiv = document.createElement('div'),
                redDot = document.createElement('span');              
                  
                var dayNum = document.createElement('span');

                newDiv.appendChild(redDot);
                newDiv.appendChild(dayNum);
                redDot.style.fontSize = '20px';
                redDot.style.color = 'red';

                redDot.textContent = '• ';
                dayNum.textContent = j;
                
                newCell.textContent = '';
                newCell.appendChild(newDiv)
            }
            //Add event listener to every new cell. Will allow user to select specific day to create and view events.
            newCell.addEventListener('click', () => {
                removeChildrenByClassName('card')
                deselectDays();
                newCell.classList.add('selected');
                newCell.classList.add('modal-trigger');
                newCell.setAttribute('data-target', 'modal1');
                //Get all events for this specific cells date
                selectedDate = currentCellDate;
                
                //If event list for that day is empty, inform user that no events are scheduled. Otherwise, fill modal with daily event cards
                if(currCellEvents.length == 0){
                    console.log("No Events Scheduled for Today!")
                }else{
                    fillDailyModal(currCellEvents);
                }
            });

            //Add 'todays-date' HTML class so current date can be highlighted
            if(currentYear === thisYear && j === currentDate && thisMonth === currentMonth){
                newCell.classList.add('todays-date');
            }
            //Increment 'j' to the next day of the month.
            j++;
        }
        //Add the new cell to the current row        
        newRow.appendChild(newCell);
    }
}

//Fill modal with the selected days event cards, including new ones
function fillDailyModal(currCellEvents){
    //Reset event cards to avoid duplicates
    removeChildrenByClassName('card');

    /*For each event on the selected date: 
            Get event modal elements (card to append, edit/delete buttons, ) => assign card & edit/delete buttons matching id's (unique to THAT card & edit/delete button) => add event listeners to edit/delete buttons*/
    for(let i = 0; i < currCellEvents.length; i++){
        let eventModal = document.getElementById('event-modal');
        let cardToAppend = getDailyEventCard(currCellEvents[i], i + 1);
        cardToAppend.setAttribute('id', 'card-' + (i + 1));
        eventModal.appendChild(cardToAppend);

        targetDelete = document.getElementById('delete-' + String(i + 1));
    
        //Declare edit and delete buttons for each card with matching id's
        let currentDelete = document.getElementById('delete-' + String(i + 1)),
        currentEdit = document.getElementById('edit-' + String(i + 1)),
        currentCard = document.getElementById('card-' + String(i+1));

        //Edit events:
        /**recreate event object using card info => parse local storage to array => search local storage array for matching event obj => 
         auto-populate event input with object manipulate event obj => add event listener to confirmation button to send array back to local storage => update modal to display modified event**/
        //Mainly done by editEvent()
        currentEdit.addEventListener('click', () => {
            //Hide submit button on edit form
            btnConfirmEdit.classList.remove('hidden');
            btnSubmitEvent.classList.add('hidden');

            //Ensures consistent formatting for local storage comparisons
            let formattedStartTime = getStartTime(currentCard.children[4].textContent);
            let formattedEndTime = getEndTime(currentCard.children[4].textContent);

            //All cards have identical element tree, so card.children will be consistent
            eventToEditOBJ = {
                    date: currentCard.children[2].textContent,
                    name: currentCard.children[0].textContent,
                    startTime: formattedStartTime,
                    endTime: formattedEndTime,
                    description: currentCard.children[1].textContent,
                    location: currentCard.children[3].textContent,
            }

            //Auto-populate input fields with event
            txtEventName.value = currentCard.children[0].textContent,
            txtStartTime.value = formattedStartTime,
            txtEndTime.value = formattedEndTime,
            txtEventDescription.value = currentCard.children[1].textContent,
            txtLocation.value = currentCard.children[3].textContent;
            
            //On confirmation, perform local storage manipulation operations & update daily-modal
            btnConfirmEdit.addEventListener('click', () => {
                editEvent(eventToEditOBJ);
                let currCellEvents = getEventsByDay(selectedDate);
                fillDailyModal(currCellEvents)
                generateCalendar();

                btnConfirmEdit.classList.add('hidden');
                btnSubmitEvent.classList.remove('hidden');
            })
                
        })
        //Delete Events:
        /**Create new confirmation buttons each time to avoid adding multiple event listeners to same button**/
        currentDelete.addEventListener('click', () => {
            removeChildrenByClassName('deletion-option')
            btnModalYes = document.createElement('button'),
            btnModalNo = document.createElement('button');
        
            btnModalYes.textContent = 'Yes';
            btnModalNo.textContent = 'No';
        
            btnModalYes.setAttribute('id', 'btn-confirm');
            btnModalNo.setAttribute('id', 'btn-cancel');
        
            btnModalYes.classList.add('modal-close', 'btn', 'deletion-option');
            btnModalNo.classList.add('modal-close', 'btn', 'deletion-option');
        
            modalConfirm.appendChild(btnModalYes);
            modalConfirm.appendChild(btnModalNo);

            //Confirm Delete: Similar to the edit feature, duplicate event, search local storage for matching object.
            //Call deleteEvent(); to create a new array without that object & send back to local storage
            btnModalYes.addEventListener('click', () => {
                let formattedStartTime = getStartTime(currentCard.children[4].textContent);
                let formattedEndTime = getEndTime(currentCard.children[4].textContent);
                currentEventOBJ = {
                    date: currentCard.children[2].textContent,
                    name: currentCard.children[0].textContent,
                    startTime: formattedStartTime,
                    endTime: formattedEndTime,
                    description: currentCard.children[1].textContent,
                    location: currentCard.children[3].textContent
                }
                deleteEvent(currentEventOBJ);
                let currCellEvents = getEventsByDay(selectedDate);
                fillDailyModal(currCellEvents);
                generateCalendar();
            });
        })
    }
}


//Create & style event card for each daily event
function getDailyEventCard(event, index){

    //Create card & child elements
    let card = document.createElement('div');    
    eventName = document.createElement('span'),
    eventDescription = document.createElement('p'),
    eventDate = document.createElement('p'),
    eventLocation = document.createElement('p'),
    eventTime = document.createElement('p');

    //Set id attributes for event property elements
    eventName.setAttribute('id', 'event-name');
    eventDescription.setAttribute('id', 'event-description');
    eventDate.setAttribute('id', 'event-date');
    eventLocation.setAttribute('id', 'event-location');
    eventTime.setAttribute('id', 'event-time');

    //Create edit & delete buttons & append to parent div
    editDelete = document.createElement('div');
    btnEditEvent = document.createElement('span');
    btnDeleteEvent = document.createElement('span');    

    //Set attributes for buttons & card to open corresponding modals, & assign unique id's
    btnEditEvent.setAttribute('data-target', 'modal2');
    btnEditEvent.classList.add('edit-event', 'modal-trigger');
    btnDeleteEvent.classList.add('delete-event', 'modal-trigger');
    btnDeleteEvent.setAttribute('data-target', 'modal6')
    editDelete.setAttribute('class', 'edit-delete')
    btnEditEvent.textContent = "Edit/";
    btnEditEvent.setAttribute('id', 'edit-' + index)
    btnDeleteEvent.textContent = "Delete";
    btnDeleteEvent.setAttribute('id', 'delete-' + index)

    editDelete.appendChild(btnEditEvent);
    editDelete.appendChild(btnDeleteEvent);

    //Set text content from event object properties
    eventName.textContent = event.name;
    eventDescription.textContent = event.description;
    eventDate.textContent = event.date;
    eventLocation.textContent = event.location;
    eventTime.textContent = event.startTime + "-" + event.endTime;

    //Append children elements to card
    card.appendChild(eventName);
    card.appendChild(eventDescription);
    card.appendChild(eventDate);
    card.appendChild(eventLocation);
    card.appendChild(eventTime);
    card.appendChild(editDelete);

    eventName.classList.add('card-title');

    //Style & label card using Materialize CSS conventions
    card.classList.add('card', 'blue-grey', 'card-content', 'daily-card');
    return card;
}

//On confirmation of delete
function deleteEvent(eventToDelete){
    let todaysEventList = JSON.parse(localStorage.getItem('events'));
    for(let i = 0; i < todaysEventList.length; i++){
        //If eventToDelete obj matches an object in local storage, pass event list and index of matched element to removeElementFromArray(); and overwrite local storage
        if(JSON.stringify(eventToDelete) == JSON.stringify(todaysEventList[i])){
            console.log("MATCH FOUND: " + todaysEventList[i]);
            console.log("current event: " + eventToDelete);
            let updatedEvents = removeElementFromArray(todaysEventList, i);
            localStorage.setItem('events', JSON.stringify(updatedEvents));
            return;
        }
    }
}

//On confirmation of edit 
function editEvent(eventToEdit){
    let todaysEventList = JSON.parse(localStorage.getItem('events'));
    for(let i = 0; i < todaysEventList.length; i++){
        if(JSON.stringify(eventToEdit) == JSON.stringify(todaysEventList[i])){
            todaysEventList[i].date = selectedDate,
            todaysEventList[i].name = txtEventName.value,
            todaysEventList[i].startTime = txtStartTime.value,
            todaysEventList[i].endTime = txtEndTime.value,
            todaysEventList[i].description = txtEventDescription.value,
            todaysEventList[i].location = txtLocation.value;
            localStorage.setItem('events', JSON.stringify(todaysEventList));
            return;
        }
    }
}

//Needed to break up SeatGeek date/time info for event editing. Based on SeatGeek date/time formatting, we know that if an array's length is greater than 2 after using split(), 
//the time data must originiate from a SeatGeek generated event, and can be broken down into date and time to match formatting of local storage event objects
function getStartTime(timeData){
    let brokenTime = timeData.split('-');
    if(brokenTime.length > 2){
        return brokenTime[0] + '-' + brokenTime[1] + '-' + brokenTime[2];
    }else{
        return brokenTime[0];
    }
}  
function getEndTime(timeData){
    let brokenTime = timeData.split('-');
    if(brokenTime.length > 2){
        return brokenTime[3];
    }else{
        return brokenTime[1];
    }
}

//Separate date from time in case of SeatGeek events
function formatDateTime(dateTime){
    let splitDate = dateTime.split('-');
    let dd = splitDate[2].substring(0,2);

    let yyyy = splitDate[0];
    let mm = splitDate[1];

    let formattedDate = mm + "/" + dd + "/" + yyyy;
    return formattedDate;
}

//Remove 'selected' class from all calendar days each time a day is selected, so that only one may be selected at a time
function deselectDays(){
    let childDays = calendarTable.children;
    //Loop through rows
    for(let i = 0; i < childDays.length; i++){
        //Loop through each cell in the row
        for(let j = 0; j < childDays[i].children.length; j++){
            childDays[i].children[j].classList.remove('selected');
        }
    }
}

//Testing for adding new events to calendar
function newEvent(){
    let eventsList = [];
    //Create oject with event details
    const eventObj = {
        date: selectedDate,
        name: txtEventName.value,
        startTime: (txtStartTime.value != "") ? txtStartTime.value : 'N/A',
        endTime: (txtEndTime.value != "") ? txtEndTime.value : 'N/A',
        description: (txtEventDescription.value != "") ? txtEventDescription.value : 'N/A',
        location: (txtLocation.value != "") ? txtLocation.value : 'N/A',
    }
    //Send to local storage. If event list is empty, initialize one
    let currentEvents = localStorage.getItem('events');
    if(currentEvents == null){
        let firstEvent = [eventObj]
        localStorage.setItem('events', JSON.stringify(firstEvent));
    }else{
        eventsList = JSON.parse(localStorage.getItem('events'));
        eventsList.push(eventObj);
        localStorage.setItem('events', JSON.stringify(eventsList));
    }
    generateCalendar();
}

// TODO: implement this function into generateCalendar where individual days are created. 
function getEventsByDay(date){
    let todaysEvents = [];
    let allEvents = JSON.parse(localStorage.getItem('events'));
    //If there's no scheduled events, return empty array    
    if(allEvents == null){
        return [];
    }
    //Check newCell date in calendar for events scheduled that day
    for(let i = 0; i < allEvents.length; i++){
        if(allEvents[i].date === date){
            todaysEvents.push(allEvents[i]);
        }
    }
    return todaysEvents;
}



//Function to append event cards to event list
function getEventCards(data){
    //Declare DOM variables for non-daily event modal
    let modalEventTitle = document.getElementById('event-title'),
    modalEventType = document.getElementById('type'),
    modalEventTime = document.getElementById('time'),
    modalEventVenue = document.getElementById('venue'),
    btnAddToCalendar = document.getElementById('add-event-to-calendar'),
    btnViewSite = document.getElementById('btn-url');

    //Create DOM elements to display on cards & assign textContent to corresponding object properties
    let eventCard = document.createElement("div"),
    eventTitle = document.createElement("div"),
    eventType = document.createElement("div"),
    eventTime = document.createElement("div"),
    eventVenue = document.createElement("div"),
    eventURL = data.url;

    eventTitle.textContent = data.title;
    eventType.textContent = data.type;
    eventTime.textContent = data.datetime_local;
    eventVenue.textContent = data.venue.name;

    //Append elements to card
    eventCard.appendChild(eventTitle);
    eventCard.appendChild(eventType);
    eventCard.appendChild(eventTime);
    eventCard.appendChild(eventVenue);

    //Set card attributes to open corresponding modal
    eventCard.classList.add("card", "modal-trigger");
    eventCard.setAttribute("data-target", "modal4");

    //Set text content for modal on card click
    eventCard.addEventListener('click', () => {
        btnViewSite.setAttribute("href", eventURL);
        modalEventTitle.textContent = "Event Name: " + eventTitle.textContent;
        modalEventType.textContent = "Event Type: " + eventType.textContent;
        modalEventTime.textContent = "Time: " + eventTime.textContent;
        modalEventVenue.textContent = "Venue: " + eventVenue.textContent;
        
        //Open event creation modal and auto-populate with event data for user to verify and adjust
        btnAddToCalendar.addEventListener('click', () => {
            //Change selected date to listed date of the event for automatic & accurate calendar placement
            selectedDate = formatDateTime(eventTime.textContent);
            txtEventName.value = eventTitle.textContent;
            txtEventDescription.value = eventType.textContent;
            txtStartTime.value = eventTime.textContent;
            txtLocation.value = eventVenue.textContent;
        });
    });
    
    eventCard.style.cursor = "pointer";
    //add card to event list
    eventList.appendChild(eventCard);
};


//Only non-nested function call.
setDate();