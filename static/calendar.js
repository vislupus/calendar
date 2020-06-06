function today() {
    let all = document.querySelectorAll('.grid-calendar-day');

    for (let t = 0; t < all.length; t += 1) {

        // Add holidays
        for (let n = 0; n < dom.holidays.length; n += 1) {
            if (all[t].getAttribute('data-day') == dom.holidays[n].day && all[t].getAttribute('data-month') == dom.holidays[n].month) {
                if (all[t].getAttribute('data-day') == 24 && all[t].getAttribute('data-month') == 12 && all[t].getAttribute('data-week') == 6) {
                    all[t + 3].setAttribute("data-event", "holiday");
                    all[t + 3].style.backgroundColor = 'var(--holiday-color)';
                    all[t + 4].setAttribute("data-event", "holiday");
                    all[t + 4].style.backgroundColor = 'var(--holiday-color)';
                } else if (all[t].getAttribute('data-day') == 24 && all[t].getAttribute('data-month') == 12 && all[t].getAttribute('data-week') == 7) {
                    all[t + 3].setAttribute("data-event", "holiday");
                    all[t + 3].style.backgroundColor = 'var(--holiday-color)';
                } else if (all[t].getAttribute('data-day') == 25 && all[t].getAttribute('data-month') == 12 && all[t].getAttribute('data-week') == 6) {
                    all[t + 3].setAttribute("data-event", "holiday");
                    all[t + 3].style.backgroundColor = 'var(--holiday-color)';
                } else if (all[t].getAttribute('data-week') == 6) {
                    all[t + 2].setAttribute("data-event", "holiday");
                    all[t + 2].style.backgroundColor = 'var(--holiday-color)';
                } else if (all[t].getAttribute('data-week') == 7) {
                    all[t + 1].setAttribute("data-event", "holiday");
                    all[t + 1].style.backgroundColor = 'var(--holiday-color)';
                } else {
                    all[t].setAttribute("data-event", "holiday");
                    all[t].style.backgroundColor = 'var(--holiday-color)';
                }
            }

            // Easter
            if (all[t].getAttribute('data-day') == easter(dom.year).day && all[t].getAttribute('data-month') == easter(dom.year).month) {
                if (easter(dom.year).day == 1) {
                    for (let v = 0; v < all.length; v += 1) {
                        // 01.05 -> 29.04
                        if (all[v].getAttribute('data-day') == 29 && all[v].getAttribute('data-month') == 4) {
                            all[v].setAttribute("data-event", "holiday");
                            all[v].style.backgroundColor = 'var(--holiday-color)';
                        }

                        // 01.05 -> 03.05
                        if (all[v].getAttribute('data-day') == 3 && all[v].getAttribute('data-month') == 5) {
                            all[v].setAttribute("data-event", "holiday");
                            all[v].style.backgroundColor = 'var(--holiday-color)';
                        }
                    }
                } else if (easter(dom.year).day == 2) {
                    for (let v = 0; v < all.length; v += 1) {
                        // 02.05 -> 30.04
                        if (all[v].getAttribute('data-day') == 30 && all[v].getAttribute('data-month') == 4) {
                            all[v].setAttribute("data-event", "holiday");
                            all[v].style.backgroundColor = 'var(--holiday-color)';
                        }

                        // 02.05 -> 04.05
                        if (all[v].getAttribute('data-day') == 4 && all[v].getAttribute('data-month') == 5) {
                            all[v].setAttribute("data-event", "holiday");
                            all[v].style.backgroundColor = 'var(--holiday-color)';
                        }
                    }
                } else if (easter(dom.year).day == 29) {
                    for (let v = 0; v < all.length; v += 1) {
                        // 29.04 -> 27.04
                        if (all[v].getAttribute('data-day') == 27 && all[v].getAttribute('data-month') == 4) {
                            all[v].setAttribute("data-event", "holiday");
                            all[v].style.backgroundColor = 'var(--holiday-color)';
                        }

                        // 29.04 -> 30.04
                        if (all[v].getAttribute('data-day') == 30 && all[v].getAttribute('data-month') == 4) {
                            all[v].setAttribute("data-event", "holiday");
                            all[v].style.backgroundColor = 'var(--holiday-color)';
                        }
                    }
                } else if (easter(dom.year).day == 30) {
                    for (let v = 0; v < all.length; v += 1) {
                        // 30.04 -> 28.04
                        if (all[v].getAttribute('data-day') == 28 && all[v].getAttribute('data-month') == 4) {
                            all[v].setAttribute("data-event", "holiday");
                            all[v].style.backgroundColor = 'var(--holiday-color)';
                        }
                    }
                } else {
                    all[t + 1].setAttribute("data-event", "holiday");
                    all[t + 1].style.backgroundColor = 'var(--holiday-color)';

                    all[t - 2].setAttribute("data-event", "holiday");
                    all[t - 2].style.backgroundColor = 'var(--holiday-color)';
                }
            }
        }

        // Add vacation
        for (let n = 0; n < dom.vacation.length; n += 1) {
            if (all[t].getAttribute('data-day') == dom.vacation[n].day && all[t].getAttribute('data-month') == dom.vacation[n].month && dom.vacation[n].year == dom.year) {
                all[t].insertAdjacentHTML('afterbegin', `<div class="icon-vacation"></div>`);
            }
        }

        // Add today
        if (all[t].getAttribute('data-month') == dom.today.getMonth() + 1 && all[t].getAttribute('data-day') == dom.today.getDate() && dom.year == dom.today.getFullYear()) {
            all[t].style.backgroundColor = 'var(--today-color)';
        }


        // Add events
        addEvent(all[t]);
    }
}

function calcCalendar() {
    document.querySelector('#year').textContent = dom.year;

    // calculate if it's leap year
    calcLeapYear(dom.year);

    for (let m = 0; m < 12; m += 1) {
        calcMonth(dom.year, m);

        dom.days = [];

        dom.html = `<div class="grid-calendar">
                                <div class="grid-calendar-title">${dom.months[m]}</div>
                                ${dom.htmlWeek}
                                ${dom.htmlDay}
                            </div>`;

        document.querySelectorAll('.grid-item')[m + 3].innerHTML = dom.html;
    }

    today();
}

function calcLeapYear(year) {
    if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
        // console.log(year + ': leap year')
        dom.daysInMonth[1] = 29;
    } else {
        // console.log(year + ': common year')
        dom.daysInMonth[1] = 28;
    }
}

function calcMonth(year, month) {
    let length = 35;
    let first = calcDayWeek(year, month, 1);
    let last = calcDayWeek(year, month, dom.daysInMonth[month]);

    dom.htmlDay = ``;

    if ((first - 1) + dom.daysInMonth[month] > 35) {
        let sixthRow = ((first - 1) + dom.daysInMonth[month]) - 35;

        for (let d = 0; d < first - 1; d += 1) {
            dom.days.push(0)
        }

        for (let d = 1; d < (dom.daysInMonth[month] + 1) - sixthRow; d += 1) {
            dom.days.push(d)
        }

        for (let d = 1; d < sixthRow + 1; d += 1) {
            dom.days[d - 1] = dom.days[dom.days.length - 1] + d;
        }

        for (let d = 0; d < dom.days.length; d += 1) {
            if (dom.days[d] == 0) {
                dom.htmlDay += `<div class="grid-calendar-day" data-week="0" data-day="0" data-month="${month+1}"></div>`;
            } else {
                dom.htmlDay += `<div class="grid-calendar-day" data-week="${calcDayWeek(year, month, dom.days[d])}" data-day="${dom.days[d]}" data-month="${month+1}" onclick="openForm(this)">${dom.days[d]}<div class="icon-container"></div></div>`;
            }
        }
    } else {
        for (let d = 0; d < first - 1; d += 1) {
            dom.htmlDay += `<div class="grid-calendar-day" data-week="0" data-day="0" data-month="${month+1}"></div>`;
        }

        for (let d = 1; d < dom.daysInMonth[month] + 1; d += 1) {
            dom.htmlDay += `<div class="grid-calendar-day" data-week="${calcDayWeek(year, month, d)}" data-day="${d}" data-month="${month+1}" onclick="openForm(this)">${d}<div class="icon-container"></div></div>`;
        }

        length -= first - 1;

        for (let d = dom.daysInMonth[month]; d < length; d += 1) {
            dom.htmlDay += `<div class="grid-calendar-day" data-week="0" data-day="0" data-month="${month+1}"></div>`;
        }
    }
}

function calcDayWeek(year, month, day) {
    let dayWeek = new Date(year, month, day).getDay()

    if (dayWeek == 0) {
        dayWeek = 7;
    }

    return dayWeek;
}

function easter(y) {
    d = (19 * (y % 19) + 15) % 30;
    x = d + (2 * (y % 4) + 4 * (y % 7) - d + 34) % 7 + 114;
    m = ~~(x / 31);
    d = x % 31 + 1;
    if (y > 1899 && y < 2100) {
        d += 13;
        if (m == 3 && d > 31) {
            d -= 31;
            m++
        }
        if (m == 4 && d > 30) {
            d -= 30;
            m++
        }
    }
    return {
        day: d,
        month: m,
        year: y
    };
}

function changeYear(n) {
    dom.year += n;
    document.querySelector('#year').textContent = dom.year;

    calcCalendar();
}