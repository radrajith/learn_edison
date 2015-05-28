//Type Node.js Here :)

var soundLib = require('jsupm_groveloudness');
var mySound = new soundLib.GroveLoudness(1);
var textAlert = require('twilio')('ACe921f930e31abbc8645841251dd104f3','f01ca55062d2d180f7b747440090a83e');

var myInterval = setInterval(function(){
    console.log(mySound.value());
if (mySound.value()>700){
    //console.log(mySound.value());
    textAlert.sendMessage(
        {
            to: "+13474454491",  //receiver number
            from: "+13472017984",
            body: "Its loud " +mySound.value()
        }
    );
}
 },500);
