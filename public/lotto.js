//var lottoMachine = new Worker ("worker.js");  
var lottoMachine = new Worker(URL.createObjectURL(new Blob(["("+worker_function.toString()+")()"], {type: 'text/javascript'})));

var workerMessage = {
    HowManyTimes: 0,
    mySix: [],
    timerSetFor: 0,
    stop: false,
};

var workerFinished = false;
var workerFound = 0;
var workerCounter = 0;

var timer = {
    seconds: 0,
    minutes: 0,
    hours: 0,
    remainder: 0,
}
var secondsCounter = 0;
var timeLeft = 0;


var my6 = [];

var arr = [];
var alertValidation = '';
var numbersValidated = false;
var numberOfTimesValidated = false;
var timerValidated = false;
var outputToPrint = '';

var text_computing = 'Stay tuned!<br> Computing....'
var text_finished = '<br>Finished.'

//- - - - - - - - - - - HTML Edition - - - - - - - - - - - - - -
//--------------------------------------------------------------
var timerLaunched = "<p id=\'hours\' ></p><p>h</p><p id=\'minutes\'></p><p>m</p><p id=\'seconds\'></p><p>s</p>"

function elementsTurnedHidden () {
    document.querySelector('#number-of-times').style.visibility ='hidden';
    document.querySelector('#or').style.visibility ='hidden';
    document.querySelector('#set').style.visibility ='hidden';
    document.querySelector('#how-many').style.visibility ='hidden';
};//hides the text when computing

//- - - - - - - - - - - Input Fields - - - - - - - - - - - - - -
//--------------------------------------------------------------

var inputField1 = document.getElementById('number_1');
var inputField2 = document.getElementById('number_2');
var inputField3 = document.getElementById('number_3');
var inputField4 = document.getElementById('number_4');
var inputField5 = document.getElementById('number_5');
var inputField6 = document.getElementById('number_6');
var my6inputFields = [inputField1, inputField2, inputField3, inputField4, inputField5, inputField6];

var inputFieldHowManyTimes = document.getElementById('how-many');

var timerElements =  document.querySelector('#timer-elements')
var inputFieldHours = document.querySelector('#hours');
var inputFieldMinutes = document.querySelector('#minutes');
var inputFieldSeconds = document.querySelector('#seconds');

var launchButton = document.getElementById('launch-worker');
var refreshButton = document.getElementById('refresh');

//- - - - - - - - - Communication Functions- - - - - - - - - - - 
//--------------------------------------------------------------

function replaceHTML(divIdName, content) {    
    document.getElementById(divIdName).innerHTML = content;
    }

function placeToDiv(divIdName, outputToPrint) {    
    document.getElementById(divIdName).innerHTML = outputToPrint;
    }
function printAlert() {
    document.getElementById('validation-alerts').style.fontStyle = 'bold';
    placeToDiv('validation-alerts', alertValidation);
    
}
function clearAlert() {
    alertValidation = '';
    placeToDiv('validation-alerts', '');
}//clears both the variable and html

//- - - - - - - - - Navigation Functions- - - - - - - - - - - -
//-------------------------------------------------------------
function getAllSiblings(elem, exclude) {
    var siblings = [];
    elem = elem.parentNode.firstChild;
    do { 
        if (elem.nodeType === 3) {continue}; //text node
        if (elem !== exclude) siblings.push(elem)} 
    while (elem = elem.nextSibling); //when elem.nextSibling is the last one it equals to null
    return siblings; 
}
function goToNextSibling(elem) { //jumps from active element to next sibling element
    var next = elem.nextElementSibling;
    if ( next === null ) {return 'last' ; };// if it's the last element
    return next.focus(); 
};
function buttonOnOff (buttonId) {
    if (document.getElementById(buttonId).disabled === false) 
    {document.getElementById(buttonId).disabled = true;
    } else if (document.getElementById(buttonId).disabled === true) 
    {document.getElementById(buttonId).disabled = false};
};


//- - - - - - - - - Validation Functions- - - - - - - - - - - -
//-------------------------------------------------------------

function numberOfTimesValidation (number) {
    var number = number;
    if (isNaN(parseInt(number))) {
        alertValidation = 'Come on! I need a number here ALSO.';
        return false;
    } else if (number < 1) {
        alertValidation = 'Get yourself together.';
        return false;
    } else if (number > 1 && number<1000) {
        alertValidation = 'Your chances are really low, but we can try.';
        return true;
    }
    numberOfTimesValidated = true;
    return true;        
}
function checkIfValid (number) {   
    var number = number;
    if (isNaN(parseInt(number))) {
        alertValidation = 'Come on! I need a number here.';
        return false;
    } else if (number < 1) {
        alertValidation = 'Try again! I need something bigger';
        return false;
    } else if (number > 49) {
        alertValidation = 'It\'s too high! I need a number below or equal to 49.';
        return false;
    };
    for (var i=0; i<my6.length; i++) {
        if (number === my6[i]) { 
            repeated++;
            };
        if (repeated > 1) {
            alertValidation = 'Didn\'t I say 6 UNIQUE numbers?';
            return false };
    };
    
    return true;
};
function timerValidation (number) {
    var number = number;
    if (isNaN(parseInt(number))) {
        alertValidation = 'Come on! This ain\'t number.'
        return false;
    } else if (number < 0) {
        alertValidation = 'Sorry, I was not allowed to do it'
        return false; 
    }  
    timerValidated = true;
    return true;
};//returns false when NaN or < 0; else true

//- - - - - - - - - - Timer Functions- - - - - - - - - - - - - 
//-------------------------------------------------------------
function timerToZero () {
    timer.seconds = 0;
    timer.minutes = 0;
    timer.hours = 0;
    displayTimer();
};
function updateTimeLeft () {
    timeLeft = timer.seconds+timer.minutes*60+timer.hours*3600;
    workerMessage.timerSetFor = timeLeft;
};
function displayTimer () {
    document.getElementById('seconds').innerHTML = formatTimer('sec', timeLeft-secondsCounter);
    document.getElementById('minutes').innerHTML = formatTimer('min', timeLeft-secondsCounter);
    document.getElementById('hours').innerHTML = formatTimer('hrs', timeLeft-secondsCounter);
    document.getElementById('seconds').style.fontWeight = '600';
    document.getElementById('minutes').style.fontWeight = '600';
    document.getElementById('hours').style.fontWeight = '600';
};
function displayClock () {
    document.getElementById('seconds').innerHTML = formatTimer('sec', secondsCounter);
    document.getElementById('minutes').innerHTML = formatTimer('min', secondsCounter);
    document.getElementById('hours').innerHTML = formatTimer('hrs', secondsCounter);
    document.getElementById('seconds').style.fontWeight = '600';
    document.getElementById('minutes').style.fontWeight = '600';
    document.getElementById('hours').style.fontWeight = '600';
};


function clockRunning () {
    var interval = setInterval(function () {timeIt()}, 1000);
    
    function timeIt() {
        secondsCounter++;
        if (workerFinished === true) {clearInterval(interval)};
        displayClock();    
    };
};
function timerSetAndRunning() {
    updateTimeLeft();
    
var interval = setInterval(function () {timeIt()}, 1000);
    function timeIt() {
        secondsCounter++;
        if (secondsCounter === timeLeft) {clearInterval(interval)};
        displayTimer();
    };    
};//REVISION NEEDED -> We dont want it to display BLANK for the first second!!!
function formatTimer(unit, seconds) {
    var unit = unit;
    var seconds = seconds;
    var hrs = Math.floor(seconds/3600);
    var min = Math.floor(seconds/60);
    var sec = seconds % 60;        
    if (unit === 'sec') {return twoDigits(sec)};
    if (unit === 'min') {return twoDigits(min)};   
    if (unit === 'hrs') {return twoDigits(hrs)};
};//returns sec/min/hrs
function twoDigits(number) {
    number.toString();
    return (number<10 ? '0' : '') + number;//concatenates
};//returns numbers as '01'-'09'

//------------------------------------------------------------------------------------------------------------------------------------

function sortMy6() {
        arr = [];
    for (var i=0; i<my6.length; i++) {        
        arr.push((parseInt(my6[i])));
        arr.sort(function(a, b){return a-b});
           }
        return my6sorted = arr;
        console.log(my6sorted);
        
};//returns User's sorted array
function sortSave() {
    workerMessage.mySix = sortMy6();
    console.log('ok, sorted');
//    placeToDiv('your-6', 'Your six numbers are: <br>'+workerMessage.mySix);
};//writes User's sorted array to the 
//workerMesssage object AND PLACE IT TO THE RIGHT;
function arrayFiltered(array) {
    return array = array.filter(function(x) { return x !== undefined && x != null; } )
};

//- - - - - - - - -  BUTTONS & EVENT LISTENERS - - - - - - - - - - - - 

function addChangeListeners (inputField, inputFieldIndex) {
    inputField.addEventListener("change", function() {
        repeated = 0;  
        var num = inputField.value;
        var index = inputFieldIndex;
        var siblingFields = getAllSiblings(inputField, inputField);
        
        checkIfValid(num);
        
        if (checkIfValid(num) == false) {
            printAlert();; //prints an adequate message
            inputField.style.backgroundColor = 'pink'; //colors the field
            for (var key in siblingFields) {
                siblingFields[key].disabled = true;
            } //disable all the other fields
            inputField.focus(); //and holds the focus             
        }; 
        if (checkIfValid(num) == true) {
            my6[inputFieldIndex] = num; // saves the input
            for (var key in siblingFields) {
                siblingFields[key].disabled = false;
            };
            inputField.style.border = 'solid 2px' 
            inputField.style.backgroundColor = ''; // restores default
            goToNextSibling(inputField); //and goes to the next field
            clearAlert();
            buttonOnOff('refresh');
            
        
            if (goToNextSibling(inputField) ==='last'&&arrayFiltered(my6).length<6) {
                // when last element has been filled CHECK OUT IF THE REST IS FILLED
                numbersValidated = true // they have been validated one by one - so they are all validated by now
                for (i=0; i<6; i++) {
                    if (isNaN(parseInt(my6[i])) == true) {
                        numbersValidated = false;
                        alertValidation = 'Oops, you missed something';
                        printAlert();
                        my6inputFields[i].style.backgroundColor = 'pink';
                        my6inputFields[i].focus(); //SHOWS WHICH FIELDS ARE EMPTY!!more than one!!!
                    };
                };
               
            }; 
            if ( arrayFiltered(my6).length === 6) {
                for (i=0; i<6; i++) {
                    if (checkIfValid(my6[i]) === true) {numbersValidated = true}
                }
                
                    alertValidation = 'OK. Thank you.';
                    printAlert();
                    sortSave();                
                    inputFieldHowManyTimes.focus();
            };
        };        
    }); 
};  
for (i=0; i < my6inputFields.length; i++) {
    addChangeListeners(my6inputFields[i], i)
    } //LISTNERES TO 6 INPUT FIELDS

inputFieldHowManyTimes.addEventListener('change', function() {
    var number = inputFieldHowManyTimes.value;
    numberOfTimesValidated = false;
    numberOfTimesValidation(number);
    if(!numberOfTimesValidated) {
        printAlert();
        inputFieldHowManyTimes.style.backgroundColor = 'pink';
        inputFieldHowManyTimes.focus()
    } else if(numberOfTimesValidated && !numbersValidated) {
        document.querySelector('#hours').disabled = true;
        document.querySelector('#minutes').disabled = true;
        document.querySelector('#seconds').disabled = true;
        inputFieldHowManyTimes.style.border = 'solid 2px';
        inputFieldHowManyTimes.style.backgroundColor = '';
        inputField1.focus()
    }
    
    if(numberOfTimesValidated && numbersValidated) {
        workerMessage.HowManyTimes = inputFieldHowManyTimes.value;
        document.querySelector('#hours').disabled = true;
        document.querySelector('#minutes').disabled = true;
        document.querySelector('#seconds').disabled = true;
        inputFieldHowManyTimes.style.border = 'solid 2px';
        inputFieldHowManyTimes.style.backgroundColor = '';
        buttonOnOff('launch-worker');
        launchButton.focus()};    
    if (workerMessage.HowManyTimes === 0) {
        document.querySelector('#hours').disabled = false;
        document.querySelector('#minutes').disabled = false;
        document.querySelector('#seconds').disabled = false;
        inputFieldHowManyTimes.style.border = '';
        inputFieldHowManyTimes.style.backgroundColor = '';
    }
})


//timer

inputFieldSeconds.addEventListener('change', function() {
    var number = inputFieldSeconds.value;
    clearAlert();
    timerValidation(number);
    if (!timerValidated) {printAlert(); inputFieldMinutes.focus();} 
    else if (timerValidated && !numbersValidated) {inputField1.focus()} 
    else if (timerValidated) {
            timer.seconds = parseInt(number);//sets value to the timer Object
            updateTimeLeft();
            buttonOnOff('launch-worker');
            launchButton.focus();
    }
});

inputFieldMinutes.addEventListener('change', function() {
    var number = inputFieldMinutes.value;
    clearAlert();
    timerValidation(number) 
    if (!timerValidated) {printAlert(); inputFieldMinutes.focus();} 
    else if (timerValidated && !numbersValidated) {inputField1.focus()} 
    else if (timerValidated) {
            timer.minutes = parseInt(number);//sets value to the timer Object
            updateTimeLeft();
            buttonOnOff('launch-worker');
            launchButton.focus();
    }
})

inputFieldHours.addEventListener('change', function() {
    var number = inputFieldHours.value;
    clearAlert();
    timerValidation(number) 
    if (!timerValidated) {printAlert(); inputFieldMinutes.focus();} 
    else if (timerValidated && !numbersValidated) {inputField1.focus()} 
    else if (timerValidated) {
            timer.minutes = parseInt(number);//sets value to the timer Object
            updateTimeLeft();
            buttonOnOff('launch-worker');
            launchButton.focus();
    };
});

//-----

refreshButton.addEventListener("click", function () {
    
    window.location.reload();
})
launchButton.addEventListener("click", function() {
    console.log('LAUNCHED!');    
    lottoMachine.postMessage(workerMessage);
    replaceHTML('welcome', text_computing);
    buttonOnOff('launch-worker');
    buttonOnOff('refresh');
    if(timeLeft == 0) {
        replaceHTML('timer-elements', timerLaunched);    
        elementsTurnedHidden ();
        clockRunning()
        console.log('this')
    };
    if (timeLeft > 0) {
        replaceHTML('timer-elements', timerLaunched);    
        elementsTurnedHidden ();
        timerSetAndRunning();       
    };
}); // sends the message to the worker & turns on refresh button

lottoMachine.addEventListener("message", function(event) {
    workerFinished = event.data.finished;
    workerFound = event.data.found.toLocaleString();
    workerCounter = event.data.counter.toLocaleString();
    var chanceOfSix = workerFound / workerCounter;
    if(parseInt(workerFound)>1) {
    alertValidation = 'I found ' + workerFound + ' matches in ' + workerCounter + ' draws, <br>which gives an average of one in' +chanceOfSix+'draws.';
    }
    if(parseInt(workerFound)>0 && parseInt(workerFound)<1) {
        alertValidation = 'I found ' + workerFound + ' match in ' + workerCounter + ' draws, <br>which gives an average of one in' +chanceOfSix+'draws.'
    };
    alertValidation = 'I found ' + workerFound + ' matches in ' + workerCounter + ' draws.'; 
    printAlert();
//    printReport();
    if (workerFinished) {replaceHTML('welcome', text_finished)};
}); // receives the message from the worker




//function printReport(data) {
//    data = '<li>' + workerFound + secondsCounter + '</li>'
//   
//    placeToDiv('report', data);
//}