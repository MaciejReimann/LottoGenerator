function worker_function() {
var messageFromWorker = {
    counter: 0,
    found: 0,
    time: 0,
    finished: false,
};


var mySix = [];

function uniqueRandomNumbers(n, min, max) {
        var values = []; 
        i= max;
        while(i>=min) {values.push(i--)} // create an array of i integers from min to max
        var results = [];
        var maxIndex = max; //49
        for (i=1; i<=n; i++) { //6
            maxIndex--; // remaining numbers array's length -the 'making it one shorter part'
            var randomIndex = generateRandomNumber(min, maxIndex); //shorter range each time the loops run
            results.push(values[randomIndex]);//pushes the chosen item into a new array
            values[randomIndex] = values[maxIndex];//Remove the element from the array, making it one shorter, the last element overwrites the chosen one; 
            }
    return results.sort(function(a, b){return a-b});
};//returns sorted array
function generateRandomNumber(fromN, toX) {
    return randomNumber = Math.floor(Math.random() * toX + fromN); 
};

function rockAndRoll (mySix) {
    uniqueRandomNumbers(6, 1, 49);
    messageFromWorker.counter++
    if (messageFromWorker.counter%100000===0) {
        postMessage(messageFromWorker)}
    if (uniqueRandomNumbers(6, 1, 49).join() === mySix.join()) 
            {
            messageFromWorker.found++;
            postMessage(messageFromWorker);
            };
};

addEventListener('message', function (event) {
    var NumberOfTimes = event.data.HowManyTimes;
    var mySix = event.data.mySix;
    var timerSetFor = event.data.timerSetFor;
    var timerStart = Date.now();
    
    console.log('received! '+ event.data.mySix+' for '+ event.data.HowManyTimes + ' '+timerSetFor)
           
    if (NumberOfTimes !== 0) {
        for (var i=0; i<NumberOfTimes; i++) {
            rockAndRoll(mySix);                
        };
        console.log('got nothin');
    } 
    while((Date.now() - timerStart) < timerSetFor*1000) {
        rockAndRoll(mySix);
    };
    console.log(messageFromWorker.counter)
    messageFromWorker.finished = true;
    postMessage(messageFromWorker);     
});
};

if(window!=self) {worker_function()};