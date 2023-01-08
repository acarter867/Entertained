// API KEY MzEzNjU0MzZ8MTY3Mjk2NjkyNi4xMTAzMDM
// API KEY MzEzNjU0MzZ8MTY3Mjk2NjkyNi4xMTAzMDM
// API KEY MzEzNjU0MzZ8MTY3Mjk2NjkyNi4xMTAzMDM
// API KEY MzEzNjU0MzZ8MTY3Mjk2NjkyNi4xMTAzMDM
// API KEY MzEzNjU0MzZ8MTY3Mjk2NjkyNi4xMTAzMDM

const leftArrow = document.getElementById('left-arrow'),
rightArrow = document.getElementById('right-arrow'),
month = document.getElementById('month'),
calendarTable = document.getElementById('calendar-table'),
btnNewEvent = document.getElementById('create-event'),
eventInput = document.getElementById('txt-new-event');

let selectedDate = '';
btnNewEvent.addEventListener('click', newEvent)

//seatgeek api call
let something = 'https://api.seatgeek.com/2/events?client_id=MzEzNjU0MzZ8MTY3Mjk2NjkyNi4xMTAzMDM'
fetch(something)
.then(result => {
    console.log(result);
    return result.json();
})
.then(data => {
    console.log(data);
});

//bored api call
let queryString = 'http://www.boredapi.com/api/activity/';

//bored api

fetch(queryString)
.then(result => {
    console.log(result);
    return result.json();
})
.then(data => {
    console.log(data);
});
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

//initialization of current month and year
let currentMonth = 0;
let currentYear = 0;

//sets current date
function setDate(){
    let date = new Date();
    currentMonth = date.getMonth();
    currentYear = date.getFullYear();
    month.textContent = months[currentMonth] + " " + currentYear;
    generateCalendar();
}

//go back one month
leftArrow.addEventListener('click', () => {
    generateCalendar('left');
});

//go forward one month
rightArrow.addEventListener('click', () =>{
    generateCalendar('right');
});

//returns number of days in month
function daysInMonth(year, month){
    return new Date(year, month, 0).getDate();
}

//returnbs day of week that a given month starts on 
function firstWeekday(month, year){
    const d = new Date(month + " 1, " + currentYear);
    let day = d.getDay()

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

    //call resetCalendar to avoid multiples of days in month
    resetCalendar();
    let numRows = 0;
    //
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
    month.textContent = months[currentMonth] + " " + currentYear;

    let numDays = daysInMonth(currentYear, currentMonth + 1);
    console.log(numDays);   

    let beginningDay = firstWeekday(months[currentMonth], currentYear);

    for(let i = 0, j = 1; i < numDays + beginningDay; i++){
        if(i < 0 || i % 7 == 0){
           var newRow = document.createElement('tr');
           newRow.setAttribute('id', "row" + i)
           newRow.setAttribute('class', 'rows');
           calendarTable.appendChild(newRow);
        }
        let newCell = document.createElement('td');
        if(i < beginningDay){
            newCell.textContent = " ";
        }else{
            newCell.setAttribute('class', 'has-date')
            newCell.textContent = j;
            newCell.style.border = '1px solid black';
            newCell.addEventListener('click', () => {
                deselectDays();
                newCell.classList.add('selected');
                selectedDate = currentMonth + " " + newCell.textContent + " " + currentYear;
            });
            j++;
            if(currentYear === thisYear && j - 1 === currentDate && thisMonth === currentMonth){
                newCell.classList.add('todays-date')
            }
        }
        newRow.appendChild(newCell);
    }
}

//remove 'selected' class from all calendar days each time a day is selected, so that only one may be selected at a time
function deselectDays(){
    let childDays = calendarTable.children;
    for(let i = 0; i < childDays.length; i++){
        for(let j = 0; j < childDays[i].children.length; j++){
            childDays[i].children[j].classList.remove('selected');
        }
    }
}

//testing for adding new events to calendar
function newEvent(date){
    const eventObj = {
        date: selectedDate,
        time: 'TBD',
        description: eventInput.value
    }

    console.log(eventObj)
}

setDate();
