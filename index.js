const inquirer = require('inquirer')
const notionAPI = require('./services/notion')

const months = {
    'January' : '01',
    'February' : '02',
    'March' : '03',
    'April' : '04',
    'May' : '05',
    'June' : '06',
    'July' : '07',
    'August' : '08',
    'September' : '09',
    'October' : '10',
    'November' : '11',
    'December' : '12'
}

const monthNames = Object.keys(months);

const years = getFutureYears();


const promptUser = () => {
    return inquirer.prompt([
        {
            type: 'list',
            message: 'What MONTH would you like to generate entries for?',
            name: 'monthName',
            choices: monthNames
        },
        {
            type: 'list',
            message: 'What YEAR would you like to generate entries for?',
            name: 'year',
            choices: years,
        },
    ])
}

const generateEntries = (answers) => {
    console.log("Generating entries...")
    let entries = [];
    let monthName = answers.monthName;
    let year = answers.year;

    let numberOfDays = getDaysInMonth(monthName, year);

    for (let index = 1; index <= numberOfDays; index++) {
        let entry = {};
        let dayString;

        entry.dateName = `${monthName} ${getOrdinalSuffix(index)}, ${year}`

        if(index<10){
            dayString = "0"+index;
        }else{
            dayString = String(index);
        }

        entry.date = `${year}-${months[monthName]}-${dayString}`;

        entries.push(entry);
    }

    return entries;
}

/**
 * @param {int} month The month number, **0 based**
 * @param {int} year The year, not zero based, required to account for leap years
 * @return {Date[]} List with date objects for each day of the month
 */
function getDaysInMonth(month, year) {

    let date = new Date(year, Number(months[month]-1));
    let days = 0;

    while (date.getMonth() === Number(months[month]-1)) {
      days++;
      date.setDate(date.getDate() + 1);
    }

    return days;
}

function getFutureYears() {
    let currentYear = Number(new Date(Date.now()).getFullYear());
    const numberOfFutureYears = 5; //Can adjust to generate additional future years

    let futureYears = [];

    for (let index = 0; index < numberOfFutureYears; index++) {
        futureYears.push(String(currentYear + index));   
    }

    return futureYears;
}

function getOrdinalSuffix(i) {
    let j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

const init = () => {
    promptUser()
    .then(
        (answers) => { 
            return generateEntries(answers); 
        }
    )
    .then(
        (entries) => {
            console.log("Adding entries to database...")
            entries.forEach(entry => {
                notionAPI.createEntry(entry);
            });
        }
    )
    
}

init();
