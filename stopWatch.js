"use strict";
// src: https://stackoverflow.com/a/56746381
(function(root){

    let stopWatch = root.stopWatch = {};
    let interval;

    // holds incrementing value
    let sec = 0;
    let min = 0;
    let hour = 0;

    // Contains and outputs returned value of  function checkTime
    let secOut = 0;
    let minOut = 0;
    let hourOut = 0;

    // holds elements to update
    let secElem = null;
    let minElem = null;
    let hElem = null;

    // Start
    stopWatch.start = function (_secElem,_minElem,_hElem) {
        // if interval, clear
        if(interval)
            clearInterval(interval);
        secElem = _secElem;
        minElem = _minElem;
        hElem = _hElem;
        interval = setInterval(timer, 1000);
    }

    // Stop
    stopWatch.stop = function () {
        clearInterval(interval);
    }

    function timer() {
        /* Main Timer */

        secOut = checkTime(sec);
        minOut = checkTime(min);
        hourOut = checkTime(hour);

        sec = ++sec;

        if (sec == 60) {
            min = ++min;
            sec = 0;
        }

        if (min == 60) {
            min = 0;
            hour = ++hour;

        }

        update(secOut,minOut,hourOut);
    }
    // Adds 0 when value is <10 
    function checkTime(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
    // Reset
    stopWatch.reset = function () {
      
        sec = 0;
        min = 0
        hour = 0;
      
        update("00","00","00")      
    }
    // update watch
    function update(sec,min,h){

        if(secElem !== null)
            secElem.innerHTML = sec;

        if(minElem !== null)
            minElem.innerHTML = min;

        if(hElem !== null)
            hElem.innerHTML = h;
    }
})(this)