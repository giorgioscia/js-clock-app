let mode = 'NEW';
let startButtonEl;
let resetButtonEl;
let clockEl;
let hoursInputEl;
let minutesInputEl;
let secondsInputEl;
let interval;
let timerStartDuration;
let runningDuration;

function timerStartPauseClick() {
    getTimerElements();

    if (mode === 'NEW') {
        timerTidyInputs();
        mode = 'RUNNING';
        resetButtonEl.disabled = true;
        startButtonEl.innerHTML = 'Pause';
        timerStartDuration = moment.duration(
            ((hoursInputEl.value * 60 * 60) + (minutesInputEl.value * 60) + (secondsInputEl.value * 1)) * 1000
        );
        runningDuration = timerStartDuration.clone();
        timerStart();
    } else if (mode === 'RUNNING') {
        mode = 'PAUSED';
        resetButtonEl.disabled = false;
        startButtonEl.innerHTML = 'Resume';
        timerPause();
    } else if (mode === 'PAUSED') {
        mode = 'RUNNING';
        resetButtonEl.disabled = true;
        startButtonEl.innerHTML = 'Pause';
        timerStart();
    }
}

function timerTidyInputs() {
    let duration = moment.duration(
        ((Math.abs(hoursInputEl.value) * 60 * 60) + (Math.abs(minutesInputEl.value) * 60) + (Math.abs(secondsInputEl.value * 1))) * 1000
    );

    let hours = Math.floor(duration.asHours());

    hoursInputEl.value = hours > 99 ? 99 : hours;
    minutesInputEl.value = duration.minutes();
    secondsInputEl.value = duration.seconds();
}

function timerStart() {
    setTimer(runningDuration);

    interval = setInterval(() => {
        if (runningDuration.asMilliseconds() > 0) {
            runningDuration = runningDuration.subtract(1000);
            setTimer(runningDuration);
        } 
        
        if (runningDuration.asMilliseconds() <= 0) { // not else-if as don't want to wait another second after hitting zero to reset
            timerReset();
        }
    }, 1000);
}

function timerPause() {
    clearInterval(interval);
}

function getTimerElements() {
    if (!startButtonEl) startButtonEl = document.getElementById("timer-start-button");
    if (!resetButtonEl) resetButtonEl = document.getElementById("timer-reset-button");
    if (!clockEl) clockEl = document.getElementById("timer-clock");
    if (!hoursInputEl) hoursInputEl = document.getElementById("hours-input");
    if (!minutesInputEl) minutesInputEl = document.getElementById("minutes-input");
    if (!secondsInputEl) secondsInputEl = document.getElementById("seconds-input");
}

function setTimer(duration) {
    if (duration) {
        let hourString = `${Math.floor(duration.asHours())}`.padStart(2, '0');
        let minutesString = `${duration.minutes()}`.padStart(2, '0');
        let secondsString = `${duration.seconds()}`.padStart(2, '0');

        clockEl.innerHTML = `${hourString}:${minutesString}:${secondsString}`;
    }
}

function timerReset() {
    getTimerElements();
    clearInterval(interval);
    mode = 'NEW';
    startButtonEl.innerHTML = 'Start';
    resetButtonEl.disabled = true;
}