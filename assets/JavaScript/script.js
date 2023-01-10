// API KEY MzEzNjU0MzZ8MTY3Mjk2NjkyNi4xMTAzMDM
// API KEY MzEzNjU0MzZ8MTY3Mjk2NjkyNi4xMTAzMDM
// API KEY MzEzNjU0MzZ8MTY3Mjk2NjkyNi4xMTAzMDM
// API KEY MzEzNjU0MzZ8MTY3Mjk2NjkyNi4xMTAzMDM
// API KEY MzEzNjU0MzZ8MTY3Mjk2NjkyNi4xMTAzMDM


//let APIKey = '22c381336de0f996a4083c7ecafd3174';

const leftArrow = document.getElementById('left-arrow'),
rightArrow = document.getElementById('right-arrow'),
month = document.getElementById('month'),
calendarTable = document.getElementById('calendar-table'),
btnNewEvent = document.getElementById('create-event'),
eventInput = document.getElementById('txt-new-event'),
btnCitySearch = document.getElementById('city-search'),
txtCitySearch = document.getElementById('txt-search');


//Currently selected calendar day
let selectedDate = '';

btnNewEvent.addEventListener('click', newEvent);

function getCityCoords(city){
    let APIKey = '22c381336de0f996a4083c7ecafd3174';
    let queryCity = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + APIKey;

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
                console.log(data);
            });
        }catch{
            //TODO: Create Modals to inform user of any errors when attempting API call************************************************************************************************************************************
            console.log("failed");
        }  
    });
}


btnCitySearch.addEventListener('click', () => {
    getCityCoords(txtCitySearch.value);
    txtCitySearch.textContent = "";
});

//Function to call bored API
function getBored(){
    try{
        let queryString = 'http://www.boredapi.com/api/activity/';
        fetch(queryString)
        .then(result => {
            console.log(result);
            return result.json();
        })
        .then(data => {
            console.log(data);
        });
    }catch{
    //TODO: Create Modals to inform user of any errors when attempting API call************************************************************************************************************************************
    
    }
}

//function to call seatGeek API


const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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

//Function to wipe out all calendar days. Needed to prevent repeating days popping up every time user moves to a different month
function resetCalendar(){
    const toDelete = document.getElementsByClassName('rows');
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

    //Call resetCalendar to avoid multiples of days in month
    resetCalendar();
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
            //Add event listener to every new cell. Will allow user to select specific day to create and view events.
            newCell.addEventListener('click', () => {
                deselectDays();
                newCell.classList.add('selected');
                //Get all events for this specific cells date
                selectedDate = String(currentMonth + 1).padStart(2, '0') + "/" + newCell.textContent.padStart(2, '0') + "/" + currentYear;
                let eventsForToday = getEventsByDay(selectedDate);

                /**********************************************************TODO***********************************************************************/
                /**********************************************************Replace console logs with Modals for viewing days & their events***********************************************************************/
                /**********************************************************Add visual indicator for days (cells) with scheduled events (Unordered List?)***********************************************************************/
                if(eventsForToday.length == 0){
                    console.log("No Events Scheduled for Today!")
                }else{
                    for(let i = 0; i < eventsForToday.length; i++){
                        console.log("Event " + (i + 1) + ": " + eventsForToday[i].description);
                    }
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
        time: 'TBD',
        description: eventInput.value
    }  
    let currentEvents = localStorage.getItem('events');
    if(currentEvents == null){
        let firstEvent = [eventObj]
        localStorage.setItem('events', JSON.stringify(firstEvent));
    }else{
        eventsList = JSON.parse(localStorage.getItem('events'));
        eventsList.push(eventObj);
        localStorage.setItem('events', JSON.stringify(eventsList));
    }
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

setDate();
