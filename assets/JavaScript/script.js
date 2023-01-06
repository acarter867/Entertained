// API KEY MzEzNjU0MzZ8MTY3Mjk2NjkyNi4xMTAzMDM
// API KEY MzEzNjU0MzZ8MTY3Mjk2NjkyNi4xMTAzMDM
// API KEY MzEzNjU0MzZ8MTY3Mjk2NjkyNi4xMTAzMDM
// API KEY MzEzNjU0MzZ8MTY3Mjk2NjkyNi4xMTAzMDM
// API KEY MzEzNjU0MzZ8MTY3Mjk2NjkyNi4xMTAzMDM







const leftArrow = document.getElementById('left-arrow'),
rightArrow = document.getElementById('right-arrow'),
month = document.getElementById('month'),
calendarTable = document.getElementById('calendar-table');


let something = 'https://api.seatgeek.com/2/events?client_id=MzEzNjU0MzZ8MTY3Mjk2NjkyNi4xMTAzMDM'

fetch(something)
.then(result => {
    console.log(result);
    return result.json();
})
.then(data => {
    console.log(data);
})


//seatgeek
let queryString = 'http://www.boredapi.com/api/activity/';

//bored api

fetch(queryString)
.then(result => {
    console.log(result);
    return result.json();
})
.then(data => {
    console.log(data);
})


const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

let currentMonth = 0;
let currentYear = 0;


function setDate(){
    let date = new Date();
    currentMonth = date.getMonth();
    currentYear = date.getFullYear();
    month.textContent = months[currentMonth] + " " + currentYear;
    generateCalendar();
}

leftArrow.addEventListener('click', () => {
    generateCalendar('left');
});

rightArrow.addEventListener('click', () =>{
    generateCalendar('right');
});

function daysInMonth(year, month){
    return new Date(year, month, 0).getDate();
}

function firstWeekday(month, year){
    const d = new Date(month + " 1, " + currentYear);
    let day = d.getDay()

    return day;
}

function resetCalendar(parent){
    const toDelete = document.getElementsByClassName('rows');
    while(toDelete.length > 0){
        toDelete[0].parentNode.removeChild(toDelete[0])
    }
}

function generateCalendar(direction){
    let today = new Date();
    let thisYear = today.getFullYear();
    let thisMonth = today.getMonth();
    let currentDate = today.getDate();


    resetCalendar();
    let numRows = 0;

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
            newCell.textContent = j;
            newCell.style.border = '1px solid black';
            j++;
            if(currentYear === thisYear && j - 1 === currentDate && thisMonth === currentMonth){
                newCell.classList = 'todays-date'
            }
        }
        newRow.appendChild(newCell);
    }
}

setDate();
