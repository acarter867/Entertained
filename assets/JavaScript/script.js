// API KEY MzEzNjU0MzZ8MTY3Mjk2NjkyNi4xMTAzMDM

//Open weather map api '22c381336de0f996a4083c7ecafd3174';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const leftArrow = document.getElementById('left-arrow'),
rightArrow = document.getElementById('right-arrow'),
month = document.getElementById('month'),
calendarTable = document.getElementById('calendar-table'),
btnNewEvent = document.getElementById('create-event'),
eventInput = document.getElementById('txt-new-event'),
btnCitySearch = document.getElementById('city-search'),
txtCitySearch = document.getElementById('txt-search'),
btnSubmitEvent = document.getElementById('btn-new-event');
eventList = document.getElementById('event-list'),
btnGenerateRandom = document.getElementById('random-activity'),
txtEventName = document.getElementById('txt-event-name'),
txtEventDescription = document.getElementById('txt-event-description'),
txtStartTime = document.getElementById('txt-start-time'),
txtEndTime = document.getElementById('txt-end-time');
txtLocation = document.getElementById('txt-event-location');

//Currently selected calendar day
let selectedDate = '';

//Prep modal when page is open
document.addEventListener('DOMContentLoaded', function(){
    var modalEls = document.querySelectorAll('.modal');
    var instances = M.Modal.init(modalEls);

    //Force name field as required
    btnSubmitEvent.addEventListener('click', () => {
        if(document.getElementById('txt-event-name').value == ""){
            btnSubmitEvent.classList.remove('modal-close')
            console.log("Error, name field is empty")
        }else{
            //If name field is not empty, add new event to calendar
            btnSubmitEvent.classList.add('modal-close');            
            newEvent();
            let currentCellEvents = getEventsByDay(selectedDate);
            generateDailyEvents(currentCellEvents);
        }
    })
})



//btnNewEvent.addEventListener('click', newEvent);
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
            //Use data from OpenWeatherMap response to pass longitude and latitude data to SeatGeek API
            let something = 'https://api.seatgeek.com/2/events?' + 'lon=' + data[0].lon+ '&' + 'lat=' + data[0].lat +  '&client_id=MzEzNjU0MzZ8MTY3Mjk2NjkyNi4xMTAzMDM'
            fetch(something)
            .then(result => {
                console.log(result.status);
                return result.json();
            })
            .then(data => {
                //Create event card for each event in search result
                for(let i = 0; i < data.events.length; i++){
                    getEventCards(data.events[i])
                };
            });
        }catch{
            console.log("failed");
        }  
    });
}

//Remove events from previously searched cities to avoid clutter and confusion for the user
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
            console.log(result.status);
            return result.json();
        })
        .then(data => {
            //Auto-populate event input fields
            let txtEventName = document.getElementById('txt-event-name'),
            txtEventDescription = document.getElementById('txt-event-description');
            txtEventName.value = "Activity: " + data.activity;
            txtEventDescription.value = "Type: " + data.type;
            //data.avtivity
            //data.type
            
        });
    }catch{
    //TODO: Create Modals to inform user of any errors when attempting API call************************************************************************************************************************************
    console.log("failed");
    }
}

//Generate random activity on user click
btnGenerateRandom.addEventListener('click', () => {
    getBored();
});




//Initialization of current month and year
let currentMonth = 0;
let currentYear = 0;

//Sets current date
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
function removeChildrenByClassName(className){
    const toDelete = document.getElementsByClassName(className);
    while(toDelete.length > 0){
        toDelete[0].parentNode.removeChild(toDelete[0])
    }
}

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
            if(currCellEvents.length !== 0){
                let newDiv = document.createElement('div');
                let redDot = document.createElement('span');
                
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

                /**********************************************************TODO***********************************************************************/
                /**********************************************************Replace console logs with Modals for viewing days & their events***********************************************************************/
                if(currCellEvents.length == 0){
                    console.log("No Events Scheduled for Today!")
                }else{
                    generateDailyEvents(currCellEvents);
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

function generateDailyEvents(currCellEvents){
    for(let i = 0; i < currCellEvents.length; i++){
        let eventModal = document.getElementById('event-modal');
        eventModal.appendChild(getEventCard(currCellEvents[i]));
    }
}

//Create & style event card for each daily event
function getEventCard(event){
    let card = document.createElement('div');    
    eventName = document.createElement('span')
    eventDescription = document.createElement('p'),
    eventDate = document.createElement('p'),
    eventLocation = document.createElement('p'),
    eventTime = document.createElement('p');
    //Set text content for daily event cards
    eventName.textContent = event.name;
    eventDescription.textContent = event.description;
    eventDate.textContent = event.date;
    eventLocation.textContent = event.location;
    eventTime.textContent = event.startTime + "-" + event.endTime;

    //Append daily event card elements to card 
    card.appendChild(eventName);
    card.appendChild(eventDescription);
    card.appendChild(eventDate);
    card.appendChild(eventLocation);
    card.appendChild(eventTime);

    eventName.classList.add('card-title')
    card.classList.add('card', 'blue-grey', 'card-content');
    return card;
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
    //Create oject with event details. More properties can be added as needed.
    const eventObj = {
        date: selectedDate,
        name: txtEventName.value,
        startTime: (txtStartTime.value != "") ? txtStartTime.value : 'N/A',
        endTime: (txtEndTime.value != "") ? txtEndTime.value : 'N/A',
        description: (txtEventDescription.value != "") ? txtEventDescription.value : 'N/A',
        location: (txtLocation.value != "") ? txtLocation.value : 'N/A',

    }  
    let currentEvents = localStorage.getItem('events');

    //If there's nothing in currentEvents, we need an initial entry
    if(currentEvents == null){
        let firstEvent = [eventObj]
        localStorage.setItem('events', JSON.stringify(firstEvent));
    }else{
        eventsList = JSON.parse(localStorage.getItem('events'));
        eventsList.push(eventObj);
        localStorage.setItem('events', JSON.stringify(eventsList));
    }

    //Reset event input values
    txtEventName.value = '';
    txtEventDescription.value = '';
    txtStartTime.value = '';
    txtEndTime.value = '';
    txtLocation.value = '';

    //Reset calendar to update status icon (red dot)
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



//Create and append event cards to event list
function getEventCards(data){
    //
    let modalEventTitle = document.getElementById('event-title'),
    modalEventType = document.getElementById('type'),
    modalEventTime = document.getElementById('time'),
    modalEventVenue = document.getElementById('venue'),
    btnAddToCalendar = document.getElementById('add-event-to-calendar'),
    btnViewSite = document.getElementById('btn-url');

    //Create card elements for display
    let eventCard = document.createElement("div");
    let eventTitle = document.createElement("div");
    let eventType = document.createElement("div");
    let eventTime = document.createElement("div");
    let eventVenue = document.createElement("div");
    let eventURL = data.url;

    //SeatGeek event modal fields
    eventTitle.textContent = data.title;
    eventType.textContent = data.type;
    eventTime.textContent = data.datetime_local;
    eventVenue.textContent = data.venue.name;

    //Append elements to card for display
    eventCard.appendChild(eventTitle);
    eventCard.appendChild(eventType);
    eventCard.appendChild(eventTime);
    eventCard.appendChild(eventVenue);

   
    eventCard.classList.add("card", "modal-trigger");
    eventCard.addEventListener('click', () => {
        btnViewSite.setAttribute("href", eventURL);
        modalEventTitle.textContent = "Event Name: " + eventTitle.textContent;
        modalEventType.textContent = "Event Type: " + eventType.textContent;
        modalEventTime.textContent = "Time: " + eventTime.textContent;
        modalEventVenue.textContent = "Venue: " + eventVenue.textContent;
        
        //Event listener to auto-populate event entry
        btnAddToCalendar.addEventListener('click', () => {
            //Add event info per-modal
            selectedDate = formatDateTime(eventTime.textContent);
            let txtEventName = document.getElementById('txt-event-name'),
            txtEventDescription = document.getElementById('txt-event-description'),
            txtStartTime = document.getElementById('txt-start-time'),
            txtLocation = document.getElementById('txt-event-location');

            //Set text values for elements
            txtEventName.value = eventTitle.textContent;
            txtEventDescription.value = eventType.textContent;
            txtStartTime.value = eventTime.textContent;
            txtLocation.value = eventVenue.textContent;
        });
    });

    //Set card to open modal to display selected event
    eventCard.setAttribute("data-target", "modal4");
    eventCard.style.cursor = "pointer";

    //Append children to event list div
    eventList.appendChild(eventCard);
};

//Separate time from date in SeatGeek API response to aid in auto-population ******************* SEATGEEK FORMAT EX: 2023-01-18T20:30:00 *************************
function formatDateTime(dateTime){
    let splitDate = dateTime.split('-');
    let dd = splitDate[2].substring(0,2);

    let yyyy = splitDate[0];
    let mm = splitDate[1];

    let formattedDate = mm + "/" + dd + "/" + yyyy;
    return formattedDate;
}

/**Only non-nested function call**/
setDate();