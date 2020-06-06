var dom = {
    weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    holidays: [{
        day: 1,
        month: 1
    }, {
        day: 3,
        month: 3
    }, {
        day: 1,
        month: 5
    }, {
        day: 6,
        month: 5
    }, {
        day: 24,
        month: 5
    }, {
        day: 6,
        month: 9
    }, {
        day: 22,
        month: 9
    }, {
        day: 24,
        month: 12
    }, {
        day: 25,
        month: 12
    }, {
        day: 26,
        month: 12
    }],
    days: [],
    htmlWeek: ``,
    htmlRecords: ``,
    form: false,
    today: new Date(),
    vacation: [],
    events: [],
};


(async function () {
    //    get data for vacations from json
    await ajax_get_promise('/api/get_vacation_data', function (data) {
        dom.vacation = data;
    });

    //    get data for events from json
    await ajax_get_promise('/api/get_events_data', function (data) {
        dom.events = data;
    });

    dom.year = dom.today.getFullYear();

    // add labels for day of the week
    for (let w = 0; w < 7; w += 1) {
        dom.htmlWeek += `<div class="grid-calendar-week">${dom.weekdays[w]}</div>`;
    }

    // Generate calendar
    calcCalendar();
})();

function addEvent(id) {
    dom.htmlEvent = `<div class="icon-event"></div>`;

    for (let n = 0; n < dom.events.length; n += 1) {
        if (id.getAttribute('data-day') == dom.events[n].day && id.getAttribute('data-month') == dom.events[n].month && dom.events[n].year == dom.year) {
            id.querySelector('.icon-container').insertAdjacentHTML('afterbegin', dom.htmlEvent);
            id.querySelector('.icon-container').querySelector('.icon-event').style.backgroundColor = dom.events[n].color;
        }
    }
}

function previousColor(id) {
    if (id.getAttribute('data-week') == 6 || id.getAttribute('data-week') == 7) {
        id.style.backgroundColor = 'var(--weekend-color)';
    } else if (id.getAttribute('data-event') == 'holiday') {
        id.style.backgroundColor = 'var(--holiday-color)';
    } else {
        id.style.backgroundColor = 'var(--container-color)';
    }
}

function openForm(id) {
    dom.eventDay = id;

    if (!dom.form) {
        dom.p = id;
        dom.form = true;
    } else {
        previousColor(dom.p);

        dom.p = id;
    }

    id.style.backgroundColor = 'var(--select-color)';

    document.getElementById('add-button').style.display = "block";
    document.getElementById('edit-button').style.display = "none";
    document.getElementById('add-text').value = '';
    document.getElementById('add-color').value = '#ff00ff';
    positionForm(id);

    console.log(id.getAttribute('data-week'))
    console.log(id.getAttribute('data-event'))

    if (id.getAttribute('data-week') == 6 || id.getAttribute('data-week') == 7 || id.getAttribute('data-event') == 'holiday') {
        document.getElementById('add-vacation').disabled = true;
    } else {
        document.getElementById('add-vacation').disabled = false;
    }

    document.getElementById('add-vacation').checked = false;
    dom.vacationN = null;
    for (let n = 0; n < dom.vacation.length; n += 1) {
        if (id.getAttribute('data-day') == dom.vacation[n].day && id.getAttribute('data-month') == dom.vacation[n].month && dom.vacation[n].year == dom.year) {
            dom.vacationN = n;
            document.getElementById('add-vacation').checked = true;
        }
    }
}

function exitForm() {
    document.getElementById('add-form').style.display = 'none';
    document.getElementById('add-text').style.border = '0.1vw solid #ccc';
    document.getElementById('add-text').value = '';
    document.getElementById('add-color').value = '#ff00ff';

    removeRecordSelect();

    previousColor(dom.eventDay);
}

async function vacation() {
    if (dom.vacationN == null) {
        if (dom.eventDay.getAttribute('data-week') != 6 && dom.eventDay.getAttribute('data-week') != 7 && dom.eventDay.getAttribute('data-event') != 'holiday') {
            let data = JSON.stringify({
                day: parseInt(dom.eventDay.getAttribute('data-day')),
                month: parseInt(dom.eventDay.getAttribute('data-month')),
                year: parseInt(dom.year)
            });

            await ajax_post('/api/add_vacation_data', data, function (data_json) {
                //                console.log(data_json)
                dom.vacation = data_json;
            });

            dom.eventDay.insertAdjacentHTML('afterbegin', `<div class="icon-vacation"></div>`);

            dom.vacationN = dom.vacation.length - 1;
        }
    } else {
        await ajax_post('/api/remove_vacation_data', JSON.stringify(dom.vacation[dom.vacationN]), function (data_json) {
            //                console.log(data_json)
            dom.vacation = data_json;
        });

        dom.eventDay.querySelector('.icon-vacation').remove();
        dom.vacationN = null;
    }
}

function positionForm(id) {
    addRecord(id);

    document.getElementById('add-form').style.display = 'block';

    if (id.getBoundingClientRect().top > window.innerHeight * 0.8) {
        document.getElementById('add-form').style.marginTop = id.getBoundingClientRect().bottom - document.getElementById('add-form').getBoundingClientRect().height + 10 + 'px';
    } else {
        document.getElementById('add-form').style.marginTop = id.getBoundingClientRect().top - 15 + 'px';
    }

    if (id.getBoundingClientRect().left > window.innerWidth * 0.75) {
        document.getElementById('add-form').style.marginLeft = id.getBoundingClientRect().left - document.getElementById('add-form').getBoundingClientRect().width - 10 + 'px';
    } else {
        document.getElementById('add-form').style.marginLeft = id.getBoundingClientRect().left + id.getBoundingClientRect().width + 5 + 'px';
    }
}

async function addButton() {
    if (document.getElementById('add-text').value == '') {
        document.getElementById('add-text').style.border = '0.1vw solid red';
    } else {
        let text = document.getElementById('add-text').value;
        let color = document.getElementById('add-color').value;

        let data = JSON.stringify({
            day: parseInt(dom.eventDay.getAttribute('data-day')),
            month: parseInt(dom.eventDay.getAttribute('data-month')),
            year: parseInt(dom.year),
            text: text,
            color: color
        });

        await ajax_post('/api/add_events_data', data, function (data_json) {
            //            console.log(data_json)
            dom.events = data_json;
        });

        dom.eventDay.querySelector('.icon-container').insertAdjacentHTML('afterbegin', dom.htmlEvent);
        dom.eventDay.querySelector('.icon-container').querySelector('.icon-event').style.backgroundColor = color;

        exitForm();
    }
}

function addRecord(id) {
    for (let n = 0; n < dom.events.length; n += 1) {
        if (id.getAttribute('data-day') == dom.events[n].day && id.getAttribute('data-month') == dom.events[n].month && dom.events[n].year == dom.year) {
            dom.htmlRecord = `<div class="group-record" onclick="editRecord(this, ${n})">
                                <div class="color-record" style="background-color:${dom.events[n].color}"></div>
                                <div class="text-record">${dom.events[n].text}</div>
                                <svg class="delete-button-record" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" onclick="removeRecord(${n})">
                                    <path d="M 10.3125 -0.03125 C 8.589844 -0.03125 7.164063 1.316406 7 3 L 2 3 L 2 5 L 6.96875 5 L 6.96875 5.03125 L 17.03125 5.03125 L 17.03125 5 L 22 5 L 22 3 L 17 3 C 16.84375 1.316406 15.484375 -0.03125 13.8125 -0.03125 Z M 10.3125 2.03125 L 13.8125 2.03125 C 14.320313 2.03125 14.695313 2.429688 14.84375 2.96875 L 9.15625 2.96875 C 9.296875 2.429688 9.6875 2.03125 10.3125 2.03125 Z M 4 6 L 4 22.5 C 4 23.300781 4.699219 24 5.5 24 L 18.59375 24 C 19.394531 24 20.09375 23.300781 20.09375 22.5 L 20.09375 6 Z M 7 9 L 8 9 L 8 22 L 7 22 Z M 10 9 L 11 9 L 11 22 L 10 22 Z M 13 9 L 14 9 L 14 22 L 13 22 Z M 16 9 L 17 9 L 17 22 L 16 22 Z" />
                                </svg>
                            </div>`;

            dom.htmlRecords += dom.htmlRecord;
        }
    }

    document.getElementById('records').innerHTML = dom.htmlRecords;
    dom.htmlRecords = '';
}

function removeRecordSelect() {
    for (let i = 0; i < document.querySelectorAll('.group-record').length; i += 1) {
        document.querySelectorAll('.group-record')[i].classList.remove("select-record");
    }
}

function editRecord(id, n) {
    dom.eventN = n;

    id.classList.toggle("select-record");
    if (document.querySelectorAll('.select-record').length > 1) {
        removeRecordSelect();

        id.classList.toggle("select-record");
    }

    document.getElementById('add-button').style.display = "none";
    document.getElementById('edit-button').style.display = "block";

    document.getElementById('add-text').value = dom.events[n].text;
    document.getElementById('add-color').value = dom.events[n].color;
}

function editButton() {
    removeRecordSelect();

    document.getElementById('add-button').style.display = "block";
    document.getElementById('edit-button').style.display = "none";

    dom.events[dom.eventN].text = document.getElementById('add-text').value;
    dom.events[dom.eventN].color = document.getElementById('add-color').value;

    let data = JSON.stringify({
        n: dom.eventN,
        text: document.getElementById('add-text').value,
        color: document.getElementById('add-color').value
    });

    ajax_post('/api/edit_events_data', data, function (data_json) {
        //        console.log(data_json)
        dom.events = data_json;
    });

    document.getElementById('add-text').value = '';
    document.getElementById('add-color').value = '#ff00ff';

    addRecord(dom.eventDay);
    dom.eventDay.querySelector('.icon-container').innerHTML = "";
    addEvent(dom.eventDay);
}

async function removeRecord(rec) {
    event.stopPropagation();

    ajax_post('/api/remove_events_data', JSON.stringify(dom.events[rec]), function (data_json) {
        //        console.log(data_json)
        dom.events = data_json;

        addRecord(dom.eventDay);
        dom.eventDay.querySelector('.icon-container').innerHTML = "";
        addEvent(dom.eventDay);
    });
}
