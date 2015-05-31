/* This code was taken from https://github.com/intel-iot-devkit/upm/blob/master/examples/javascript/groveloudness.js
and modified to include text alert
sensorUsed: sound sensor
myAdditions: adding twilio text features, so that it will send a text to my phone if the read value is higher than certian range
<<<<<<< HEAD

*/      
var beepLib = require('mraa');                          //including the mraa library/
//console.log('MRAA Version: ' + beepLib.getVersion()); //write the mraa version to the console
=======
twilio code was modelled based on http://twilio.github.io/twilio-node/
*/

>>>>>>> origin/master
var soundLib = require('jsupm_groveloudness');         //including the upm_groveloudness library 
var mySound = new soundLib.GroveLoudness(1);           //connect it to A1
var beep = new beepLib.Gpio(4);                        //setting to gpio pin 4 (D4)
var textAlert = require('twilio')('ACe921f930e31abbc8645841251dd104f3','f01ca55062d2d180f7b747440090a83e'); //including the both id's required for                                                                              //twilio, these ids are available in their website after we create account 
   // textAlert.messages('PN54a6cb8718645b37d209b852717a4b4e').get(function(err, message) {               //to get the reply
//	console.log(message.body); 
//    });
beep.dir(beepLib.DIR_OUT);                          // setting the direction of the gpio pin 
beep.write(0);                                      //turn the beeper on or off
var myInterval = setInterval(function(){            //will read and print data every .5s 
    console.log(mySound.value());                   //printing the sound value read from analog pin

if (mySound.value()>700){
    //console.log(mySound.value());
    textAlert.sendMessage(                          // will send a text to my phone if the sound is higher than 700.
        {                                           //have to register my phone number in twilio in order to receive the text
            to: "+13474454491",  //receiver number
            from: "+13472017984",
            body: "Its loud " +mySound.value()
        }
    );
}
 },500);
