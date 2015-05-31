var mraa = require('mraa'); 
var request = require('request');

// Configure REQUEST
// Configure Header
var headers = {
    'User-Agent' : 'Intel Edison',
    'Content-Type' : 'application/x-www-form-urlencoded'
};

// Configure the request
var options = {
    url: 'https://script.google.com/macros/s/AKfycbw0D1_CnPBnQ4NeXQtHH4u6-jFbpbUfGkoE87HnwFvO8ATHg2o/exec',
    method: 'POST',
    headers: headers,
    form: {'m': 'xxx'}
};
    
var waitMS = 10000; // Post a measurement every 10 seconds (10*1000 ms)

// Read analog sensor value from A0 at 10-bit precision
var analogPin0 = new mraa.Aio(0);

// loop() / while(1)
periodicActivity(); 

function periodicActivity()
{
    // Read analog value
    var a = analogPin0.read(); // returns a value between 0..1023 (10-bit)
    console.log(a + '\n');
    options.form.m=a;
    
    // POST request
    request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        // No problems, do nothing
    } else {
        console.log("something wrong");// Handle problem		 
    }
});
 setTimeout(periodicActivity, waitMS);    
}